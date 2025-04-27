const db = require('../config/db');

// Lấy danh sách tất cả số điện thoại
exports.getPhones = async (req, res) => {
    try {
        const department = req.query.department || '';
        const location = req.query.location || '';
  
        let sql = `
            SELECT 
                p.id, p.phone_number, p.location, 
                d.name AS department_name,
                GROUP_CONCAT(u.name SEPARATOR ', ') AS users
            FROM phones p
            LEFT JOIN departments d ON p.department_id = d.id
            LEFT JOIN users u ON u.phone_id = p.id
            WHERE 1 = 1
        `;
  
        const conditions = [];
        const params = [];
  
        if (department) {
            conditions.push('d.name = ?');
            params.push(department);
        }
  
        if (location) {
            conditions.push('p.location = ?');
            params.push(location);
        }
  
        if (conditions.length > 0) {
            sql += ' AND ' + conditions.join(' AND ');
        }
  
        sql += ' GROUP BY p.id ORDER BY p.phone_number ASC';
  
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error('Lỗi getPhones:', err.message);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


// Tìm kiếm theo tên người, số điện thoại, phòng ban, vị trí
exports.searchPhones = async (req, res) => {
    const { keyword = '', department = '' } = req.query;
    try {
        let query = `
            SELECT 
                p.id, p.phone_number, p.location, 
                d.name AS department_name,
                GROUP_CONCAT(u.name SEPARATOR ', ') AS users
            FROM phones p
            LEFT JOIN departments d ON p.department_id = d.id
            LEFT JOIN users u ON u.phone_id = p.id
            WHERE 1 = 1
        `;
        const params = [];

        if (keyword) {
            query += `
                AND (
                    p.phone_number LIKE ? OR
                    d.name LIKE ? OR
                    p.location LIKE ? OR
                    u.name LIKE ?
                )
            `;
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        if (department) {
            query += ` AND d.name = ? `;
            params.push(department);
        }

        query += `
            GROUP BY p.id, p.phone_number, p.location, d.name
            ORDER BY p.phone_number ASC
        `;

        const [phones] = await db.execute(query, params);
        res.json(phones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Thêm mới số điện thoại (Admin)
exports.createPhone = async (req, res) => {
    const { phone_number, department_id,location } = req.body;
    try {
        if (!phone_number || !location || !department_id) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        await db.execute(
            'INSERT INTO phones (phone_number,department_id, location ) VALUES (?, ?, ?)',
            [phone_number,department_id, location]
        );
        res.status(201).json({ message: 'Thêm thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật số điện thoại (Admin)
exports.updatePhone = async (req, res) => {
    const { id } = req.params;
    const { phone_number, location, department_id } = req.body; // Sửa thành department_id
    try {
        if (!phone_number || !location || !department_id) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        await db.execute(
            'UPDATE phones SET phone_number = ?, location = ?, department_id = ? WHERE id = ?',
            [phone_number, location, department_id, id]
        );
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa số điện thoại (Admin)
exports.deletePhone = async (req, res) => {
    const { id } = req.params;
    try {
        // Kiểm tra ràng buộc users
        const [users] = await db.execute('SELECT * FROM users WHERE phone_id = ?', [id]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'Không thể xóa số điện thoại đang có người dùng' });
        }

        await db.execute('DELETE FROM phones WHERE id = ?', [id]);
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};