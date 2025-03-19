import api from "./api";

class AnalyticsService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-backend.onrender.com/api/analytics";
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
