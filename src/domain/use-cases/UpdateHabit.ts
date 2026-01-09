import { Habit, UpdateHabitDTO } from '../entities/Habit';

export const updateHabit = (habit: Habit, dto: UpdateHabitDTO): Habit => {
    if (dto.name !== undefined && !dto.name.trim()) {
        throw new Error('Habit name cannot be empty');
    }
    if (dto.frequencyPerWeek !== undefined && (dto.frequencyPerWeek < 1 || dto.frequencyPerWeek > 7)) {
        throw new Error('Frequency must be between 1 and 7');
    }

    return {
        ...habit,
        ...dto,
    };
};
