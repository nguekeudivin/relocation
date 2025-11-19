import TableActions from '@/components/common/TableActions';
import { formatDate } from '@/lib/utils';
import { getFullName, User } from '@/store/User';
import Avatar from '../ui/avatar';

export const userStatusMap: any = {
    active: 'Actif',
    inactive: 'Inactif',
    banned: 'Banni',
};

export const userStatusOptions: any = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'banned', label: 'Banni' },
];

export const maritalStatusesMap: any = {
    single: 'Célibataire',
    married: 'Marié(e)',
    widowed: 'Veuf / Veuve',
    divorced: 'Divorcé(e)',
};

export const maritalStatusesOptions = [
    { value: 'single', label: 'Célibataire' },
    { value: 'married', label: 'Marié(e)' },
    { value: 'widowed', label: 'Veuf / Veuve' },
    { value: 'divorced', label: 'Divorcé(e)' },
];

export const gendersOptions: any = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
];

export const gendersMap: any = {
    male: 'Homme',
    female: 'Femme',
};

export const UsersTableColumns = ({ onView, onEdit, onDelete }: { onView?: any; onEdit?: any; onDelete?: any }) => {
    return [
        {
            header: 'Nom',
            name: 'name',
            row: (item: User) => (
                <div className="flex items-center gap-2">
                    <div onClick={() => onView(item)} className="cursor-pointer">
                        <Avatar name={item.first_name} url={undefined} className="h-12 w-12 hover:border-1 hover:border-blue-200" />
                    </div>

                    <div className="text-gray-800">
                        <p onClick={() => onView(item)} className="cursor-pointer hover:text-blue-800 hover:underline">
                            {getFullName(item)}
                        </p>
                        <p className="text-gray-500"> {item.email}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Phone number',
            name: 'phone_number',
            row: (item: User) => <span>{item.phone_number}</span>,
        },

        {
            header: 'First booking at',
            name: 'created_at',
            row: (item: User) => <span>{formatDate(item.created_at)}</span>,
        },
        {
            header: 'Actions',
            name: 'actions',
            row: (item: User) => <TableActions item={item} resourceName="users" onView={onView} onEdit={onEdit} canEdit={true} />,
        },
    ];
};
