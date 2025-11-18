import { cn } from '@/lib/utils'; // optional if you use Tailwind/class merging helper
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
}

export const BanknoteArrowDown: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('lucide lucide-banknote-arrow-down', className)}
        {...props}
    >
        <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
        <path d="m16 19 3 3 3-3" />
        <path d="M18 12h.01" />
        <path d="M19 16v6" />
        <path d="M6 12h.01" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

export const BanknoteArrowUp: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('lucide lucide-banknote-arrow-up', className)}
        {...props}
    >
        <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
        <path d="M18 12h.01" />
        <path d="M19 22v-6" />
        <path d="m22 19-3-3-3 3" />
        <path d="M6 12h.01" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

export const BanknoteX: React.FC<IconProps> = ({ size = 24, color = 'currentColor', strokeWidth = 2, className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('lucide lucide-banknote-x', className)}
        {...props}
    >
        <path d="M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
        <path d="m17 17 5 5" />
        <path d="M18 12h.01" />
        <path d="m22 17-5 5" />
        <path d="M6 12h.01" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);
