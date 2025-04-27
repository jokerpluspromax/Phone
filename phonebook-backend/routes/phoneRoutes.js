const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');
const { verifyToken } = require('../middleware/authMiddleware');

// Danh sách điện thoại
router.get('/', phoneController.getPhones);

// Tìm kiếm điện thoại
router.get('/search', phoneController.searchPhones);

// chỉ admin
router.post('/', verifyToken, phoneController.createPhone);
router.put('/:id', verifyToken, phoneController.updatePhone);
router.delete('/:id', verifyToken, phoneController.deletePhone);

module.exports = router;