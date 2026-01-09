import { Diet } from '../entities/Diet';

/**
 * Sets a diet as active and deactivates all other diets.
 * Only one diet can be active at a time.
 */
export const setActiveDiet = (diets: Diet[], dietId: string): Diet[] => {
    return diets.map(diet => ({
        ...diet,
        isActive: diet.id === dietId,
    }));
};

/**
 * Deactivates all diets.
 */
export const deactivateAllDiets = (diets: Diet[]): Diet[] => {
    return diets.map(diet => ({
        ...diet,
        isActive: false,
    }));
};

