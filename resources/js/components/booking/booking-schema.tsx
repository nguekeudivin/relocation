import { addDays, getDay, isBefore, startOfDay } from 'date-fns';
import { z } from 'zod';

const coerceDate = z.preprocess(
    (value) => {
        if (value instanceof Date) return value;
        if (typeof value === 'string' || typeof value === 'number') {
            const d = new Date(value);
            return isNaN(d.getTime()) ? undefined : d;
        }
        return undefined;
    },
    z.date({ required_error: 'A valid date is required.' }),
);
const requiredString = (field: string) => z.string({ required_error: `${field} is required.` }).min(1, `${field} cannot be empty.`);

export const CreateBookingFormSchema = [
    z.object({
        from_city: requiredString('Origin city'),
        from_street: requiredString('Origin address'),

        to_city: requiredString('Destination city'),
        to_street: requiredString('Destination address'),
    }),
    z.object({
        // date: coerceDate.refine((d) => !!d, 'Please select a valid date.'),
        time: coerceDate.refine((d) => !!d, 'Please select a valid time.'),
    }),
    z.object({
        duration: z.coerce
            .number({
                required_error: 'Duration is required',
                invalid_type_error: 'Duration must be a number',
            })
            .int({ message: 'Duration must be a whole number' })
            .min(2, { message: 'Duration must be at least 2 hours' }),
    }),
];

type ValidateTransportDateParams = {
    date: Date | string | number;
    t: (key: string, options?: Record<string, any>) => string;
};

type ValidationResult = { isValid: boolean; error: string };
export function validateTransportDate({ date, t }: ValidateTransportDateParams): ValidationResult {
    if (!date) {
        return { isValid: true, error: '' };
    }

    const selectedDate = startOfDay(new Date(date));
    const today = startOfDay(new Date());
    const dayOfWeek = getDay(selectedDate); // 0 = Sunday, 6 = Saturday

    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4; // Monday to Thursday
    const requiredDaysInAdvance = isWeekday ? 5 : 14;

    const minAllowedDate = addDays(today, requiredDaysInAdvance);

    if (isBefore(selectedDate, minAllowedDate)) {
        const periodKey = isWeekday ? 'weekday (Monday to Thursday)' : 'weekend (Friday to Sunday)';

        const error = t('Vehicle booking for a {{period}} job must be made at least {{days}} days in advance.', {
            period: t(periodKey),
            days: requiredDaysInAdvance,
        });

        return { isValid: false, error };
    }

    return { isValid: true, error: '' };
}

export const createEditBookingSchema = (t: any) => {
    return z.object({
        date: z
            .date({
                required_error: t('Please select a date'),
                invalid_type_error: t('Invalid date'),
            })
            .refine(
                (date) => {
                    const result = validateTransportDate({ date, t });
                    return result.isValid;
                },
                (date) => ({
                    message: validateTransportDate({ date: date!, t }).error || '',
                }),
            ),

        time: z.date({
            required_error: t('Please select a time'),
            invalid_type_error: t('Invalid time'),
        }),

        from_city: z.string().min(1, t('Pick-up city required')),

        from_street: z.string().min(1, t('Pick-up Street is required')),

        to_city: z.string().min(1, t('Delivery city required')),

        to_street: z.string().min(1, t('Delivery Street is required')),

        workers: z.coerce
            .number({ invalid_type_error: t('Number of workers must be a number') })
            .int(t('Number of workers must be an integer'))
            .min(1, t('At least 1 worker is required'))
            .max(50, t('Maximum 50 workers allowed')),

        duration: z.coerce.number({ invalid_type_error: t('Duration must be a number') }).min(2, t('Minimum duration is 2 hours')),

        transport_price: z.coerce.number().min(0),
    });
};
