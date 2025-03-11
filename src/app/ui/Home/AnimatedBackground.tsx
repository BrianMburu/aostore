'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const AnimatedBackground: React.FC = () => {
    const { theme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Enhanced color palette with better contrast and visual appeal
    const colors = theme === 'dark'
        ? [
            '#6366F1', // Indigo
            '#8B5CF6', // Purple
            '#EC4899', // Pink
            '#3B82F6', // Blue
            '#10B981'  // Emerald
        ]
        : [
            '#818CF8', // Light Indigo
            '#A78BFA', // Light Purple
            '#F472B6', // Light Pink
            '#60A5FA', // Light Blue
            '#34D399'  // Light Emerald
        ];

    // Subtle gradient backgrounds for added depth
    const gradients = theme === 'dark'
        ? [
            'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            'linear-gradient(135deg, #EC4899 0%, #3B82F6 100%)',
            'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
            'linear-gradient(135deg, #10B981 0%, #6366F1 100%)'
        ]
        : [
            'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)',
            'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
            'linear-gradient(135deg, #F472B6 0%, #60A5FA 100%)',
            'linear-gradient(135deg, #60A5FA 0%, #34D399 100%)',
            'linear-gradient(135deg, #34D399 0%, #818CF8 100%)'
        ];

    // Track mouse movement for interactive parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // More sophisticated animations with varying speeds and paths
    const createVariants = (index: number) => ({
        animate: {
            x: [0, 30 * (index % 2 ? 1 : -1), -40 * (index % 2 ? -1 : 1), 20 * (index % 2 ? 1 : -1), 0],
            y: [0, -20 * (index % 3 ? 1 : -1), 30 * (index % 3 ? -1 : 1), -10 * (index % 3 ? 1 : -1), 0],
            rotate: [0, 5, -5, 3, 0],
            scale: [1, 1.03, 0.98, 1.01, 1],
            transition: {
                duration: 15 + index * 3,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1]
            }
        }
    });

    // Interactive parallax effect based on mouse position
    const parallaxEffect = (depth: number) => {
        const factor = depth * 0.02;
        return {
            x: mousePosition.x * factor,
            y: mousePosition.y * factor
        };
    };

    // Array of blob objects with different properties
    const blobs = [
        { size: 350, top: '5%', left: '15%', opacity: 0.8, blur: 30, depth: 1 },
        { size: 250, top: '15%', right: '10%', opacity: 0.7, blur: 40, depth: 2 },
        { size: 400, bottom: '10%', left: '5%', opacity: 0.6, blur: 60, depth: 3 },
        { size: 300, bottom: '20%', right: '20%', opacity: 0.7, blur: 45, depth: 2 },
        { size: 480, top: '50%', left: '60%', opacity: 0.5, blur: 70, depth: 4 },
        // Smaller accents
        { size: 120, top: '30%', left: '30%', opacity: 0.6, blur: 20, depth: 1 },
        { size: 150, top: '70%', right: '25%', opacity: 0.7, blur: 25, depth: 2 }
    ];

    // Hexagon background pattern elements
    const hexagonPatterns = Array.from({ length: 6 }).map((_, i) => ({
        top: `${(i * 20) + 5}%`,
        left: `${((i % 3) * 30) + 10}%`,
        size: 80 + (i * 10),
        rotate: i * 15,
        opacity: 0.1,
        delay: i * 0.5
    }));

    return (
        <div className="fixed inset-0 overflow-hidden z-0">
            {/* Mesh gradient base */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: theme === 'dark'
                        ? 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.3), transparent 60%), radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.3), transparent 60%)'
                        : 'radial-gradient(circle at 30% 30%, rgba(129, 140, 248, 0.3), transparent 60%), radial-gradient(circle at 70% 70%, rgba(244, 114, 182, 0.3), transparent 60%)'
                }}
            />

            {/* Blobs */}
            {blobs.map((blob, index) => (
                <motion.div
                    key={`blob-${index}`}
                    variants={createVariants(index)}
                    animate="animate"
                    style={{
                        position: 'absolute',
                        width: blob.size,
                        height: blob.size,
                        borderRadius: '50%',
                        background: gradients[index % gradients.length],
                        filter: `blur(${blob.blur}px)`,
                        opacity: blob.opacity,
                        top: blob.top,
                        left: blob.left,
                        right: blob.right,
                        bottom: blob.bottom,
                        zIndex: -1,
                        ...parallaxEffect(blob.depth)
                    }}
                />
            ))}

            {/* Hexagon patterns for tech feel */}
            {hexagonPatterns.map((hex, index) => (
                <motion.svg
                    key={`hex-${index}`}
                    width={hex.size}
                    height={hex.size}
                    viewBox="0 0 100 100"
                    style={{
                        position: 'absolute',
                        top: hex.top,
                        left: hex.left,
                        opacity: hex.opacity,
                        zIndex: -1,
                        transform: `rotate(${hex.rotate}deg)`
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: hex.opacity,
                        scale: [0.9, 1.1, 0.9],
                        rotate: [hex.rotate, hex.rotate + 5, hex.rotate]
                    }}
                    transition={{
                        duration: 15,
                        delay: hex.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <polygon
                        points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25"
                        fill="none"
                        stroke={colors[index % colors.length]}
                        strokeWidth="1"
                    />
                    <polygon
                        points="50 10, 85 30, 85 70, 50 90, 15 70, 15 30"
                        fill="none"
                        stroke={colors[(index + 2) % colors.length]}
                        strokeWidth="0.5"
                    />
                </motion.svg>
            ))}

            {/* Subtle particle effect */}
            {Array.from({ length: 20 }).map((_, index) => (
                <motion.div
                    key={`particle-${index}`}
                    className="absolute rounded-full"
                    style={{
                        width: 3 + Math.random() * 5,
                        height: 3 + Math.random() * 5,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: 0.3 + Math.random() * 0.4,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

export default React.memo(AnimatedBackground);