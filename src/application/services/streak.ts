import { Entry } from '../../domain/entities/Entry';
import { isSameDay, subDays, startOfDay } from 'date-fns';

export const calculateStreak = (entries: Entry[], habitId: string): number => {
    const habitEntries = entries
        .filter(e => e.habitId === habitId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    if (habitEntries.length === 0) return 0;

    let streak = 0;
    let currentDate = startOfDay(new Date());

    // Check if today has entry
    const hasEntryToday = habitEntries.some(e => isSameDay(new Date(e.createdAt), currentDate));

    if (!hasEntryToday) {
        // Check if yesterday had entry (streak might still be alive)
        currentDate = subDays(currentDate, 1);
        const hasEntryYesterday = habitEntries.some(e => isSameDay(new Date(e.createdAt), currentDate));
        if (!hasEntryYesterday) return 0;
    }

    // Count backwards
    let checkDate = hasEntryToday ? startOfDay(new Date()) : subDays(startOfDay(new Date()), 1);

    while (true) {
        const hasEntry = habitEntries.some(e => isSameDay(new Date(e.createdAt), checkDate));
        if (hasEntry) {
            streak++;
            checkDate = subDays(checkDate, 1);
        } else {
            break;
        }
    }

    return streak;
};
