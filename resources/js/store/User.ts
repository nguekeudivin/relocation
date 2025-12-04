import { apiClient } from '@/lib/http';
import { createResourceStore, ID, ResourceStore } from '@/lib/resource';
import { differenceInSeconds, formatDistanceToNow } from 'date-fns';
import { Asset } from './Asset';

export interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone_number: string;
    address_id: string;
    status: 'active' | 'inactive' | 'banned';
    email_verified_at?: string | null;
    password: string;
    current_user_role_id?: number | null;
    created_at: string;
    updated_at: string;
    image: Asset;
    address: Address;
    is_online: any;
}

export interface Profile {
    name: string;
    label: string;
    type: string;
    role_id: ID;
}

export function getFullName(user: User) {
    return user?.first_name + ' ' + user?.last_name;
}

interface UserStore extends ResourceStore<User> {
    stats: any;
    getStats: (year: string) => Promise<any>;
}

export const useUser = createResourceStore<User, UserStore>('users', (set, get) => ({
    stats: {},
    getStats: (year: string) => {
        return apiClient()
            .get(`/stats/user?year=${year}`)
            .then((res) => {
                set(() => ({ stats: res.data }));
                return res.data;
            });
    },
}));

export const isOnline = (user: any): string => {
    if (!user.last_online) return 'offline';
    const secondsAgo = differenceInSeconds(new Date(), user.last_online);

    if (secondsAgo < 70) {
        return 'online';
    }

    return formatDistanceToNow(user.last_online, {
        addSuffix: true,
    });
};
