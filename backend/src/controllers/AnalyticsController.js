const AnalyticsService = require('../services/AnalyticsService');

/**
 * AnalyticsController - Handles HTTP requests for analytics operations
 * Delegates business logic to AnalyticsService
 */
class AnalyticsController {
  /**
   * Get summary statistics
   * @route GET /api/analytics/summary
   * @query userId - User ID (required)
   */
  async getSummary(req, res, next) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter is required'
        });
      }

      const summary = await AnalyticsService.getSummaryStats(userId);

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get success rate by company
   * @route GET /api/analytics/by-company
   * @query userId - User ID (required)
   */
  async getByCompany(req, res, next) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter is required'
        });
      }

      const companyStats = await AnalyticsService.getSuccessRateByCompany(userId);

      res.status(200).json({
        success: true,
        count: companyStats.length,
        data: companyStats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get success rate by position
   * @route GET /api/analytics/by-position
   * @query userId - User ID (required)
   */
  async getByPosition(req, res, next) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter is required'
        });
      }

      const positionStats = await AnalyticsService.getSuccessRateByPosition(userId);

      res.status(200).json({
        success: true,
        count: positionStats.length,
        data: positionStats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get timeline data
   * @route GET /api/analytics/timeline
   * @query userId - User ID (required)
   */
  async getTimeline(req, res, next) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter is required'
        });
      }

      const timeline = await AnalyticsService.getTimelineData(userId);

      res.status(200).json({
        success: true,
        count: timeline.length,
        data: timeline
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get items requiring attention
   * @route GET /api/analytics/attention
   * @query userId - User ID (required)
   */
  async getAttentionRequired(req, res, next) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId query parameter is required'
        });
      }

      const attention = await AnalyticsService.getAttentionRequired(userId);

      res.status(200).json({
        success: true,
        data: attention
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
