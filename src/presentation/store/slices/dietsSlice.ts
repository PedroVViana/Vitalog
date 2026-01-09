import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Diet } from '../../../domain/entities/Diet';
import { createDiet } from '../../../domain/use-cases/CreateDiet';
import { updateDiet as updateDietUseCase } from '../../../domain/use-cases/UpdateDiet';
import { setActiveDiet as setActiveDietUseCase, deactivateAllDiets as deactivateAllDietsUseCase } from '../../../domain/use-cases/SetActiveDiet';

interface DietsState {
    items: Diet[];
}

const initialState: DietsState = {
    items: [],
};

const dietsSlice = createSlice({
    name: 'diets',
    initialState,
    reducers: {
        setDiets: (state, action: PayloadAction<Diet[]>) => {
            state.items = action.payload;
        },
        addDiet: (state, action: PayloadAction<Omit<Diet, 'id' | 'isActive'>>) => {
            const newDiet = createDiet(action.payload);
            state.items.push(newDiet);
        },
        updateDiet: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Diet, 'id'>> }>) => {
            const index = state.items.findIndex(d => d.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = updateDietUseCase(state.items[index], action.payload.updates);
            }
        },
        deleteDiet: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(d => d.id !== action.payload);
        },
        setActiveDiet: (state, action: PayloadAction<string>) => {
            state.items = setActiveDietUseCase(state.items, action.payload);
        },
        deactivateAllDiets: (state) => {
            state.items = deactivateAllDietsUseCase(state.items);
        },
    },
});

export const { setDiets, addDiet, updateDiet, deleteDiet, setActiveDiet: setActiveDietAction, deactivateAllDiets } = dietsSlice.actions;
export default dietsSlice.reducer;

