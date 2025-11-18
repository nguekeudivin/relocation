import { Sheet } from '@/components/ui/sheet';
import { createFormData, useSimpleForm } from '@/hooks/use-simple-form';
import useAppStore from '@/store';
import { UserForm } from '../user-form';

export function CreateUserModal() {
    const name = 'create_user';
    const store = useAppStore();

    // const form = useSimpleForm({
    //     first_name: '',
    //     last_name: '',
    //     email: '',
    //     phone_number: '',
    //     gender: '',
    //     birth_date: '',
    //     profession: '',
    //     address: '',
    //     city: '',
    //     joined_at: '',
    //     marital_status: '',
    //     status: '',
    // });

    const form = useSimpleForm({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        gender: '',
        birth_date: '', // YYYY-MM-DD format
        profession: '',
        address: '',
        city: '',
        joined_at: '',
        marital_status: 'married', // or 'married', 'divorced', etc.
        status: 'active', // e.g. 'active' | 'inactive' | 'pending'
    });

    const submit = async () => {
        store.user
            .create(createFormData(form.values), { sync: true, addFirst: true })
            .then((res) => {
                store.display.hide(name);
            })
            .catch(store.errors.catch);
    };

    return (
        <>
            <Sheet
                title="Enregistrer un nouveau membre"
                name={name}
                className="w-[700px] max-w-[700px]"
                footer={{
                    name: name,
                    submit,
                    loading: store.user.loading('create'),
                }}
            >
                <UserForm form={form} />
                {/* <ModalFooter name={name} submit={submit} loading={store.user.loading('create')} /> */}
            </Sheet>
        </>
    );
}
