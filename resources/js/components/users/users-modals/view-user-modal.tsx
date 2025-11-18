import { Button } from '@/components/ui/button';
import CustomAvatar from '@/components/ui/custom-avatar';
import { Modal } from '@/components/ui/modal';
import { gendersMap, maritalStatusesMap, userStatusMap } from '@/components/users/users-meta';
import useAppStore from '@/store';
import { User, getFullName } from '@/store/User';
import { format } from 'date-fns';

export function ViewUserModal() {
    const name = 'view_user';
    const store = useAppStore();
    const user = store.user.current as User;

    const details = [
        { label: 'Statut', value: userStatusMap[user.status] },
        { label: 'Date de naissance', value: user.birth_date ? format(new Date(user.birth_date), 'yyyy-MM-dd') : 'N/A' },
        { label: 'Genre', value: user.gender ? gendersMap[user.gender as string] : 'N/A' },
        { label: 'Profession', value: user.profession || 'N/A' },
        { label: 'Adresse', value: user.address || 'N/A' },
        { label: 'Ville', value: user.city || 'N/A' },
        { label: 'Statut matrimonial', value: maritalStatusesMap[user.marital_status as string] || 'N/A' },
        { label: "Date d'adhésion", value: user.joined_at ? format(new Date(user.joined_at), 'yyyy-MM-dd') : 'N/A' },
    ];

    return (
        <>
            <Modal title="Détails de l'utilisateur" name={name} className="w-[800px] max-w-[800px]">
                <div className="flex px-8">
                    <div className="flex w-1/3 justify-center pr-8">
                        <div>
                            <CustomAvatar className="mx-auto h-36 w-36" user={user} />
                            <div className="mt-3 text-center">
                                <p className="font-semibold"> {getFullName(user)}</p>
                                <p className="text-gray-700">{user.phone_number}</p>
                                <p className="text-gray-700">{user.email}</p>
                                <Button className="mt-4">Contacter</Button>
                            </div>
                        </div>
                    </div>
                    <ul className="w-2/3">
                        {details.map((item) => (
                            <li key={item.label} className="flex justify-between border-b border-gray-200 py-2">
                                <div className="text-gray-600">{item.label}</div>
                                <div>{item.value}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </>
    );
}
