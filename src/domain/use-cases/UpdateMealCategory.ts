import { MealCategory, UpdateMealCategoryDTO } from '../entities/MealCategory';

export const updateMealCategory = (
    existing: MealCategory,
    updates: UpdateMealCategoryDTO
): MealCategory => {
    return {
        ...existing,
        ...updates,
    };
};

