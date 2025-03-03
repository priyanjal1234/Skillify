import api from "./api";

class LessonService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/lessons";
  }

  async createLesson(lessonData, courseId) {
    try {
      return await this.api.post(
        `${this.baseUrl}/create-lesson/${courseId}`,
        lessonData,
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

let lessonService = new LessonService();

export default lessonService;
