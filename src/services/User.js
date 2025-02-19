import api from "./api";

class UserService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/users";
  }

  async createAccount(registerData) {
    try {
      return await this.api.post(`${this.baseUrl}/register`, registerData, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(verifyData) {
    try {
      return await this.api.post(`${this.baseUrl}/verify-email`, verifyData, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async resendCode(email) {
    try {
      return await this.api.post(
        `${this.baseUrl}/resend-code`,
        { email },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

let userService = new UserService();

export default userService;
