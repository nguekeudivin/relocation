import { InputField } from '@/components/ui/form';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Chat, useChat } from '@/store/Chat';
import { useMessage } from '@/store/Message';
import { router, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Avatar from '../ui/avatar';
import Messages from './Messages';

interface Props {
    role: string; // user, admin
}

export default function ChatView({ role }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const chatStore = useChat();
    const messageStore = useMessage();
    const selected = chatStore.current;
    const { auth } = usePage<any>().props;
    const { t } = useTranslation();

    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    // Filter conversations based on search query
    const filteredConversations = chatStore.items.filter((chat) => {
        const users = chat.users.filter((u: any) => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return users.length;
    });

    const getReceiver = (chat: any) => {
        return chat.users.find((u: any) => u.id != auth.user.id);
    };

    const getLastMessage = (chat: any) => {
        const messages = messageStore.items[chat.id];
        if (!messages) return undefined;

        const len = messages.length;
        if (messages[len - 1]) return messages[len - 1];
        else return undefined;
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        chatStore.getUserChats(auth.user.id).then((chats) => {
            // Set the current chat if is exists.
            selectChat(chats.find((item: any) => item.id == searchParams.get('chatId')));
            // fill the message store.
            messageStore.setItems(Object.fromEntries(chats.map((chat: any) => [chat.id, chat.messages])));
        });
    }, []);

    // Capture
    // If there is a current chat but url does not reflect it.
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (chatStore.current && !searchParams.get('chatId')) {
            router.visit(`/${role}/messages?chatId=${chatStore.current.id}`);
        }
    }, []);

    const selectChat = (chat: Chat) => {
        if (chat != undefined) {
            chatStore.setCurrent(chat);
            setMobileView('chat');
            messageStore.readLatestOf(chat.id);

            router.visit(`/${role}/messages?chatId=${chat.id}`, {
                preserveState: true,
            });
        }
    };

    const closeChat = () => {
        router.visit(`/${role}/messages`);
        chatStore.setCurrent(undefined);
        setMobileView('list');
    };

    // compute the size of the chat list container.
    const chatListRef = useRef<any>(undefined);
    const chatListHeaderRef = useRef<any>(undefined);
    useEffect(() => {
        chatListRef.current.style.height = `${window.innerHeight - chatListHeaderRef.current.offsetHeight - 72 * 2}px`;
    }, []);

    return (
        <div
            className={cn(
                'fixed left-0 flex w-full flex-col overflow-hidden border border-gray-200 bg-white md:relative md:top-0 md:h-[calc(100vh-140px)] md:flex-row',
                {
                    'top-[120px]': role == 'user',
                    'top-[68px]': role == 'admin',
                },
            )}
        >
            {/* Liste des conversations - cachée en mobile quand chat actif */}
            <div
                className={cn(`hidden w-full border-gray-100 md:w-[380px] md:border-r`, {
                    'md:block': role == 'admin' && mobileView === 'chat',
                    block: role == 'admin' && mobileView != 'chat',
                })}
            >
                <div className="border-b border-gray-300 px-4 py-1" ref={chatListHeaderRef}>
                    {/* <h2 className="mb-3 text-lg font-medium text-gray-900">{'Messages'}</h2> */}

                    {/* Recherche */}
                    <div className="relative">
                        {/* <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" /> */}
                        <InputField
                            type="text"
                            placeholder={t('Search conversations...')}
                            className="w-full py-2 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="no-scroll-visual overflow-y-auto" ref={chatListRef}>
                    {filteredConversations.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {filteredConversations
                                .slice()
                                .sort((a, b) => {
                                    const aLatest = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].created_at).getTime() : 0;

                                    const bLatest = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].created_at).getTime() : 0;

                                    return bLatest - aLatest;
                                })
                                .map((chat) => {
                                    const receiver = getReceiver(chat);
                                    const lastMessage = getLastMessage(chat);

                                    if (receiver == undefined) return null;

                                    return (
                                        <li
                                            key={`chat${chat.id}`}
                                            className={`cursor-pointer p-3 transition-colors hover:bg-gray-50 ${
                                                selected?.id === chat.id ? 'bg-primary-50' : ''
                                            }`}
                                            onClick={() => selectChat(chat)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex-shrink-0">
                                                    <Avatar name={receiver.name} url={receiver?.image?.url} />
                                                    {receiver.is_online == true && (
                                                        <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium text-gray-900">{receiver.name}</h3>
                                                        {lastMessage && (
                                                            <p className="text-xs text-gray-500">
                                                                {formatDistanceToNow(lastMessage.created_at, {
                                                                    addSuffix: true,
                                                                })}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {lastMessage && (
                                                        <div className="flex items-center justify-between">
                                                            <p className="truncate pr-2 text-sm text-gray-500">{lastMessage.content}</p>
                                                            {lastMessage.reads.find((read) => read.user_id == auth.user.id) == undefined && (
                                                                <div className="bg-primary-500 h-2 w-2 rounded-full"></div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-gray-500">{t('No conversations found')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Zone de chat - cachée en mobile quand liste active */}
            <div className={`flex flex-1 flex-col ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
                {selected ? (
                    <Messages closeChat={closeChat} />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
                        <div className="bg-primary-100 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <User size={28} className="text-primary-500" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">{t('No conversation selected')}</h3>
                        <p className="mb-6 max-w-md text-gray-500">
                            {t('Select a conversation from the list to start messaging or create a new message')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
