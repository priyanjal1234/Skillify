import api from "./api";

class CourseService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/courses";
  }

  async createCourse(courseData) {
    try {
      return await this.api.post(`${this.baseUrl}/create-course`, courseData, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getInstructorCourses(instructorId) {
    try {
      return await this.api.get(`${this.baseUrl}/${instructorId}/courses`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllCourses() {
    try {
      return await this.api.get(`${this.baseUrl}/all`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async changeCourseStatus(courseId, status) {
    try {
      return await this.api.post(
        `${this.baseUrl}/change-course-status/${courseId}`,
        { status },
        { withCredentials: true }
      );
    } catch (error) {
      throw error
    }
  }
}

let courseService = new CourseService();

export default courseService;
