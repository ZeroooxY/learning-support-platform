import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [materials, setMaterials] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const query = search ? `?search=${search}` : '';
                const res = await api.get(`/api/materials${query}`);
                setMaterials(res.data);
            } catch (err) {
                console.error("Error fetching materials:", err);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchMaterials();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Learning Materials</h1>
                        <p>Welcome to your learning dashboard. Select a topic to start studying.</p>
                    </div>
                    {localStorage.getItem('userRole') === 'admin' && (
                        <Link to="/create-course" className="btn" style={{ backgroundColor: '#10b981', color: 'white' }}>
                            + Create New Course
                        </Link>
                    )}
                </div>

                <div className="search-container" style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}
                    />
                </div>

                <div className="materials-grid">
                    {materials.map(material => (
                        <div key={material.id} className="material-card">
                            <h3>{material.title}</h3>
                            <p>{material.description}</p>
                            <Link to={`/material/${material.id}`} className="btn btn-secondary">Read More</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
