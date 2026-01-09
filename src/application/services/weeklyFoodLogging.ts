import { FoodEntry } from '../../domain/entities/FoodEntry';
import { isAfter, subDays } from 'date-fns';

export interface WeeklyFoodLoggingStats {
    daysLogged: number;
    totalEntries: number;
    averageEntriesPerDay: number;
}

/**
 * Calculates weekly food logging statistics.
 * Returns the number of days with at least one food log in the last 7 days.
 */
export const calculateWeeklyFoodLogging = (
    entries: FoodEntry[]
): WeeklyFoodLoggingStats => {
    const last7Days = subDays(new Date(), 7);
    const recentEntries = entries.filter(e =>
        isAfter(new Date(e.createdAt), last7Days)
    );

    // Get unique dates
    const datesWithEntries = new Set(
        recentEntries.map(e => new Date(e.createdAt).toDateString())
    );

    return {
        daysLogged: datesWithEntries.size,
        totalEntries: recentEntries.length,
        averageEntriesPerDay: datesWithEntries.size > 0
            ? Math.round((recentEntries.length / datesWithEntries.size) * 10) / 10
            : 0,
    };
};

