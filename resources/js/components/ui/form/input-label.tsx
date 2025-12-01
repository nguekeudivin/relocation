import { cn } from '@/lib/utils';

interface Props {
    htmlFor?: string;
    className?: string;
    children: React.ReactNode;
}

export default function InputLabel({ htmlFor, className, children }: Props) {
    return (
        <label htmlFor={htmlFor} className={cn('mb-1.5 block text-sm font-medium text-gray-900', className)}>
            {children}
        </label>
    );
}
