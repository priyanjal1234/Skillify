import lessonModel from '../models/lesson.model.js';
import resourceModel from '../models/resource.model.js';
import ApiError from '../utils/ApiError.js';

const createResource = async function (req, res, next) {
  try {
    let { lessonId } = req.params;
    let { type, title } = req.body;

    let lesson = await lessonModel.findOne({ _id: lessonId });

    if (!lesson) {
      return next(new ApiError(404, 'Lesson with this id not found'));
    }

    if (!type || !title) {
      return next(
        new ApiError(400, 'Type of resource and its title are required')
      );
    }

    if (!req.file) {
      return next(new ApiError(400, 'Resource file is required'));
    }

    let resource = await resourceModel.create({
      type,
      title,
      url: req.file.path,
    });

    lesson.resources.push(resource._id);
    await lesson.save();

    return res.status(200).json({message: "Resource Created"})
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error creating resource'
      )
    );
  }
};

export { createResource };
