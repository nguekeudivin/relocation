import { Modal } from '@/components/ui/modal';
import useAppStore from '@/store';
import { Profile } from '@/store/User';
import { router, usePage } from '@inertiajs/react';

export function SelectProfileModal() {
    const store = useAppStore();
    const { auth } = usePage<any>().props;

    return (
        <Modal title="Selectionne un profile" name="SelectProfileModal" className="w-[500px] max-w-[500px]">
            <div className="px-8 py-6">
                <div className="space-y-4">
                    {auth.profiles.map((item: Profile) => (
                        <div
                            onClick={() => {
                                store.display.hide('SelectProfileModal');
                                router.visit(`/profile/change/${item.role_id}`);
                            }}
                            className="hover:border-primary-600 block rounded-lg border-2 border-gray-300 p-4"
                        >
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
