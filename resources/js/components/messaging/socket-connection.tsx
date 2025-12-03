'use client';

import { useChat } from '@/store/Chat';
import { useMessage } from '@/store/Message';
import { useNotification } from '@/store/Notification';
import { useUser } from '@/store/User';
import { usePage } from '@inertiajs/react';

import { useEffect, useRef, useState } from 'react';

export default function SocketConnection() {
    const chatStore = useChat();
    //const auth = useAuth();
    const messageStore = useMessage();
    const notificationStore = useNotification();
    const userStore = useUser();
    const currentChat = chatStore.current;

    const { WS_SERVER_URL, RECONNECT_INTERVAL, MAX_RECONNECT_ATTEMPTS, auth } = usePage<any>().props;

    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const ws = useRef<any>(undefined);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef<any>(undefined);

    // Function to establish WebSocket connection
    const connectWebSocket = () => {
        // Clear any pending reconnection attempts
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }

        // --- NEW CHECK HERE ---
        // If WebSocket is already OPEN or CONNECTING, do nothing and return.
        if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
            setConnectionStatus('Connected'); // Or 'Connecting...' if it's 0
            console.log('WebSocket is already open or connecting. Skipping new connection attempt.');
            // Ensure the socket is set on messageStore, in case it wasn't during initial connection
            if (!messageStore.socket || messageStore.socket.current !== ws.current) {
                messageStore.setSocket(ws);
            }
            return;
        }
        // --- END NEW CHECK ---

        // Close any existing connection before opening a new one
        if (ws.current) {
            ws.current.close(); // This will trigger onclose, but we handle it
        }

        setConnectionStatus('Connecting...');
        ws.current = new WebSocket(`${WS_SERVER_URL}?id=${auth.user.id}`);

        ws.current.onopen = () => {
            setConnectionStatus('Connected');
            reconnectAttempts.current = 0; // Reset attempts on successful connection
            messageStore.setSocket(ws);
            //loadChats();
            messageStore.receiveLatest();
        };

        ws.current.onmessage = (event: any) => {
            // console.log(event);

            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'AUTH_SUCCESS':
                    // console.log("WebSocket Authenticated successfully.");

                    break;
                case 'AUTH_FAILED':
                    setConnectionStatus('Authentication Failed');
                    console.error('WebSocket Authentication Failed. Closing connection.');
                    ws.current.close();
                    // Do not attempt to reconnect on auth failure, usually implies invalid token
                    break;
                case 'NEW_MESSAGE':
                    // Get the current chat form the url.
                    console.log('new message');

                    const searchParams = new URLSearchParams(window.location.search);
                    messageStore.receive(data.payload.id);
                    const currentChatId = searchParams.get('chatId');

                    if (currentChatId) {
                        if (currentChatId == data.payload.chat_id) {
                            messageStore.read(data.payload.id);
                        } else {
                            notificationStore.receiveMessage(data.payload.id);
                        }
                    } else {
                        notificationStore.receiveMessage(data.payload.id);
                    }

                    break;
                case 'MESSAGE_READ':
                    messageStore.handleRead(data.payload.id);
                    break;
                case 'MESSAGE_RECEIVED':
                    messageStore.handleReceive(data.payload.id);
                    break;
                case 'LATEST_MESSAGES_RECEIVED':
                    messageStore.handleReceiveLatestOf(data.payload.chat_ids);
                    break;
                case 'CHAT_LATEST_MESSAGES_READ':
                    messageStore.handleReadLatestOf(data.payload.id);
                    break;
                case 'MESSAGE_DELETED':
                    messageStore.handleDeleteMessage(data.payload);
                    break;
                case 'USER_ONLINE':
                    messageStore.handleUserOnline(data.payload.id);
                    break;
                // case 'USER_POSITION':
                //     userStore.handleUserPosition(data.payload);
                //     break;
                case 'NEW_NOTIFICATION':
                    notificationStore.handleNewNotification(data.payload);
                    break;
                case 'ERROR':
                    console.error('WebSocket Error from Server:', data.message);
                    break;

                default:
                    // console.log("Unhandled WebSocket message type:", data.type);
                    break;
            }
        };

        ws.current.onclose = (event: any) => {
            console.log('WebSocket Disconnected.', event.code, event.reason);
            setConnectionStatus('Disconnected');

            // Attempt to reconnect only if not intentionally closed (e.g., auth failure)
            if (event.code !== 1000 && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                // 1000 is normal closure
                reconnectAttempts.current++;
                console.log(`Attempting to reconnect (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})...`);
                setConnectionStatus(`Reconnecting (${reconnectAttempts.current})...`);
                reconnectTimeout.current = setTimeout(connectWebSocket, RECONNECT_INTERVAL);
            } else if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
                setConnectionStatus('Failed to reconnect');
                console.error('Maximum reconnection attempts reached. Please refresh.');
            }
        };

        ws.current.onerror = (error: any) => {
            setConnectionStatus('Error');
            console.error('WebSocket connection error:', error);
            // onerror typically precedes onclose, onclose will handle reconnection
        };
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Ensure code runs only in browser
            connectWebSocket();
        }

        // Cleanup function: This runs when the component unmounts or dependencies change
        return () => {
            if (ws.current) {
                ws.current.close(); // Close the WebSocket connection
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current); // Clear any pending reconnection
            }
        };
    }, [WS_SERVER_URL]);

    useEffect(() => {
        console.log('Connection Status:', connectionStatus);
    }, [connectionStatus]);

    return <></>;
}
