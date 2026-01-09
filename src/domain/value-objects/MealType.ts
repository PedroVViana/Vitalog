export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'custom';

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack', 'custom'];

// This function is deprecated - use useTranslation hook instead
export const getMealTypeLabel = (type: MealType): string => {
    const labels: Record<MealType, string> = {
        breakfast: 'Breakfast',
        lunch: 'Lunch',
        dinner: 'Dinner',
        snack: 'Snack',
        custom: 'Custom',
    };
    return labels[type];
};

