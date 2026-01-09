'use client';

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import { deleteFoodEntry } from '@/presentation/store/slices/foodEntriesSlice';
import { Card } from '@/presentation/components/ui/Card';
import { Drawer } from '@/presentation/components/ui/Drawer';
import { Button } from '@/presentation/components/ui/Button';
import { Chip } from '@/presentation/components/ui/Chip';
import { FoodEntry } from '@/domain/entities/FoodEntry';
import { MealType, getMealTypeLabel, MEAL_TYPES } from '@/domain/value-objects/MealType';
import { format } from 'date-fns';
import { Search, Tag, Trash2, Calendar, FileText, ImageIcon, Mic } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import styles from './page.module.css';

export default function TimelinePage() {
    const { t } = useTranslation();
    const foodEntries = useSelector((state: RootState) => state.foodEntries.items);
    const diets = useSelector((state: RootState) => state.diets.items);
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<FoodEntry | null>(null);

    // Filter logic
    const filteredEntries = useMemo(() => {
        return [...foodEntries]
            .filter(e => {
                const matchesSearch = e.text?.toLowerCase().includes(search.toLowerCase()) ||
                    e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
                const matchesType = !selectedType || e.type === selectedType;
                const matchesMealType = !selectedMealType || e.mealType === selectedMealType;
                return matchesSearch && matchesType && matchesMealType;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [foodEntries, search, selectedType, selectedMealType]);

    // Group by day
    const groupedEntries = useMemo(() => {
        const groups: { date: string; entries: FoodEntry[] }[] = [];
        filteredEntries.forEach(entry => {
            const dateStr = new Date(entry.createdAt).toDateString();
            const existingGroup = groups.find(g => g.date === dateStr);
            if (existingGroup) {
                existingGroup.entries.push(entry);
            } else {
                groups.push({ date: dateStr, entries: [entry] });
            }
        });
        return groups;
    }, [filteredEntries]);

    return (
        <div className={styles.pageContainer}>
            <header>
                <h1 className="text-3xl font-black">{t.timeline.title}</h1>
                <p className="text-muted">{t.timeline.subtitle}</p>
            </header>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrap}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder={t.timeline.searchPlaceholder}
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.chipsWrap}>
                    <Chip
                        label={t.timeline.all}
                        active={!selectedType}
                        onClick={() => setSelectedType(null)}
                    />
                    {['text', 'image', 'audio'].map(type => (
                        <Chip
                            key={type}
                            label={t.entryTypes[type as keyof typeof t.entryTypes]}
                            active={selectedType === type}
                            onClick={() => setSelectedType(type)}
                        />
                    ))}
                </div>

                <div className={styles.divider} />

                <select
                    className={styles.mealTypeSelect}
                    onChange={(e) => setSelectedMealType(e.target.value as MealType || null)}
                    value={selectedMealType || ''}
                >
                    <option value="">{t.timeline.allMeals}</option>
                    {MEAL_TYPES.map((mt) => (
                        <option key={mt} value={mt}>{t.mealCategories[mt]}</option>
                    ))}
                </select>
            </div>

            {/* Timeline List */}
            <div className={styles.timelineContainer}>
                {groupedEntries.length === 0 ? (
                    <div className={styles.emptyState}>{t.timeline.noLogsFound}</div>
                ) : (
                    groupedEntries.map((group) => (
                        <div key={group.date}>
                            <h3 className={styles.groupHeader}>
                                {format(new Date(group.date), 'EEEE, MMM do')}
                            </h3>

                            <div className={styles.groupContent}>
                                {group.entries.map((entry) => (
                                    <Card
                                        key={entry.id}
                                        className={styles.entryCard}
                                        onClick={() => setSelectedEntry(entry)}
                                    >
                                        {/* Timeline Dot */}
                                        <div
                                            className={styles.timelineDot}
                                            style={{ backgroundColor: 'var(--primary)' }}
                                        />

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                                {entry.type === 'text' && <FileText size={16} color="#3b82f6" />}
                                                {entry.type === 'image' && <ImageIcon size={16} color="#10b981" />}
                                                {entry.type === 'audio' && <Mic size={16} color="#ef4444" />}
                                                <span className={styles.entryMeta}>
                                                    {format(new Date(entry.createdAt), 'HH:mm')} • {t.mealCategories[entry.mealType]}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                {entry.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className={styles.tagBadge}>#{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {entry.text && (
                                            <p className={styles.entryText}>
                                                {entry.text}
                                            </p>
                                        )}
                                        {entry.dietId && (() => {
                                            const diet = diets.find(d => d.id === entry.dietId);
                                            return diet ? (
                                                <p className={styles.dietReference}>
                                                    {t.timeline.dietReference}: {diet.name}
                                                </p>
                                            ) : null;
                                        })()}
                                        {entry.observation && (
                                            <div className={styles.entryObservation}>
                                                <p className={styles.observationLabel}>{t.timeline.observation}</p>
                                                <p className={styles.observationText}>{entry.observation}</p>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Entry Detail Drawer */}
            <Drawer
                isOpen={!!selectedEntry}
                onClose={() => setSelectedEntry(null)}
                title={t.timeline.entryDetails}
            >
                {selectedEntry && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                        <div className={styles.detailHeaderCard}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <div
                                    className={styles.mealIconWrap}
                                    style={{ color: 'var(--primary)' }}
                                >
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">{t.mealCategories[selectedEntry.mealType]}</p>
                                    <p className="text-xs text-muted">{format(new Date(selectedEntry.createdAt), 'PPP p')}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.detailSection}>
                            <label className={styles.detailLabel}>{t.timeline.note}</label>
                            <div className={styles.detailContentBox}>
                                {selectedEntry.text || t.timeline.noNote}
                            </div>
                        </div>

                        {selectedEntry.observation && (
                            <div className={styles.detailSection}>
                                <label className={styles.detailLabel}>{t.timeline.observation}</label>
                                <div className={`${styles.detailContentBox} ${styles.observationBox}`}>
                                    {selectedEntry.observation}
                                </div>
                            </div>
                        )}

                        {selectedEntry.dietId && (() => {
                            const diet = diets.find(d => d.id === selectedEntry.dietId);
                            return diet ? (
                                <div className={styles.detailSection}>
                                    <label className={styles.detailLabel}>{t.timeline.dietReference}</label>
                                    <div className={styles.detailContentBox}>
                                        {diet.name}
                                        {diet.description && (
                                            <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
                                                {diet.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : null;
                        })()}

                        <div className={styles.detailSection}>
                            <label className={styles.detailLabel}>{t.timeline.entryType}</label>
                            <div className={styles.statBox} style={{ color: 'var(--primary)' }}>
                                {t.entryTypes[selectedEntry.type as keyof typeof t.entryTypes]}
                            </div>
                        </div>

                        <div className={styles.detailSection}>
                            <label className={styles.detailLabel}>{t.timeline.tags}</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', paddingTop: 'var(--space-1)' }}>
                                {selectedEntry.tags.length > 0 ? (
                                    selectedEntry.tags.map(tag => (
                                        <span key={tag} className={styles.detailTag}>#{tag}</span>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted italic">{t.timeline.noTags}</span>
                                )}
                            </div>
                        </div>

                        <div style={{ paddingTop: 'var(--space-8)', borderTop: '1px solid var(--border)' }}>
                            <Button
                                variant="ghost"
                                fullWidth
                                onClick={() => {
                                    dispatch(deleteFoodEntry(selectedEntry.id));
                                    setSelectedEntry(null);
                                }}
                                className={styles.deleteButton}
                            >
                                <Trash2 size={18} /> {t.timeline.deleteEntry}
                            </Button>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
