export interface MealCategory {
    id: string;
    name: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'custom';
    isArchived: boolean;
    createdAt: string; // ISO String
    colorHex?: string;
}

export type CreateMealCategoryDTO = Omit<MealCategory, 'id' | 'isArchived' | 'createdAt'>;
export type UpdateMealCategoryDTO = Partial<CreateMealCategoryDTO>;

