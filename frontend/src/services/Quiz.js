import api from "./api";

class QuizService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-backend-7pex.onrender.com/api/quiz";
  }

  async createQuiz(quizData, lessonId) {
    try {
      return await this.api.post(
        `${this.baseUrl}/create/${lessonId}`,
        quizData,
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getQuiz(lessonId) {
    try {
      return this.api.get(`${this.baseUrl}/${lessonId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

let quizService = new QuizService();

export default quizService;
