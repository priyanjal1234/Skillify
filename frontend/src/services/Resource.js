import api from "./api";

class ResourceService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/resources";
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
