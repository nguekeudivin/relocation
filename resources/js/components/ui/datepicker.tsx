'use client';

import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CustomerCalendarProps {
    date?: string;
    limitLeft?: Date;
    limitRight?: Date;
    disabledDates?: string[]; // ← NEW: list of ISO dates that cannot be selected
    onPick: (date: any) => void;
    className?: string;
}

export default function DatePicker({ date, limitLeft, limitRight, disabledDates = [], onPick, className }: CustomerCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightedDate, setHighlightedDate] = useState<string | undefined>(date);
    const { t } = useTranslation();

    // Convert array to Set for fast lookup
    const disabledSet = new Set(disabledDates);

    const canGoPrev = () => {
        if (!limitLeft) return true;
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(currentDate.getMonth() - 1);
        return (
            prevMonth.getFullYear() > limitLeft.getFullYear() ||
            (prevMonth.getFullYear() === limitLeft.getFullYear() && prevMonth.getMonth() >= limitLeft.getMonth())
        );
    };

    const canGoNext = () => {
        if (!limitRight) return true;
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        return (
            nextMonth.getFullYear() < limitRight.getFullYear() ||
            (nextMonth.getFullYear() === limitRight.getFullYear() && nextMonth.getMonth() <= limitRight.getMonth())
        );
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        if ((direction === 'prev' && !canGoPrev()) || (direction === 'next' && !canGoNext())) return;
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
        setCurrentDate(newDate);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();

        const calendarDays = [];

        for (let i = 0; i < startingDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i); // ← local date, correct

            // CORRECT way — no timezone conversion!
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            // → "2025-12-08" always matches the actual day shown

            const isHighlighted = highlightedDate === dateString;

            const isBeforeLimitLeft = limitLeft ? dateObj < startOfDay(limitLeft) : false;
            const isAfterLimitRight = limitRight ? dateObj > startOfDay(limitRight) : false;
            const isDisabled = isBeforeLimitLeft || isAfterLimitRight || disabledSet.has(dateString);

            calendarDays.push(
                <div
                    key={dateString}
                    onClick={() => {
                        if (!isDisabled) {
                            onPick(dateObj);
                            setHighlightedDate(dateString);
                        }
                    }}
                    className={cn(
                        'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-center transition-colors',
                        isDisabled ? 'cursor-not-allowed text-gray-400' : '',
                        isHighlighted && !isDisabled ? 'bg-primary-500 text-white' : '',
                        !isHighlighted && !isDisabled ? 'hover:bg-primary-300 bg-primary-100' : '',
                    )}
                >
                    {i}
                </div>,
            );
        }

        return calendarDays;
    };

    function startOfDay(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    return (
        <div className={cn('w-[400px] bg-white p-4', className)}>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{t(currentDate.toLocaleString('default', { month: 'long' }))}</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => changeMonth('prev')}
                        disabled={!canGoPrev()}
                        className={cn(
                            'rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-900',
                            !canGoPrev() ? 'cursor-not-allowed opacity-50 hover:text-gray-600' : '',
                        )}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => changeMonth('next')}
                        disabled={!canGoNext()}
                        className={cn(
                            'rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-900',
                            !canGoNext() ? 'cursor-not-allowed opacity-50 hover:text-gray-600' : '',
                        )}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="mt-2 grid w-full grid-cols-7 gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="flex items-center text-center font-medium text-gray-700">
                        {t(day)}
                    </div>
                ))}
                {renderCalendar()}
            </div>
        </div>
    );
}
