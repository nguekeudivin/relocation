import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
    return (
        <h2 className={cn('text-center text-2xl font-bold md:text-4xl', className)}>
            {/* <span className="text-primary-600">Re</span>
            <span className="">location</span> */}
            <img src="/images/logo.png" alt="Images" className="h-[100px] w-[140px]" />
        </h2>
    );
}
