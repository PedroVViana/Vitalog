import { Diet, CreateDietDTO } from '../entities/Diet';

export const createDiet = (dto: CreateDietDTO): Diet => {
    if (!dto.name || dto.name.trim().length === 0) {
        throw new Error('Diet name is required');
    }

    return {
        id: crypto.randomUUID(),
        name: dto.name.trim(),
        description: dto.description?.trim() || undefined,
        startDate: dto.startDate || undefined,
        endDate: dto.endDate || undefined,
        notes: dto.notes?.trim() || undefined,
        isActive: false, // New diets are inactive by default
    };
};

