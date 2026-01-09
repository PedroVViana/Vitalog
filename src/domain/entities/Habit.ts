export interface Habit {
    id: string;
    name: string;
    frequencyPerWeek: number;
    isArchived: boolean;
    createdAt: string; // ISO String
    colorHex?: string;
}

export type CreateHabitDTO = Omit<Habit, 'id' | 'isArchived' | 'createdAt'>;
export type UpdateHabitDTO = Partial<CreateHabitDTO>;
