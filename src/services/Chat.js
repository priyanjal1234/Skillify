import api from "./api";

class ChatService {
  constructor() {
    this.api = api;
    this.baseUrl = "http://localhost:3000/api/chats";
  }

  async getSenderChats(senderId,receiverId) {
    try {
      return await this.api.get(`${this.baseUrl}/${senderId}/${receiverId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getReceiverChats(receiverId) {
    try {
      return await this.api.get(`${this.baseUrl}/${receiverId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

let chatService = new ChatService();

export default chatService;
