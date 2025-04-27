const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Login Admin
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const [admins] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
      if (admins.length === 0) {
        return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
      }
  
      const admin = admins[0];
  
      if (admin.password !== password) {
        return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
      }
  
      // Tạo JWT token
      const token = jwt.sign(
        { id: admin.id, username: admin.username }, 
        'SECRET_KEY',
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      console.error('Lỗi login:', error.message);
      res.status(500).json({ message: 'Lỗi server' });
    }
};