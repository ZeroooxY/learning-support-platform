import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const SubDetail = () => {
    const { id, subId } = useParams();
    const [subMaterial, setSubMaterial] = useState(null);
    const [parentTitle, setParentTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubMaterial = async () => {
            try {
                // Fetch directly from the new dedicated endpoint
                const res = await api.get(`/api/materials/${id}/sub/${subId}`);
                const data = res.data;

                setSubMaterial(data);
                setParentTitle(data.parentTitle);
            } catch (err) {
                console.error("Error fetching sub-material:", err);
                setError('Failed to load material');
            } finally {
                setLoading(false);
            }
        };

        fetchSubMaterial();
    }, [id, subId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!subMaterial) return <div>Sub-material not found</div>;

    return (
        <div className="page-container">
            <Navbar />
            <div className="content-container">
                <Link to={`/material/${id}`} className="back-link">← Back to {parentTitle}</Link>

                <div className="detail-card">
                    <h1>{subMaterial.title}</h1>
                    <div className="material-content">
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                            {subMaterial.description}
                        </p>

                        <div className="pdf-section" style={{
                            padding: '2rem',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <h3>Study Material (PDF)</h3>
                            <p>Download the PDF to study this topic in depth.</p>
                            <a
                                href={subMaterial.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '1rem',
                                    textDecoration: 'none'
                                }}
                            >
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubDetail;
