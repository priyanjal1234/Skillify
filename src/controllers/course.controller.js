import courseModel from '../models/course.model.js';
import enrollmentModel from '../models/enrollment.model.js';
import lessonModel from '../models/lesson.model.js';
import orderModel from '../models/order.model.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const createCourse = async function (req, res, next) {
  try {
    let {
      title,
      description,
      category,
      price,
      level,
      duration,
      courseOutcome,
    } = req.body;

    let instructor = await userModel.findOne({ email: req.user.email });

    if (!title || !description || !category) {
      return next(new ApiError(400, 'All Fields are required'));
    }

    if (typeof courseOutcome === 'string') {
      courseOutcome = courseOutcome.split(',').map((outcome) => outcome.trim());
    }

    if (!Array.isArray(courseOutcome)) {
      courseOutcome = [courseOutcome];
    }

    let course;
    if (!req.file) {
      course = await courseModel.create({
        title,
        description,
        instructor: instructor?._id,
        category,
        price,
        level,
        duration,
        courseOutcome,
      });
    } else {
      course = await courseModel.create({
        title,
        description,
        instructor: instructor?._id,
        category,
        thumbnail: req.file.path,
        price,
        level,
        duration,
        courseOutcome,
      });
    }

    instructor.createdCourses.push(course._id);
    await instructor.save();

    return res.status(201).json({ message: 'Course Created Successfully' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error Creating Course'
      )
    );
  }
};

const getAllCourses = async function (req, res, next) {
  try {
    let allCourses = await courseModel.find().populate('instructor');

    return res.status(200).json(allCourses);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error fetching Courses'
      )
    );
  }
};

const getOneCourse = async function (req, res, next) {
  try {
    let { id } = req.params;
    let singleCourse = await courseModel
      .findOne({ _id: id })
      .populate([{ path: 'instructor' }, { path: 'lessons' }]);
    if (!singleCourse) {
      return next(new ApiError(404, 'Course with the given id is not found'));
    }

    return res.status(200).json(singleCourse);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error fetching the single course'
      )
    );
  }
};

const getInstructorCourses = async function (req, res, next) {
  try {
    let { instructorId } = req.params;
    let instructorCourses = await courseModel
      .find({
        instructor: instructorId,
      })
      .populate([{ path: 'instructor' }, { path: 'lessons' }]);
    if (Array.isArray(instructorCourses) && instructorCourses.length === 0) {
      return next(new ApiError(404, 'No Courses to display for you'));
    }

    return res.status(200).json(instructorCourses);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error fetching the course of instructor'
      )
    );
  }
};

const getPublishedCourses = async function (req, res, next) {
  try {
    let publishedCourses = await courseModel.find({ status: 'Published' });

    return res.status(200).json(publishedCourses);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error fetching Published Courses'
      )
    );
  }
};

const enrollInCourse = async function (req, res, next) {
  try {
    let { id } = req.params;

    let student = await userModel.findOne({
      email: req.user.email,
    });

    let course = await courseModel.findOne({ _id: id });

    if (!course) {
      return next(
        new ApiError(404, 'Course that you are looking for is not found')
      );
    }

    if (course.studentsEnrolled.includes(student._id)) {
      return next(
        new ApiError(409, 'Student is already enrolled in this course')
      );
    }

    course.studentsEnrolled.push(student._id);
    await course.save();

    student.enrolledCourses.push(course._id);
    await student.save();

    return res
      .status(200)
      .json({ message: 'Student is successfully enrolled in the course' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error in student enrollment of course'
      )
    );
  }
};

const unenrollFromCourse = async function (req, res, next) {
  try {
    let { courseId } = req.params;

    let student = await userModel.findOne({ email: req.user.email });
    let course = await courseModel.findOne({ _id: courseId });
    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }

    if (
      course.studentsEnrolled.includes(student._id) &&
      student.enrolledCourses.includes(course._id)
    ) {
      course.studentsEnrolled = course.studentsEnrolled.filter(
        (id) => id.toString() !== student._id.toString()
      );
      student.enrolledCourses = student.enrolledCourses.filter(
        (id) => id.toString() !== course._id.toString()
      );
      await student.save();
      await course.save();
      return res
        .status(200)
        .json({ message: 'Student successfully unenrolled from the course' });
    } else {
      return next(
        new ApiError(401, 'Student is already unenrolled from the course')
      );
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error in student unenrollment from course'
      )
    );
  }
};

const changeCourseStatus = async function (req, res, next) {
  try {
    let { courseId } = req.params;
    let { status } = req.body;
    let course = await courseModel.findOne({ _id: courseId });
    if (!course)
      return next(new ApiError(404, 'Course with this id not found'));
    course.status = status;
    await course.save();
    return res.status(200).json({ message: 'Course Status Changed' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error occurred in changing the status of the course'
      )
    );
  }
};

const deleteCourse = async function (req, res, next) {
  try {
    let { courseId } = req.params;
    let user = await userModel.findOne({ email: req.user.email });

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    let courseToBeDeleted = await courseModel.findOne({
      _id: courseId,
      instructor: user._id,
    });

    if (!courseToBeDeleted) {
      return next(new ApiError(404, 'Course not found'));
    }

    const filteredCourses = user.createdCourses.filter(
      (course) => !course.equals(courseId)
    );
    const filtered2Courses = user.enrolledCourses.filter(
      (course) => !course.equals(courseId)
    );
    user.set('createdCourses', filteredCourses);
    user.set('enrolledCourses', filtered2Courses);

    await user.save();

    await courseModel.findByIdAndDelete(courseId);

    await enrollmentModel.deleteMany({ course: courseId });

    await lessonModel.deleteMany({ course: courseId });

    return res.status(200).json({ message: 'Course Deleted Successfully' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error in deleting the course'
      )
    );
  }
};

const updateCourse = async function (req, res, next) {
  try {
    let {
      title,
      description,
      category,
      level,
      price,
      couponCode,
      discountType,
      discountValue,
    } = req.body;
    let { courseId } = req.params;

    if (couponCode && (!discountType || !discountValue)) {
      return next(
        new ApiError(
          400,
          'Discount Type and Discount value are required if coupon code is provided'
        )
      );
    }

    let user = await userModel.findOne({
      email: req.user.email,
      role: 'instructor',
    });
    if (!user)
      return next(
        new ApiError(403, 'Unauthorized: Only instructors can update courses')
      );

    let course = await courseModel.findOne({
      _id: courseId,
      instructor: user._id,
    });
    if (!course) return next(new ApiError(404, 'Course not found'));

    let updateData = {
      title: title || course.title,
      description: description || course.description,
      category: category || course.category,
      level: level || course.level,
      price: price || course.price,
    };

    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    if (couponCode) {
      updateData.couponCode = couponCode;
      updateData.discountType = discountType;
      updateData.discountValue =
        discountType === 'Percentage' ? `${discountValue}%` : discountValue;
      updateData.couponExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else {
      updateData.couponCode = undefined;
      updateData.discountType = undefined;
      updateData.discountValue = undefined;
      updateData.couponExpiry = undefined;
    }

    let updatedCourse = await courseModel.findOneAndUpdate(
      { _id: courseId },
      updateData,
      { new: true }
    );

    if (!updatedCourse)
      return next(new ApiError(403, 'Unauthorized or Course Not Found'));

    return res
      .status(200)
      .json({ message: 'Course Updated Successfully', updatedCourse });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error Updating Course'
      )
    );
  }
};

const rateCourse = async function (req, res, next) {
  try {
    let { courseId } = req.params;
    let { value } = req.body;

    // Validate rating value
    if (value < 1 || value > 5) {
      return next(new ApiError(400, 'Rating must be between 1 and 5'));
    }

    // Find user
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    // Find course
    let course = await courseModel.findById(courseId);
    if (!course) {
      return next(new ApiError(404, 'Course with this ID not found'));
    }

    // Check if user has already rated this course
    let existingRatingIndex = course.ratings.findIndex((r) =>
      r.user.equals(user._id)
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating

      course.ratings[existingRatingIndex].value = value;
    } else {
      course.ratings.push({ user: user._id, value });
    }

    // Save course
    await course.save();

    return res
      .status(200)
      .json({ message: 'Thanks for your feedback', rating: course.rating });
  } catch (error) {
    console.error('Error in rateCourse:', error);
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error rating the course'
      )
    );
  }
};

const validateCouponCode = async function (req, res, next) {
  try {
    let { code } = req.body;
    let { courseId } = req.params;

    if (!code) {
      return next(new ApiError(400, 'Coupon code is required'));
    }
    let course = await courseModel.findOne({ _id: courseId });
    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }

    if (String(code) === String(course.couponCode)) {
      if (course.couponExpiry && course.couponExpiry < new Date()) {
        return next(new ApiError(403, 'Coupon code is expired'));
      }

      let discountedPrice;
      let originalPrice = course.price;
      let discountValue;
      if (course.discountType === 'Percentage') {
        discountValue =
          (course.discountValue.replace('%', '') / 100) * originalPrice;
        discountedPrice = originalPrice - discountValue;
        return res.status(200).json({
          message: 'Discount Applied Successfully',
          discountedPrice,
          discountValue,
        });
      } else {
        discountValue = Number(course.discountValue);
        discountedPrice = Number(originalPrice) - Number(course.discountValue);

        return res.status(200).json({
          message: 'Discount Applied Successfully',
          discountValue,
          discountedPrice,
        });
      }
    } else {
      return next(new ApiError(403, 'Invalid or expired coupon code'));
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error Validating Coupon code'
      )
    );
  }
};

const getAverageRating = async function (req, res, next) {
  try {
    let { courseId } = req.params;

    let course = await courseModel.findOne({ _id: courseId });
    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }

    let totalRatings = course.ratings.length;
    let totalValueofRating = course.ratings.reduce(function (acc, current) {
      return acc + Number(current.value);
    }, 0);

    let averageRating = (totalValueofRating / totalRatings);
    
    return res.status(200).json(averageRating);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error occurred in getting rating'
      )
    );
  }
};

export {
  createCourse,
  getAllCourses,
  getOneCourse,
  getInstructorCourses,
  enrollInCourse,
  unenrollFromCourse,
  changeCourseStatus,
  deleteCourse,
  updateCourse,
  getPublishedCourses,
  rateCourse,
  validateCouponCode,
  getAverageRating
};
