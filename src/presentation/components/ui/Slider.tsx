'use client';

import React from 'react';
import styles from './Slider.module.css';

interface SliderProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    style?: React.CSSProperties;
}

export const Slider = ({ label, value, onChange, min = 1, max = 10, style }: SliderProps) => {
    return (
        <div className={styles.sliderContainer} style={style}>
            <div className={styles.sliderHeader}>
                <label>{label}</label>
                <span className={styles.sliderValue}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className={styles.sliderInput}
            />
        </div>
    );
};
