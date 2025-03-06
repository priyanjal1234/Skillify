import quizModel from '../models/quiz.model.js';
import ApiError from '../utils/ApiError.js';

const createQuiz = async function (req, res, next) {
  try {
    let { lessonId } = req.params;
    let { questions, options, correctOptions } = req.body;

    if (!questions || !options || !correctOptions) {
      return next(
        new ApiError(
          400,
          'Questions, Options and Respective correct options are required'
        )
      );
    }

    await quizModel.create({
      lesson: lessonId,
      questions,
      options,
      correctOptions,
    });

    return res.status(200).json({ message: 'Quiz Created Successfully' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error creating quiz'
      )
    );
  }
};

export { createQuiz };
