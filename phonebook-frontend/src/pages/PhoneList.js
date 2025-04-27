import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneCard from '../components/PhoneCard';
import { isAdminLoggedIn, logoutAdmin } from '../utils/auth';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar'; // Import Navbar mới

function PhoneList() {
  const [phones, setPhones] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null); // Dùng để quản lý việc sửa

  const navigate = useNavigate();

  useEffect(() => {
    fetchPhones();
    fetchDepartments();
    setIsAdmin(isAdminLoggedIn()); // kiểm tra login mỗi lần load
  }, []);

  const fetchPhones = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/phones');
      setPhones(res.data);
    } catch (err) {
      console.error('Lỗi fetch phones', err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Lỗi fetch departments', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = `http://localhost:5000/api/phones/search?keyword=${keyword}&department=${selectedDept}`;
    const res = await axios.get(query);
    setPhones(res.data);
  };

  const handleDeptChange = async (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);

    const query = `http://localhost:5000/api/phones/search?keyword=${keyword}&department=${dept}`;
    const res = await axios.get(query);
    setPhones(res.data);
  };

  const handleEdit = (phone) => {
    setEditingPhone(phone);
    // Điều hướng đến trang sửa (có thể là Modal hoặc trang riêng)
    navigate(`/edit-phone/${phone.id}`);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const { phone_number, location, department_name } = editingPhone;

    axios.put(`http://localhost:5000/api/phones/${editingPhone.id}`, {
      phone_number,
      location,
      department_name
    })
      .then(response => {
        // Cập nhật lại danh sách sau khi sửa
        setPhones(phones.map(phone =>
          phone.id === editingPhone.id ? { ...phone, phone_number, location, department_name } : phone
        ));
        alert('Cập nhật thành công');
        setEditingPhone(null); // Đóng form chỉnh sửa
      })
      .catch(error => console.error(error));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa số điện thoại này?')) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/phones/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Xóa số điện thoại thành công!');
        fetchPhones(); // Refresh lại danh sách
      } catch (err) {
        toast.error('Xóa số điện thoại thất bại!');
        console.error('Lỗi xóa phone', err);
      }
    }
  };


  const handleLogout = () => {
    toast.success('Đăng xuất thành công!');
    logoutAdmin(); // Xử lý đăng xuất và chuyển hướng về trang login
  };

  return (
    <>
      {/* Navbar dùng component mới */}
      <Navbar
        departments={departments}
        keyword={keyword}
        setKeyword={setKeyword}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        isAdmin={isAdmin}
        handleSearch={handleSearch}
        handleDeptChange={handleDeptChange}
      />
      {/* Nội dung */}
      <div className="container py-5 mt-4">
        <div className="row">
          {phones.map((phone) => (
            <div key={phone.id} className="col-md-3 mb-3">
              <PhoneCard
                phone={phone}
                isAdmin={isAdmin}
                onEdit={() => handleEdit(phone)}
                onDelete={() => handleDelete(phone.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PhoneList;
