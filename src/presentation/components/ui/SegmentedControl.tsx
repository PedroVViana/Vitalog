'use client';

import React from 'react';
import styles from './SegmentedControl.module.css';

interface SegmentedControlProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    style?: React.CSSProperties;
}

export const SegmentedControl = ({ options, value, onChange, style }: SegmentedControlProps) => {
    return (
        <div className={styles.segmentedControl} style={style}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`${styles.segmentedOpt} ${value === opt.value ? styles.segmentedOptActive : ''}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
