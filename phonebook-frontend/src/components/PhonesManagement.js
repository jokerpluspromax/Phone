import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PhonesManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [keyword, setKeyword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [phones, setPhones] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
        fetchPhones();
        const token = localStorage.getItem("token");
        if (token) {
            setIsAdmin(true);
        }
    }, []);

    const fetchDepartments = async () => {
        const res = await axios.get('http://localhost:5000/api/departments');
        setDepartments(res.data);
    };

    const fetchPhones = async () => {
        const res = await axios.get('http://localhost:5000/api/phones');
        setPhones(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!phoneNumber || !departmentId) {
            return alert('Vui lòng nhập đủ thông tin.');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/phones/${editingId}`,
                    { phone_number: phoneNumber, department_id: departmentId, location },
                    config
                );
                toast('Cập nhật thành công!');
            } else {
                await axios.post(
                    `http://localhost:5000/api/phones`,
                    { phone_number: phoneNumber, department_id: departmentId, location },
                    config
                );
                toast('Thêm mới thành công!');
            }
            fetchPhones();
            setPhoneNumber('');
            setDepartmentId('');
            setLocation(''); // Reset location
            setEditingId(null);
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra.');
        }
    };

    const handleEdit = (phone) => {
        setEditingId(phone.id);
        setPhoneNumber(phone.phone_number);
        setDepartmentId(phone.department_id);
        setLocation(phone.location); // <-- thêm dòng này
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };
            try {
                await axios.delete(`http://localhost:5000/api/phones/${id}`, config);
                fetchPhones();
            } catch (err) {
                console.error(err);
                alert('Có lỗi xảy ra khi xóa.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <Navbar
                keyword={keyword}
                setKeyword={setKeyword}
                selectedDept={selectedDept}
                setSelectedDept={setSelectedDept}
                departments={departments}
                handleSearch={(e) => e.preventDefault()}
                handleDeptChange={() => { }}
                isAdmin={isAdmin}
                handleLogout={handleLogout}
            />

            <div className="container mt-5 pt-4">
                <h2>Quản lý Số điện thoại</h2>

                {isAdmin && (
                    <form onSubmit={handleSubmit} className="mb-4">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Nhập số điện thoại"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Nhập vị trí (location)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <select
                            className="form-control mb-2"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                        >
                            <option value="">Chọn phòng ban</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </form>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th>Số điện thoại</th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th> {/* <-- Thêm dòng này */}
                            {isAdmin && <th>Hành động</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {phones.map((phone) => (
                            <tr key={phone.id}>
                                <td>{phone.phone_number}</td>
                                <td>{phone.department_name}</td>
                                <td>{phone.location}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(phone)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(phone.id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default PhonesManagement;
