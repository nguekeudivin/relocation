import { addDays, addMonths, addWeeks, isSameDay, isSameMonth, isSameWeek, startOfMonth, startOfWeek } from 'date-fns';
import { useState } from 'react';

export type AgendaMode = 'day' | 'week' | 'month' | 'agenda';

export interface AgendaItem {
    startDate: Date;
    [key: string]: any; // Allow additional properties
}

interface UseAgendaProps {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
}

interface UseAgendaReturn {
    agendaMode: AgendaMode;
    setAgendaMode: React.Dispatch<React.SetStateAction<AgendaMode>>;
    changeAgendaDate: (increment: number) => void;
    filterAgendaData: (data: AgendaItem[]) => AgendaItem[];
}

export function useAgenda({ setCurrentDate, currentDate }: UseAgendaProps): UseAgendaReturn {
    const [agendaMode, setAgendaMode] = useState<AgendaMode>('week');

    const filterAgendaData = (data: AgendaItem[]): AgendaItem[] => {
        if (agendaMode === 'month') return data.filter((item) => isSameMonth(item.startDate, currentDate));
        if (agendaMode === 'week') return data.filter((item) => isSameWeek(item.startDate, currentDate));
        if (agendaMode === 'day') return data.filter((item) => isSameDay(item.startDate, currentDate));
        return data;
    };

    const changeAgendaDate = (increment: number) => {
        if (agendaMode === 'month') {
            setCurrentDate(addMonths(startOfMonth(currentDate), increment));
        }
        if (agendaMode === 'week') {
            setCurrentDate(addWeeks(startOfWeek(currentDate), increment));
        }
        if (agendaMode === 'day') {
            setCurrentDate(addDays(currentDate, increment));
        }
    };

    return { agendaMode, setAgendaMode, changeAgendaDate, filterAgendaData };
}
