import { configureStore, combineReducers } from '@reduxjs/toolkit';
import dietsReducer from './slices/dietsSlice';
import foodEntriesReducer from './slices/foodEntriesSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import { firestoreRepo } from '../../infrastructure/repositories/firestore';

const rootReducer = combineReducers({
    diets: dietsReducer,
    foodEntries: foodEntriesReducer,
    ui: uiReducer,
    auth: authReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

// Persistence logic with Firestore
let lastDiets: any = null;
let lastFoodEntries: any = null;
let isSyncing = false;

store.subscribe(() => {
    const state = store.getState();
    const user = state.auth.user;

    // Only sync if user is authenticated and not currently syncing
    if (!user || isSyncing || state.auth.loading) return;

    // Sync diets
    if (state.diets.items !== lastDiets) {
        const currentDiets = state.diets.items;
        lastDiets = currentDiets;
        isSyncing = true;
        firestoreRepo.saveDiets(currentDiets).catch(err => {
            console.error('Error saving diets to Firestore:', err);
            // Revert lastDiets on error to allow retry
            lastDiets = null;
        }).finally(() => {
            isSyncing = false;
        });
    }

    // Sync food entries
    if (state.foodEntries.items !== lastFoodEntries) {
        const currentFoodEntries = state.foodEntries.items;
        lastFoodEntries = currentFoodEntries;
        isSyncing = true;
        firestoreRepo.saveFoodEntries(currentFoodEntries).catch(err => {
            console.error('Error saving food entries to Firestore:', err);
            // Revert lastFoodEntries on error to allow retry
            lastFoodEntries = null;
        }).finally(() => {
            isSyncing = false;
        });
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
