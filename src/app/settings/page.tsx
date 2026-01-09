'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/presentation/store/store';
import { toggleTheme, setLanguage } from '@/presentation/store/slices/uiSlice';
import { setDiets } from '@/presentation/store/slices/dietsSlice';
import { setFoodEntries } from '@/presentation/store/slices/foodEntriesSlice';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { Moon, Sun, Download, Trash2, Shield, Languages } from 'lucide-react';
import { firestoreRepo } from '@/infrastructure/repositories/firestore';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { Language } from '@/shared/i18n';

export default function SettingsPage() {
    const { t } = useTranslation();
    const theme = useSelector((state: RootState) => state.ui.theme);
    const language = useSelector((state: RootState) => state.ui.language);
    const diets = useSelector((state: RootState) => state.diets.items);
    const foodEntries = useSelector((state: RootState) => state.foodEntries.items);
    const dispatch = useDispatch();

    const handleExport = () => {
        const data = { diets, foodEntries, exportedAt: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vitalog-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleClearData = async () => {
        if (confirm(t.settings.totalWipeDesc)) {
            try {
                await firestoreRepo.clearAllUserData();
                dispatch(setDiets([]));
                dispatch(setFoodEntries([]));
                window.location.reload();
            } catch (error) {
                console.error('Error clearing data:', error);
                alert('Erro ao limpar dados. Tente novamente.');
            }
        }
    };

    const handleLanguageChange = (lang: Language) => {
        dispatch(setLanguage(lang));
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold">{t.settings.title}</h1>
                <p className="text-vitalog-textMuted">{t.settings.subtitle}</p>
            </header>

            <div className="grid gap-6">
                <Card className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-yellow-500/10 text-yellow-600'}`}>
                            {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                        </div>
                        <div>
                            <p className="font-bold">{t.settings.appearance}</p>
                            <p className="text-sm text-vitalog-textMuted">{t.settings.appearanceDesc}</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={() => dispatch(toggleTheme())}>
                        {t.settings.setTo} {theme === 'dark' ? t.settings.light : t.settings.dark}
                    </Button>
                </Card>

                <Card className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                            <Languages size={24} />
                        </div>
                        <div>
                            <p className="font-bold">{t.settings.language}</p>
                            <p className="text-sm text-vitalog-textMuted">{t.settings.languageDesc}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button 
                            variant={language === 'pt' ? 'primary' : 'ghost'} 
                            size="sm"
                            onClick={() => handleLanguageChange('pt')}
                        >
                            {t.settings.portuguese}
                        </Button>
                        <Button 
                            variant={language === 'en' ? 'primary' : 'ghost'} 
                            size="sm"
                            onClick={() => handleLanguageChange('en')}
                        >
                            {t.settings.english}
                        </Button>
                    </div>
                </Card>

                <Card className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                            <Download size={24} />
                        </div>
                        <div>
                            <p className="font-bold">{t.settings.exportData}</p>
                            <p className="text-sm text-vitalog-textMuted">{t.settings.exportDataDesc}</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={handleExport}>
                        {t.settings.export}
                    </Button>
                </Card>

                <Card className="flex items-center justify-between p-6 border-red-500/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10 text-red-600">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-red-600">{t.settings.totalWipe}</p>
                            <p className="text-sm text-vitalog-textMuted">{t.settings.totalWipeDesc}</p>
                        </div>
                    </div>
                    <Button variant="danger" onClick={handleClearData}>
                        {t.settings.clearEverything}
                    </Button>
                </Card>

                <Card className="p-6 bg-vitalog-primary/5 border-none">
                    <div className="flex items-center gap-3 mb-2 text-vitalog-primary">
                        <Shield size={20} />
                        <p className="font-bold">{t.settings.privacyFirst}</p>
                    </div>
                    <p className="text-sm text-vitalog-textMuted leading-relaxed">
                        {t.settings.privacyDesc}
                    </p>
                </Card>
            </div>
        </div>
    );
}
