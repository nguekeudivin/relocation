import { apiClient } from '@/lib/http';
import { createResourceStore, ResourceStore } from '@/lib/resource';

export interface Setting {
    name: string;
    code: string;
    description: string;
    value: string;
    meta: any;
}

interface SettingStore extends ResourceStore<Setting> {
    values: any;
    save: (data: Record<string, any>) => Promise<any>;
}

export const useSetting = createResourceStore<Setting, SettingStore>('settings', (set, get) => ({
    values: {
        price_per_hour: 16,
        worker_tax: 15,
        car_tax: 15,
        available_workers: 10,
        van_price_weekday: 75,
        van_price_weekend: 130,
        bus_price_weekday: 60,
        bus_price_weekend: 120,
        fee_per_km: 0.4,
    },
    save: (data) => {
        return apiClient()
            .post('settings/many', data)
            .then((res) => {
                set(() => ({
                    values: Object.fromEntries(res.data.map((item: Setting) => [item.code, item.value])),
                }));
                return res.data;
            });
    },
}));
