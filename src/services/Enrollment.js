import api from "./api";

class EnrollmentService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/enrollments";
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
