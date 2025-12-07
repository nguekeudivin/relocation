import TableActions from '@/components/shared/table-actions';
import useTranslation from '@/hooks/use-translation';
import { formatDate } from '@/lib/utils';
import { Booking } from '@/store/Booking';

export const BookingStatusMap: any = {
    pending: 'Waiting Payment',
    completed: 'Completed',
    paid: 'Paid',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
};

export const BookingStatusColors: any = {
    pending: 'bg-orange-800 text-white',
    paid: 'bg-green-700 text-white',
    confirmed: 'bg-blue-700 text-white',
    cancelled: 'bg-red-700 text-white',
    completed: 'bg-sky-700 text-white',
    rejected: 'bg-red-700 text-white',
};

export const BookingCarTypeMap: any = {
    van: 'van',
    bus: 'bus',
};

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
            header: t('Vehicle'),
            name: 'car_type',
            row: (booking: Booking) => <span>{BookingCarTypeMap[booking.car_type]}</span>,
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
