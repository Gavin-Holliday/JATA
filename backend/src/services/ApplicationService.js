const Application = require('../models/Application');

/**
 * ApplicationService - Handles all application-related business logic
 * Follows the Service/Repository pattern with SOLID principles
 */
class ApplicationService {
  /**
   * Create a new application
   * @param {Object} applicationData - Application data
   * @returns {Promise<Object>} Created application
   */
  async createApplication(applicationData) {
    const application = new Application(applicationData);
    return await application.save();
  }

  /**
   * Get application by ID
   * @param {string} applicationId - Application ID
   * @returns {Promise<Object>} Application object
   */
  async getApplicationById(applicationId) {
    const application = await Application.findById(applicationId).populate('userId', 'name email');
    if (!application) {
      throw new Error('Application not found');
    }
    return application;
  }

  /**
   * Get all applications for a user with optional filters
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options (stage, priority, search)
   * @param {Object} sortOptions - Sort options
   * @returns {Promise<Array>} Array of applications
   */
  async getApplicationsByUser(userId, filters = {}, sortOptions = {}) {
    const query = { userId };

    // Apply filters
    if (filters.stage) {
      query.currentStage = filters.stage;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }
    if (filters.search) {
      query.$or = [
        { company: { $regex: filters.search, $options: 'i' } },
        { positionTitle: { $regex: filters.search, $options: 'i' } }
      ];
    }
    if (filters.dateFrom || filters.dateTo) {
      query.applicationDate = {};
      if (filters.dateFrom) {
        query.applicationDate.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.applicationDate.$lte = new Date(filters.dateTo);
      }
    }

    // Build sort object
    let sort = {};
    if (sortOptions.sortBy) {
      const sortOrder = sortOptions.order === 'desc' ? -1 : 1;

      switch (sortOptions.sortBy) {
        case 'priority':
          // Custom priority order: High > Medium > Low
          sort = { priority: sortOrder };
          break;
        case 'stage':
          sort = { currentStage: sortOrder };
          break;
        case 'company':
          sort = { company: sortOrder };
          break;
        case 'date':
          sort = { applicationDate: sortOrder };
          break;
        default:
          sort = { applicationDate: -1 };
      }
    } else {
      sort = { applicationDate: -1 };
    }

    return await Application.find(query).sort(sort).select('-__v');
  }

  /**
   * Get all applications (admin view)
   * @returns {Promise<Array>} Array of all applications
   */
  async getAllApplications() {
    return await Application.find()
      .populate('userId', 'name email')
      .sort({ applicationDate: -1 })
      .select('-__v');
  }

  /**
   * Update application
   * @param {string} applicationId - Application ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated application
   */
  async updateApplication(applicationId, updateData) {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new Error('Application not found');
    }

    return application;
  }

  /**
   * Update application stage
   * @param {string} applicationId - Application ID
   * @param {string} newStage - New stage
   * @returns {Promise<Object>} Updated application
   */
  async updateStage(applicationId, newStage) {
    return await this.updateApplication(applicationId, { currentStage: newStage });
  }

  /**
   * Update application priority
   * @param {string} applicationId - Application ID
   * @param {string} newPriority - New priority
   * @returns {Promise<Object>} Updated application
   */
  async updatePriority(applicationId, newPriority) {
    return await this.updateApplication(applicationId, { priority: newPriority });
  }

  /**
   * Delete application
   * @param {string} applicationId - Application ID
   * @returns {Promise<Object>} Deleted application
   */
  async deleteApplication(applicationId) {
    const application = await Application.findByIdAndDelete(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }
    return application;
  }

  /**
   * Add document reference to application
   * @param {string} applicationId - Application ID
   * @param {Object} documentData - Document metadata
   * @returns {Promise<Object>} Updated application
   */
  async addDocument(applicationId, documentData) {
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    application.documents.push(documentData);
    return await application.save();
  }

  /**
   * Remove document from application
   * @param {string} applicationId - Application ID
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Updated application
   */
  async removeDocument(applicationId, documentId) {
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    application.documents = application.documents.filter(
      doc => doc._id.toString() !== documentId
    );

    return await application.save();
  }

  /**
   * Get upcoming interviews
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look ahead (default: 7)
   * @returns {Promise<Array>} Applications with upcoming interviews
   */
  async getUpcomingInterviews(userId, days = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await Application.find({
      userId,
      interviewDateTime: {
        $gte: now,
        $lte: futureDate
      }
    })
      .sort({ interviewDateTime: 1 })
      .select('-__v');
  }
}

module.exports = new ApplicationService();
