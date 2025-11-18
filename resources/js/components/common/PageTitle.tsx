import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export default function PageTitle({
    title,
    subtitle,
    links,
    className,
    actions,
}: {
    title: string;
    subtitle?: ReactNode;
    links?: any;
    className?: string;
    actions?: any;
}) {
    return (
        <div className={cn('flex items-center justify-between', className)}>
            <div>
                <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
                {subtitle && (
                    <>
                        <div>{subtitle}</div>
                    </>
                )}

                {/* {links && (
                    <nav className="mt-3 flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            {links.map((link: any, index: number) => {
                                return (
                                    <li key={`${index}-${route}`} className="inline-flex items-center">
                                        <Link href={link.route}>
                                            <button className={cn('flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600')}>
                                                {index == 0 ? (
                                                    <Home className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                                )}
                                                <span className="mt-1">{link.label}</span>
                                            </button>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                )} */}
            </div>
            {actions && <div>{actions}</div>}
        </div>
    );
}
