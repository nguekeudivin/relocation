'use client';

import useTranslation from '@/hooks/use-translation';
import { generateRandomString } from '@/lib/utils';
import { useChat } from '@/store/Chat';
import { Message, useMessage } from '@/store/Message';
import { isOnline } from '@/store/User';
import { usePage } from '@inertiajs/react';
import { ArrowLeft, Check, CheckCheck, Clock, Image as ImageIcon, Paperclip, Send, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../ui/avatar';
import MessagingHandlers from './messaging.handlers';

export default function Messages({ closeChat }: { closeChat: any }) {
    // Store definition
    const { auth } = usePage<any>().props;

    const chatStore = useChat();
    const messageStore = useMessage();
    const { t } = useTranslation();

    // current elements.
    const currentChat = chatStore.current;
    const messages = messageStore.items[chatStore.current?.id as any] ?? [];

    // The receiver must comme from the chat list.
    const receiver = chatStore.items.find((chat) => chat.id == chatStore.current?.id)?.users?.find((u) => u.id != auth.user.id);

    // Local variable definition.
    const [inputMessage, setInputMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { isSender, formatFileSize, formatTimestamp, attachments, setAttachments, removeAttachment, handleFileUpload } = MessagingHandlers();

    const handleSendMessage = () => {
        if (inputMessage.trim() === '' && attachments.length === 0) return;

        const newMessage: Message = {
            id: generateRandomString(),
            chat_id: (currentChat as any).id,
            content: inputMessage,
            user_id: auth.user.id,
            created_at: new Date(),
            reads: [],
            receives: [],
            status: 'sending',
            attachments: attachments.map((file) => ({
                type: file.type.startsWith('image/') ? 'image' : 'file',
                url: URL.createObjectURL(file),
                file: file,
                name: file.name,
                size: file.size,
            })),
        };

        messageStore.addNewMessage(newMessage);
        messageStore.send(newMessage);

        setInputMessage('');
        setAttachments([]);

        // Call the prop callback with the message text and attachments
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderMessageStatus = (message: Message) => {
        switch (message.status) {
            case 'sent':
                return <Check size={15} className="text-gray-50" />;
            case 'received':
                return <CheckCheck size={15} className="text-gray-50" />;
            case 'read':
                return <CheckCheck size={15} className="text-green-500" />;
            default:
                return <Clock size={15} className="text-gray-50" />;
        }
    };

    const deleteMessage = (message: Message) => {
        messageStore.deleteMessage(message);
    };

    const inputsContainerRef = useRef<any>(undefined);
    const messageContainerRef = useRef<any>(undefined);
    const receiverContainerRef = useRef<any>(undefined);

    const computeMessagesSize = () => {
        const top = document.getElementById('navbar-top');
        if (top && messageContainerRef.current && inputsContainerRef.current && receiverContainerRef.current) {
            messageContainerRef.current.style.height = `${
                window.innerHeight - top.offsetHeight - 70 - inputsContainerRef.current.offsetHeight - receiverContainerRef.current.offsetHeight
            }px`;
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageStore.items]);

    useEffect(() => {
        computeMessagesSize();
    }, []);

    useEffect(() => {
        computeMessagesSize();
    }, [attachments, receiver]);

    return (
        <div className="w-full flex-col rounded-lg bg-gray-50">
            <div ref={receiverContainerRef} className="flex items-center justify-between border-b border-gray-300 bg-white p-3">
                {receiver && (
                    <div className="flex items-center">
                        <button
                            className="mr-2 p-2 md:hidden"
                            onClick={() => {
                                // Remove the chats from the url.
                                closeChat();
                            }}
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="relative">
                            <Avatar name={receiver.name as string} url={receiver?.image?.url} />
                            {receiver.is_online == true && (
                                <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                            )}
                        </div>
                        <div className="ml-3">
                            <h3 className="font-medium text-gray-900">{receiver.name} </h3>
                            <p className="text-xs text-gray-500">{isOnline(receiver)}</p>
                        </div>
                    </div>
                )}
            </div>
            <div ref={messageContainerRef} className="overflow-y-auto py-2">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                        <div className="bg-primary-100 mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                            <Send size={24} className="text-primary-500" />
                        </div>
                        <h3 className="mb-1 font-medium text-gray-700">{'No messages yet'}</h3>
                        <p className="max-w-xs text-sm text-gray-500">
                            {t('Send a message to start the conversation with')} {receiver?.name}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 p-4">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`message-item flex ${isSender(message) ? 'sent-message justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] ${
                                            isSender(message) ? 'bg-primary-600 text-white' : 'bg-white text-gray-800'
                                        } relative rounded-lg px-4 py-2 shadow-sm`}
                                    >
                                        <button className="absolute top-2 right-2 text-white">
                                            {/* <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <ChevronDown className="h-4 w-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            deleteMessage(message);
                                                        }}
                                                    >
                                                        {t('Delete')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu> */}
                                        </button>
                                        {/* Attachments */}
                                        {message.attachments && message.attachments.length > 0 && (
                                            <div className="mb-2 space-y-2">
                                                {message.attachments.map((attachment, i) =>
                                                    attachment.type === 'image' ? (
                                                        <div key={i} className="overflow-hidden rounded-lg">
                                                            <img
                                                                src={attachment.url}
                                                                alt="Attachment"
                                                                className="h-auto max-h-60 max-w-full rounded"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div
                                                            key={i}
                                                            className={`flex items-center rounded p-2 ${
                                                                isSender(message) ? 'bg-primary-600' : 'bg-gray-100'
                                                            }`}
                                                        >
                                                            <Paperclip
                                                                size={16}
                                                                className={isSender(message) ? 'text-primary-200' : 'text-gray-500'}
                                                            />
                                                            <div className="ml-2 overflow-hidden">
                                                                <p className="truncate text-sm font-medium">{attachment.name}</p>
                                                                <p className="text-xs">{attachment.size}</p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                        {/* Message text */}
                                        {message.content && <p className="pr-2 whitespace-pre-wrap">{message.content}</p>}

                                        {/* Timestamp and status */}
                                        <div
                                            className={`mt-1 flex items-center justify-end gap-1 ${
                                                isSender(message) ? 'text-primary-200' : 'text-gray-400'
                                            }`}
                                        >
                                            <span className="text-xs">{formatTimestamp(new Date(message.created_at))}</span>
                                            {isSender(message) && renderMessageStatus(message)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            <div ref={inputsContainerRef} className="shrink-0 bg-green-500">
                {/* Attachment preview */}
                {attachments.length > 0 && (
                    <div className="border-t border-gray-300 bg-gray-50 p-3">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {attachments.map((file, index) => (
                                <div key={index} className="relative">
                                    {file.type.startsWith('image/') ? (
                                        <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                                            <img src={URL.createObjectURL(file)} alt="Attachment preview" className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex h-20 w-32 flex-col justify-between rounded-lg border border-gray-200 bg-gray-100 p-2">
                                            <div className="flex items-start justify-between">
                                                <Paperclip size={16} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="truncate text-xs font-medium">{file.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        className="absolute top-2 right-2 rounded-full bg-gray-800 p-1 text-white shadow-sm"
                                        onClick={() => removeAttachment(index)}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Message input */}
                <div className="border-t border-gray-300 bg-white p-3">
                    <div className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                        <button
                            className="h-auto rounded-full p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon size={20} />
                        </button>
                        <div className="flex-1">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your message..."
                                className="focus:border-primary-500 focus:ring-primary-500 max-h-32 min-h-10 w-full resize-none rounded-md border border-gray-200 p-2 focus:outline-none"
                                rows={1}
                            />
                        </div>

                        <button
                            className={`h-auto rounded-full p-2 ${
                                inputMessage.trim() || attachments.length > 0 ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'text-gray-400'
                            }`}
                            onClick={handleSendMessage}
                            disabled={inputMessage.trim() === '' && attachments.length === 0}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
