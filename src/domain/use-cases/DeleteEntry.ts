import { Entry } from '../entities/Entry';

// This is a thin wrapper, logic might be added later if needed (e.g. security checks)
export const deleteEntry = (entries: Entry[], entryId: string): Entry[] => {
    return entries.filter(e => e.id !== entryId);
};
