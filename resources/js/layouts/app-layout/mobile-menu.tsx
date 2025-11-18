import { useAppStyle } from '@/hooks/use-appearance';
import { useDisplay } from '@/hooks/use-display';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Menu } from './menu';

export default function MobileMenu() {
    const display = useDisplay();
    const appStyle = useAppStyle();
    return (
        <div
            className={cn('hidden transform transition-transform', {
                block: display.visible.MobileMenu,
            })}
        >
            <div className={cn('flex justify-end px-4 py-2 text-white', appStyle.sidebarBgColor)}>
                <button
                    onClick={() => {
                        display.hide('MobileMenu');
                    }}
                    className="rounded-full p-2 hover:bg-gray-200/30"
                >
                    <X />
                </button>
            </div>
            <Menu menu={[]} bgColor={appStyle.sidebarBgColor} />
        </div>
    );
}
