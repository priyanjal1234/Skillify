import api from "./api";

class OrderService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-backend-7pex.onrender.com/api/orders";
  }

  async createOrder(amount, courseId, instructor) {
    try {
      return await this.api.post(
        `${this.baseUrl}/create-order`,
        { amount, courseId, instructor },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyPayment(response, courseId) {
    try {
      return this.api.post(
        `${this.baseUrl}/verify-payment/${courseId}`,
        response,
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async getOneOrder(courseId) {
    try {
      return this.api.get(`${this.baseUrl}/one-order/${courseId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

let orderService = new OrderService();

export default orderService;
