const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/AnalyticsController');

// Analytics routes
router.get('/summary', AnalyticsController.getSummary.bind(AnalyticsController));
router.get('/by-company', AnalyticsController.getByCompany.bind(AnalyticsController));
router.get('/by-position', AnalyticsController.getByPosition.bind(AnalyticsController));
router.get('/timeline', AnalyticsController.getTimeline.bind(AnalyticsController));
router.get('/attention', AnalyticsController.getAttentionRequired.bind(AnalyticsController));

module.exports = router;
