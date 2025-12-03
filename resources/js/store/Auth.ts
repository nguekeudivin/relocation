import { create } from 'zustand';
import { User } from './User';

export interface Auth {
    user: User;
}

interface AuthState {
    user: User;
    setUser: (item: User) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
    user: {
        id: 0,
    } as unknown as User,
    setUser: (user: User) => {
        set(() => ({
            user,
        }));
    },
}));
