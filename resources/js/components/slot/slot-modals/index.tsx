import { CreateManySlotModal } from './create-many-slot-modal';
import { DeleteSlotModal } from './delete-slot-modal';
import { EditSlotModal } from './edit-slot-modal';
import { ViewSlotModal } from './view-slot-modal';

export function SlotModals() {
    return (
        <>
            <EditSlotModal />
            <ViewSlotModal />
            <DeleteSlotModal />
            <CreateManySlotModal />
        </>
    );
}
