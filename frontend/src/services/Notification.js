import api from "./api";

class NotificationService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-backend.onrender.com/api/notifications";
  }

  async getUnreadNotifications() {
    try {
      return await this.api.get(`${this.baseUrl}/unread-notifications`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async markAsRead() {
    try {
      return await this.api.put(
        `${this.baseUrl}/mark-read`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

let notificationService = new NotificationService();

export default notificationService;
