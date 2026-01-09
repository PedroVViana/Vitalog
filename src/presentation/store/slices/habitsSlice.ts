import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit } from '../../../domain/entities/Habit';

interface HabitsState {
    items: Habit[];
    loading: boolean;
    error: string | null;
}

const initialState: HabitsState = {
    items: [],
    loading: false,
    error: null,
};

const habitsSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        setHabits: (state, action: PayloadAction<Habit[]>) => {
            state.items = action.payload;
        },
        addHabit: (state, action: PayloadAction<Habit>) => {
            state.items.push(action.payload);
        },
        updateHabit: (state, action: PayloadAction<Habit>) => {
            const index = state.items.findIndex(h => h.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteHabit: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(h => h.id !== action.payload);
        },
    },
});

export const { setHabits, addHabit, updateHabit, deleteHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
