import { cn } from '@/lib/utils'; // assuming a utility for classNames
import type { MenuItemType } from '@/types';
import { Link } from '@inertiajs/react';

export const Menu = ({ menu, className }: { menu: any; className: string }) => {
    const pathname = '';

    return (
        <div className={cn('scrollbar-thin w-full overflow-hidden hover:overflow-auto', className)}>
            <ul className="space-y-2">
                {menu.map((item: MenuItemType, index: number) => {
                    return (
                        <li key={`menu${index}`}>
                            {item.method ? (
                                <Link
                                    href={item.route as string}
                                    method={item.method}
                                    className={cn('group flex items-center rounded-full px-6 py-3 text-gray-600 hover:bg-white/90', {
                                        'bg-gray-200/30': pathname == item.route,
                                    })}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="ms-3">{item.label}</span>
                                </Link>
                            ) : (
                                <Link
                                    href={item.route as string}
                                    className={cn('group flex items-center rounded-full px-6 py-3 text-gray-600 hover:bg-white/90', {
                                        'bg-gray-200/30': pathname == item.route,
                                    })}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="ms-3">{item.label}</span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
