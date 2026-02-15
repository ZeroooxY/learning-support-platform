import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    // Simple check for token - in real app use context
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">Learning Platform</Link>
                <div className="nav-links">
                    {token ? (
                        <>
                            <Link to="/">Dashboard</Link>
                            <Link to="/saved-courses">Saved Courses</Link>
                            {localStorage.getItem('userRole') === 'admin' && (
                                <Link to="/deleted-materials">Deleted Materials</Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
