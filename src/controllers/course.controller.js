import courseModel from '../models/course.model.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const createCourse = async function (req, res, next) {
  try {
    let { title, description, category, price, level, duration } = req.body;

    let instructor = await userModel.findOne({ email: req.user.email });

    if (!title || !description || !category) {
      return next(new ApiError(400, 'All Fields are required'));
    }
    let course;
    if (!req.file) {
      course = await courseModel.create({
        title,
        description,
        instructor: instructor?._id,
        category: String(category).toLowerCase(),
        price,
        level,
        duration,
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
    let singleCourse = await courseModel.findOne({ _id: id });
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
      .populate('instructor');
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
      role: 'student',
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
    let courseToBeDeleted = await courseModel.findOne({
      _id: courseId,
      instructor: user._id,
    });
    if (!courseToBeDeleted) return next(new ApiError(404, 'Course not found'));
    user.createdCourses = user.createdCourses.filter(
      (course) => String(course) !== String(courseId)
    );

    await courseModel.findByIdAndDelete(courseId);

    await user.save();
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
    let { title, description, category, level, price } = req.body;
    let { courseId } = req.params;

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

    let updatedCourse;

    if (req.file) {
      updatedCourse = await courseModel.findOneAndUpdate(
        { _id: courseId },
        {
          title: title || course.title,
          description: description || course.description,
          category: category || course.category,
          level: level || course.level,
          price: price || course.price,
          thumbnail: req.file.path,
        },
        { new: true }
      );
    } else {
      updatedCourse = await courseModel.findOneAndUpdate(
        { _id: courseId },
        {
          title: title || course.title,
          description: description || course.description,
          category: category || course.category,
          level: level || course.level,
          price: price || course.price,
        },
        { new: true }
      );
    }

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

export {
  createCourse,
  getAllCourses,
  getOneCourse,
  getInstructorCourses,
  enrollInCourse,
  changeCourseStatus,
  deleteCourse,
  updateCourse,
  getPublishedCourses
};
