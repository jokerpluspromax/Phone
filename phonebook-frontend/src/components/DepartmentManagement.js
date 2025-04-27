import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const DepartmentManagement = () => {
    const [name, setName] = useState('');
    const [departments, setDepartments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchDepartments();
        const token = localStorage.getItem("token");
        if (token) {
            setIsAdmin(true);
        }
    }, []);

    const fetchDepartments = async () => {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return alert('Vui lòng nhập tên phòng ban');
    
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };
    
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/departments/${editingId}`, { name }, config);
                toast('Cập nhật thành công');
            } else {
                await axios.post('http://localhost:5000/api/departments', { name }, config);
                toast('Thêm mới thành công');
            }
            fetchDepartments();
            setName('');
            setEditingId(null);
        } catch (err) {
            console.error("Lỗi:", err);
            alert("Đã xảy ra lỗi khi gửi dữ liệu.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa?')) {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };
            try {
                await axios.delete(`http://localhost:5000/api/departments/${id}`, config);
                fetchDepartments();
            } catch (err) {
                console.error("Lỗi:", err);
                alert("Đã xảy ra lỗi khi xóa.");
            }
        }
    };

    const handleEdit = (dept) => {
        setEditingId(dept.id);
        setName(dept.name);
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

            {/* Noi dung DepartmentManagement */}
        </><div className="container mt-5 pt-4">
                <h2>Quản lý phòng ban</h2>
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Tên phòng ban"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <button type="submit" className="btn btn-primary">
                        {editingId ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </form>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Tên phòng ban</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(dept => (
                            <tr key={dept.id}>
                                <td>{dept.name}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(dept)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(dept.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></>
    );
};

export default DepartmentManagement;