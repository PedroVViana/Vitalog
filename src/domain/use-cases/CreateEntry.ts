import { Entry, CreateEntryDTO } from '../entities/Entry';

export const createEntry = (dto: CreateEntryDTO): Entry => {
    return {
        id: crypto.randomUUID(),
        ...dto,
        createdAt: new Date().toISOString(),
    };
};
