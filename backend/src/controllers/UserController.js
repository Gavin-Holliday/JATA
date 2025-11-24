const UserService = require('../services/UserService');

/**
 * UserController - Handles HTTP requests for user operations
 * Delegates business logic to UserService
 */
class UserController {
  /**
   * Create a new user
   * @route POST /api/users
   */
  async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * @route GET /api/users/:id
   */
  async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users
   * @route GET /api/users
   */
  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * @route PUT /api/users/:id
   */
  async updateUser(req, res, next) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * @route DELETE /api/users/:id
   */
  async deleteUser(req, res, next) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
