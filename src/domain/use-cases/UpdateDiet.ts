import { Diet, UpdateDietDTO } from '../entities/Diet';

export const updateDiet = (diet: Diet, updates: UpdateDietDTO): Diet => {
    return {
        ...diet,
        ...updates,
        name: updates.name?.trim() || diet.name,
        description: updates.description?.trim() || diet.description,
        notes: updates.notes?.trim() || diet.notes,
    };
};

