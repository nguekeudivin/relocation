import { addDays, addHours, getDay, isBefore, startOfDay } from 'date-fns';
import { z } from 'zod';

export const CreateBookingFormSchema = (t: any, formValues: any) => [
    z.object({
        from_city: z.string({ required_error: t(`Pick-up city  is required.`) }).min(1, t(`Pick-up city  is required.`)),
        from_street: z.string({ required_error: t(`Pick-up street is required.`) }).min(1, t(`Pick-up street is required.`)),
        from_postal_code: z.string({ required_error: t(`Pick-up postal code is required.`) }).min(1, t(`Pick-up postal code is required.`)),
        to_city: z.string({ required_error: t(`Delivery city is required.`) }).min(1, t(`Delivery city is required.`)),
        to_street: z.string({ required_error: t(`Delivery street is required.`) }).min(1, t(`Delivery street is required.`)),
        to_postal_code: z.string({ required_error: t(`Delivery postal code is required.`) }).min(1, t(`Delivery postal code is required.`)),
    }),
    z.object({
        date: z
            .date({
                required_error: t('Please select a date. Make sure to select the date and the day.'),
                invalid_type_error: t('Invalid date'),
            })
            .refine(
                (selectedDate) => {
                    // On récupère la date + heure complète (date + time) depuis les valeurs du formulaire
                    const timeValue = formValues.date; // doit être un objet Date valide
                    if (!timeValue || !(timeValue instanceof Date) || isNaN(timeValue.getTime())) {
                        return false;
                    }

                    // On combine la partie "date" sélectionnée avec l'heure sélectionnée
                    const fullDateTime = new Date(selectedDate);
                    fullDateTime.setHours(timeValue.getHours(), timeValue.getMinutes(), timeValue.getSeconds(), timeValue.getMilliseconds());

                    // On compare avec maintenant + 4h
                    const minAllowed = addHours(new Date(), 4);

                    return fullDateTime >= minAllowed;
                },
                {
                    message: t('The selected date and time must be at least 4 hours from now.'),
                },
            ),
        time: z.date({ required_error: t('Select a the time.') }),
    }),
    z.object({
        date: z
            .date({
                required_error: t('Please select a date. Make sure to select the date and the day.'),
                invalid_type_error: t('Invalid date'),
            })
            // On garde ta validation personnalisée existante si tu en as besoin
            .refine(
                (date) => {
                    const result = validateTransportDate({ date, t, formValues });
                    return result.isValid;
                },
                (date) => ({
                    message: validateTransportDate({ date: date!, t, formValues }).error || '',
                }),
            ),

        duration: z.coerce
            .number({
                required_error: t('Duration is required'),
                invalid_type_error: t('Duration must be a number'),
            })
            .int({ message: t('Duration must be a whole number') })
            .min(2, { message: t('Duration must be at least 2 hours') }),
    }),
];

type ValidateTransportDateParams = {
    date: Date | string | number;
    t: (key: string, options?: Record<string, any>) => string;
    formValues: any;
};

type ValidationResult = { isValid: boolean; error: string };
export function validateTransportDate({ date, t, formValues }: ValidateTransportDateParams): ValidationResult {
    if (!date || formValues.car_type === undefined) {
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

        const error = t('Vehicle booking for a :period job must be made at least :days days in advance.', {
            period: t(periodKey),
            days: requiredDaysInAdvance,
        });

        return { isValid: false, error };
    }

    return { isValid: true, error: '' };
}

export const createEditBookingSchema = (t: any, formValues: any) => {
    return z.object({
        date: z
            .date({
                required_error: t('Please select a date'),
                invalid_type_error: t('Invalid date'),
            })
            .refine(
                (date) => {
                    const result = validateTransportDate({ date, t, formValues });
                    return result.isValid;
                },
                (date) => ({
                    message: validateTransportDate({ date: date!, t, formValues }).error || '',
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
