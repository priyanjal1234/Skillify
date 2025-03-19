import api from "./api";

class ChatService {
  constructor() {
    this.api = api;
    this.baseUrl = "https://skillify-backend.onrender.com/api/chats";
  }

  async getSenderChats(senderId, receiverId) {
    try {
      return await this.api.get(`${this.baseUrl}/${senderId}/${receiverId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getReceiverChats(senderId) {
    try {
      return await this.api.get(`${this.baseUrl}/${senderId}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUnreadChats() {
    try {
      return await this.api.get(`${this.baseUrl}/unread`, {
        withCredentials: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async readChats(unreadMessages) {
    try {
      return await this.api.post(
        `${this.baseUrl}/read`,
        { unreadMessages },
        { withCredentials: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

let chatService = new ChatService();

export default chatService;
