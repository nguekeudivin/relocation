import DatePicker from '@/components/ui/datepicker';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { format, isEqual } from 'date-fns';
import { useState } from 'react';

function generateTimeSlots(start = '08:00', end = '18:00') {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const slots = [];
    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
        slots.push(new Date(current));
        current = new Date(current.getTime() + 30 * 60 * 1000); // +30 min
    }

    return slots;
}

export default function BookingDateStep({ form }: { form: any }) {
    const { t } = useTranslation();
    const store = useAppStore();
    const [date, setDate] = useState<string>(form.values.date.toISOString().split('T')[0]);
    const times = generateTimeSlots('08:00', '18:00'); // Working hours

    return (
        <>
            <h3 className="text-lg font-semibold">{t('When and at what time ?')}</h3>
            <>{store.errors.render()}</>
            <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-5 md:gap-12">
                <div className="text-sm md:col-span-3">
                    <DatePicker
                        className="w-auto p-0"
                        limitLeft={new Date()}
                        date={date}
                        onPick={(date) => {
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
                                    form.setValue('time', item);
                                }}
                                className={cn('cursor-pointer border border-gray-200 px-4 py-2', {
                                    'bg-primary-500 border-primary-500 text-white': isEqual(form.values.time, item),
                                })}
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
