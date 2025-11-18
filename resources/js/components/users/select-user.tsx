import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { getFullName, User } from '@/store/User';
import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomAvatar from '../ui/custom-avatar';
import { InputField } from '../ui/form';

interface SelectUserProps {
    user?: User;
    onUserSelected: (user: User) => void;
    label?: string;
    optionsClass?: string;
}

export default function SelectUser({ user: _user, onUserSelected, label = 'Membre', optionsClass }: SelectUserProps) {
    const store = useAppStore();
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User | undefined>(_user);
    const [keyword, setKeyword] = useState<string>('');

    useEffect(() => {
        store.user.queryFetch({ id: '', first_name: '', last_name: '', phone_number: '' });
    }, []);

    const handleSearch = (value: string) => {
        setKeyword(value);
        if (!value.trim()) {
            setUsers([]);
            return;
        }

        const lower = value.toLowerCase();
        const filtered = store.user.items.filter((item) => {
            const first = item.first_name?.toLowerCase() || '';
            const last = item.last_name?.toLowerCase() || '';
            const phone = item.phone_number?.toLowerCase() || '';
            return first.includes(lower) || last.includes(lower) || phone.includes(lower);
        });

        setUsers(filtered);
    };

    return (
        <div className="relative">
            {user ? (
                <div className="relative mt-2 rounded-md bg-gray-50 p-3">
                    <span className="text-sm">{label}</span>
                    <div className="mt-1 flex items-center gap-2">
                        <CustomAvatar className="h-10 w-10" user={user} />
                        <div>
                            <div className="font-medium">{getFullName(user)}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="h-3 w-3" /> {user.phone_number}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setUser(undefined)} className="text-secondary-800 mt-2 text-sm hover:underline">
                        Modifier
                    </button>
                </div>
            ) : (
                <InputField
                    label={label}
                    placeholder="Entrez le nom ou le numéro du membre"
                    value={keyword}
                    onChange={(e: any) => handleSearch(e.target.value)}
                />
            )}

            {keyword != '' && (
                <>
                    {users.length > 0 ? (
                        <ul
                            className={cn(
                                'z-20 mt-1 max-h-[200px] w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md',
                                optionsClass,
                            )}
                        >
                            {users.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => {
                                        onUserSelected(item);
                                        setKeyword('');
                                        setUser(item);
                                        // setUsers([]);
                                    }}
                                    className="cursor-pointer border-b border-gray-200 px-4 py-2 hover:bg-gray-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <CustomAvatar className="h-5 w-5" user={item} />
                                        <span className="font-medium">{getFullName(item)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700">Aucun membre ne correspond à ce mot clé.</div>
                    )}
                </>
            )}
        </div>
    );
}
