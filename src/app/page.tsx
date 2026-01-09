'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { calculateFoodLoggingStreak } from '@/application/services/foodLoggingStreak';
import { Flame, CheckCircle2, Plus, Coffee, UtensilsCrossed, Moon, Cookie } from 'lucide-react';
import { QuickLogModal } from '@/presentation/features/quick-log/QuickLogModal';
import { addFoodEntry } from '@/presentation/store/slices/foodEntriesSlice';
import { MealType, MEAL_TYPES } from '@/domain/value-objects/MealType';
import { format } from 'date-fns';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { getMealTypeLabel } from '@/domain/value-objects/MealType';
import styles from './page.module.css';

export default function Dashboard() {
    const { t } = useTranslation();
    const foodEntries = useSelector((state: RootState) => state.foodEntries.items);
    const diets = useSelector((state: RootState) => state.diets.items);
    const dispatch = useDispatch();
    const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
    const [preselectedMealType, setPreselectedMealType] = useState<MealType | null>(null);
    
    const activeDiet = diets.find(d => d.isActive);

    // Stats
    const todayEntries = foodEntries.filter(e =>
        new Date(e.createdAt).toDateString() === new Date().toDateString()
    );
    const streak = calculateFoodLoggingStreak(foodEntries);
    const mealsLoggedToday = todayEntries.length;

    // Meal shortcuts - check which meals have been logged today
    const mealTypesLogged = new Set(todayEntries.map(e => e.mealType));
    const mealShortcuts = [
        { type: 'breakfast' as MealType, icon: Coffee, label: t.mealCategories.breakfast },
        { type: 'lunch' as MealType, icon: UtensilsCrossed, label: t.mealCategories.lunch },
        { type: 'dinner' as MealType, icon: Moon, label: t.mealCategories.dinner },
        { type: 'snack' as MealType, icon: Cookie, label: t.mealCategories.snack },
    ];

    // Recent entries (last 5)
    const recentEntries = [...foodEntries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const handleMealShortcut = (mealType: MealType) => {
        setPreselectedMealType(mealType);
        setIsQuickLogOpen(true);
    };

    const handleQuickLogClose = () => {
        setIsQuickLogOpen(false);
        setPreselectedMealType(null);
    };

    return (
        <div className={`${styles.container} max-w-3xl animate-slide-up`}>
            {/* 1. Hero Section: Today Focus */}
            <section className={styles.heroSection}>
                <header className={styles.heroHeader}>
                    <h1 className={`text-4xl font-black tracking-tight ${styles.heroTitle}`}>
                        {t.dashboard.title}
                    </h1>
                    <div className={styles.heroStats}>
                        <span className={styles.heroStatItem}>
                            <CheckCircle2 size={14} color="var(--primary)" />
                            {mealsLoggedToday} {t.dashboard.mealsLogged}
                        </span>
                        <span className={styles.heroStatItem}>
                            <Flame size={14} color="var(--accent)" />
                            {streak} {t.dashboard.dayStreak}
                        </span>
                    </div>
                </header>

                <div
                    onClick={() => setIsQuickLogOpen(true)}
                    className={`${styles.heroCta} card`}
                >
                    <div className={styles.heroIcon}>
                        <Plus size={120} />
                    </div>
                    <div className={styles.heroCtaContent}>
                        <h2 className="text-2xl font-bold">{t.dashboard.logMeal}</h2>
                        <p className={styles.heroSubtext}>
                            {t.dashboard.subtitle}
                        </p>
                    </div>
                </div>

                {mealsLoggedToday === 0 && (
                    <p className={`text-muted text-sm ${styles.noMealsText}`}>
                        {t.dashboard.noMealsToday}
                    </p>
                )}
            </section>

            {/* Current Diet Section */}
            {activeDiet ? (
                <section className={styles.section}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted">
                        {t.dashboard.currentDiet}
                    </h3>
                    <Card className={styles.dietCard}>
                        <div>
                            <p className="font-bold text-sm">{activeDiet.name}</p>
                            {activeDiet.description && (
                                <p className="text-xs text-muted">{activeDiet.description}</p>
                            )}
                        </div>
                    </Card>
                </section>
            ) : (
                <section className={styles.section}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted">
                        {t.dashboard.currentDiet}
                    </h3>
                    <Card className={styles.dietCard}>
                        <p className="text-sm text-muted italic">{t.dashboard.addDietReference}</p>
                    </Card>
                </section>
            )}

            {/* 2. Meal Shortcuts */}
            <section className={styles.section}>
                <h3 className="text-xs font-black uppercase tracking-widest text-muted">
                    {t.dashboard.quickLog}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {mealShortcuts.map(({ type, icon: Icon, label }) => {
                        const isLogged = mealTypesLogged.has(type);
                        return (
                            <Card
                                key={type}
                                onClick={() => handleMealShortcut(type)}
                                className={`${styles.mealShortcutCard} ${isLogged ? styles.mealShortcutCardLogged : styles.mealShortcutCardNotLogged}`}
                            >
                                <div className={styles.mealShortcutIconWrapper}>
                                    <Icon size={32} color={isLogged ? 'var(--text-muted)' : 'var(--primary)'} />
                                    {isLogged && (
                                        <CheckCircle2
                                            size={20}
                                            color="var(--primary)"
                                            className={styles.mealShortcutCheck}
                                        />
                                    )}
                                </div>
                                <div className={styles.mealShortcutLabel}>
                                    <p className="font-bold text-sm">{label}</p>
                                    <p className="text-xs text-muted" style={{ fontSize: '10px' }}>
                                        {isLogged ? t.dashboard.logged : t.dashboard.tapToLog}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* 3. Today's Summary */}
            <section className={styles.section}>
                <h3 className="text-xs font-black uppercase tracking-widest text-muted">
                    {t.dashboard.mealsLoggedToday}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <Card className={styles.summaryCard}>
                        <p className={`text-xs font-black uppercase tracking-widest text-muted ${styles.summaryLabel}`}>
                            {t.dashboard.mealsLoggedToday}
                        </p>
                        <div className={styles.summaryValue}>
                            <span className="text-3xl font-black text-primary">{mealsLoggedToday}</span>
                        </div>
                        <p className={`text-xs text-muted ${styles.summaryDescription}`}>
                            {t.dashboard.foodEntriesToday}
                        </p>
                    </Card>

                    <Card className={styles.summaryCard}>
                        <p className={`text-xs font-black uppercase tracking-widest text-muted ${styles.summaryLabel}`}>
                            {t.dashboard.currentStreak}
                        </p>
                        <div className={styles.summaryValue}>
                            <span className="text-3xl font-black text-secondary">{streak}</span>
                        </div>
                        <p className={`text-xs text-muted ${styles.summaryDescription}`}>
                            {t.dashboard.consecutiveDays}
                        </p>
                    </Card>
                </div>
            </section>

            {/* 4. Recent Entries */}
            {recentEntries.length > 0 && (
                <section className={styles.section}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted">
                        Recent Entries
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {recentEntries.map((entry) => (
                            <Card key={entry.id} className={styles.recentEntryCard}>
                                <div className={styles.recentEntryHeader}>
                                    <div>
                                        <p className="font-bold text-sm">{getMealTypeLabel(entry.mealType)}</p>
                                        <p className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>
                                            {format(new Date(entry.createdAt), 'HH:mm')}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold uppercase text-muted ${styles.recentEntryType}`}>
                                        {entry.type}
                                    </span>
                                </div>
                                {entry.text && (
                                    <p className={`text-sm text-muted ${styles.recentEntryText}`}>
                                        {entry.text}
                                    </p>
                                )}
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            <QuickLogModal
                isOpen={isQuickLogOpen}
                onClose={handleQuickLogClose}
                onSubmit={(entry) => dispatch(addFoodEntry(entry))}
                preselectedMealType={preselectedMealType || undefined}
            />
        </div>
    );
}
