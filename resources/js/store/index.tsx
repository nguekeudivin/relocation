import { useDisplay } from '@/hooks/use-display';
import { useErrors } from '@/hooks/use-errors';
import { useLoading } from '@/hooks/use-loading';
import { useAsset } from './Asset';
import { useBooking } from './Booking';
import { useCategory } from './Category';
import { useNotification } from './Notification';
import { usePayment } from './Payment';
import { useSetting } from './Setting';
import { useSlot } from './Slot';
import { useUser } from './User';

export default function useAppStore() {
    const assetStore = useAsset();
    const categoryStore = useCategory();
    const userStore = useUser();
    const paymentStore = usePayment();
    const settingStore = useSetting();
    const notificationStore = useNotification();
    const booking = useBooking();
    const slot = useSlot();
    const errors = useErrors();
    const loading = useLoading();
    const display = useDisplay();

    return {
        asset: assetStore,
        category: categoryStore,
        user: userStore,
        payment: paymentStore,
        setting: settingStore,
        notification: notificationStore,
        booking,
        slot,
        errors,
        loading,
        display,
    };
}
