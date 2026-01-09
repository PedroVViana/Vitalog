'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import { addDiet, updateDiet, deleteDiet, setActiveDietAction } from '@/presentation/store/slices/dietsSlice';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { Plus, Edit2, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Diet } from '@/domain/entities/Diet';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { DietFormModal } from '@/presentation/features/diet/DietFormModal';
import { Modal } from '@/presentation/components/ui/Modal';
import styles from './page.module.css';

export default function DietPage() {
    const { t } = useTranslation();
    const diets = useSelector((state: RootState) => state.diets.items);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDiet, setEditingDiet] = useState<Diet | undefined>();
    const [dietToDelete, setDietToDelete] = useState<Diet | null>(null);

    const activeDiet = diets.find(d => d.isActive);

    const handleCreate = () => {
        setEditingDiet(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (diet: Diet) => {
        setEditingDiet(diet);
        setIsModalOpen(true);
    };

    const handleSubmit = (diet: Diet) => {
        if (editingDiet) {
            dispatch(updateDiet({ id: diet.id, updates: diet }));
        } else {
            dispatch(addDiet(diet));
        }
        setIsModalOpen(false);
    };

    const handleSetActive = (dietId: string) => {
        dispatch(setActiveDietAction(dietId));
    };

    const handleDeleteClick = (diet: Diet) => {
        setDietToDelete(diet);
    };

    const handleConfirmDelete = () => {
        if (dietToDelete) {
            dispatch(deleteDiet(dietToDelete.id));
            setDietToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDietToDelete(null);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className="text-3xl font-black">{t.diet.title}</h1>
                    <p className="text-muted">{t.diet.subtitle}</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus size={20} />
                    {t.diet.newDiet}
                </Button>
            </div>

            {/* Active Diet Card */}
            {activeDiet && (
                <Card className={styles.activeDietCard}>
                    <div className={styles.activeDietHeader}>
                        <div>
                            <div className={styles.activeBadge}>
                                <CheckCircle2 size={16} />
                                {t.diet.active}
                            </div>
                            <h3 className="font-bold text-lg">{activeDiet.name}</h3>
                            {activeDiet.description && (
                                <p className="text-sm text-muted">{activeDiet.description}</p>
                            )}
                        </div>
                        <div className={styles.activeDietActions}>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(activeDiet)}>
                                <Edit2 size={16} />
                            </Button>
                            <button
                                className={styles.btnTrash}
                                onClick={() => handleDeleteClick(activeDiet)}
                                title={t.diet.deleteDiet}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    {activeDiet.notes && (
                        <p className={styles.dietNotes}>{activeDiet.notes}</p>
                    )}
                </Card>
            )}

            {/* Diets List */}
            <div className={styles.dietsList}>
                {diets.length === 0 ? (
                    <Card className={styles.emptyStateCard}>
                        <p className={`text-xl font-bold text-muted ${styles.emptyStateTitle}`}>
                            {t.diet.noDiets}
                        </p>
                        <p className={`text-sm text-muted ${styles.emptyStateDesc}`}>
                            {t.diet.noDietsDesc}
                        </p>
                        <Button onClick={handleCreate} variant="primary">
                            {t.diet.createFirst}
                        </Button>
                    </Card>
                ) : (
                    diets
                        .filter(d => !d.isActive)
                        .map((diet) => (
                            <Card key={diet.id} className={styles.dietCard}>
                                <div className={styles.dietCardContent}>
                                    <div>
                                        <h3 className="font-bold text-lg">{diet.name}</h3>
                                        {diet.description && (
                                            <p className="text-sm text-muted">{diet.description}</p>
                                        )}
                                        {diet.startDate && (
                                            <p className="text-xs text-muted">
                                                {t.diet.period}: {new Date(diet.startDate).toLocaleDateString()}
                                                {diet.endDate && ` - ${new Date(diet.endDate).toLocaleDateString()}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.dietActions}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSetActive(diet.id)}
                                    >
                                        {t.diet.setActive}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(diet)}>
                                        <Edit2 size={16} />
                                    </Button>
                                    <button
                                        className={styles.btnTrash}
                                        onClick={() => handleDeleteClick(diet)}
                                        title={t.diet.deleteDiet}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </Card>
                        ))
                )}
            </div>

            <DietFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingDiet}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={dietToDelete !== null}
                onClose={handleCancelDelete}
                title={t.diet.confirmDelete}
            >
                <div className={styles.deleteModalContent}>
                    <div className={styles.deleteModalIcon}>
                        <AlertTriangle size={48} color="#ef4444" />
                    </div>
                    <p className={styles.deleteModalMessage}>
                        {t.diet.deleteConfirmMessage.replace('{name}', dietToDelete?.name || '')}
                    </p>
                    <p className={styles.deleteModalWarning}>
                        {t.diet.deleteWarning}
                    </p>
                    <div className={styles.deleteModalActions}>
                        <Button variant="ghost" onClick={handleCancelDelete}>
                            {t.common.cancel}
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            <Trash2 size={18} />
                            {t.common.delete}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

