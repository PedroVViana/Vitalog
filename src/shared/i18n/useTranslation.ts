import { useSelector } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import { translations, TranslationKeys } from './index';

export const useTranslation = () => {
    const language = useSelector((state: RootState) => state.ui.language || 'pt');
    const t = translations[language as 'pt' | 'en'] as TranslationKeys;

    return { t, language };
};

