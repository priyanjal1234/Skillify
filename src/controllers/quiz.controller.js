import quizModel from '../models/quiz.model.js';
import ApiError from '../utils/ApiError.js';

const createQuiz = async function (req, res, next) {
  try {
    let { lessonId } = req.params;
    let { questions } = req.body;

    if (!questions) {
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

const getLessonQuiz = async function (req, res, next) {
  try {
    let { lessonId } = req.params;
    let quiz = await quizModel.findOne({ lesson: lessonId });
    if (!quiz) {
      return next(new ApiError(404, 'Quiz not found for this lesson'));
    }

    return res.status(200).json(quiz);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error fetching lesson quiz'
      )
    );
  }
};

export { createQuiz, getLessonQuiz };
