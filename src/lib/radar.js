import { useEffect, useRef, useState } from 'react';

const RADAR_CX = 150;
const RADAR_CY = 150;
const RADAR_PUSH_DIST = 12;

// Animates a per-point "push" value (0..1) toward 1 for the active index
// and 0 for the rest, easing every point toward its target each frame.
export function useRadarPush(activeIndex, count) {
    const [push, setPush] = useState(() => new Array(count).fill(0));
    const ref = useRef(push);

    useEffect(() => {
        let frame;
        const tick = () => {
            const current = ref.current;
            let changed = false;
            const next = current.map((v, i) => {
                const target = i === activeIndex ? 1 : 0;
                const nv = v + (target - v) * 0.22;
                if (Math.abs(target - nv) > 0.002) {
                    changed = true;
                    return nv;
                }
                return target;
            });
            ref.current = next;
            setPush(next);
            if (changed) {
                frame = requestAnimationFrame(tick);
            }
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [activeIndex]);

    return push;
}

// Nudges each point outward from the chart center in proportion to its
// push value, so only the two edges touching the active vertex move.
export function pushRadarCoords(coords, push) {
    return coords.map((p, i) => {
        const t = push[i] || 0;
        if (!t) return p;
        const dx = p.x - RADAR_CX;
        const dy = p.y - RADAR_CY;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        return { x: p.x + (dx / len) * RADAR_PUSH_DIST * t, y: p.y + (dy / len) * RADAR_PUSH_DIST * t };
    });
}

export function radarCoordsToPoints(coords) {
    return coords.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}
