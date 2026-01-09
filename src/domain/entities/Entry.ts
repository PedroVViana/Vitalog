import { EntryType } from '../value-objects/EntryType';
import { Score0to10 } from '../value-objects/Score0to10';

export interface Entry {
    id: string;
    habitId: string;
    createdAt: string; // ISO String
    type: EntryType;
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    tags: string[];
    mood?: Score0to10;
    energy?: Score0to10;
}

export type CreateEntryDTO = Omit<Entry, 'id' | 'createdAt'>;
