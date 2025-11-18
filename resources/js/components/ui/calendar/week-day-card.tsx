import { cn, dateFromHourIndex } from '@/lib/utils';
import { addDays, addMinutes, differenceInMinutes } from 'date-fns';
import { useCalendar } from './calendar-context';

interface WeekDayCardItem {
    startDate: Date;
    endDate: Date;
    [key: string]: any; // additional fields
}

interface WeekDayCardProps {
    date: Date;
    items: WeekDayCardItem[];
}

export function WeekDayCard({ date, items }: WeekDayCardProps) {
    const { startCreateItem, renderItemComponent } = useCalendar();

    const hourHeight = 80;

    return (
        <>
            <div>
                <div
                    onClick={() => {
                        startCreateItem(dateFromHourIndex(0), addDays(dateFromHourIndex(0), 1));
                    }}
                    className="h-12 border-b border-gray-300 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                ></div>

                <div className="relative w-full">
                    <div className="w-full">
                        {Array.from({ length: 24 }).map((_, index) => (
                            <div
                                style={{ height: hourHeight }}
                                key={`dayhourtimes${index}`}
                                className={cn('border-0.5 border-b border-gray-300', {
                                    'bg-gray-100 dark:bg-gray-700': index % 2 === 0,
                                    'dark:border-gray-600': true,
                                })}
                            >
                                <div
                                    onClick={() => {
                                        const start = dateFromHourIndex(index);
                                        const end = addMinutes(start, 30);
                                        startCreateItem(start, end);
                                    }}
                                    className="flex h-[50%] items-center justify-center border-b border-gray-300 hover:bg-gray-200/50 dark:border-gray-600 dark:hover:bg-gray-600"
                                ></div>
                                <div
                                    onClick={() => {
                                        const start = addMinutes(dateFromHourIndex(index), 30);
                                        const end = addMinutes(start, 30);
                                        startCreateItem(start, end);
                                    }}
                                    className="h-[50%] hover:bg-gray-200 dark:hover:bg-gray-700"
                                ></div>
                            </div>
                        ))}
                    </div>

                    {items.map((item: WeekDayCardItem, index: number) => {
                        const startDate = new Date(item.startDate);
                        const top = hourHeight * startDate.getHours() + (hourHeight / 60) * startDate.getMinutes();

                        const height = (hourHeight / 60) * Math.abs(differenceInMinutes(item.startDate, item.endDate));

                        return (
                            <div key={`weekdayitem${index}`} className="absolute w-full" style={{ top: `${top}px`, height: `${height}px` }}>
                                {renderItemComponent(item, index)}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
