import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { Button } from '../ui/button';
import ToggleSwitch from '../ui/form/toggle-switch';
import Show from '../ui/show';

interface Props {
    loggedUser: any;
    setLoggedUser: any;
    form: any;
    submit: any;
}

export default function BookingRecapUserLogged({ form, loggedUser, setLoggedUser, submit }: Props) {
    const store = useAppStore();
    const { t } = useTranslation();

    return (
        <Show when={!!loggedUser}>
            {/* Consent (you probably still want consent even when logged in) */}
            <div
                className={cn('mt-6', {
                    'bg-red-50 p-4 text-red-500': store.errors.values.accept,
                })}
            >
                <ToggleSwitch
                    checked={form.values.accept}
                    label={t('booking.consent.label')}
                    onChange={(checked: boolean) => {
                        form.setValue('accept', checked);
                        store.errors.unset('accept');
                    }}
                />
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm text-gray-700">
                    {t('You are connected to your account')}{' '}
                    <span className="font-semibold">
                        {loggedUser?.first_name} {loggedUser?.last_name}
                    </span>
                    {' — '}
                    <span className="font-medium">{loggedUser?.email}</span>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                    {t('Do you want to submit this with your current information, or create a new account?')}
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button color="dark" className="text-sm" loading={store.loading.status.booking} onClick={submit}>
                        {t('Submit with my account')}
                    </Button>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900"
                        onClick={() => {
                            form.setValue('with_account', true);
                            store.display.hide('hide_submit');
                            setLoggedUser(undefined);
                        }}
                    >
                        {t('Continue with new account')}
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900"
                        onClick={() => {
                            form.setValue('with_account', false);
                            form.setValue('user_id', undefined);
                            store.display.hide('hide_submit');
                            setLoggedUser(undefined);
                        }}
                    >
                        {t('Continue without account')}
                    </button>
                </div>
            </div>
        </Show>
    );
}
