const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const applicationRoutes = require('./applicationRoutes');
const analyticsRoutes = require('./analyticsRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);
router.use('/analytics', analyticsRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JATA API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
