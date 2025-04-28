import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [name, setName] = useState('');
    const [phoneId, setPhoneId] = useState('');
    const [users, setUsers] = useState([]);
    const [phones, setPhones] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchPhones();
        const token = localStorage.getItem("token");
        if (token) {
            setIsAdmin(true);
        }
    }, []);

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:5000/api/users');
        setUsers(res.data);
    };

    const fetchPhones = async () => {
        const res = await axios.get('http://localhost:5000/api/phones');
        setPhones(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };

            if (editingId) {
                await axios.put(`http://localhost:5000/api/users/${editingId}`, { name, phone_id: phoneId }, config);
                toast('Cập nhật thành công');
            } else {
                await axios.post("http://localhost:5000/api/users", { name, phone_id: phoneId }, config);
                toast('Thêm mới thành công');
            }
            fetchUsers();
            setName('');
            setPhoneId('');
            setEditingId(null);
        } catch (err) {
            console.error("Lỗi:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa?")) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                };
                await axios.delete(`http://localhost:5000/api/users/${id}`, config);
                fetchUsers();
                toast('Xóa thành công');
            } catch (err) {
                console.error("Lỗi xóa người dùng:", err);
            }
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setName(user.name);
        setPhoneId(user.phone_id);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <Navbar
                keyword=""
                setKeyword={() => {}}
                selectedDept=""
                setSelectedDept={() => {}}
                departments={[]}
                handleSearch={(e) => e.preventDefault()}
                handleDeptChange={() => {}}
                isAdmin={isAdmin}
                handleLogout={handleLogout}
            />

            <div className="container mt-5 pt-4">
                <h2>Quản lý Người dùng</h2>
                {isAdmin && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Tên người dùng"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        className="form-control mb-2"
                        value={phoneId}
                        onChange={(e) => setPhoneId(e.target.value)}
                    >
                        <option value="">Chọn số điện thoại</option>
                        {phones.map(phone => (
                            <option key={phone.id} value={phone.id}>
                                {phone.phone_number} ({phone.location})
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </form>)}

                <table className="table">
                    <thead>
                        <tr>
                            <th>Tên người dùng</th>
                            <th>Số điện thoại</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.phone_number}</td>
                                {isAdmin && (
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserManagement;
