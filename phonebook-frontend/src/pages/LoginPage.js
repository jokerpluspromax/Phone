import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      toast.success('Đăng nhập thành công!');
      localStorage.setItem("token", res.data.token);
      window.location.href = '/'; // sau login, về trang chính
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      toast.error('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label>Tên đăng nhập</label>
          <input 
            type="text" 
            className="form-control" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label>Mật khẩu</label>
          <input 
            type="password" 
            className="form-control" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
        <div className="text-center mt-3">
          <Link to="/">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>Quay lại trang chính</Link></div>
      </form>
    </div>
  );
};

export default LoginPage;
