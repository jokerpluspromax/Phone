const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng nhập admin
router.post('/login', authController.login);

module.exports = router;