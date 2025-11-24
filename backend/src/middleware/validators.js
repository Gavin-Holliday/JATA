const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware using express-validator
 */

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  validate
];

// Application validation rules
const validateApplication = [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID'),
  body('positionTitle')
    .trim()
    .notEmpty().withMessage('Position title is required')
    .isLength({ max: 200 }).withMessage('Position title cannot exceed 200 characters'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 200 }).withMessage('Company name cannot exceed 200 characters'),
  body('currentStage')
    .optional()
    .isIn(['Submitted', 'Under Review', 'Assessment in Progress', 'Interviews', 'Offer'])
    .withMessage('Invalid stage'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority'),
  body('applicationDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('interviewDateTime')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  validate
];

// Stage update validation
const validateStage = [
  body('stage')
    .notEmpty().withMessage('Stage is required')
    .isIn(['Submitted', 'Under Review', 'Assessment in Progress', 'Interviews', 'Offer'])
    .withMessage('Invalid stage'),
  validate
];

// Priority update validation
const validatePriority = [
  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority'),
  validate
];

// MongoDB ID validation
const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate
];

// Query parameter validation for userId
const validateUserIdQuery = [
  query('userId').notEmpty().withMessage('userId is required').isMongoId().withMessage('Invalid user ID'),
  validate
];

module.exports = {
  validate,
  validateUser,
  validateApplication,
  validateStage,
  validatePriority,
  validateMongoId,
  validateUserIdQuery
};
