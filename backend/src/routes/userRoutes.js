const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// User CRUD routes
router.post('/', UserController.createUser.bind(UserController));
router.get('/', UserController.getAllUsers.bind(UserController));
router.get('/:id', UserController.getUserById.bind(UserController));
router.put('/:id', UserController.updateUser.bind(UserController));
router.delete('/:id', UserController.deleteUser.bind(UserController));

module.exports = router;
