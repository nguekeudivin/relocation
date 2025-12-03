import { createResourceStore } from '@/lib/resource';

export interface ChatUser {
    id: number;
    chat_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export const useChatUser = createResourceStore<ChatUser>('chats-users');
