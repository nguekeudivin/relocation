import { Modal } from '@/components/ui/modal';
import useAppStore from '@/store';

export function ModalBluePrint() {
    const store = useAppStore();

    return (
        <Modal title="Select a profile" name="ModalBluePrint" className="w-[400px] max-w-[400px]">
            <div className="px-8 py-8"></div>
        </Modal>
    );
}
