import React from 'react';
import { useNavigate } from 'react-router-dom';
import TriangleSVG from '../../components/TriangleSVG/TriangleSVG';
import './DisplayPage.css';
import { usePoints } from '../../context/PointsContext';

export default function DisplayPage() {
    const navigate = useNavigate();
    const { points } = usePoints();

    return (
        <div className="page">
            <div className="card">
                <h2 className="title">Triangle Display</h2>
                <div className="actions">
                    <button className="primary large" onClick={() => navigate('/')}>Back to Input</button>
                </div>
                <div className="canvasWrap">
                    <TriangleSVG points={points} width={800} height={800} />
                </div>
            </div>
        </div>
    );
}


