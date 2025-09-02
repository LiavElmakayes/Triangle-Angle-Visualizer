import React from 'react';
import './PointInputs.css';

// Simple input grid for 3 points (A, B, C), each with X and Y.
// Assumes valid numeric input per requirements.
export default function PointInputs({ points, onChange }) {
    const labels = ['A', 'B', 'C'];

    const updatePoint = (index, key, value) => {
        const num = Number(value);
        const next = points.map((p, i) => (i === index ? { ...p, [key]: num } : p));
        onChange(next);
    };

    return (
        <div className="inputsGrid">
            {points.map((p, i) => (
                <div key={i} className="row">
                    <strong className="label">{labels[i]}:</strong>
                    <label className="field">
                        <span className="fieldTitle">X</span>
                        <input
                            type="number"
                            value={p.x}
                            onChange={(e) => updatePoint(i, 'x', e.target.value)}
                            className="input"
                        />
                    </label>
                    <label className="field">
                        <span className="fieldTitle">Y</span>
                        <input
                            type="number"
                            value={p.y}
                            onChange={(e) => updatePoint(i, 'y', e.target.value)}
                            className="input"
                        />
                    </label>
                </div>
            ))}
        </div>
    );
}


