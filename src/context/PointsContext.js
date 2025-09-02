import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_POINTS = [
    { x: 200, y: 200 },
    { x: 600, y: 250 },
    { x: 350, y: 600 },
];

const PointsContext = createContext(null);

export function PointsProvider({ children }) {
    const [points, setPoints] = useState(() => {
        try {
            const raw = localStorage.getItem('triangle_points');
            if (raw) return JSON.parse(raw);
        } catch { }
        return DEFAULT_POINTS;
    });

    useEffect(() => {
        try {
            localStorage.setItem('triangle_points', JSON.stringify(points));
        } catch { }
    }, [points]);

    const value = useMemo(() => ({ points, setPoints }), [points]);
    return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
    const ctx = useContext(PointsContext);
    if (!ctx) throw new Error('usePoints must be used within PointsProvider');
    return ctx;
}


