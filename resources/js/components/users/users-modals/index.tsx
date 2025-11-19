import useAppStore from '@/store';
import { CreateUserModal } from './create-user-modal';
// import { ViewUserModal } from './view-user-modal';

export function UsersModals() {
    const store = useAppStore();
    const user = store.user.current;
    return (
        <>
            <CreateUserModal />
            {user && (
                <>
                    {/* <EditUserModal /> */}
                    {/* <ViewUserModal /> */}
                </>
            )}
        </>
    );
}
