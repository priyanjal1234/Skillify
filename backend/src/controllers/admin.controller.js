import { notEqual } from 'assert';
import activityModel from '../models/activity.model.js';
import courseModel from '../models/course.model.js';
import enrollmentModel from '../models/enrollment.model.js';
import orderModel from '../models/order.model.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const getDashboardDetails = async function (req, res, next) {
  try {
    const [totalStudents, activeCourses, totalInstructors, successOrders] =
      await Promise.all([
        userModel.find({ role: 'student' }),
        courseModel.find({
          status: 'Published',
          studentsEnrolled: { $ne: [] },
        }),
        userModel.find({ role: 'instructor' }),
        orderModel.find({ paymentStatus: 'Success' }),
      ]);

    const totalRevenue = Array.isArray(successOrders)
      ? successOrders.reduce((acc, order) => {
          return (
            acc + (typeof order.amountPaid === 'number' ? order.amountPaid : 0)
          );
        }, 0)
      : 0;

    const recentActivities = await activityModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5);

    const dashboardDetails = {
      totalStudents: totalStudents.length,
      totalInstructors: totalInstructors.length,
      activeCourses: activeCourses.length,
      totalRevenue,
      recentActivities,
    };

    return res.status(200).json(dashboardDetails);
  } catch (error) {
    console.error('Error fetching dashboard details:', error);

    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error in fetching dashboard details'
      )
    );
  }
};

const getStudentDetails = async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const students = await userModel
      .find({ role: 'student' })
      .skip(skip)
      .limit(limit);

    const total = await userModel.countDocuments({ role: 'student' });

    return res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      students,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error fetching students'
      )
    );
  }
};

const getInstructorDetails = async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const instructors = await userModel
      .find({ role: 'instructor' })
      .skip(skip)
      .limit(limit);

    const total = await userModel.countDocuments({ role: 'instructor' });

    return res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      instructors,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error occurred while fetch instructor details'
      )
    );
  }
};

const deleteStudent = async function (req, res, next) {
  try {
    let { studentId } = req.params;

    await userModel.findOneAndDelete({ _id: studentId, role: 'student' });

    await courseModel.updateMany(
      { studentsEnrolled: studentId },
      { $pull: { studentsEnrolled: studentId } }
    );
    return res.status(200).json({ message: 'Student Deleted Successfully' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error deleting Student'
      )
    );
  }
};

const deleteInstructor = async function (req, res, next) {
  try {
    let { instructorId } = req.params;
    await userModel.findOneAndDelete({ _id: instructorId, role: 'instructor' });

    await courseModel.deleteMany({ instructor: instructorId });
    await enrollmentModel.deleteMany({ instructor: instructorId });
    await orderModel.deleteMany({ instructor: instructorId });

    return res.status(200).json({ message: 'Instructor Deleted Successfully' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error deleting instructor'
      )
    );
  }
};

const getUserRegisterationAnalytics = async function (req, res, next) {
  try {
    let { startDate, endDate } = req.query;


    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const data = await userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte:end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error getting the registeration data'
      )
    );
  }
};

const getUserRolesAnalytics = async function (req, res, next) {
  try {
    const data = await userModel.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error getting role analytics'
      )
    );
  }
};

const getCourseEnrollmentAnalytics = async function (req, res, next) {
  try {
    const data = await courseModel.aggregate([
      {
        $project: {
          title: 1,
          enrollmentCount: { $size: '$studentsEnrolled' },
        },
      },
      { $sort: { enrollmentCount: -1 } },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error getting course enrollment analytics'
      )
    );
  }
};

const getCourseRatingsAnalytics = async function (req, res, next) {
  try {
    const data = await courseModel.aggregate([
      { $unwind: '$ratings' },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          averageRating: { $avg: '$ratings.value' },
          ratingsCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1 } },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error getting the course rating analytics'
      )
    );
  }
};

const getRevenueAnalytics = async function (req, res, next) {
  try {
    let { startDate, endDate } = req.query;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const data = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'Success',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$amountPaid' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json(data);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error getting revenue analytics'
      )
    );
  }
};

const getOrderStatusAnalytics = async function (req, res, next) {
  try {
    const data = await orderModel.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error getting order status analytics'
      )
    );
  }
};

export {
  getDashboardDetails,
  getStudentDetails,
  deleteStudent,
  deleteInstructor,
  getInstructorDetails,
  getUserRegisterationAnalytics,
  getUserRolesAnalytics,
  getCourseEnrollmentAnalytics,
  getCourseRatingsAnalytics,
  getRevenueAnalytics,
  getOrderStatusAnalytics,
};
