import { createResourceStore } from '@/lib/resource';

export interface Category {
    name: string;
    id: number;
    type: string;
    description: string;
}

export const useCategory = createResourceStore<Category>('categories');
