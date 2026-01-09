import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Entry } from '../../../domain/entities/Entry';

interface EntriesState {
    items: Entry[];
    loading: boolean;
    error: string | null;
}

const initialState: EntriesState = {
    items: [],
    loading: false,
    error: null,
};

const entriesSlice = createSlice({
    name: 'entries',
    initialState,
    reducers: {
        setEntries: (state, action: PayloadAction<Entry[]>) => {
            state.items = action.payload;
        },
        addEntry: (state, action: PayloadAction<Entry>) => {
            state.items.push(action.payload);
        },
        deleteEntry: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(e => e.id !== action.payload);
        },
    },
});

export const { setEntries, addEntry, deleteEntry } = entriesSlice.actions;
export default entriesSlice.reducer;
