import { createResourceStore } from '@/lib/resource';

export interface Asset {
    id: number;
    name: string | null;
    purpose: string | null;
    disk: string; // e.g., 'public', 's3'
    path: string;
    url: string;
    size_bytes: number | null;
    mime_type: string;
    assetable_type: string;
    assetable_id: number;
    created_at: string;
    updated_at: string;
}

export const useAsset = createResourceStore<Asset>('assets');
