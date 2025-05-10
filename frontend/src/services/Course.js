import api from "./api";

class CourseService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-lms-backend.onrender.com/api/courses";
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

  async getPublishedCourses() {
    try {
      return await this.api.get(`${this.baseUrl}/published/all`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async rateCourse(courseId, value) {
    try {
      return await this.api.post(
        `${this.baseUrl}/rate/${courseId}`,
        { value },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getSingleCourse(courseId) {
    try {
      return await this.api.get(`${this.baseUrl}/course/${courseId}`, {
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
      throw error;
    }
  }

  async deleteCourse(courseId) {
    try {
      return this.api.delete(`${this.baseUrl}/delete-course/${courseId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(courseId, edited) {
    try {
      return await this.api.put(
        `${this.baseUrl}/edit-course/${courseId}`,
        edited,
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async enrollInCourse(courseId) {
    try {
      return await this.api.post(
        `${this.baseUrl}/${courseId}/enroll`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async unenrollFromCourse(courseId) {
    try {
      return await this.api.put(
        `${this.baseUrl}/${courseId}/unenroll`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async applyCouponCode(code, courseId) {
    try {
      return await this.api.post(
        `${this.baseUrl}/validate-couponCode/${courseId}`,
        { code },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getCourseRating(courseId) {
    try {
      return await this.api.get(`${this.baseUrl}/get-rating/${courseId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

let courseService = new CourseService();

export default courseService;
