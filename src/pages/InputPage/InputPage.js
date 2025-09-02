import React from 'react';
import { useNavigate } from 'react-router-dom';
import PointInputs from '../../components/PointInputs/PointInputs';
import './InputPage.css';
import { usePoints } from '../../context/PointsContext';

export default function InputPage() {
    const { points, setPoints } = usePoints();
    const navigate = useNavigate();

    const handleShow = () => {
        navigate('/display');
    };

    return (
        <div className="page">
            <div className="card">
                <h2 className="title">Triangle Input</h2>
                <p className="subtitle">Enter coordinates for A, B, and C to visualize the triangle and its angles.</p>
                <PointInputs points={points} onChange={setPoints} />
                <div className="actions">
                    <button className="primary large" onClick={handleShow}>
                        Show Triangle
                    </button>
                </div>
            </div>
        </div>
    );
}


