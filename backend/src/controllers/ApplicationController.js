const ApplicationService = require('../services/ApplicationService');

/**
 * ApplicationController - Handles HTTP requests for application operations
 * Delegates business logic to ApplicationService
 */
class ApplicationController {
  /**
   * Create a new application
   * @route POST /api/applications
   */
  async createApplication(req, res, next) {
    try {
      const application = await ApplicationService.createApplication(req.body);
      res.status(201).json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get application by ID
   * @route GET /api/applications/:id
   */
  async getApplicationById(req, res, next) {
    try {
      const application = await ApplicationService.getApplicationById(req.params.id);
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all applications with filters and sorting
   * @route GET /api/applications
   * @query userId - Filter by user ID
   * @query stage - Filter by stage
   * @query priority - Filter by priority
   * @query search - Search by company or position
   * @query sortBy - Sort field (priority, stage, company, date)
   * @query order - Sort order (asc, desc)
   */
  async getApplications(req, res, next) {
    try {
      const { userId, stage, priority, search, dateFrom, dateTo, sortBy, order } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter is required'
        });
      }

      const filters = {
        stage,
        priority,
        search,
        dateFrom,
        dateTo
      };

      const sortOptions = {
        sortBy,
        order
      };

      const applications = await ApplicationService.getApplicationsByUser(
        userId,
        filters,
        sortOptions
      );

      res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update application
   * @route PUT /api/applications/:id
   */
  async updateApplication(req, res, next) {
    try {
      const application = await ApplicationService.updateApplication(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update application stage
   * @route PATCH /api/applications/:id/stage
   */
  async updateStage(req, res, next) {
    try {
      const { stage } = req.body;
      if (!stage) {
        return res.status(400).json({
          success: false,
          message: 'Stage is required'
        });
      }

      const application = await ApplicationService.updateStage(req.params.id, stage);
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update application priority
   * @route PATCH /api/applications/:id/priority
   */
  async updatePriority(req, res, next) {
    try {
      const { priority } = req.body;
      if (!priority) {
        return res.status(400).json({
          success: false,
          message: 'Priority is required'
        });
      }

      const application = await ApplicationService.updatePriority(req.params.id, priority);
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete application
   * @route DELETE /api/applications/:id
   */
  async deleteApplication(req, res, next) {
    try {
      await ApplicationService.deleteApplication(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get upcoming interviews
   * @route GET /api/applications/interviews/upcoming
   */
  async getUpcomingInterviews(req, res, next) {
    try {
      const { userId, days } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter is required'
        });
      }

      const applications = await ApplicationService.getUpcomingInterviews(
        userId,
        days ? parseInt(days) : 7
      );

      res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApplicationController();
