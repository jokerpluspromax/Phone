const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// Lấy danh sách người dùng
router.get('/', async (req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT u.id, u.name, p.phone_number 
            FROM users u
            LEFT JOIN phones p ON u.phone_id = p.id
        `);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Thêm người dùng
router.post("/", verifyToken, async (req, res) => {
    const { name, phone_id } = req.body;
    try {
        if (!name || !phone_id) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        
        await db.execute(
            'INSERT INTO users (name, phone_id) VALUES (?, ?)',
            [name, phone_id]
        );
        res.status(201).json({ message: 'Thêm thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Cập nhật người dùng
router.put("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, phone_id } = req.body;
    try {
        await db.execute(
            'UPDATE users SET name = ?, phone_id = ? WHERE id = ?',
            [name, phone_id, id]
        );
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Xóa người dùng
router.delete("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;