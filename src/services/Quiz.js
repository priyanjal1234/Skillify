import api from "./api";

class QuizService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/quiz";
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
}

let quizService = new QuizService();

export default quizService;
