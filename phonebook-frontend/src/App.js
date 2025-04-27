import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PhoneList from './pages/PhoneList'; // Trang chính của bạn
import PhonesManagement from './components/PhonesManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DepartmentManagement from './components/DepartmentManagement';//     navigate('/edit-phone'); // Điều hướng đến trang sửa
import UserManagement from './components/UserManagement';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLoginSuccess = () => setIsAdmin(true);
  return (
    <>
      {/* ToastContainer phải đặt ở đây để mọi trang đều dùng được */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/manage-users" element={<UserManagement />} />
          <Route path="/manage-departments" element={<DepartmentManagement />} />
          <Route path="/" element={<PhoneList isAdmin={isAdmin} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/manage-phones" element={<PhonesManagement onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
