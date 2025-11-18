import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/form';
import { useSimpleForm } from '@/hooks/use-simple-form';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import { getSettingObject } from '@/store/Setting';
import { useEffect } from 'react';

export default function SettingsPage() {
    const store = useAppStore();

    const form = useSimpleForm({
        monthly_contribution_amount: '',
        monthly_contribution_due_days: '',
        adhesion_contribution_amount: '',
        adhesion_payment_due_days: '',
        help_transaction_due_days: '',
        meeting_support_amount: '',
    });

    // Fetch settings on mount
    useEffect(() => {
        store.setting
            .queryFetch({
                code: '',
                name: '',
                value: '',
            })
            .then((items: any) => {
                const settings = getSettingObject(items);

                form.setValues(() => ({
                    monthly_contribution_amount: settings?.monthly_contribution_amount || '',
                    monthly_contribution_due_days: settings?.monthly_contribution_due_days || '',
                    adhesion_contribution_amount: settings?.adhesion_contribution_amount || '',
                    adhesion_payment_due_days: settings?.adhesion_payment_due_days || '',
                    help_transaction_due_days: settings?.help_transaction_due_days || '',
                    meeting_support_amount: settings?.meeting_support_amount || '',
                }));
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        store.errors.reset();

        // Validation rules for days
        const daysFields = ['monthly_contribution_due_days', 'adhesion_payment_due_days', 'help_transaction_due_days'];
        daysFields.forEach((field) => {
            const value = form.values[field];
            if (value < 1 || value > 30) {
                store.errors.set(field, 'Cette valeur doit être comprise entre 1 et 30');
            }
        });

        if (store.errors.hasErrors()) return;

        // Save all settings
        store.setting
            .save({ settings: form.values })
            .then((res) => {
                console.log('Paramètres enregistrés', res);
            })
            .catch(store.errors.catch);
    };

    return (
        <>
            <AppLayout breadcrumbds={[]}>
                <section className="mx-auto max-w-5xl">
                    <PageTitle title="Paramètres" />

                    <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-gray-200">
                        <header className="border-b border-gray-200 px-4 py-2 text-lg font-semibold">Contributions</header>
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <InputField
                                    label="Montant de la contribution mensuelle"
                                    name="monthly_contribution_amount"
                                    type="number"
                                    value={form.values.monthly_contribution_amount}
                                    onChange={form.handleChange}
                                    error={store.errors.values.monthly_contribution_amount}
                                    placeholder="Saisir le montant"
                                />

                                <InputField
                                    label="Jour d’échéance de la contribution mensuelle"
                                    name="monthly_contribution_due_days"
                                    type="number"
                                    value={form.values.monthly_contribution_due_days}
                                    onChange={form.handleChange}
                                    error={store.errors.values.monthly_contribution_due_days}
                                    placeholder="Saisir le jour d’échéance (ex : 15)"
                                />

                                <InputField
                                    label="Montant de l’adhésion"
                                    name="adhesion_contribution_amount"
                                    type="number"
                                    value={form.values.adhesion_contribution_amount}
                                    onChange={form.handleChange}
                                    error={store.errors.values.adhesion_contribution_amount}
                                    placeholder="Saisir le montant"
                                />

                                <InputField
                                    label="Jour d’échéance du paiement d’adhésion"
                                    name="adhesion_payment_due_days"
                                    type="number"
                                    value={form.values.adhesion_payment_due_days}
                                    onChange={form.handleChange}
                                    error={store.errors.values.adhesion_payment_due_days}
                                    placeholder="Saisir le jour d’échéance (ex : 7)"
                                />

                                <InputField
                                    label="Jour d’échéance pour le paiement des aides"
                                    name="help_transaction_due_days"
                                    type="number"
                                    value={form.values.help_transaction_due_days}
                                    onChange={form.handleChange}
                                    error={store.errors.values.help_transaction_due_days}
                                    placeholder="Saisir le jour d’échéance (ex : 7)"
                                />

                                <InputField
                                    label="Montant de soutien aux réunions"
                                    name="meeting_support_amount"
                                    type="number"
                                    value={form.values.meeting_support_amount}
                                    onChange={form.handleChange}
                                    error={store.errors.values.meeting_support_amount}
                                    placeholder="Saisir le montant"
                                />
                            </div>
                        </div>

                        <footer className="flex justify-end border-t border-gray-200 px-4 py-4">
                            <Button type="submit" disabled={store.loading.status.setting}>
                                Enregistrer
                            </Button>
                        </footer>
                    </form>
                </section>
            </AppLayout>
        </>
    );
}
