const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

/* Tạo kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,        // ví dụ: 'localhost'
  user: process.env.DB_USER,         // ví dụ: 'root'
  password: process.env.DB_PASSWORD, // ví dụ: 'mật khẩu mysql'
  database: process.env.DB_NAME      // ví dụ: 'company_phonebook'
});*/
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
// Xuất ra promise luôn để dùng với async/await
module.exports = pool.promise();
/* Kết nối database
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err.message);
    process.exit(1); // Thoát chương trình nếu lỗi
  }
  console.log('✅ Kết nối MySQL thành công!');
});

module.exports = db;*/
