import { format } from 'date-fns';
import { CalendarMinus2, Minus } from 'lucide-react';

const colors: any = {
    '': '',
};

export default function Agenda({ items }: any) {
    if (items.length == 0)
        return (
            <div className="flex min-h-[600px] items-center justify-center">
                <div className="text-center">
                    <CalendarMinus2 className="mx-auto h-24 w-24 text-gray-200" />
                    <p className="text-muted-foreground mt-4 text-center text-xl">No schedules do display</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-[600px]">
            {items.map((item: any, index: number) => {
                const prevItem = items[index - 1];
                let displayDateHeader = true;
                if (prevItem) {
                    displayDateHeader = format(item.startDate, 'MM-dd-yyyy') != format(prevItem.startDate, 'MM-dd-yyyy');
                }

                return (
                    <div key={`agendaitem${index}`}>
                        {displayDateHeader && (
                            <div className="flex items-center justify-between bg-gray-100 px-6 py-2 font-semibold">
                                <span>{format(item.startDate, 'EEEE')}</span>
                                <span>{format(item.startDate, 'MMMM dd, yyy')}</span>
                            </div>
                        )}

                        <div className="flex items-center px-6 py-2">
                            <div className="flex items-center gap-1">
                                <span className="text-gray-700">{format(item.startDate, 'hh:mm a').toLocaleLowerCase()}</span>
                                <Minus className="h-2 w-2" />
                                <span className="text-gray-700">{format(item.endDate, 'hh:mm a').toLocaleLowerCase()}</span>
                            </div>
                            <div className="ml-8 flex items-center">
                                <div style={{ backgroundColor: colors[item.label] }} className="h-3 w-3 rounded-full"></div>
                                <div className="ml-4 text-gray-700">{item.name}</div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
