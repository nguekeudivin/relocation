import DatePicker from '@/components/ui/datepicker';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface Props {
    form: any;
    showError?: boolean;
}

function generateTimeSlots(date: Date = new Date(), start: string = '08:00', end: string = '21:00', interval: number = 30): Date[] {
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

export default function BookingDateStep({ form, showError = true }: Props) {
    const { t } = useTranslation();
    const store = useAppStore();

    const [date, setDate] = useState<string>(form.values.date.toISOString().split('T')[0]);
    const [times, setTimes] = useState<Date[]>([]);

    useEffect(() => {
        setTimes(generateTimeSlots(new Date(date)));
    }, [date, store.slot.items]);

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
                        disabledDates={[]}
                        onPick={(pickedDate) => {
                            if (form.values.time) {
                                pickedDate.setHours(form.values.time.getHours());
                                pickedDate.setMinutes(form.values.time.getMinutes());
                            }
                            form.setValue('date', pickedDate);
                            setDate(pickedDate.toISOString().split('T')[0]);
                        }}
                    />
                </div>

                <Show when={times.length > 0}>
                    <ul className="grid grid-cols-3 gap-4 md:col-span-2 md:grid-cols-3">
                        {times.map((item, index) => {
                            let isEqual = false;
                            if (form.values.time) {
                                isEqual = item.getHours() == form.values.time.getHours() && item.getMinutes() == form.values.time.getMinutes();
                            }
                            return (
                                <li
                                    key={`time${index}`}
                                    onClick={() => {
                                        const dateObj = new Date(form.values.date);
                                        dateObj.setHours(item.getHours());
                                        dateObj.setMinutes(item.getMinutes());
                                        form.setValue('date', dateObj);
                                        form.setValue('time', item);
                                    }}
                                    className={cn(
                                        'inline-flex cursor-pointer items-center justify-center border border-gray-200 px-4 py-2 text-center text-sm',
                                        {
                                            'bg-primary-500 border-primary-500 text-white': isEqual,
                                        },
                                    )}
                                >
                                    {format(item, 'HH:mm')}
                                </li>
                            );
                        })}
                    </ul>
                </Show>
            </div>

            <div className="h-8 md:h-20"></div>
        </>
    );
}
