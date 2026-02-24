'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MagnetProps {
    children: React.ReactNode;
    padding?: number;
    disabled?: boolean;
    magnetStrength?: number;
    className?: string;
}

export function Magnet({
    children,
    padding = 100,
    disabled = false,
    magnetStrength = 2,
    className = ''
}: MagnetProps) {
    const [isActive, setIsActive] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const magnetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) {
            setPosition({ x: 0, y: 0 });
            setIsActive(false);
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!magnetRef.current) return;
            const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const distX = Math.abs(centerX - e.clientX);
            const distY = Math.abs(centerY - e.clientY);

            if (distX < width / 2 + padding && distY < height / 2 + padding) {
                setIsActive(true);
                setPosition({
                    x: (e.clientX - centerX) / magnetStrength,
                    y: (e.clientY - centerY) / magnetStrength,
                });
            } else {
                setIsActive(false);
                setPosition({ x: 0, y: 0 });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [disabled, padding, magnetStrength]);

    return (
        <motion.div
            ref={magnetRef}
            className={`inline-block ${className}`}
            animate={position}
            transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
