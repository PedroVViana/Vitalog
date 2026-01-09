import { FoodEntry } from '../../domain/entities/FoodEntry';
import { isSameDay, subDays, startOfDay } from 'date-fns';

/**
 * Calculates the current streak of consecutive days with at least one food log.
 * A day counts if it has at least one food entry.
 */
export const calculateFoodLoggingStreak = (entries: FoodEntry[]): number => {
    if (entries.length === 0) return 0;

    // Get unique dates that have entries
    const datesWithEntries = new Set(
        entries.map(e => startOfDay(new Date(e.createdAt)).toISOString())
    );

    let streak = 0;
    let currentDate = startOfDay(new Date());

    // Check if today has any entry
    const todayStr = currentDate.toISOString();
    const hasEntryToday = datesWithEntries.has(todayStr);

    if (!hasEntryToday) {
        // Check if yesterday had entry (streak might still be alive)
        currentDate = subDays(currentDate, 1);
        const yesterdayStr = currentDate.toISOString();
        if (!datesWithEntries.has(yesterdayStr)) return 0;
    }

    // Count backwards from today (or yesterday if today has no entry)
    let checkDate = hasEntryToday ? startOfDay(new Date()) : subDays(startOfDay(new Date()), 1);

    while (true) {
        const dateStr = checkDate.toISOString();
        if (datesWithEntries.has(dateStr)) {
            streak++;
            checkDate = subDays(checkDate, 1);
        } else {
            break;
        }
    }

    return streak;
};

