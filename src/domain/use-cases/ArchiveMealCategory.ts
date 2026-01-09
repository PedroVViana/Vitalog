import { MealCategory } from '../entities/MealCategory';

export const archiveMealCategory = (category: MealCategory): MealCategory => {
    return {
        ...category,
        isArchived: true,
    };
};

