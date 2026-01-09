'use client';

import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { EntryType } from '../../../domain/value-objects/EntryType';
import { MealType, getMealTypeLabel, MEAL_TYPES } from '../../../domain/value-objects/MealType';
import { FoodEntry } from '../../../domain/entities/FoodEntry';
import { createFoodEntry } from '../../../domain/use-cases/CreateFoodEntry';
import { Image as ImageIcon, Mic, Tag } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import styles from './QuickLogModal.module.css';

interface QuickLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (entry: FoodEntry) => void;
    preselectedMealType?: MealType | null;
}

export const QuickLogModal = ({ isOpen, onClose, onSubmit, preselectedMealType }: QuickLogModalProps) => {
    const { t } = useTranslation();
    const diets = useSelector((state: RootState) => state.diets.items);
    const activeDiet = diets.find(d => d.isActive);
    
    const [selectedMealType, setSelectedMealType] = useState<MealType>(preselectedMealType || 'breakfast');
    
    React.useEffect(() => {
        if (preselectedMealType) {
            setSelectedMealType(preselectedMealType);
        } else {
            setSelectedMealType('breakfast');
        }
    }, [preselectedMealType, isOpen]);
    
    const [type, setType] = useState<EntryType>('text');
    const [text, setText] = useState('');
    const [tags, setTags] = useState('');
    const [observation, setObservation] = useState('');
    const [selectedDietId, setSelectedDietId] = useState<string | undefined>(activeDiet?.id);
    
    React.useEffect(() => {
        setSelectedDietId(activeDiet?.id);
    }, [activeDiet, isOpen]);

    const typeOptions = [
        { label: t.quickLog.note, value: 'text' },
        { label: t.quickLog.image, value: 'image' },
        { label: t.quickLog.voice, value: 'audio' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const entry = createFoodEntry({
            mealType: selectedMealType,
            type,
            text: type === 'text' ? text : undefined,
            tags: tags.split(',').map(t => t.trim()).filter(t => !!t),
            observation: observation.trim() || undefined,
            dietId: selectedDietId || undefined,
        });

        onSubmit(entry);
        reset();
        onClose();
    };

    const reset = () => {
        setSelectedMealType('breakfast');
        setType('text');
        setText('');
        setTags('');
        setObservation('');
        setSelectedDietId(activeDiet?.id);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.quickLog.title}>
            <form onSubmit={handleSubmit} className={styles.quickLogForm}>
                <div className={styles.formSection}>
                    <label className={styles.sectionLabel}>{t.quickLog.mealType}</label>
                    <div className={styles.mealTypeGrid}>
                        {MEAL_TYPES.filter(mt => mt !== 'custom').map((mealType) => (
                            <button
                                key={mealType}
                                type="button"
                                onClick={() => setSelectedMealType(mealType)}
                                className={`${styles.mealTypeBtn} ${selectedMealType === mealType ? styles.mealTypeBtnActive : ''}`}
                            >
                                {t.mealCategories[mealType]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.formSection}>
                    <label className={styles.sectionLabel}>{t.quickLog.chooseFormat}</label>
                    <SegmentedControl
                        options={typeOptions}
                        value={type}
                        onChange={(val) => setType(val as EntryType)}
                    />
                </div>

                <div className={styles.formatContent}>
                    {type === 'text' && (
                        <Textarea
                            placeholder={t.quickLog.textPlaceholder}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    )}

                    {type === 'image' && (
                        <div className={styles.imageUploadArea}>
                            <ImageIcon size={32} className={styles.uploadIcon} />
                            <p className={styles.uploadText}>{t.quickLog.imagePlaceholder}</p>
                            <p className={styles.subText}>{t.quickLog.cameraComingSoon}</p>
                        </div>
                    )}

                    {type === 'audio' && (
                        <div className={styles.audioArea}>
                            <div className={styles.audioIconWrap}>
                                <Mic size={24} />
                            </div>
                            <div className={styles.audioText}>
                                <p className="font-bold">{t.quickLog.voiceCapture}</p>
                                <p className="text-sm text-muted">
                                    {t.quickLog.voiceDesc}
                                </p>
                            </div>
                            <span className={styles.proBadge}>{t.quickLog.proFeature}</span>
                        </div>
                    )}
                </div>

                <div className={styles.formSection}>
                    <div className={styles.labelWithIcon}>
                        <Tag size={12} />
                        <label className={styles.sectionLabel}>{t.quickLog.tags}</label>
                    </div>
                    <Input
                        placeholder={t.quickLog.tagsPlaceholder}
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div className={`${styles.formSection} ${styles.observationSection}`}>
                    <label className={styles.sectionLabel}>{t.quickLog.observation}</label>
                    <p className={styles.observationHelper}>{t.quickLog.observationHelper}</p>
                    <Textarea
                        placeholder={t.quickLog.observationPlaceholder}
                        value={observation}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 280) {
                                setObservation(value);
                            }
                        }}
                        maxLength={280}
                        rows={3}
                    />
                    <p className={styles.charCount}>{observation.length}/280</p>
                </div>

                {diets.length > 0 && (
                    <div className={styles.formSection}>
                        <label className={styles.sectionLabel}>{t.quickLog.diet}</label>
                        <p className={styles.observationHelper}>{t.quickLog.dietHelper}</p>
                        <select
                            className={styles.dietSelect}
                            value={selectedDietId || ''}
                            onChange={(e) => setSelectedDietId(e.target.value || undefined)}
                        >
                            <option value="">{t.quickLog.noDiet}</option>
                            {diets.map((diet) => (
                                <option key={diet.id} value={diet.id}>
                                    {diet.name} {diet.isActive ? `(${t.diet.active})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={styles.formActions}>
                    <Button type="button" variant="ghost" fullWidth onClick={onClose} style={{ color: '#ef4444', textDecoration: 'underline' }}>
                        {t.quickLog.cancel}
                    </Button>
                    <Button type="submit" variant="primary" fullWidth style={{ height: '3.5rem' }}>
                        {t.quickLog.logMeal}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
