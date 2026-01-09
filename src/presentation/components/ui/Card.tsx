'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Card = ({ children, className = '', onClick, style }: CardProps) => {
    return (
        <div
            className={`card ${className} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
};
