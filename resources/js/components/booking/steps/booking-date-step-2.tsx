import DatePicker from '@/components/ui/datepicker';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { format, isEqual } from 'date-fns';
import { useState } from 'react';

function generateTimeSlots(date: Date = new Date(), start: string = '08:00', end: string = '18:00', interval: number = 30): Date[] {
    const slots: Date[] = [];

    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0);

    const [startHour, startMinute] = start.split(':').map(Number);
    const current = new Date(baseDate);
    current.setHours(startHour, startMinute, 0, 0);

    const [endHour, endMinute] = end.split(':').map(Number);
    const endTime = new Date(baseDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    if (endTime < current) {
        endTime.setDate(endTime.getDate() + 1);
    }

    while (current <= endTime) {
        slots.push(new Date(current));
        current.setTime(current.getTime() + interval * 60 * 1000);
    }

    return slots;
}
interface Props {
    form: any;
    showError?: boolean;
}

export default function BookingDateStep({ form, showError = true }: Props) {
    const { t } = useTranslation();
    const store = useAppStore();
    const [date, setDate] = useState<string>(form.values.date.toISOString().split('T')[0]);
    const [times, setTimes] = useState<any[]>(generateTimeSlots(form.values.date, '08:00', '18:00'));

    return (
        <>
            <h3 className="text-lg font-semibold">{t('When and at what time ?')}</h3>
            <Show when={showError}>{store.errors.render()}</Show>

            <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-5 md:gap-12">
                <div className="text-sm md:col-span-3">
                    <DatePicker
                        className="w-auto p-0"
                        limitLeft={new Date()}
                        date={date}
                        onPick={(date) => {
                            if (form.values.time) {
                                date.setHours(form.values.time.getHours());
                                date.setMinutes(form.values.time.getMinutes());
                            }
                            form.setValue('date', date);
                            setDate(date.toISOString().split('T')[0]);
                        }}
                    />
                </div>
                <Show when={form.values.date}>
                    <ul className="grid grid-cols-3 gap-4 md:col-span-2 md:grid-cols-3">
                        {times.map((item, index) => (
                            <li
                                key={`time${index}`}
                                onClick={() => {
                                    const date = new Date(form.values.date);
                                    date.setHours(item.getHours());
                                    date.setMinutes(item.getMinutes());
                                    form.setValue('date', date);
                                    form.setValue('time', item);
                                }}
                                className={cn(
                                    'inline-flex cursor-pointer items-center justify-center border border-gray-200 px-4 py-2 text-center text-sm',
                                    {
                                        'bg-primary-500 border-primary-500 text-white': isEqual(form.values.time, item),
                                    },
                                )}
                            >
                                {format(item, 'HH:mm')}
                            </li>
                        ))}
                    </ul>
                </Show>
            </div>

            <div className="h-8 md:h-20"></div>
        </>
    );
}
