'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MealCategory, CreateMealCategoryDTO } from '../../../domain/entities/MealCategory';
import { MealType, MEAL_TYPES, getMealTypeLabel } from '../../../domain/value-objects/MealType';
import { createMealCategory } from '../../../domain/use-cases/CreateMealCategory';
import { updateMealCategory } from '../../../domain/use-cases/UpdateMealCategory';
import styles from './MealCategoryFormModal.module.css';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface MealCategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (category: MealCategory) => void;
    initialData?: MealCategory;
}

const PRESET_COLORS = [
    '#1F7A6E', '#0F3D3E', '#F2B705', '#E67E22',
    '#E74C3C', '#9B59B6', '#3498DB', '#27AE60'
];

export const MealCategoryFormModal = ({ isOpen, onClose, onSubmit, initialData }: MealCategoryFormModalProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [mealType, setMealType] = useState<MealType>('custom');
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setMealType(initialData.mealType);
            setColor(initialData.colorHex || PRESET_COLORS[0]);
        } else {
            setName('');
            setMealType('custom');
            setColor(PRESET_COLORS[0]);
        }
        setError('');
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                const updated = updateMealCategory(initialData, { name, mealType, colorHex: color });
                onSubmit(updated);
            } else {
                const dto: CreateMealCategoryDTO = { name, mealType, colorHex: color };
                const newCategory = createMealCategory(dto);
                onSubmit(newCategory);
            }
            onClose();
        } catch (err: any) {
            setError(err instanceof Error ? err.message : t.mealCategoryForm.errorOccurred);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? t.mealCategoryForm.editTitle : t.mealCategoryForm.newTitle}>
            <form onSubmit={handleSubmit} className={styles.mealCategoryForm}>
                <Input
                    label={t.mealCategoryForm.categoryName}
                    placeholder={t.mealCategoryForm.categoryNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                    required
                />

                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                        {t.mealCategoryForm.mealType}
                    </label>
                    <div className={styles.mealTypeRow}>
                        {MEAL_TYPES.map((mt) => (
                            <button
                                key={mt}
                                type="button"
                                onClick={() => setMealType(mt)}
                                className={`${styles.mealTypeBtn} ${mealType === mt ? styles.mealTypeBtnActive : ''}`}
                            >
                                {getMealTypeLabel(mt)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                        {t.mealCategoryForm.color}
                    </label>
                    <div className={styles.colorRow}>
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`${styles.colorBtn} ${color === c ? styles.colorBtnActive : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.formActions}>
                    <Button type="button" variant="ghost" fullWidth onClick={onClose}>
                        {t.mealCategoryForm.cancel}
                    </Button>
                    <Button type="submit" variant="primary" fullWidth>
                        {initialData ? t.mealCategoryForm.saveChanges : t.mealCategoryForm.createCategory}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

