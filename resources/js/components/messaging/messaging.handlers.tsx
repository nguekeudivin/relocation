import { useAuth } from '@/store/Auth';
import { useState } from 'react';

export default function MessagingHandlers() {
    const auth = useAuth();
    const [attachments, setAttachments] = useState<File[]>([]);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const formatTimestamp = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isSender = (message: any) => auth.user.id == message.user_id;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachments((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    return {
        formatFileSize,
        formatTimestamp,
        isSender,
        attachments,
        setAttachments,
        removeAttachment,
        handleFileUpload,
    };
}
