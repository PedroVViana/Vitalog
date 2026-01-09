'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { calculateFoodLoggingStreak } from '@/application/services/foodLoggingStreak';
import { calculateWeeklyFoodLogging } from '@/application/services/weeklyFoodLogging';
import { BarChart2, Calendar } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import styles from './page.module.css';

export default function InsightsPage() {
    const { t } = useTranslation();
    const foodEntries = useSelector((state: RootState) => state.foodEntries.items);

    const streak = calculateFoodLoggingStreak(foodEntries);
    const weeklyStats = calculateWeeklyFoodLogging(foodEntries);

    // Calculate meal coverage (how many different meal types logged per day on average)
    const last7DaysEntries = foodEntries.filter(e => {
        const entryDate = new Date(e.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return entryDate >= sevenDaysAgo;
    });

    const mealCoverageByDay: Record<string, Set<string>> = {};
    last7DaysEntries.forEach(entry => {
        const dateStr = new Date(entry.createdAt).toDateString();
        if (!mealCoverageByDay[dateStr]) {
            mealCoverageByDay[dateStr] = new Set();
        }
        mealCoverageByDay[dateStr].add(entry.mealType);
    });

    const avgMealTypesPerDay = Object.keys(mealCoverageByDay).length > 0
        ? Math.round((Object.values(mealCoverageByDay).reduce((sum, set) => sum + set.size, 0) / Object.keys(mealCoverageByDay).length) * 10) / 10
        : 0;

    return (
        <div className={styles.pageContainer}>
            <header>
                <h1 className="text-3xl font-black">{t.insights.title}</h1>
                <p className="text-muted">{t.insights.subtitle}</p>
            </header>

            {/* Overall Stats */}
            <div className={styles.insightsGrid}>
                <Card className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <div>
                            <p className={styles.detailLabel}>{t.insights.currentStreak}</p>
                            <p className={styles.streakValue}>{streak}d</p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.statIconAccent}`}>
                            <Calendar size={24} color="var(--accent)" />
                        </div>
                    </div>
                    <p className={`text-xs text-muted ${styles.statDescription}`}>
                        {t.insights.consecutiveDaysWithLog}
                    </p>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <div>
                            <p className={styles.detailLabel}>{t.insights.daysLogged}</p>
                            <p className={styles.statValue}>{weeklyStats.daysLogged}/7</p>
                        </div>
                        <div className={`${styles.statIcon} ${styles.statIconPrimary}`}>
                            <BarChart2 size={24} color="var(--primary)" />
                        </div>
                    </div>
                    <div className={styles.progressBarBg}>
                        <div
                            className={styles.progressBarFill}
                            style={{ width: `${Math.round((weeklyStats.daysLogged / 7) * 100)}%` }}
                        />
                    </div>
                    <p className={`text-xs text-muted ${styles.statDescription}`}>
                        {weeklyStats.totalEntries} {t.insights.totalEntries}
                    </p>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <div>
                            <p className={styles.detailLabel}>{t.insights.avgMealsPerDay}</p>
                            <p className={styles.statValue}>{weeklyStats.averageEntriesPerDay}</p>
                        </div>
                    </div>
                    <p className={`text-xs text-muted ${styles.statDescription}`}>
                        {t.insights.avgEntriesPerLoggedDay}
                    </p>
                </Card>

                <Card className={styles.statCard}>
                    <div className={styles.statCardHeader}>
                        <div>
                            <p className={styles.detailLabel}>{t.insights.mealCoverage}</p>
                            <p className={styles.statValue}>{avgMealTypesPerDay}</p>
                        </div>
                    </div>
                    <p className={`text-xs text-muted ${styles.statDescription}`}>
                        {t.insights.avgDifferentMealTypes}
                    </p>
                </Card>
            </div>

            {foodEntries.length === 0 && (
                <Card className={styles.emptyStateCard}>
                    {t.insights.noLogsYet}
                </Card>
            )}

            <Card className={styles.proRevealCard}>
                <div className={styles.proIconWrap}>
                    <BarChart2 size={32} />
                </div>
                <h2 className="text-xl font-black">{t.insights.smartRecognition}</h2>
                <p className="text-sm text-muted" style={{ maxWidth: '400px' }}>
                    {t.insights.smartRecognitionDesc}
                </p>
                <Button variant="ghost" disabled>{t.insights.comingSoon}</Button>
            </Card>
        </div>
    );
}
