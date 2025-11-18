import { cn } from '@/lib/utils';
import { addDays, format, isSameDay, isSameMonth } from 'date-fns';
import { ReactNode, useState } from 'react';
import { useCalendar } from './calendar-context';
import { MonthDayCard } from './month-day-card';
import { WeekDayCard } from './week-day-card';

export type Mode = 'day' | 'week' | 'month' | 'agenda';

interface UseDaysProps {
    defaultMode?: Mode;
}

interface RenderFunction {
    (): ReactNode[];
}

export function useDays({ defaultMode = 'month' }: UseDaysProps) {
    const daysList: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'];

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<Mode>(defaultMode);
    const { items: data }: { items: any[] } = useCalendar();

    const computeMonthDates = (): Date[] => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();

        const dates: Date[] = [];

        const lastDayOfPrevMonth = new Date(year, month, 0);
        const daysInPrevMonth = lastDayOfPrevMonth.getDate();

        for (let i = startingDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const date = new Date(year, month - 1, day);
            dates.push(date);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            dates.push(date);
        }

        let totalCells = 35;
        if (dates.length > 35) totalCells = 42;

        const remainingCells = totalCells - (startingDay + daysInMonth);

        for (let i = 1; i <= remainingCells; i++) {
            const date = new Date(year, month + 1, i);
            dates.push(date);
        }

        return dates;
    };

    const computeWeekDates = (): Date[] => {
        const dates = computeMonthDates();
        const weeks: Date[][] = Array.from({ length: Math.ceil(dates.length / 7) })
            .map((_, i) => i + 1)
            .map((index) => [(index - 1) * 7, index * 7])
            .map(([i1, i2]) => dates.slice(i1, i2));

        const currentWeek = weeks.find((week) => week.find((date) => isSameDay(date, currentDate)) != undefined);

        return currentWeek ? currentWeek : [];
    };

    const render: RenderFunction = () => {
        let dates: Date[] = [];

        if (mode === 'month') dates = computeMonthDates();
        if (mode === 'week') dates = computeWeekDates();
        if (mode === 'day') dates = [currentDate];

        return dates.map((date: Date) => {
            const items: any[] = data.filter((item: any) => isSameDay(item.startDate, date));
            return (
                <div
                    key={format(date, 'MM-dd-yyyy')}
                    className={cn('cursor-pointer border-b border-l border-gray-300 transition-colors', {
                        'col-span-7': mode === 'day',
                        'min-h-32 overflow-auto': mode === 'month',
                        'min-h-screen': mode === 'week',
                        'text-muted-foreground': !isSameMonth(date, currentDate),
                        'font-bold': isSameMonth(date, currentDate),
                        'dark:border-gray-700': true,
                    })}
                >
                    <div
                        className={cn('h-full', {
                            'bg-secondary-100': isSameDay(currentDate, date),
                            'dark:bg-gray-800': isSameDay(currentDate, date),
                            'bg-white': !isSameDay(currentDate, date),
                            'dark:bg-gray-900': !isSameDay(currentDate, date),
                            'dark:text-gray-200': true,
                        })}
                    >
                        {mode === 'month' ? <MonthDayCard date={date} items={items} /> : <WeekDayCard date={date} items={items} />}
                    </div>
                </div>
            );
        });
    };

    const renderDayName = (dayName: string): string => {
        const currentDayIndex: number = daysList.indexOf(format(currentDate, 'EEEE'));
        const index: number = daysList.indexOf(dayName);
        const diff: number = index - currentDayIndex;

        const date: Date = addDays(currentDate, diff);

        return mode === 'week' ? format(date, 'EEE M/d') : dayName;
    };

    return {
        render,
        setMode,
        mode,
        currentDate,
        setCurrentDate,
        daysList,
        renderDayName,
    };
}
