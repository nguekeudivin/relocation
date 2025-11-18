import { createContext, ReactNode, useContext } from 'react';

interface CalendarContextType {
    items: any[];
    modes: string[];
    startCreateItem: (startDate: any, endDate: any) => void;
    startEditItem: (item: any) => void;
    renderItemComponent: (item: any, index: number) => ReactNode;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = (): CalendarContextType => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};
