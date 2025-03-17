import api from "./api";

class LessonService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-lms.xyz/api/lessons";
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

  async getCourseLessons(courseId) {
    try {
      return await this.api.get(`${this.baseUrl}/course/${courseId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getOneLesson(lessonId) {
    try {
      return await this.api.get(`${this.baseUrl}/${lessonId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateLesson(lessonId, edited) {
    try {
      return await this.api.put(`${this.baseUrl}/update/${lessonId}`, edited, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteLesson(lessonId, courseId) {
    try {
      return await this.api.delete(
        `${this.baseUrl}/delete/${lessonId}/${courseId}`,
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

let lessonService = new LessonService();

export default lessonService;
