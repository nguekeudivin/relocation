import { CreateSlotModal } from "./create-slot-modal";
import { EditSlotModal } from "./edit-slot-modal";
import { ViewSlotModal } from "./view-slot-modal";
import { DeleteSlotModal } from "./delete-slot-modal";

export function SlotModals() {
  return (
    <>
      <CreateSlotModal />
      <EditSlotModal />
      <ViewSlotModal />
      <DeleteSlotModal />
    </>
  );
}
