import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';

export interface Slot {
    id: number; // Internal DB ID
    date: string; // The date of the slot (YYYY-MM-DD)
    from_hour: string; // Start time (HH:MM:SS)
    to_hour: string; // End time (HH:MM:SS)
    description: string; // Description of the slot
    created_at?: string | Date; // Timestamp of creation
    updated_at?: string | Date; // Timestamp of last update
}

interface SlotStore extends ResourceStore<Slot> {
    createMany: (startDate: string, endDate: string) => Promise<any>;
}

export const useSlot = createResourceStore<Slot, SlotStore>('slots', (set, get) => ({
    transform: (item: Slot) => {
        return {
            ...item,
            startDate: item.from_hour,
            endDate: item.to_hour,
        };
    },
    createMany: (start_date: string, end_date: string) => {
        return apiClient().post(`slots/many`, { start_date, end_date });
    },
}));
