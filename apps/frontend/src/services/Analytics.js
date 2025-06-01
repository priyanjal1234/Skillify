import api from "./api";

class AnalyticsService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/analytics";
  }

  async getInstructorAnalytics(instructorId) {
    try {
      return await this.api.get(`${this.baseUrl}/dashboard/${instructorId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

let analyticsService = new AnalyticsService();

export default analyticsService
