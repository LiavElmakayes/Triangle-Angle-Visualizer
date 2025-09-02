import React, { useMemo } from 'react';

// Helper: vector operations
const sub = (p, q) => ({ x: p.x - q.x, y: p.y - q.y });
const dot = (u, v) => u.x * v.x + u.y * v.y;
const mag = (v) => Math.hypot(v.x, v.y);
const norm = (v) => {
    const m = mag(v) || 1;
    return { x: v.x / m, y: v.y / m };
};
const rad2deg = (r) => (r * 180) / Math.PI;
const atan2 = (v) => Math.atan2(v.y, v.x); // SVG coords: +y goes down
const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

// Compute internal angle at A given B and C
function angleAt(A, B, C) {
    const AB = sub(B, A);
    const AC = sub(C, A);
    const d = dot(AB, AC);
    const m = mag(AB) * mag(AC) || 1;
    const cosTheta = Math.min(1, Math.max(-1, d / m));
    return Math.acos(cosTheta);
}

// Create a small arc path marking the angle at vertex V with neighbors P1 and P2.
// We draw the smaller arc between the rays V->P1 and V->P2, radius r.
function angleArcPath(V, P1, P2, r = 24) {
    const v1 = norm(sub(P1, V));
    const v2 = norm(sub(P2, V));
    const t1 = atan2(v1);
    const t2 = atan2(v2);

    let delta = t2 - t1;
    if (delta < 0) delta += 2 * Math.PI;

    let start = v1;
    let end = v2;
    let sweepFlag = 1;
    if (delta > Math.PI) {
        start = v2;
        end = v1;
        let d2 = t1 - t2;
        if (d2 < 0) d2 += 2 * Math.PI;
        sweepFlag = 1;
    }

    const sx = V.x + r * start.x;
    const sy = V.y + r * start.y;
    const ex = V.x + r * end.x;
    const ey = V.y + r * end.y;

    const largeArcFlag = 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${ex} ${ey}`;
}

// Position for angle label: along the angle bisector, offset inward.
function angleLabelPosition(V, B, C, dist = 40) {
    const v1 = norm(sub(B, V));
    const v2 = norm(sub(C, V));
    let dir = { x: v1.x + v2.x, y: v1.y + v2.y };
    const m = mag(dir);
    if (m < 1e-6) dir = v1;
    else dir = { x: dir.x / m, y: dir.y / m };
    return { x: V.x + dir.x * dist, y: V.y + dir.y * dist };
}

// Position for vertex label: along the outward angle bisector, offset outward.
function vertexLabelPosition(V, B, C, dist = 14) {
    const v1 = norm(sub(B, V));
    const v2 = norm(sub(C, V));
    // Inward bisector is v1 + v2; outward is the opposite direction
    let inward = { x: v1.x + v2.x, y: v1.y + v2.y };
    const m = mag(inward);
    let dir;
    if (m < 1e-6) {
        // Degenerate: use a perpendicular to v1 for better separation
        dir = { x: -v1.y, y: v1.x };
        const dm = mag(dir) || 1;
        dir = { x: dir.x / dm, y: dir.y / dm };
    } else {
        dir = { x: -inward.x / m, y: -inward.y / m }; // outward
    }
    return { x: V.x + dir.x * dist, y: V.y + dir.y * dist };
}

export default function TriangleSVG({ points, width = 800, height = 800 }) {
    const [A, B, C] = points;

    const { polygonPoints, arcs, labels } = useMemo(() => {
        const a = angleAt(A, B, C);
        const b = angleAt(B, A, C);
        const c = angleAt(C, A, B);

        const polygonPointsStr = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;

        // Dynamic arc radius based on angle size to reduce overlap
        const rFor = (angleRad) => {
            const deg = rad2deg(angleRad);
            return clamp(20 + (deg - 30) * 0.08, 16, 36);
        };

        const arcs = [
            angleArcPath(A, B, C, rFor(a)),
            angleArcPath(B, A, C, rFor(b)),
            angleArcPath(C, A, B, rFor(c)),
        ];

        // Base label distance, push further for tiny angles
        const baseLabelDist = 48;
        const extraDistFor = (angleRad) => {
            const deg = rad2deg(angleRad);
            return clamp((30 - deg) * 0.6, 0, 24);
        };

        let labels = [
            { pos: angleLabelPosition(A, B, C, baseLabelDist + extraDistFor(a)), text: `${rad2deg(a).toFixed(1)}°` },
            { pos: angleLabelPosition(B, A, C, baseLabelDist + extraDistFor(b)), text: `${rad2deg(b).toFixed(1)}°` },
            { pos: angleLabelPosition(C, A, B, baseLabelDist + extraDistFor(c)), text: `${rad2deg(c).toFixed(1)}°` },
        ];

        // Simple de-overlap: nudge labels outward if they are too close
        const bisectorDir = (V, P1, P2) => {
            const v1 = norm(sub(P1, V));
            const v2 = norm(sub(P2, V));
            let d = { x: v1.x + v2.x, y: v1.y + v2.y };
            const m = mag(d) || 1;
            return { x: d.x / m, y: d.y / m };
        };

        const labelTriples = [
            { V: A, P1: B, P2: C, angle: a },
            { V: B, P1: A, P2: C, angle: b },
            { V: C, P1: A, P2: B, angle: c },
        ];

        const pushIfClose = (i, j) => {
            const p = labels[i].pos;
            const q = labels[j].pos;
            if (dist(p, q) < 26) {
                const dir = bisectorDir(labelTriples[j].V, labelTriples[j].P1, labelTriples[j].P2);
                labels[j] = {
                    ...labels[j],
                    pos: { x: q.x + dir.x * 14, y: q.y + dir.y * 14 },
                };
            }
        };
        pushIfClose(0, 1);
        pushIfClose(0, 2);
        pushIfClose(1, 2);

        // Keep labels within viewbox margins
        const margin = 8;
        labels = labels.map(l => ({
            ...l,
            pos: {
                x: clamp(l.pos.x, margin, width - margin),
                y: clamp(l.pos.y, margin, height - margin),
            }
        }));

        return {
            polygonPoints: polygonPointsStr,
            arcs,
            labels,
        };
    }, [A, B, C, width, height]);

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{
                border: '1px solid #ddd',
                width: '100%',
                maxWidth: `${width}px`,
                height: 'auto'
            }}
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Triangle */}
            <polygon points={polygonPoints} fill="#e6f2ff" stroke="#1f6feb" strokeWidth="2" />

            {/* Vertices */}
            <circle cx={A.x} cy={A.y} r="4" fill="#1f6feb" />
            <circle cx={B.x} cy={B.y} r="4" fill="#1f6feb" />
            <circle cx={C.x} cy={C.y} r="4" fill="#1f6feb" />

            {/* Angle arcs */}
            <path d={arcs[0]} stroke="#e36209" strokeWidth="3" fill="none" />
            <path d={arcs[1]} stroke="#e36209" strokeWidth="3" fill="none" />
            <path d={arcs[2]} stroke="#e36209" strokeWidth="3" fill="none" />

            {/* Labels near vertices */}
            <text x={labels[0].pos.x} y={labels[0].pos.y} fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#111">
                {labels[0].text}
            </text>
            <text x={labels[1].pos.x} y={labels[1].pos.y} fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#111">
                {labels[1].text}
            </text>
            <text x={labels[2].pos.x} y={labels[2].pos.y} fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="#111">
                {labels[2].text}
            </text>

            {/* Vertex labels positioned relative to the outward bisector */}
            {(() => {
                const p = vertexLabelPosition(A, B, C, 16); return (
                    <text x={p.x} y={p.y} fontSize="12" textAnchor="middle" dominantBaseline="middle" fill="#555">A</text>
                );
            })()}
            {(() => {
                const p = vertexLabelPosition(B, A, C, 16); return (
                    <text x={p.x} y={p.y} fontSize="12" textAnchor="middle" dominantBaseline="middle" fill="#555">B</text>
                );
            })()}
            {(() => {
                const p = vertexLabelPosition(C, A, B, 16); return (
                    <text x={p.x} y={p.y} fontSize="12" textAnchor="middle" dominantBaseline="middle" fill="#555">C</text>
                );
            })()}
        </svg>
    );
}


