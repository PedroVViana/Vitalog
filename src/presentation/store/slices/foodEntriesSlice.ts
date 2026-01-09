import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodEntry } from '../../../domain/entities/FoodEntry';

interface FoodEntriesState {
    items: FoodEntry[];
    loading: boolean;
    error: string | null;
}

const initialState: FoodEntriesState = {
    items: [],
    loading: false,
    error: null,
};

const foodEntriesSlice = createSlice({
    name: 'foodEntries',
    initialState,
    reducers: {
        setFoodEntries: (state, action: PayloadAction<FoodEntry[]>) => {
            state.items = action.payload;
        },
        addFoodEntry: (state, action: PayloadAction<FoodEntry>) => {
            state.items.push(action.payload);
        },
        deleteFoodEntry: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(e => e.id !== action.payload);
        },
    },
});

export const { setFoodEntries, addFoodEntry, deleteFoodEntry } = foodEntriesSlice.actions;
export default foodEntriesSlice.reducer;

