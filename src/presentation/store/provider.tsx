'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect, ReactNode } from 'react';
import { setDiets } from './slices/dietsSlice';
import { setFoodEntries } from './slices/foodEntriesSlice';
import { setTheme, setLanguage } from './slices/uiSlice';
import { setUser, setLoading } from './slices/authSlice';
import { authService } from '../../infrastructure/firebase/auth';
import { firestoreRepo } from '../../infrastructure/repositories/firestore';

export function ReduxProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Set default UI preferences (these are client-side only, not synced)
        const defaultUI = { theme: 'light' as const, sidebarOpen: true, language: 'pt' as const };
        store.dispatch(setTheme(defaultUI.theme));
        store.dispatch(setLanguage(defaultUI.language));

        // Initialize auth state listener
        store.dispatch(setLoading(true));
        let unsubscribeDiets: (() => void) | null = null;
        let unsubscribeFoodEntries: (() => void) | null = null;

        const unsubscribeAuth = authService.onAuthStateChange(async (user) => {
            store.dispatch(setUser(user));
            store.dispatch(setLoading(false));

            // Cleanup previous subscriptions
            if (unsubscribeDiets) unsubscribeDiets();
            if (unsubscribeFoodEntries) unsubscribeFoodEntries();
            unsubscribeDiets = null;
            unsubscribeFoodEntries = null;

            if (user) {
                // Load data from Firestore when user is authenticated
                try {
                    const [diets, foodEntries] = await Promise.all([
                        firestoreRepo.getDiets(),
                        firestoreRepo.getFoodEntries()
                    ]);

                    store.dispatch(setDiets(diets));
                    store.dispatch(setFoodEntries(foodEntries));

                    // Subscribe to real-time updates
                    unsubscribeDiets = firestoreRepo.subscribeToDiets((diets) => {
                        store.dispatch(setDiets(diets));
                    });

                    unsubscribeFoodEntries = firestoreRepo.subscribeToFoodEntries((entries) => {
                        store.dispatch(setFoodEntries(entries));
                    });
                } catch (error) {
                    console.error('Error loading data from Firestore:', error);
                }
            } else {
                // Clear data when user logs out
                store.dispatch(setDiets([]));
                store.dispatch(setFoodEntries([]));
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDiets) unsubscribeDiets();
            if (unsubscribeFoodEntries) unsubscribeFoodEntries();
        };
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
