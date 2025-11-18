import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
    return (
        <h2 className={cn('text-primary-600 text-center text-6xl font-semibold', className)}>
            <img src="/images/logo.jpeg" className="rounded-full" />
        </h2>
    );
}
