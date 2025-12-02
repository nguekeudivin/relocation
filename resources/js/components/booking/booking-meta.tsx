import TableActions from '@/components/shared/table-actions';
import useTranslation from '@/hooks/use-translation';
import { formatDate } from '@/lib/utils';
import { Booking } from '@/store/Booking';

export const BookingStatusMap: any = {
    waiting_payment: 'Waiting Payment',
    paid: 'Paid',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
};

export const BookingStatusColors: any = {
    waiting_payment: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
};

export const BookingCarTypeMap: any = {
    van: 'Van',
    bus: 'Bus',
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
