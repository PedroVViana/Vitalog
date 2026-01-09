import { Entry } from '../../domain/entities/Entry';
import { Habit } from '../../domain/entities/Habit';
import { isAfter, subDays } from 'date-fns';

export interface WeeklyConsistency {
    count: number;
    percentage: number;
}

export const calculateWeeklyConsistency = (
    entries: Entry[],
    habitId: string,
    frequencyPerWeek: number
): WeeklyConsistency => {
    const last7Days = subDays(new Date(), 7);
    const habitEntries = entries.filter(e =>
        e.habitId === habitId && isAfter(new Date(e.createdAt), last7Days)
    );

    // Note: frequencyPerWeek is what the user aims for. 
    // Percentage is relative to the frequency goal.
    const count = habitEntries.length;
    const percentage = Math.min(Math.round((count / frequencyPerWeek) * 100), 100);

    return { count, percentage };
};
