import api from "./api";

class CodeService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/code";
  }

  async runCode(code, language) {
    try {
      return await this.api.post(
        `${this.baseUrl}/run-code`,
        {
          code,
          language,
        },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

let codeService = new CodeService();

export default codeService;
