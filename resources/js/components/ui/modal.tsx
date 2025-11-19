'use client';

import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from './button';

interface ModalFooterProps {
    submit: any;
    name: string;
    cancelText?: string;
    submitText?: string;
    loading?: boolean;
    className?: string;
    render?: React.ReactNode;
}

interface Props {
    children: React.ReactNode;
    name: string;
    title?: string;
    className?: string;
    header?: React.ReactNode;
    footer?: ModalFooterProps;
}

export const Modal = ({ name, children, title, className, header, footer }: Props) => {
    const store = useAppStore();
    const display = store.display;
    const isVisible = display.visible[name];
    const toggleModal = () => display.toggle(name);

    // 🔒 Lock body scroll when modal is open
    useEffect(() => {
        if (isVisible) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/50" onClick={toggleModal}>
            <div
                className={cn('relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-sm', className)}
                onClick={(e) => e.stopPropagation()}
            >
                {header ? (
                    header
                ) : (
                    <div className="relative flex items-center justify-between border-b border-gray-200 p-4 md:px-8">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                )}
                <div className="p-4 pb-6 md:px-8 md:pt-4 md:pb-6">{children}</div>
                {footer && (
                    <footer className={cn('flex-shrink-0 border-t border-gray-200 bg-white p-4 md:px-8', footer.className)}>
                        {!footer.render ? <ModalFooter {...footer} /> : <>{footer.render}</>}
                    </footer>
                )}
            </div>
        </div>
    );
};

export const ModalFooter = ({ name, submit, cancelText = 'Cancel', submitText = 'Submit', loading = false }: ModalFooterProps) => {
    const store = useAppStore();
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-end gap-2">
            <Button color="neutral" onClick={() => store.display.hide(name)}>
                {t(cancelText)}
            </Button>
            <Button onClick={submit} loading={loading}>
                {t(submitText)}
            </Button>
        </div>
    );
};
