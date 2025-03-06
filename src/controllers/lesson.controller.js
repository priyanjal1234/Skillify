import courseModel from '../models/course.model.js';
import lessonModel from '../models/lesson.model.js';
import ApiError from '../utils/ApiError.js';
import imageKit from '../config/imageKitConfig.js';

const createLesson = async function (req, res, next) {
  try {
    let { courseId } = req.params;
    let { title, content, duration } = req.body;

    let course = await courseModel.findOne({ _id: courseId });

    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }

    if (!title || !content || !duration) {
      return next(new ApiError(400, 'Title,Content and Duration are required'));
    }

    if (!req.file) {
      return next(new ApiError(400, 'Lesson Video is required'));
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: '/videos',
      resourceType: 'video',
    });

    let lesson = await lessonModel.create({
      title,
      content,
      videoUrl: uploadResponse.url,
      course: course._id,
      duration,
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
      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      const uploadResponse = await imageKit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: '/videos',
        resourceType: 'video',
      });
      updatedData.videoUrl = uploadResponse.url;
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

const deleteLesson = async function (req, res, next) {
  try {
    let { lessonId, courseId } = req.params;
    let lesson = await lessonModel.findOne({ _id: lessonId });
    let course = await courseModel.findOne({ _id: courseId });

    if (!lesson) {
      return next(new ApiError(404, 'Lesson with this id not found'));
    }

    if (!course) {
      return next(new ApiError(404, 'Course with this id not found'));
    }

    await lessonModel.findByIdAndDelete(lessonId);

    let filteredLessons = course.lessons.filter(
      (lesson) => lesson.toString() !== lessonId.toString()
    );

    course.lessons = filteredLessons;
    await course.save();

    return res.status(200).json({ message: 'Lesson Deleted Successfully' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error Deleting Lesson'
      )
    );
  }
};


export {
  createLesson,
  getCourseLessons,
  getOneLesson,
  updateLesson,
  deleteLesson,
};
