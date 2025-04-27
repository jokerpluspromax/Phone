import React from 'react';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PhonesManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [keyword, setKeyword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    //const [editingPhone, setEditingPhone] = useState(null); // Dùng để quản lý việc sửa
    const [name, setName] = useState('');
    const [phoneId, setPhoneId] = useState('');
    const [users, setUsers] = useState([]);
    const [phones, setPhones] = useState([]);
    const [editingId, setEditingId] = useState(null);
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
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <><>
            <Navbar
                keyword=""
                setKeyword={() => { } }
                selectedDept=""
                setSelectedDept={() => { } }
                departments={[]}
                handleSearch={(e) => e.preventDefault()}
                handleDeptChange={() => { } }
                isAdmin={isAdmin}
                handleLogout={handleLogout} />

            {/* Noi dung phonemanagement */}
        </><div className="container mt-5 pt-4">
                <h2>Phones Management</h2>
                <form className="mb-4">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Số điện thoại mới" />
                    <select
                        className="form-control mb-2"
                        placeholder="Chọn bộ phận">
                    </select>
                </form>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Tên người dùng</th>
                            <th>Số điện thoại</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nguyễn Văn A</td>
                            <td>0123456789</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2">Sửa</button>
                                <button className="btn btn-sm btn-danger">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div></>
    );
};

export default PhonesManagement;