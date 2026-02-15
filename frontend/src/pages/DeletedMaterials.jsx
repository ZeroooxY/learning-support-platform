import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const DeletedMaterials = () => {
    const [deletedMaterials, setDeletedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeletedMaterials();
    }, []);

    const fetchDeletedMaterials = async () => {
        try {
            const res = await api.get('/api/materials/deleted');
            setDeletedMaterials(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching deleted materials:", err);
            setLoading(false);
        }
    };

    const handleRestore = async (materialId) => {
        if (window.confirm('Restore this material?')) {
            try {
                await api.put(`/api/materials/${materialId}/restore`);
                // Refresh list
                fetchDeletedMaterials();
            } catch (err) {
                console.error("Error restoring material:", err);
                const errorMsg = err.response?.data?.message || "Failed to restore material";
                alert(errorMsg);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <Link to="/" className="back-link">← Back to Dashboard</Link>
                <h1>Deleted Materials</h1>
                <p>Materials that have been deleted. You can restore them if needed.</p>

                {deletedMaterials.length === 0 ? (
                    <p style={{ color: '#6b7280', marginTop: '2rem' }}>No deleted materials</p>
                ) : (
                    <div className="materials-grid" style={{ marginTop: '2rem' }}>
                        {deletedMaterials.map(material => (
                            <div key={material.id} className="material-card" style={{ opacity: 0.7 }}>
                                <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px'
                                    }}>
                                        {material.type || 'MATERIAL'}
                                    </span>
                                </div>
                                <h3>{material.title}</h3>
                                <p>{material.description}</p>
                                {material.parent_id && (
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                        📁 Parent: {material.parent_id.title || 'Unknown'}
                                    </p>
                                )}
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                                    🗑️ Deleted: {material.deletedAt ? new Date(material.deletedAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Unknown'}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleRestore(material.id)}
                                        className="btn"
                                        style={{ backgroundColor: '#10b981', color: 'white', flex: 1 }}
                                    >
                                        Restore
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

export default DeletedMaterials;
