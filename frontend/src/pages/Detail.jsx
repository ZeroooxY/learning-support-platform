import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Detail = () => {
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [savedSubMaterials, setSavedSubMaterials] = useState([]);
    const [showSubMaterialForm, setShowSubMaterialForm] = useState(false);
    const [subMaterialForm, setSubMaterialForm] = useState({
        title: '',
        description: '',
        content: '',
        pdfUrl: ''
    });
    const [editingSubId, setEditingSubId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterialAndSaved = async () => {
            try {
                const [matRes, savedRes] = await Promise.all([
                    api.get(`/api/materials/${id}`),
                    api.get('/api/materials/saved')
                ]);

                setMaterial(matRes.data);

                // Extract IDs of saved materials for easy lookup
                const savedIds = savedRes.data.map(m => m.id);
                setSavedSubMaterials(savedIds);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchMaterialAndSaved();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await api.delete(`/api/materials/${id}`);
                navigate('/');
            } catch (err) {
                console.error("Error deleting material:", err);
                alert("Failed to delete material");
            }
        }
    };

    const handleToggleSave = async (subId) => {
        try {
            const res = await api.post(`/api/materials/save/${subId}`);
            if (res.data.isSaved) {
                setSavedSubMaterials([...savedSubMaterials, subId]);
            } else {
                setSavedSubMaterials(savedSubMaterials.filter(id => id !== subId));
            }
        } catch (err) {
            console.error("Error toggling save:", err);
            alert("Failed to update save status");
        }
    };

    const handleAddSubMaterial = () => {
        setSubMaterialForm({ title: '', description: '', content: '', pdfUrl: '' });
        setEditingSubId(null);
        setShowSubMaterialForm(true);
    };

    const handleSubMaterialFormChange = (e) => {
        setSubMaterialForm({ ...subMaterialForm, [e.target.name]: e.target.value });
    };

    const handleSubMaterialSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...subMaterialForm,
                content: subMaterialForm.content || `Content for ${subMaterialForm.title}`,
            };

            if (editingSubId) {
                await api.put(`/api/materials/${editingSubId}`, payload);
            } else {
                await api.post('/api/materials', {
                    ...payload,
                    subject: material.subject,
                    parent_id: id
                });
            }
            const res = await api.get(`/api/materials/${id}`);
            setMaterial(res.data);
            setShowSubMaterialForm(false);
        } catch (err) {
            console.error("Error saving submaterial:", err);
            alert("Failed to save submaterial");
        }
    };

    const handleDeleteSubMaterial = async (subId) => {
        if (!window.confirm('Delete this submaterial?')) return;

        try {
            await api.delete(`/api/materials/${subId}`);
            const res = await api.get(`/api/materials/${id}`);
            setMaterial(res.data);
        } catch (err) {
            console.error("Error deleting submaterial:", err);
            alert("Failed to delete submaterial");
        }
    };

    if (!material) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <Link to="/" className="back-link">← Back to Dashboard</Link>
                <div className="detail-card">
                    <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                        <h1 style={{ margin: 0, border: 'none' }}>{material.title}</h1>
                        {localStorage.getItem('userRole') === 'admin' && (
                            <button onClick={handleDelete} className="btn" style={{ backgroundColor: '#ef4444', color: 'white' }}>Delete</button>
                        )}
                    </div>
                    <div className="material-content">
                        <p>{material.content}</p>

                        {material.subMaterials && material.subMaterials.length > 0 && (
                            <div className="sub-materials-section" style={{ marginTop: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Sub-Materials</h2>
                                    {localStorage.getItem('userRole') === 'admin' && (
                                        <button onClick={handleAddSubMaterial} className="btn" style={{ backgroundColor: '#10b981', color: 'white', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                            + Add Submaterial
                                        </button>
                                    )}
                                </div>
                                <div className="sub-materials-list">
                                    {material.subMaterials.map((sub, index) => (
                                        <div key={index} className="sub-material-item" style={{
                                            padding: '1rem',
                                            border: '1px solid #eee',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                            backgroundColor: '#f9fafb',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ marginTop: 0 }}>{sub.title}</h3>
                                                <Link to={`/material/${id}/sub/${sub.id}`} className="btn btn-sm" style={{ display: 'inline-block', marginTop: '0.5rem' }}>View Details</Link>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleToggleSave(sub.id)}
                                                    className="btn-icon"
                                                    title={savedSubMaterials.includes(sub.id) ? "Remove from Saved" : "Save to My Courses"}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '1.5rem',
                                                        color: savedSubMaterials.includes(sub.id) ? '#ef4444' : '#9ca3af',
                                                        padding: '0.5rem',
                                                        transition: 'color 0.2s'
                                                    }}
                                                >
                                                    {savedSubMaterials.includes(sub.id) ? '−' : '+'}
                                                </button>
                                                {localStorage.getItem('userRole') === 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteSubMaterial(sub.id)}
                                                        className="btn"
                                                        style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!material.subMaterials || material.subMaterials.length === 0 && localStorage.getItem('userRole') === 'admin' && (
                            <div style={{ marginTop: '2rem' }}>
                                <button onClick={handleAddSubMaterial} className="btn" style={{ backgroundColor: '#10b981', color: 'white' }}>
                                    + Add Submaterial
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submaterial Form Modal */}
                {showSubMaterialForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '2rem',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}>
                            <h2>{editingSubId ? 'Edit Submaterial' : 'Add Submaterial'}</h2>
                            <form onSubmit={handleSubMaterialSubmit}>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={subMaterialForm.title}
                                        onChange={handleSubMaterialFormChange}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={subMaterialForm.description}
                                        onChange={handleSubMaterialFormChange}
                                        required
                                        rows="3"
                                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label>PDF URL</label>
                                    <input
                                        type="url"
                                        name="pdfUrl"
                                        value={subMaterialForm.pdfUrl}
                                        onChange={handleSubMaterialFormChange}
                                        required
                                        placeholder="https://example.com/file.pdf"
                                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="submit" className="btn" style={{ flex: 1, backgroundColor: '#10b981', color: 'white' }}>
                                        {editingSubId ? 'Update' : 'Add'} Submaterial
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowSubMaterialForm(false)}
                                        className="btn"
                                        style={{ flex: 1, backgroundColor: '#6b7280', color: 'white' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detail;
