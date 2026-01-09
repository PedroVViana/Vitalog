import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '@/shared/i18n';

interface UIState {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    isSidebarCollapsed: boolean;
    language: Language;
}

const initialState: UIState = {
    theme: 'light',
    sidebarOpen: true,
    isSidebarCollapsed: false,
    language: 'pt', // Português como padrão
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        toggleSidebarCollapse: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
        },
    },
});

export const { toggleTheme, setTheme, toggleSidebar, toggleSidebarCollapse, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
