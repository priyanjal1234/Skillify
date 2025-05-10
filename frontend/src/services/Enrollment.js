import api from "./api";

class EnrollmentService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-lms-backend.onrender.com/api/enrollments";
  }

  async getEnrolledStudents() {
    try {
      return await this.api.get(`${this.baseUrl}/students`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

let enrollmentService = new EnrollmentService();

export default enrollmentService;
