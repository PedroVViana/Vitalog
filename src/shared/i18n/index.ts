import { pt } from './locales/pt';
import { en } from './locales/en';

export type Language = 'pt' | 'en';

export const translations = {
    pt,
    en,
};

export type TranslationKeys = typeof pt;

