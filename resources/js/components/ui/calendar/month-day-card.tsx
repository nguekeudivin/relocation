import { addHours, format, startOfDay } from 'date-fns';
import { useCalendar } from './calendar-context';

export function MonthDayCard({ date, items }: any) {
    const { startCreateItem, renderItemComponent } = useCalendar();

    return (
        <div
            className="h-full"
            onClick={() => {
                startCreateItem(startOfDay(date), addHours(startOfDay(date), 1));
            }}
        >
            <div className="px-4 pt-4 pb-2 text-end">{format(date, 'dd')}</div>
            <div className="space-y-2 p-2 pt-0">{items.map((item: any, index: number) => renderItemComponent(item, index))}</div>
        </div>
    );
}
