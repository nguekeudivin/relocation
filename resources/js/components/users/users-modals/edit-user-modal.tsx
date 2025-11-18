import { ModalFooter } from '@/components/ui/modal';
import { Sheet } from '@/components/ui/sheet';
import { createFormData, useSimpleForm } from '@/hooks/use-simple-form';
import useAppStore from '@/store';
import { getFullName, User } from '@/store/User';
import { useEffect } from 'react';
import { UserForm } from '../user-form';

export function EditUserModal() {
    const name = 'edit_user';
    const store = useAppStore();

    const form = useSimpleForm({});
    const user = store.user.current as User;

    useEffect(() => {
        if (!user) return; // safety check

        if (store.display.visible[name]) {
            form.setValues(() => ({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                status: user.status,
                image: {
                    file: undefined,
                    src: user.image?.url || '',
                },
                phone_number: user.phone_number || '',
                birth_date: user.birth_date || '',
                gender: user.gender || '',
                profession: user.profession || '',
                address: user.address || '',
                city: user.city || '',
                joined_at: user.joined_at || '',
                marital_status: user.marital_status || '',
            }));
        }
    }, [store.display.visible[name], user]);

    const submit = async () => {
        store.errors.reset();
        store.user
            .update(user.id, createFormData(form.values), { sync: true, addFirst: true })
            .then((res) => {
                store.display.hide(name);
            })
            .catch(store.errors.catch);
    };

    return (
        <>
            <Sheet
                title={getFullName(user)}
                name={name}
                className="w-[700px] max-w-[700px]"
                footer={{
                    name,
                    loading: store.user.loading('update'),
                    submit,
                }}
            >
                <UserForm form={form} />
                <ModalFooter name={name} submit={submit} loading={store.user.loading('update')} />
            </Sheet>
        </>
    );
}
