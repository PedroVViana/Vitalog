'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Habit, CreateHabitDTO } from '../../../domain/entities/Habit';
import { createHabit } from '../../../domain/use-cases/CreateHabit';
import { updateHabit } from '../../../domain/use-cases/UpdateHabit';

interface HabitFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (habit: Habit) => void;
    initialData?: Habit;
}

const PRESET_COLORS = [
    '#1F7A6E', '#0F3D3E', '#F2B705', '#E67E22',
    '#E74C3C', '#9B59B6', '#3498DB', '#27AE60'
];

export const HabitFormModal = ({ isOpen, onClose, onSubmit, initialData }: HabitFormModalProps) => {
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState(7);
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setFrequency(initialData.frequencyPerWeek);
            setColor(initialData.colorHex || PRESET_COLORS[0]);
        } else {
            setName('');
            setFrequency(7);
            setColor(PRESET_COLORS[0]);
        }
        setError('');
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                const updated = updateHabit(initialData, { name, frequencyPerWeek: frequency, colorHex: color });
                onSubmit(updated);
            } else {
                const dto: CreateHabitDTO = { name, frequencyPerWeek: frequency, colorHex: color };
                const newHabit = createHabit(dto);
                onSubmit(newHabit);
            }
            onClose();
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Habit' : 'New Habit'}>
            <form onSubmit={handleSubmit} className="habit-form">
                <Input
                    label="Habit Name"
                    placeholder="e.g. Drink 2L Water"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                    required
                />

                <div className="field-group">
                    <label className="field-label">
                        Frequency (times per week)
                    </label>
                    <div className="frequency-row">
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setFrequency(num)}
                                className={`freq-btn ${frequency === num ? 'active' : ''}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="field-group">
                    <label className="field-label">
                        Color
                    </label>
                    <div className="color-row">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`color-btn ${color === c ? 'active' : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <Button type="button" variant="ghost" fullWidth onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" fullWidth>
                        {initialData ? 'Save Changes' : 'Create Habit'}
                    </Button>
                </div>

                <style jsx>{`
                    .habit-form { display: flex; flex-direction: column; gap: var(--space-6); }
                    .field-group { display: flex; flex-direction: column; gap: var(--space-2); }
                    .field-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }
                    .frequency-row { display: flex; gap: var(--space-2); }
                    .freq-btn {
                        width: 2.5rem;
                        height: 2.5rem;
                        border-radius: var(--radius-lg);
                        border: 1px solid var(--border);
                        background: transparent;
                        font-weight: 800;
                        color: var(--text-muted);
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .freq-btn.active {
                        background-color: var(--primary);
                        color: white;
                        border-color: var(--primary);
                        transform: scale(1.1);
                        box-shadow: 0 4px 6px -1px rgba(var(--primary-rgb), 0.3);
                    }
                    .color-row { display: flex; flex-wrap: wrap; gap: var(--space-3); }
                    .color-btn {
                        width: 2rem;
                        height: 2rem;
                        border-radius: 50%;
                        border: 2px solid transparent;
                        cursor: pointer;
                        transition: transform 0.2s;
                    }
                    .color-btn.active {
                        transform: scale(1.2);
                        border-color: var(--accent);
                        box-shadow: 0 0 0 2px white, 0 0 0 4px var(--accent);
                    }
                    .dark .color-btn.active { box-shadow: 0 0 0 2px var(--bg-dark), 0 0 0 4px var(--accent); }
                    .form-actions { display: flex; gap: var(--space-3); padding-top: var(--space-4); }
                `}</style>
            </form>
        </Modal>
    );
};
