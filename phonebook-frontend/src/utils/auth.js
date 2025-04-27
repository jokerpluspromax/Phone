// src/utils/auth.js

// Kiểm tra đã đăng nhập admin chưa
export const isAdminLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token; // true nếu có token
};

// Thực hiện logout admin
export const logoutAdmin = () => {
  localStorage.removeItem('token');
  window.location.href = '/'; // Reload về trang chủ (hoặc '/login' nếu bạn thích)
};
