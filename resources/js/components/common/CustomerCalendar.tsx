import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import CustomSelect from './CustomSelect';

// Define the type for highlighted dates
type HighlightedDates = Set<string>;

interface CustomerCalendarProps {
    dates: string[];
}

export default function CustomerCalendar({ dates }: CustomerCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState<HighlightedDates>(new Set(dates));

    // Function to handle month navigation
    const changeMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
        setCurrentDate(newDate);
    };

    // Function to handle year change
    const changeYear = (year: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
    };

    // Function to handle date highlighting
    const toggleHighlightDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0]; // Convert date to YYYY-MM-DD format
        const newHighlightedDates = new Set(highlightedDates);

        if (newHighlightedDates.has(dateString)) {
            newHighlightedDates.delete(dateString);
        } else {
            newHighlightedDates.add(dateString);
        }

        setHighlightedDates(newHighlightedDates);
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

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateString = date.toISOString().split('T')[0];
            const isHighlighted = highlightedDates.has(dateString);

            calendarDays.push(
                <div
                    key={dateString}
                    className={`h-8 w-8 cursor-pointer rounded rounded-full text-center transition-colors ${
                        isHighlighted ? 'bg-primary-600 flex items-center justify-center text-white' : 'hover:bg-secondary'
                    }`}
                    // onClick={() => toggleHighlightDate(date)}
                >
                    {i}
                </div>,
            );
        }

        return calendarDays;
    };

    // Generate a list of years for the dropdown
    const years = Array.from({ length: 31 }, (_, i) => 2000 + i); // 2000 to 2030

    return (
        <div className="">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">{currentDate.toLocaleString('default', { month: 'long' })}</h2>
                    <CustomSelect
                        value={currentDate.getFullYear()}
                        onChange={(e: any) => changeYear(parseInt(e.target.value))}
                        className="w-[100px] rounded border border-gray-200 px-2 py-1"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </CustomSelect>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => changeMonth('prev')} className="rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-900">
                        <ChevronLeft />
                    </button>
                    <button onClick={() => changeMonth('next')} className="rounded-md bg-gray-100 p-2 text-gray-600 hover:text-gray-900">
                        <ChevronRight />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-4">
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
