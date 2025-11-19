import TableActions from '@/components/shared/table-actions';
import useTranslation from '@/hooks/use-translation';
import { formatDate } from '@/lib/utils';
import { Booking } from '@/store/Booking';
import { z } from 'zod';

// --- Helpers ------------------------------------------------
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
const positiveInt = (field: string) =>
    z
        .number({
            required_error: `${field} is required.`,
            invalid_type_error: `${field} must be a number.`,
        })
        .int(`${field} must be an integer.`);

// ------------------------------------------------------------

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
];

// --- Table Columns (Translated - uses t() hook) ---
export const BookingTableColumns = ({ onView, onEdit, onDelete }: { onView?: any; onEdit?: any; onDelete?: any }) => {
    const { t } = useTranslation();

    return [
        {
            header: t('Date & Time'),
            name: 'date',
            row: (booking: Booking) => (
                <div onClick={() => onView(booking)} className="cursor-pointer hover:text-blue-800 hover:underline">
                    <div>{formatDate(booking.date)}</div>
                    {/* <div className="text-xs text-gray-600">{formatDate(booking.date)}</div> */}
                </div>
            ),
        },
        {
            header: t('Origin'),
            name: 'origin',
            row: (booking: Booking) => <span className="font-medium">{booking.origin?.name || booking.origin_id}</span>,
        },
        {
            header: t('Destination'),
            name: 'destination',
            row: (booking: Booking) => <span className="font-medium">{booking.destination?.name || booking.destination_id}</span>,
        },
        {
            header: t('Workers'),
            name: 'workers',
            row: (booking: Booking) => <span>{booking.workers}</span>,
        },
        {
            header: t('Cars'),
            name: 'cars',
            row: (booking: Booking) => <span>{booking.cars ?? 0}</span>,
        },
        {
            header: t('Duration'),
            name: 'duration',
            row: (booking: Booking) => <span>{booking.duration} h</span>,
        },
        {
            header: t('Amount'),
            name: 'amount',
            row: (booking: Booking) => <span className="font-semibold">{booking.amount}</span>,
        },
        {
            header: t('Actions'),
            name: 'actions',
            row: (booking: Booking) => <TableActions item={booking} resourceName="bookings" onView={onView} onEdit={onEdit} onDelete={onDelete} />,
        },
    ];
};
