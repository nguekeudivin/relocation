'use client';

import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from '../ui/button';

interface FullPaginationProps {
    pagination: any;
    canEdit?: boolean;
    className?: string;
    onPrevious?: () => void;
    onNext?: () => void;
    onGoto?: (pageNumber: number) => void;
    onPerPage?: (value: number) => void;
}

const FullPagination: FC<FullPaginationProps> = ({ pagination, canEdit = false, className, onGoto, onPerPage = () => {} }) => {
    const { t } = useTranslation();

    const previous = () => {
        window.scroll({ top: 0, behavior: 'smooth' });
        if (pagination.current_page != 1) {
            if (onGoto) onGoto(pagination.current_page - 1);
        }
    };

    const next = () => {
        window.scroll({ top: 0, behavior: 'smooth' });
        if (pagination.current_page != pagination.last_page) {
            if (onGoto) onGoto(pagination.current_page + 1);
        }
    };

    const goTo = (pageNumber: number) => {
        window.scroll({ top: 0, behavior: 'smooth' });
        if (onGoto) onGoto(pageNumber);
    };

    const [perPage, setPerPage] = useState<number>(pagination.per_page);

    return (
        <div className={cn('flex items-center justify-between', className)}>
            {canEdit && (
                <div className="flex items-center space-x-3">
                    <span className="">Show</span>
                    <select
                        className="rounded-lg bg-gray-100 px-4 py-2"
                        value={perPage}
                        onChange={(e: any) => {
                            setPerPage(e.target.value);
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={pagination.total}></option>
                    </select>
                    {pagination.per_page != perPage && (
                        <Button className="px-2 py-2 text-sm" onClick={() => onPerPage(perPage)}>
                            {t('Refresh')}
                        </Button>
                    )}
                    {/* <span className="">  {pagination.total}</span> */}
                </div>
            )}

            <ul className="flex h-10 items-center space-x-2 text-base">
                {pagination.current_page != 1 ? (
                    <li>
                        <button onClick={previous} className="p-2 hover:bg-gray-200">
                            <ChevronLeft />
                        </button>
                    </li>
                ) : null}

                {Array.from({
                    length: pagination.last_page,
                })
                    .map((_, index) => index + 1)
                    .map((pageNumber) => (
                        <li key={`pageNumber${pageNumber}`}>
                            <button
                                onClick={() => goTo(pageNumber)}
                                className={clsx('inline-flex h-8 w-8 items-center justify-center hover:bg-gray-200', {
                                    'bg-white': pagination.current_page != pageNumber,
                                    'bg-primary-600 text-white': pagination.current_page == pageNumber,
                                })}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    ))}

                {pagination.current_page != pagination.last_page ? (
                    <li>
                        <button onClick={next} className="p-2 hover:bg-gray-200">
                            <ChevronRight />
                        </button>
                    </li>
                ) : null}
            </ul>
        </div>
    );
};

export default FullPagination;
