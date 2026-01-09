'use client';

import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
    colorHex?: string;
    style?: React.CSSProperties;
}

export const Chip = ({ label, active, onClick, colorHex, style }: ChipProps) => {
    return (
        <button
            onClick={onClick}
            className={`${styles.chip} ${active ? styles.chipActive : ''}`}
            style={{
                '--chip-color': colorHex || 'var(--primary)',
                cursor: onClick ? 'pointer' : 'default',
                ...style
            } as any}
        >
            {active && (
                <div className={styles.chipDot} style={{ backgroundColor: colorHex || 'var(--primary)' }} />
            )}
            <span>{label}</span>
        </button>
    );
};
