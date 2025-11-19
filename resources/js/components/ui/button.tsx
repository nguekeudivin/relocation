// components/ui/Button.tsx
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'default' | 'secondary' | 'green' | 'red' | 'light' | 'dark' | 'outline' | 'neutral' | 'text';
    loading?: boolean;
}

const colorClasses: Record<NonNullable<ButtonProps['color']>, string> = {
    default: 'text-gray-900 bg-primary-500 hover:bg-primary-600 focus:ring-blue-300',
    secondary: 'text-white bg-secondary-700 hover:bg-secondary-800 focus:ring-secondary-300',
    neutral: 'text-white bg-gray-500 hover:bg-dray-300',
    outline: ' border-2 border-gray-900',
    text: 'border-none bg-transparent text-primary-500 font-semibold hover:bg-primary-100',
    green: 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300',
    red: 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300',
    light: 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-100',
    dark: 'text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 border-gray-700',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, color = 'default', className = '', loading = false, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={loading}
                className={cn(
                    'inline-flex items-center justify-center gap-1.5 px-5 py-2 font-medium focus:ring-4 focus:outline-none',
                    colorClasses[color],
                    className,
                )}
                {...props}
            >
                {loading && <Loader2 className="animate-spin" />}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';
