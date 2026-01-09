import { FoodEntry, CreateFoodEntryDTO } from '../entities/FoodEntry';

export const createFoodEntry = (dto: CreateFoodEntryDTO): FoodEntry => {
    if (!dto.mealType) {
        throw new Error('Meal type is required');
    }
    if (!dto.type) {
        throw new Error('Entry type is required');
    }

    return {
        id: crypto.randomUUID(),
        ...dto,
        tags: dto.tags || [],
        dietId: dto.dietId || undefined,
        createdAt: new Date().toISOString(),
    };
};

