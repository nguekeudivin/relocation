import { useAway } from '@/hooks/use-away';
import { useDisplay } from '@/hooks/use-display';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

export default function Popover({ name, className, children }: { name: string; className: string; children: React.ReactNode }) {
    const display = useDisplay();
    const popRef = useRef<any>(undefined);
    useAway(popRef, () => {
        display.hide(name);
    });

    if (display.visible[name]) {
        return (
            <div ref={popRef} className={cn('absolute', className)}>
                {children}
            </div>
        );
    }
}
