'use client'

import React from 'react';
import { motion } from 'framer-motion';

type LoaderVariant = 'pulse' | 'spin' | 'dots';

interface LoaderProps {
    variant?: LoaderVariant;
    size?: number;
    color?: string;
    secondaryColor?: string;
    text?: string;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
    variant = 'pulse',
    size = 64,
    color = 'var(--primary)',
    secondaryColor = 'var(--secondary)',
    text,
    className = '',
}) => {
    const renderLoader = () => {
        switch (variant) {
            case 'pulse':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <motion.div
                            className="rounded-full"
                            style={{
                                width: size,
                                height: size,
                                backgroundColor: color,
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 0.9, 0.7],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        {text && <p className="mt-4 text-muted-foreground font-medium">{text}</p>}
                    </div>
                );

            case 'spin':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative" style={{ width: size, height: size }}>
                            <motion.div
                                className="absolute inset-0 rounded-full border-t-2 border-solid"
                                style={{
                                    width: size,
                                    height: size,
                                    borderColor: color,
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-solid opacity-25"
                                style={{
                                    width: size,
                                    height: size,
                                    borderColor: secondaryColor,
                                }}
                            />
                        </div>
                        {text && <p className="mt-4 text-muted-foreground font-medium">{text}</p>}
                    </div>
                );

            case 'dots':
                return (
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex space-x-2">
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-full"
                                    style={{
                                        width: size / 3,
                                        height: size / 3,
                                        backgroundColor: color,
                                    }}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.6, 1, 0.6],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.15,
                                    }}
                                />
                            ))}
                        </div>
                        {text && <p className="mt-4 text-muted-foreground font-medium">{text}</p>}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            {renderLoader()}
        </div>
    );
};

export default Loader;