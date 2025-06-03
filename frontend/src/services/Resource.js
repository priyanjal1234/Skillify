import api from "./api";

class ResourceService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-backend-7pex.onrender.com/api/resources";
  }

  async createResource(data, lessonId) {
    try {
      return await this.api.post(
        `${this.baseUrl}/create-resource/${lessonId}`,
        data,
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

let resourceService = new ResourceService();

export default resourceService;
