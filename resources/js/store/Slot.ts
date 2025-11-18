import { createResourceStore } from '@/lib/resource';

export interface Slot {
    id: number; // Internal DB ID
    date: string; // The date of the slot (YYYY-MM-DD)
    from_hour: string; // Start time (HH:MM:SS)
    to_hour: string; // End time (HH:MM:SS)
    description: string; // Description of the slot
    created_at?: string | Date; // Timestamp of creation
    updated_at?: string | Date; // Timestamp of last update
}

export const useSlot = createResourceStore<Slot>('slots');
