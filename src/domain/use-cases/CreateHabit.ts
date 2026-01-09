import { Habit, CreateHabitDTO } from '../entities/Habit';

export const createHabit = (dto: CreateHabitDTO): Habit => {
    if (!dto.name.trim()) {
        throw new Error('Habit name is required');
    }
    if (dto.frequencyPerWeek < 1 || dto.frequencyPerWeek > 7) {
        throw new Error('Frequency must be between 1 and 7');
    }

    return {
        id: crypto.randomUUID(),
        ...dto,
        isArchived: false,
        createdAt: new Date().toISOString(),
    };
};
