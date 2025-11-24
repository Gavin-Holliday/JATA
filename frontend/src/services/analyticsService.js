import api from './api';

class AnalyticsService {
  async getSummary(userId) {
    return await api.get(`/analytics/summary?userId=${userId}`);
  }

  async getByCompany(userId) {
    return await api.get(`/analytics/by-company?userId=${userId}`);
  }

  async getByPosition(userId) {
    return await api.get(`/analytics/by-position?userId=${userId}`);
  }

  async getTimeline(userId) {
    return await api.get(`/analytics/timeline?userId=${userId}`);
  }

  async getAttentionRequired(userId) {
    return await api.get(`/analytics/attention?userId=${userId}`);
  }
}

export default new AnalyticsService();
