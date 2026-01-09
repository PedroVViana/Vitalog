import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MealCategory } from '../../../domain/entities/MealCategory';

interface MealsState {
    items: MealCategory[];
    loading: boolean;
    error: string | null;
}

const initialState: MealsState = {
    items: [],
    loading: false,
    error: null,
};

const mealsSlice = createSlice({
    name: 'meals',
    initialState,
    reducers: {
        setMeals: (state, action: PayloadAction<MealCategory[]>) => {
            state.items = action.payload;
        },
        addMeal: (state, action: PayloadAction<MealCategory>) => {
            state.items.push(action.payload);
        },
        updateMeal: (state, action: PayloadAction<MealCategory>) => {
            const index = state.items.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteMeal: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(m => m.id !== action.payload);
        },
    },
});

export const { setMeals, addMeal, updateMeal, deleteMeal } = mealsSlice.actions;
export default mealsSlice.reducer;

