import courseModel from '../models/course.model.js';
import enrollmentModel from '../models/enrollment.model.js';
import orderModel from '../models/order.model.js';
import ApiError from '../utils/ApiError.js';

const getInstructorAnalytics = async function (req, res, next) {
  try {
    let { instructorId } = req.params;
    const totalCourses = await courseModel.find({ instructor: instructorId });

    let totalStudents = await enrollmentModel.find({
      instructor: instructorId,
    });

    let orders = await orderModel.find({ instructor: instructorId });
    const totalRevenue = orders.reduce((sum, o) => sum + o.amountPaid, 0);

    return res.status(200).json({ totalCourses, totalStudents, totalRevenue });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error fetching analytics'
      )
    );
  }
};

export { getInstructorAnalytics };