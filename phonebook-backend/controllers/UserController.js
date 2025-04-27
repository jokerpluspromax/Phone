const db = require('../config/db'); // hoặc đường dẫn tới file kết nối MySQL của bạn

// Lấy tất cả users kèm thông tin phone và department
const getUsers = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                users.id,
                users.name,
                phones.phone_number,
                phones.location,
                departments.name AS department_name
            FROM users
            JOIN phones ON users.phone_id = phones.id
            JOIN departments ON phones.department_id = departments.id

        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Thêm user mới
const createUser = async (req, res) => {
    const { name, phone_id } = req.body;
    try {
        await db.execute(
            `INSERT INTO users (name, phone_id) VALUES (?, ?)`,
            [name, phone_id]
        );
        res.json({ message: "Thêm người dùng thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Cập nhật user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phone_id } = req.body;
    try {
        await db.execute(
            `UPDATE users SET name = ?, phone_id = ? WHERE id = ?`,
            [name, phone_id, id]
        );
        res.json({ message: "Cập nhật người dùng thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute(
            `DELETE FROM users WHERE id = ?`,
            [id]
        );
        res.json({ message: "Xóa người dùng thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
