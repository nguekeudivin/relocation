'use client';

import { ReactNode } from 'react';
import { CalendarContext } from './calendar-context';
import CalendarView from './calendar-view';

interface CalendarProps {
    items: any[];
    modes?: string[];
    renderItem: (item: any, index: number) => ReactNode;
    onCreate?: (startDate: any, endDate: any) => void;
    onEdit?: (item: any) => void;
}

export default function Calendar({ items, onCreate, onEdit, renderItem, modes }: CalendarProps) {
    return (
        <section className="w-full">
            <CalendarContext.Provider
                value={{
                    items,
                    modes: modes ? modes : ['month', 'week', 'day', 'agenda'],
                    startCreateItem: onCreate ? onCreate : () => {},
                    startEditItem: onEdit ? onEdit : () => {},
                    renderItemComponent: renderItem,
                }}
            >
                <CalendarView />
            </CalendarContext.Provider>
        </section>
    );
}
