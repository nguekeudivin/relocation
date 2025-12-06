import { InputField } from '@/components/ui/form';
import PhoneNumberField from '@/components/ui/form/phone-number-field';
import ToggleSwitch from '@/components/ui/form/toggle-switch';
import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';
import { format } from 'date-fns';
import BookingCostCard from './booking-cost-card';

export default function BookingRecapStep({ form }: { form: any }) {
    const { t } = useTranslation();
    const store = useAppStore();

    return (
        <>
            <>{store.errors.render()}</>
            <h3 className="text-lg font-semibold">{t('Submission')}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <aside className="">
                    <div className="border-secondary-400 mb-4 border-2 p-4">
                        <div className="font-bold">
                            {format(form.values.date, 'dd MMM yyyy')} {format(form.values.time, 'HH:mm')}
                        </div>
                        <div className="mb-4 pl-2">
                            <ol className="relative mt-2">
                                <li className={cn('border-primary-600 border-l-4 pb-4 pl-4')}>
                                    <div className="border-primary-600 absolute -start-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-2 bg-white"></div>
                                    <h3 className="text-sm font-semibold">{form.values.from_city}</h3>
                                    <p>{form.values.from_street}</p>
                                </li>
                            </ol>
                            <ol className="relative">
                                <li className={cn('pb-4 pl-4')}>
                                    <div className="border-primary-600 absolute -start-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-2 bg-white"></div>
                                    <h3 className="text-sm font-semibold">{form.values.to_city}</h3>
                                    <p>{form.values.to_street}</p>
                                </li>
                            </ol>
                        </div>
                    </div>
                </aside>
                <aside>
                    <BookingCostCard form={form} />
                </aside>
            </div>

            <ToggleSwitch
                className="mt-4"
                checked={form.values.with_account}
                label={t('Create an account and submit')}
                onChange={(checked: boolean) => {
                    form.setValue('with_account', checked);
                    if (!checked) {
                        store.errors.reset();
                    } else {
                        form.setValue('car_type', 'van');
                    }
                }}
            />

            <Show when={!form.values.with_account}>
                <InputField
                    className="mt-4"
                    name="email"
                    value={form.values.email}
                    onChange={form.handleChange}
                    label={t('Your email')}
                    error={store.errors.values.email}
                />
                <p className="mt-2 text-sm text-gray-600">{t('This is email is use for booking confirmation')}</p>
            </Show>

            <Show when={form.values.with_account}>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField
                        name="first_name"
                        value={form.values.first_name}
                        onChange={form.handleChange}
                        label={t('Your first name')}
                        error={store.errors.values.first_name}
                    />
                    <InputField
                        name="last_name"
                        value={form.values.last_name}
                        onChange={form.handleChange}
                        label={t('Your last name')}
                        error={store.errors.values.last_name}
                    />

                    <InputField
                        name="email"
                        value={form.values.email}
                        onChange={form.handleChange}
                        label={t('Your email')}
                        error={store.errors.values.email}
                    />

                    <div>
                        <label className={cn('mb-1.5 block text-sm font-medium text-gray-900')}>{t('Phone number')}</label>
                        <PhoneNumberField
                            value={form.values.phone_number}
                            onValueChange={(value: string) => {
                                form.setValue('phone_number', value);
                            }}
                            error={store.errors.values.phone_number}
                        />
                    </div>

                    <InputField
                        name="password"
                        canToggleType={true}
                        type="password"
                        value={form.values.password}
                        onChange={form.handleChange}
                        label={t('Choose a password to access your account')}
                        error={store.errors.values.password}
                    />
                </div>
            </Show>
            <div className="h-8 md:h-20"></div>
        </>
    );
}
