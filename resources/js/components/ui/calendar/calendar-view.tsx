'use client';

import { Display } from '@/components/ui/display';
import { cn, dateFromHourIndex } from '@/lib/utils';
import { addDays, addMonths, addWeeks, format, subDays, subMonths, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import Agenda from './agenda';
import { useCalendar } from './calendar-context';
import { useAgenda } from './use-agenda';
import { useDays } from './use-days';

export default function CalendarView() {
    const { items, modes } = useCalendar();

    const { render, setMode, mode, currentDate, setCurrentDate, daysList, renderDayName } = useDays({
        defaultMode: 'month',
    });

    const { setAgendaMode, changeAgendaDate, filterAgendaData } = useAgenda({
        currentDate,
        setCurrentDate,
    });

    const previousDate = () => {
        if (mode == 'week') setCurrentDate(subWeeks(currentDate, 1));
        if (mode == 'month') setCurrentDate(subMonths(currentDate, 1));
        if (mode == 'day') setCurrentDate(subDays(currentDate, 1));
        if (mode == 'agenda') changeAgendaDate(-1);
    };

    const nextDate = () => {
        if (mode == 'week') setCurrentDate(addWeeks(currentDate, 1));
        if (mode == 'month') setCurrentDate(addMonths(currentDate, 1));
        if (mode == 'day') setCurrentDate(addDays(currentDate, 1));
        if (mode == 'agenda') changeAgendaDate(1);
    };

    useEffect(() => {
        if (window) {
            window.onresize = () => {
                if (window.innerWidth < 768) {
                    setMode('agenda');
                }
            };
        }
    }, []);

    const modesMap: Record<string, string> = {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        agenda: 'Agenda',
    };

    return (
        <div className="rounded-xl bg-white shadow-xl dark:bg-gray-800">
            <header className="flex flex-wrap items-center justify-between gap-2 p-6 text-lg text-gray-900 dark:text-gray-100">
                <div className="flex gap-4">
                    <Display cond={modes.length != 0}>
                        <select
                            defaultValue="month"
                            onChange={(e) => {
                                setMode(e.target.value as any);
                            }}
                            className="w-[120px] rounded-md border border-gray-200 bg-gray-100 p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        >
                            {modes.map((item: string) => (
                                <option value={item}>{modesMap[item]}</option>
                            ))}
                        </select>
                    </Display>

                    <Display cond={mode === 'agenda'} className="flex items-center gap-2">
                        <span>of the</span>
                        <select
                            defaultValue="month"
                            onChange={(e) => {
                                setAgendaMode(e.target.value as any);
                            }}
                            className="w-[120px] rounded-md border border-gray-200 p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        >
                            {modes
                                .filter((item: string) => item != 'agenda')
                                .map((item: string) => (
                                    <option value={item}>{modesMap[item]}</option>
                                ))}
                        </select>
                    </Display>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-lg">
                        <button
                            onClick={previousDate}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ChevronLeft className="text-gray-900 dark:text-gray-100" />
                        </button>
                        <span>{format(currentDate, 'EEEE MMM dd, yyyy')}</span>
                        <button
                            onClick={nextDate}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ChevronRight className="text-gray-900 dark:text-gray-100" />
                        </button>
                    </div>
                </div>
                <div></div>
            </header>

            <section id="calendar-container" className="overflow-auto bg-white dark:bg-gray-800">
                {mode === 'agenda' ? (
                    <Agenda items={filterAgendaData(items)} />
                ) : (
                    <div id="calendar" className="flex">
                        <aside className="w-full">
                            <div className="flex h-12 items-center border-b border-gray-300 dark:border-gray-700">
                                <Display cond={mode !== 'month'}>
                                    <div className="w-[80px]"></div>
                                </Display>
                                <Display cond={mode === 'day'} className="flex w-full items-center justify-center text-center text-lg font-semibold">
                                    {renderDayName(format(currentDate, 'EEEE'))}
                                </Display>

                                <Display cond={mode !== 'day'} className="grid w-full grid-cols-7 gap-4">
                                    {daysList.map((day) => (
                                        <div
                                            key={day}
                                            className="flex items-center justify-center text-center text-lg font-semibold text-gray-900 dark:text-gray-100"
                                        >
                                            {renderDayName(day)}
                                        </div>
                                    ))}
                                </Display>
                            </div>
                            <div className="flex">
                                <Display cond={mode !== 'month'} className="w-[80px]">
                                    <div className="flex h-12 items-center justify-center border-b border-gray-300 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                                        All day
                                    </div>
                                    {Array.from({ length: 24 }).map((_, index) => (
                                        <div
                                            key={`daytimes${index}`}
                                            className={cn('h-[80px] border-b border-gray-300 dark:border-gray-700', {
                                                'bg-gray-100 dark:bg-gray-700': index % 2 === 0,
                                            })}
                                        >
                                            <div className="flex h-[50%] items-center justify-center border-b border-gray-300 text-gray-900 dark:border-gray-700 dark:text-gray-100">
                                                {format(dateFromHourIndex(index), 'ha').toLowerCase()}
                                            </div>
                                            <div></div>
                                        </div>
                                    ))}
                                </Display>
                                <div className="grid w-full grid-cols-7">{render()}</div>
                            </div>
                        </aside>
                    </div>
                )}
            </section>
        </div>
    );
}
