import { ResourceStore } from '@/lib/resource';

export interface StatStore extends ResourceStore<any> {
    stats: any;
    getStats: (year: string) => Promise<any>;
}
