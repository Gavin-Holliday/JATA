const Application = require('../models/Application');

/**
 * AnalyticsService - Handles analytics and statistics calculations
 * Provides insights into application tracking data
 */
class AnalyticsService {
  /**
   * Get overall summary statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Summary statistics
   */
  async getSummaryStats(userId) {
    const applications = await Application.find({ userId });
    const totalApplications = applications.length;

    if (totalApplications === 0) {
      return {
        totalApplications: 0,
        responseRate: 0,
        averageTimeToOffer: 0,
        applicationsByStage: {}
      };
    }

    // Calculate response rate
    const responsesReceived = applications.filter(
      app => app.currentStage !== 'Submitted'
    ).length;
    const responseRate = ((responsesReceived / totalApplications) * 100).toFixed(2);

    // Calculate average time to offer
    const offeredApplications = applications.filter(
      app => app.currentStage === 'Offer'
    );
    let averageTimeToOffer = 0;

    if (offeredApplications.length > 0) {
      const totalDays = offeredApplications.reduce((sum, app) => {
        const diffTime = app.lastUpdatedDate - app.applicationDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      averageTimeToOffer = Math.round(totalDays / offeredApplications.length);
    }

    // Applications by stage
    const applicationsByStage = applications.reduce((acc, app) => {
      acc[app.currentStage] = (acc[app.currentStage] || 0) + 1;
      return acc;
    }, {});

    // Applications by priority
    const applicationsByPriority = applications.reduce((acc, app) => {
      acc[app.priority] = (acc[app.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      totalApplications,
      responseRate: parseFloat(responseRate),
      averageTimeToOffer,
      applicationsByStage,
      applicationsByPriority,
      totalOffers: offeredApplications.length
    };
  }

  /**
   * Get success rate by company
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of companies with success rates
   */
  async getSuccessRateByCompany(userId) {
    const applications = await Application.find({ userId });

    // Group applications by company
    const companyStats = applications.reduce((acc, app) => {
      if (!acc[app.company]) {
        acc[app.company] = {
          total: 0,
          offers: 0
        };
      }
      acc[app.company].total += 1;
      if (app.currentStage === 'Offer') {
        acc[app.company].offers += 1;
      }
      return acc;
    }, {});

    // Calculate success rates
    const results = Object.keys(companyStats).map(company => ({
      company,
      totalApplications: companyStats[company].total,
      offers: companyStats[company].offers,
      successRate: parseFloat(
        ((companyStats[company].offers / companyStats[company].total) * 100).toFixed(2)
      )
    }));

    // Sort by success rate descending
    return results.sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Get success rate by position type
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of positions with success rates
   */
  async getSuccessRateByPosition(userId) {
    const applications = await Application.find({ userId });

    // Group applications by position title
    const positionStats = applications.reduce((acc, app) => {
      if (!acc[app.positionTitle]) {
        acc[app.positionTitle] = {
          total: 0,
          offers: 0
        };
      }
      acc[app.positionTitle].total += 1;
      if (app.currentStage === 'Offer') {
        acc[app.positionTitle].offers += 1;
      }
      return acc;
    }, {});

    // Calculate success rates
    const results = Object.keys(positionStats).map(position => ({
      positionTitle: position,
      totalApplications: positionStats[position].total,
      offers: positionStats[position].offers,
      successRate: parseFloat(
        ((positionStats[position].offers / positionStats[position].total) * 100).toFixed(2)
      )
    }));

    // Sort by success rate descending
    return results.sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Get timeline data for applications
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Timeline data
   */
  async getTimelineData(userId) {
    const applications = await Application.find({ userId }).sort({ applicationDate: 1 });

    const timelineData = applications.map(app => ({
      date: app.applicationDate,
      company: app.company,
      position: app.positionTitle,
      stage: app.currentStage
    }));

    return timelineData;
  }

  /**
   * Get applications requiring attention (interviews soon, pending actions)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Applications requiring attention
   */
  async getAttentionRequired(userId) {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Upcoming interviews
    const upcomingInterviews = await Application.find({
      userId,
      interviewDateTime: {
        $gte: now,
        $lte: threeDaysFromNow
      }
    }).sort({ interviewDateTime: 1 });

    // High priority applications in early stages
    const highPriorityEarlyStage = await Application.find({
      userId,
      priority: 'High',
      currentStage: { $in: ['Submitted', 'Under Review'] }
    }).sort({ applicationDate: -1 });

    return {
      upcomingInterviews,
      highPriorityEarlyStage
    };
  }
}

module.exports = new AnalyticsService();
