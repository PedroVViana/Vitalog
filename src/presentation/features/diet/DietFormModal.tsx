'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Diet } from '../../../domain/entities/Diet';
import { createDiet } from '../../../domain/use-cases/CreateDiet';
import { updateDiet } from '../../../domain/use-cases/UpdateDiet';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { Image, FileText, X } from 'lucide-react';
import styles from './DietFormModal.module.css';

interface DietFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (diet: Diet) => void;
    initialData?: Diet;
}

export const DietFormModal = ({ isOpen, onClose, onSubmit, initialData }: DietFormModalProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | undefined>(undefined);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
            setStartDate(initialData.startDate ? initialData.startDate.split('T')[0] : '');
            setEndDate(initialData.endDate ? initialData.endDate.split('T')[0] : '');
            setNotes(initialData.notes || '');
            setAttachmentUrl(initialData.attachmentUrl || '');
            setAttachmentType(initialData.attachmentType || undefined);
        } else {
            setName('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setNotes('');
            setAttachmentUrl('');
            setAttachmentType(undefined);
        }
        setError('');
    }, [initialData, isOpen]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (attachmentUrl && attachmentUrl.startsWith('blob:')) {
                URL.revokeObjectURL(attachmentUrl);
            }
        };
    }, [attachmentUrl]);

    const extractTextFromPDF = async (file: File): Promise<string> => {
        try {
            // Dynamic import of pdfjs-dist
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
            
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n';
            }
            
            return fullText;
        } catch (err) {
            console.error('Error extracting PDF text:', err);
            throw new Error(t.dietForm.pdfExtractionError);
        }
    };

    const parseDietInfoFromText = (text: string) => {
        // Try to extract diet name (first line or title-like text)
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const potentialName = lines[0]?.trim() || '';
        
        // Try to find description (first paragraph after title)
        let description = '';
        for (let i = 1; i < Math.min(5, lines.length); i++) {
            if (lines[i] && lines[i].trim().length > 20) {
                description = lines[i].trim();
                break;
            }
        }
        
        // Use first 500 chars as notes if description is empty
        const notes = text.length > 500 ? text.substring(0, 500) + '...' : text;
        
        return {
            name: potentialName.length > 0 && potentialName.length < 100 ? potentialName : '',
            description: description || undefined,
            notes: notes.length > 0 ? notes : undefined,
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                const updated = updateDiet(initialData, {
                    name,
                    description: description || undefined,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    notes: notes || undefined,
                    attachmentUrl: attachmentUrl || undefined,
                    attachmentType: attachmentType || undefined,
                });
                onSubmit(updated);
            } else {
                const newDiet = createDiet({
                    name,
                    description: description || undefined,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                    notes: notes || undefined,
                    attachmentUrl: attachmentUrl || undefined,
                    attachmentType: attachmentType || undefined,
                });
                onSubmit(newDiet);
            }
            onClose();
        } catch (err: any) {
            setError(err instanceof Error ? err.message : t.dietForm.errorOccurred);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';

        if (!isImage && !isPdf) {
            setError(t.dietForm.invalidFileType);
            return;
        }

        // Create object URL for preview
        const url = URL.createObjectURL(file);
        setAttachmentUrl(url);
        setAttachmentType(isImage ? 'image' : 'pdf');
        setError('');

        // If PDF, extract text and auto-fill fields
        if (isPdf) {
            try {
                setError(t.dietForm.extractingText);
                const extractedText = await extractTextFromPDF(file);
                const parsedInfo = parseDietInfoFromText(extractedText);
                
                if (parsedInfo.name && !name) {
                    setName(parsedInfo.name);
                }
                if (parsedInfo.description && !description) {
                    setDescription(parsedInfo.description);
                }
                if (parsedInfo.notes && !notes) {
                    setNotes(parsedInfo.notes);
                }
                
                setError('');
            } catch (err: any) {
                setError(err.message || t.dietForm.pdfExtractionError);
            }
        }
    };

    const handleRemoveAttachment = () => {
        if (attachmentUrl) {
            URL.revokeObjectURL(attachmentUrl);
        }
        setAttachmentUrl('');
        setAttachmentType(undefined);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? t.dietForm.editTitle : t.dietForm.newTitle} size="large">
            <form onSubmit={handleSubmit} className={styles.dietForm}>
                <div className={styles.disclaimer}>
                    <p className={styles.disclaimerText}>{t.dietForm.disclaimer}</p>
                </div>

                <div className={styles.formSection}>
                    <label className={styles.sectionLabel}>{t.dietForm.attachment}</label>
                    <p className={styles.helperText}>{t.dietForm.attachmentHelper}</p>
                    
                    {!attachmentUrl ? (
                        <div className={styles.fileUploadArea}>
                            <input
                                type="file"
                                id="diet-attachment"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            <label htmlFor="diet-attachment" className={styles.fileUploadLabel}>
                                <FileText size={24} />
                                <span>{t.dietForm.chooseFile}</span>
                                <span className={styles.fileTypes}>{t.dietForm.acceptedFormats}</span>
                            </label>
                        </div>
                    ) : (
                        <div className={styles.attachmentPreview}>
                            {attachmentType === 'image' ? (
                                <div className={styles.imagePreview}>
                                    <img src={attachmentUrl} alt="Diet attachment" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveAttachment}
                                        className={styles.removeBtn}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.pdfPreview}>
                                    <FileText size={32} />
                                    <p>{t.dietForm.pdfAttached}</p>
                                    <button
                                        type="button"
                                        onClick={handleRemoveAttachment}
                                        className={styles.removeBtn}
                                    >
                                        {t.dietForm.removeAttachment}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Input
                    label={t.dietForm.dietName}
                    placeholder={t.dietForm.dietNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={error}
                    required
                />

                <Textarea
                    label={t.dietForm.description}
                    placeholder={t.dietForm.descriptionPlaceholder}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />

                <div className={styles.dateRow}>
                    <Input
                        label={t.dietForm.startDate}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        label={t.dietForm.endDate}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <Textarea
                    label={t.dietForm.notes}
                    placeholder={t.dietForm.notesPlaceholder}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />

                <div className={styles.formActions}>
                    <Button type="button" variant="ghost" fullWidth onClick={onClose}>
                        {t.dietForm.cancel}
                    </Button>
                    <Button type="submit" variant="primary" fullWidth>
                        {initialData ? t.dietForm.saveChanges : t.dietForm.createDiet}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

