import api from './api';

class ApplicationService {
  async createApplication(applicationData) {
    return await api.post('/applications', applicationData);
  }

  async getApplications(userId, filters = {}, sortOptions = {}) {
    const params = new URLSearchParams({
      userId,
      ...filters,
      ...sortOptions
    });
    return await api.get(`/applications?${params}`);
  }

  async getApplicationById(applicationId) {
    return await api.get(`/applications/${applicationId}`);
  }

  async updateApplication(applicationId, applicationData) {
    return await api.put(`/applications/${applicationId}`, applicationData);
  }

  async updateStage(applicationId, stage) {
    return await api.patch(`/applications/${applicationId}/stage`, { stage });
  }

  async updatePriority(applicationId, priority) {
    return await api.patch(`/applications/${applicationId}/priority`, { priority });
  }

  async deleteApplication(applicationId) {
    return await api.delete(`/applications/${applicationId}`);
  }

  async getUpcomingInterviews(userId, days = 7) {
    return await api.get(`/applications/interviews/upcoming?userId=${userId}&days=${days}`);
  }

  async uploadDocument(applicationId, file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return await api.post(`/applications/${applicationId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async downloadDocument(applicationId, documentId) {
    return await api.get(`/applications/${applicationId}/documents/${documentId}`, {
      responseType: 'blob'
    });
  }

  async deleteDocument(applicationId, documentId) {
    return await api.delete(`/applications/${applicationId}/documents/${documentId}`);
  }
}

export default new ApplicationService();
