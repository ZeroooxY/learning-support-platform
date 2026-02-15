import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const CreateCourse = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        subject: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/materials', formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <Link to="/" className="back-link">← Back to Dashboard</Link>
                <div className="detail-card">
                    <h1>Create New Course</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Content</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="6"
                                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                            />
                        </div>
                        <button type="submit" className="btn" style={{ marginRight: '1rem' }}>Create Course</button>
                        <button type="button" onClick={() => navigate('/')} className="btn" style={{ backgroundColor: '#6b7280' }}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
