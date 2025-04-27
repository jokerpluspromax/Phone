const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
//const { authenticateToken } = require('./middleware/authMiddleware');
const db = require('./config/db');  // Kết nối database
const userRoutes = require('./routes/userRoutes'); // <-- Thêm dòng này


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Địa chỉ frontend
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // <-- Thêm dòng này
app.use('/api/auth', authRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/departments', departmentRoutes);

// Test API
app.get('/', (req, res) => {
  res.send('Company Phonebook API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
