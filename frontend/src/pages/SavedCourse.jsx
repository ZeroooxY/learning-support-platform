import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const SavedCourse = () => {
    const [savedMaterials, setSavedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedMaterials = async () => {
            try {
                const res = await api.get('/api/materials/saved');
                setSavedMaterials(res.data);
            } catch (err) {
                console.error("Error fetching saved materials:", err);
                setError('Failed to load saved materials');
            } finally {
                setLoading(false);
            }
        };

        fetchSavedMaterials();
    }, []);

    const handleUnsave = async (materialId) => {
        try {
            await api.post(`/api/materials/save/${materialId}`);
            // Remove from local state
            setSavedMaterials(savedMaterials.filter(m => m.id !== materialId));
        } catch (err) {
            console.error("Error unsaving material:", err);
            alert("Failed to unsave material");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <Link to="/" className="back-link">← Back to Dashboard</Link>
                <h1>Saved Courses</h1>

                {savedMaterials.length === 0 ? (
                    <p>No saved courses yet.</p>
                ) : (
                    <div className="materials-grid">
                        {savedMaterials.map((material) => (
                            <div key={material.id} className="material-card" style={{ position: 'relative' }}>
                                <h3>{material.title}</h3>
                                <p className="subject-tag">{material.subject}</p>
                                <p>{material.description}</p>
                                <div style={{ marginTop: '1rem' }}>
                                    {material.parent_id ? (
                                        <Link to={`/material/${material.parent_id}/sub/${material.id}`} className="btn">
                                            View Content
                                        </Link>
                                    ) : (
                                        <Link to={`/material/${material.id}`} className="btn">
                                            View Course
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleUnsave(material.id)}
                                        className="btn"
                                        style={{
                                            marginLeft: '1rem',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedCourse;
