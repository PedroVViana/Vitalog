import { MealCategory, CreateMealCategoryDTO } from '../entities/MealCategory';

export const createMealCategory = (dto: CreateMealCategoryDTO): MealCategory => {
    if (!dto.name.trim()) {
        throw new Error('Meal category name is required');
    }
    if (!dto.mealType) {
        throw new Error('Meal type is required');
    }

    return {
        id: crypto.randomUUID(),
        ...dto,
        isArchived: false,
        createdAt: new Date().toISOString(),
    };
};

