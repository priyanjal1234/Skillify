import activityModel from '../models/activity.model.js';
import courseModel from '../models/course.model.js';
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

export { getDashboardDetails, getStudentDetails, deleteStudent };
