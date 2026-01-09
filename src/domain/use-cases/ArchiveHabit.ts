import { Habit } from '../entities/Habit';

export const archiveHabit = (habit: Habit): Habit => {
    return {
        ...habit,
        isArchived: true,
    };
};

export const unarchiveHabit = (habit: Habit): Habit => {
    return {
        ...habit,
        isArchived: false,
    };
};
