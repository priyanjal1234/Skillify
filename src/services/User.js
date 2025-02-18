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
}

let userService = new UserService();

export default userService;
