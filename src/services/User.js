import api from "./api";

class UserService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-backend.onrender.com/api/users";
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

  async loginAccount(loginData) {
    try {
      return await this.api.post(`${this.baseUrl}/login`, loginData, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async logoutAccount() {
    try {
      await this.api.get(`${this.baseUrl}/logout`, { withCredentials: true });
    } catch (error) {
      throw error;
    }
  }

  async getLoggedinUser() {
    try {
      return await this.api.get(`${this.baseUrl}/profile`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateLoggedinUser(formdata) {
    try {
      return await this.api.put(`${this.baseUrl}/update/profile`, formdata, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      return await this.api.post(
        `${this.baseUrl}/forgot-password`,
        { email },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyOTP(data) {
    try {
      return await this.api.post(
        `${this.baseUrl}/validate-reset-otp`,data,{withCredentials: true}
      )
    }
    catch {
      throw error 
    } 
  }

  async resetPassword(password) {
    try {
      return await this.api.post(
        `${this.baseUrl}/reset-password`,
        { password },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getGoogleUser() {
    try {
      return this.api.get(`${this.baseUrl}/me`, { withCredentials: true });
    } catch (error) {
      throw error;
    }
  }

  async setCompleteLesson(lessonId) {
    try {
      return await this.api.post(
        `${this.baseUrl}/complete`,
        { lessonId },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getCompletedLessons() {
    try {
      return this.api.get(`${this.baseUrl}/completed-lessons`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserProgress(courseId, lessonId) {
    try {
      return this.api.get(`${this.baseUrl}/progress/${courseId}/${lessonId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getCourseInstructors() {
    try {
      return await this.api.get(`${this.baseUrl}/enrolled-course-instructors`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

let userService = new UserService();

export default userService;
