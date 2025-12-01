'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

type HighlightedDates = Set<string>;

interface CustomerCalendarProps {
    date?: string;
    limitLeft?: Date;
    limitRight?: Date;
    onPick: (date: any) => void;
    className?: string;
}

export default function DatePicker({ date, limitLeft, limitRight, onPick, className }: CustomerCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightedDate, setHighlightedDate] = useState<string | undefined>(date);

    // Helpers to check if we can go to prev/next month
    const canGoPrev = () => {
        if (!limitLeft) return true;
        // Only allow going back if the previous month is >= limitLeft month
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(currentDate.getMonth() - 1);
        return (
            prevMonth.getFullYear() > limitLeft.getFullYear() ||
            (prevMonth.getFullYear() === limitLeft.getFullYear() && prevMonth.getMonth() >= limitLeft.getMonth())
        );
    };

    const canGoNext = () => {
        if (!limitRight) return true;
        // Only allow going forward if the next month is <= limitRight month
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        return (
            nextMonth.getFullYear() < limitRight.getFullYear() ||
            (nextMonth.getFullYear() === limitRight.getFullYear() && nextMonth.getMonth() <= limitRight.getMonth())
        );
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && !canGoPrev()) return;
        if (direction === 'next' && !canGoNext()) return;

        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
        setCurrentDate(newDate);
    };

    // Function to render the calendar grid
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();

        const calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0];
            //const isHighlighted = highlightedDates.has(dateString);
            const isHighlighted = highlightedDate === dateString;

            // Check if date is before limitLeft or after limitRight
            const isBeforeLimitLeft = limitLeft ? date < startOfDay(limitLeft) : false;
            const isAfterLimitRight = limitRight ? date > startOfDay(limitRight) : false;

            const isDisabled = isBeforeLimitLeft || isAfterLimitRight;

            calendarDays.push(
                <div
                    key={dateString}
                    onClick={() => {
                        if (!isDisabled) {
                            onPick(date);
                            setHighlightedDate(dateString);
                            //highlight((items) => new Set([...items, date]));
                        }
                    }}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-center transition-colors ${isDisabled ? 'cursor-not-allowed text-gray-400' : ''} ${isHighlighted && !isDisabled ? 'bg-primary-500 text-white' : ''} ${!isHighlighted && !isDisabled ? 'hover:bg-primary-300' : ''} `}
                >
                    {i}
                </div>,
            );
        }

        return calendarDays;
    };

    // Helper to zero out time for date comparison
    function startOfDay(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    return (
        <div className={cn('w-[400px] bg-white p-4', className)}>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{currentDate.toLocaleString('default', { month: 'long' })}</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => changeMonth('prev')}
                        disabled={!canGoPrev()}
                        className={`rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-900 ${
                            !canGoPrev() ? 'cursor-not-allowed opacity-50 hover:text-gray-600' : ''
                        }`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => changeMonth('next')}
                        disabled={!canGoNext()}
                        className={`rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-900 ${
                            !canGoNext() ? 'cursor-not-allowed opacity-50 hover:text-gray-600' : ''
                        }`}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="mt-2 grid w-full grid-cols-7 gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="flex items-center text-center font-medium text-gray-700">
                        {day}
                    </div>
                ))}
                {renderCalendar()}
            </div>
        </div>
    );
}
