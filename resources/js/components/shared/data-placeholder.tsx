import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

export default function DataPlaceholder({ className }: { className?: string }) {
    return (
        <div className={cn('mt-2 flex h-full items-center justify-center border-1 border-dashed border-gray-300', className)}>
            <div>
                <div className="mx-auto text-center">
                    <Package className="mx-auto h-8 w-8 text-gray-600" />
                </div>
                <div className="mt-2 text-center text-gray-600">No data available</div>
            </div>
        </div>
    );
}
