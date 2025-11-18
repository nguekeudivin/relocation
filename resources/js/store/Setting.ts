import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';

export interface Setting {
    name: string;
    code: string;
    description: string;
    value: string;
    meta: any;
}

export const getSettingObject = (items: Setting[]): Record<string, any> => {
    return Object.fromEntries(items.map((item) => [item.code, item.value]));
};

interface SettingStore extends ResourceStore<Setting> {
    save: (data: Record<string, any>) => Promise<any>;
}

export const useSetting = createResourceStore<Setting, SettingStore>('settings', (set, get) => ({
    save: (data) => {
        return apiClient()
            .post('settings/many', data)
            .then((res) => {
                return res.data;
            });
    },
}));
