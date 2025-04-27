const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// Lấy tất cả phòng ban
router.get('/', async (req, res) => {
    try {
        const [departments] = await db.execute('SELECT * FROM departments');
        res.json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Đã có GET, bổ sung POST/PUT/DELETE
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên phòng ban không được trống' });
        
        const [result] = await db.execute(
            'INSERT INTO departments (name) VALUES (?)',
            [name]
        );
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên phòng ban không được trống' });

        await db.execute(
            'UPDATE departments SET name = ? WHERE id = ?',
            [name, id]
        );
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra ràng buộc khóa ngoại
        const [phones] = await db.execute('SELECT * FROM phones WHERE department_id = ?', [id]);
        if (phones.length > 0) {
            return res.status(400).json({ message: 'Không thể xóa phòng ban đang có số điện thoại' });
        }
        
        await db.execute('DELETE FROM departments WHERE id = ?', [id]);
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});
    
module.exports = router;
