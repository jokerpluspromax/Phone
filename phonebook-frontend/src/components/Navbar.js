import React from 'react';
import { Link } from 'react-router-dom';
import { logoutAdmin } from '../utils/auth';
import { toast } from 'react-toastify';

function Navbar({ 
    departments, keyword, setKeyword, selectedDept, setSelectedDept,
    isAdmin, handleSearch, handleDeptChange
}) {
    const handleLogoutClick = () => {
        toast.success('Đăng xuất thành công!');
        logoutAdmin();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">PhoneBook</Link>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <form className="d-flex ms-3 flex-grow-1" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Tìm kiếm theo tên, số điện thoại, bộ phận, vị trí..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <select
                            className="form-select me-2"
                            style={{ maxWidth: '450px' }}
                            value={selectedDept}
                            onChange={handleDeptChange}
                        >
                            <option value="">Tất cả bộ phận</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.name}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-outline-primary" type="submit">Tìm</button>
                    </form>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {isAdmin ? (
                            <>
                                <li className="nav-item d-flex align-items-center me-3">
                                    <span className="nav-link">Admin</span>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-info me-2" to="/manage-phones">Phones Management</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-info me-2" to="/manage-departments">Department Management</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-info me-2" to="/manage-users">User Management</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger" onClick={handleLogoutClick}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-outline-success" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
