import { apiClient } from '@/lib/http';
import { createResourceStore, ID, ResourceStore } from '@/lib/resource';
import { Message } from './Message';
import { User } from './User';

export interface Chat {
    id: number;
    creator_id?: number;
    receiver_id?: ID;
    sender_id?: ID;
    users: Partial<User>[];
    messages: Message[];
    post_id?: ID;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null; // For soft deletes
}

interface ChatState extends ResourceStore<Chat> {
    getUserChats: (userId: ID) => Promise<any>;
    receiver: User | undefined;
    setReceiver: (user: User) => void;
}

export const useChat = createResourceStore<Chat, ChatState>('chats', (set, get) => ({
    // Assuming 'chats' is the resource name for the chat store

    receiver: undefined,

    setReceiver: (user: User) => {
        set(() => ({ receiver: user }));
    },

    getUserChats: () => {
        return apiClient()
            .get('/user/chats')
            .then((res) => {
                get().setItems(res.data);
                return Promise.resolve(res.data);
            });
    },
}));
