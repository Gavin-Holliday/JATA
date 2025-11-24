import api from './api';

class UserService {
  async createUser(userData) {
    return await api.post('/users', userData);
  }

  async getAllUsers() {
    return await api.get('/users');
  }

  async getUserById(userId) {
    return await api.get(`/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return await api.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId) {
    return await api.delete(`/users/${userId}`);
  }
}

export default new UserService();
