import courseModel from '../models/course.model.js';
import lessonModel from '../models/lesson.model.js';
import ApiError from '../utils/ApiError.js';

const createLesson = async function (req, res, next) {
  try {
    let { title, content, courseId } = req.body;

    let course = await courseModel.findOne({ _id: courseId });

    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }

    if (!title || !content) {
      return next(new ApiError(400, 'Title and Content are required'));
    }

    if (!req.file) {
      return next(new ApiError(400, 'Lesson Video is required'));
    }

    let lesson = await lessonModel.create({
      title,
      content,
      videoUrl: req.file.path,
      course: course._id,
    });

    course.lessons.push(lesson._id);
    await course.save();

    return res.status(201).json({ message: 'Lesson Created Successfully' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error creating the lesson'
      )
    );
  }
};

const getCourseLessons = async function (req, res, next) {
  try {
    let { courseId } = req.params;
    let course = await courseModel.findOne({ _id: courseId });
    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }

    let courseLessons = await lessonModel.find({ course: course._id });
    return res.status(200).json(courseLessons);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error fetching course lessons'
      )
    );
  }
};

const getOneLesson = async function (req, res, next) {
  try {
    let { lessonId } = req.params;
    let lesson = await lessonModel.findOne({ _id: lessonId });

    if (!lesson) {
      return next(new ApiError(404, 'Lesson with this id not found'));
    }

    return res.status(200).json(lesson);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error
          ? error.message
          : 'Error fetching lesson from the db'
      )
    );
  }
};

const updateLesson = async function (req, res, next) {
  try {
    let { lessonId } = req.params;
    let updatedData = req.body;

    let lesson = await lessonModel.findById(lessonId);
    if (!lesson) {
      return next(new ApiError(404, 'Lesson not found for this id'));
    }

    // If a file is uploaded, update the video URL
    if (req.file) {
      updatedData.videoUrl = req.file.path;
    }

    let updatedLesson = await lessonModel.findByIdAndUpdate(
      lessonId,
      updatedData,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: 'Lesson Updated Successfully', updatedLesson });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error Updating Lesson'
      )
    );
  }
};

export { createLesson, getCourseLessons, getOneLesson, updateLesson };
