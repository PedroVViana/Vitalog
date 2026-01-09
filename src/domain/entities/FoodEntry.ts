import { EntryType } from '../value-objects/EntryType';
import { MealType } from '../value-objects/MealType';

export interface FoodEntry {
    id: string;
    mealType: MealType;
    createdAt: string; // ISO String
    type: EntryType;
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    tags: string[];
    observation?: string; // Optional contextual note about the meal (max 280 chars)
    dietId?: string; // Optional reference to an active diet
}

export type CreateFoodEntryDTO = Omit<FoodEntry, 'id' | 'createdAt'>;

