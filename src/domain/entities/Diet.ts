export interface Diet {
    id: string;
    name: string;
    description?: string;
    startDate?: string; // ISO String
    endDate?: string; // ISO String
    notes?: string;
    attachmentUrl?: string; // URL to attached image or PDF
    attachmentType?: 'image' | 'pdf'; // Type of attachment
    isActive: boolean;
}

export type CreateDietDTO = Omit<Diet, 'id' | 'isActive'>;

export type UpdateDietDTO = Partial<Omit<Diet, 'id'>>;

