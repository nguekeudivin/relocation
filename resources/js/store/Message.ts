import { apiClient } from '@/lib/http';
import { createGroupedResourceStore, GroupedResourceStore, ID } from '@/lib/resource';
import { useAuth } from './Auth';
import { useChat } from './Chat';
import { useNotification } from './Notification';

export interface MessageRead {
    user_id: ID;
    message_id: ID;
    read_at: string | Date;
    message: Message;
}

export interface MessageReceive {
    user_id: ID;
    message_id: ID;
    message: Message;
}

export interface Message {
    id: ID;
    chat_id: ID;
    user_id: ID;
    content: string;
    created_at: string | Date;
    updated_at?: string;
    status?: string;
    attachments?: {
        type: 'image' | 'file';
        file: File;
        url: string;
        name?: string;
        size?: number;
    }[];
    reads: MessageRead[];
    receives: MessageReceive[];
}

interface MessageState extends GroupedResourceStore<Message> {
    send: (newMessage: Message) => void;
    updateInvolveUser: (userId: ID) => void;
    read: (id: ID) => void;
    receive: (id: ID) => void;
    handleRead: (id: ID) => void;
    syncRead: (read: MessageRead) => void;
    handleReceive: (id: ID) => void;
    receiveLatest: () => void;
    handleReceiveLatestOf: (chatIds: ID[]) => void;
    readLatestOf: (chatIds: ID) => void;
    handleReadLatestOf: (chatIds: ID) => void;
    socket: any;
    setSocket: (sock: any) => void;
    deleteMessage: (message: Message) => void;
    handleDeleteMessage: (message: Message) => void;
    sayIAMOnline: (userId: ID) => void;
    handleUserOnline: (userId: ID) => void;
    addNewMessage: (message: Message) => void;
    notifyMyPosition: (data: any) => void;
    sendNotification: (notification: any) => void;
}

export const useMessage = createGroupedResourceStore<Message, MessageState>('messages', (set, get) => ({
    // Assuming 'messages' is the resource name for the message store
    groupId: 'chat_id',
    socket: undefined,

    transform: (message: Message) => {
        let status = message.status;

        const chat = useChat.getState().items.find((chat) => chat.id == message.chat_id);

        if (!chat) {
            return { ...message, groupId: message.chat_id };
        }

        if (message.reads.length) status = 'sent';
        if (message.receives.length == chat.users.length) status = 'received';
        if (message.reads.length == chat.users.length) status = 'read';

        return {
            ...message,
            status,
            groupId: message.chat_id,
        };
    },
    setSocket: (sock: any) => {
        set(() => ({ socket: sock }));
    },
    addNewMessage: (message) => {
        get().add(message, false);
        // update the chat.
        const { items, setItems } = useChat.getState();
        setItems(
            items.map((chat) => {
                if (chat.id == message.chat_id) {
                    return {
                        ...chat,
                        messages: [...chat.messages, message],
                    };
                } else {
                    return chat;
                }
            }),
        );
    },
    send: (inputMessage: Message) => {
        const formData = new FormData();
        formData.append('id', inputMessage.id as string);
        formData.append('chat_id', inputMessage.chat_id as string);
        formData.append('content', inputMessage.content);
        formData.append('user_id', inputMessage.user_id as string);

        inputMessage?.attachments?.forEach((file, index) => {
            formData.append(`attachments[${index}][file]`, file.file);
            formData.append(`attachments[${index}][type]`, file.type);
            formData.append(`attachments[${index}][name]`, file.name as string);
            formData.append(`attachments[${index}][size]`, (file.size as number).toString());
        });

        apiClient()
            .post('messages', formData)
            .then((res) => {
                const { message, listeners } = res.data;
                // Sync to update the status
                get().sync(
                    {
                        ...message,
                        status: 'sent',
                        id: message.id,
                        chat_id: message.chat_id, // update the status.
                    },
                    (item: Message) => item.id == inputMessage.id, // we use the inputMessage to do the sync since the input message still have string id.
                );

                // Notify.
                get().socket.current.send(
                    JSON.stringify({
                        type: 'SEND_MESSAGE',
                        listeners: listeners,
                        payload: {
                            id: message.id,
                            chat_id: message.chat_id,
                            // attachements.
                        },
                    }),
                );
            });
    },
    receive: (id: ID) => {
        apiClient()
            .post('messages/receive', {
                user_id: useAuth.getState().user.id,
                message_id: id,
            })
            .then((res) => {
                const { receive, message, listeners } = res.data;

                // Add to list.
                get().addNewMessage(message);

                // Notify
                get().socket.current.send(
                    JSON.stringify({
                        type: 'RECEIVE_MESSAGE',
                        listeners,
                        payload: {
                            id: receive.id,
                        },
                    }),
                );
            });
    },

    read: (messageId: ID) => {
        apiClient()
            .post('messages/read', {
                user_id: useAuth.getState().user.id,
                message_id: messageId,
            })
            .then((res) => {
                const { read, listeners } = res.data;
                // Send reading to the socket.
                // We keep only the need fields.
                get().socket.current.send(
                    JSON.stringify({
                        type: 'READ_MESSAGE',
                        listeners,
                        payload: {
                            id: read.id,
                        },
                    }),
                );

                // Handle the read on my side.
                get().syncRead(read);

                // remote associate notification.
                useNotification.getState().filter((item: any) => item.message_id != messageId);
            });
    },
    syncRead: (read: MessageRead) => {
        const message = get().items[read.message.chat_id].find((m: any) => m.id == read.message.id);

        if (!message) return 0;

        // check if the messageRead is not yet recorded.
        const checkExistance = message.reads.find((item: MessageRead) => item.user_id == read.user_id && item.message_id == read.message_id);
        if (!checkExistance) {
            get().syncWithId({
                id: message.id, // the message.id
                chat_id: message.chat_id, // the group id.
                reads: [...message.reads, read],
                status: 'read',
            });
        }
    },
    handleRead: (id: ID) => {
        apiClient()
            .get(`/message-reads/${id}`)
            .then((res) => {
                const read = res.data;
                get().syncRead(read);
                get().updateInvolveUser(read.user_id);
            });
        // Find the message.
    },
    handleReceive: (id: ID) => {
        apiClient()
            .get(`/message-receives/${id}`)
            .then((res) => {
                const receive = res.data;

                const message = get().items[receive.message.chat_id].find((m: any) => m.id == receive.message.id);

                if (!message) return 0;

                // check if the messageReceive is not yet recorded.
                const checkExistance = message.receives.find(
                    (delivery: any) => delivery.user_id == receive.user_id && delivery.message_id == receive.message_id,
                );

                if (!checkExistance) {
                    get().syncWithId({
                        id: message.id, // the message.id
                        chat_id: message.chat_id, // the group id.
                        receives: [...message.receives, receive],
                        status: 'received',
                    });
                }

                get().updateInvolveUser(receive.user_id);
            });
    },
    receiveLatest: () => {
        apiClient()
            .post('/message-receives/lastest')
            .then((res) => {
                const { listeners, chat_ids } = res.data;
                if (listeners.length) {
                    setTimeout(() => {
                        console.log('Last message receive chats', chat_ids);
                        get().socket.current.send(
                            JSON.stringify({
                                type: 'RECEIVE_LATEST_MESSAGES',
                                listeners,
                                payload: {
                                    chat_ids: chat_ids,
                                },
                            }),
                        );
                    }, 1000);
                }
            });
    },
    handleReceiveLatestOf: (chat_ids: ID[]) => {
        apiClient()
            .post(`/get/chats`, { chat_ids: chat_ids })
            .then((res) => {
                res.data.forEach((chat: any) => {
                    get().setGroup(chat.id, chat.messages);
                });
            });
    },
    readLatestOf: (chatId: ID) => {
        apiClient()
            .post(`/message-reads/${chatId}/latest`)
            .then((res) => {
                const { listeners, last_message, notifications } = res.data;

                // Notify that I have read all the last message.
                if (listeners.length) {
                    get().socket.current.send(
                        JSON.stringify({
                            type: 'READ_CHAT_LATEST_MESSAGES',
                            listeners,
                            payload: {
                                id: chatId,
                            },
                        }),
                    );
                }

                if (last_message) {
                    // Update the last message read.
                    get().syncRead({
                        user_id: useAuth.getState().user.id,
                        message_id: last_message.id,
                        message: last_message,
                        read_at: Date(),
                    });
                }

                // Remove also notifications for the read messages.
                useNotification.getState().setItems(notifications);
            });
    },
    handleReadLatestOf: (chatId: ID) => {
        apiClient()
            .get(`chats/${chatId}`)
            .then((res) => {
                get().setGroup(chatId, res.data.messages);
            });
    },
    deleteMessage: (message: Message) => {
        get()
            .destroy(message.chat_id, message.id)
            .then(() => {
                const listeners = useChat
                    .getState()
                    .items.find((item) => item.id == message.chat_id)
                    ?.users.map((item) => item.id);

                get().socket.current.send(
                    JSON.stringify({
                        type: 'DELETE_MESSAGE',
                        listeners,
                        payload: {
                            id: message.id,
                            chat_id: message.chat_id,
                        },
                    }),
                );
            });
    },
    handleDeleteMessage: ({ id, chat_id }: { id: ID; chat_id: ID }) => {
        get().filter(chat_id, (item: any) => item.id != id);
    },

    updateInvolveUser: (userId: ID) => {
        // Update the user can just read the message to mark that he  is online.
        const { current, setCurrent } = useChat.getState();
        if (current) {
            if (current.users.find((user) => user.id == userId)) {
                console.log('last online of', userId);
                setCurrent({
                    ...current,
                    users: current.users.map((user) => (user.id == userId ? { ...user, last_online: Date(), is_online: true } : user)),
                });
            }
        }
    },
    sayIAMOnline: (userID: ID) => {
        get().socket.current.send(
            JSON.stringify({
                type: 'IAM_ONLINE',
                broadcast: 'yes',
                payload: {
                    id: userID,
                },
            }),
        );
    },
    handleUserOnline: (userId: ID) => {
        const { items, setItems } = useChat.getState();
        // Update the online status of the user inside a particular chat.
        setItems(
            items.map((chat) => {
                // Find the user in the chat.
                const user = chat.users.find((user) => user.id == userId);
                if (user == undefined) {
                    // The user does exist inside the chat. So we skip
                    return chat;
                } else {
                    return {
                        ...chat,
                        users: chat.users.map((chatUser) =>
                            chatUser.id == userId ? { ...chatUser, last_online: Date(), is_online: true } : chatUser,
                        ),
                    };
                }
            }),
        );
    },
    notifyMyPosition: ({ user_id, lt, lg }: any) => {
        get().socket.current.send(
            JSON.stringify({
                type: 'NOTIFY_MY_POSITION',
                broadcast: 'yes',
                payload: {
                    user_id,
                    lg,
                    lt,
                },
            }),
        );
    },
    sendNotification: (notification: any) => {
        get().socket.current.send(
            JSON.stringify({
                type: 'NEW_NOTIFICATION',
                listeners: [notification.user_id],
                payload: notification,
            }),
        );
    },
}));
