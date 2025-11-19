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
        price_per_hour: '',
        price_per_worker: '',
        price_per_car: '',
    });

    // Fetch settings on mount
    useEffect(() => {
        store.setting.queryFetch({ code: '', name: '', value: '' }).then((items: any) => {
            const settings = getSettingObject(items);

            form.setValues(() => ({
                price_per_hour: settings?.price_per_hour || '',
                price_per_worker: settings?.price_per_worker || '',
                price_per_car: settings?.price_per_car || '',
            }));
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        store.errors.reset();

        if (store.errors.hasErrors()) return;

        store.setting
            .save({ settings: form.values })
            .then((res) => {
                console.log('Paramètres enregistrés', res);
            })
            .catch(store.errors.catch);
    };

    return (
        <AppLayout breadcrumbds={[]}>
            <section className="mx-auto max-w-5xl">
                <PageTitle title="Paramètres" />

                <form onSubmit={handleSubmit} className="mt-4 rounded-lg border border-gray-200">
                    <div className="p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InputField
                                label="Prix par heure"
                                name="price_per_hour"
                                type="number"
                                value={form.values.price_per_hour}
                                onChange={form.handleChange}
                                error={store.errors.values.price_per_hour}
                                placeholder="Saisir le prix par heure"
                            />
                            <InputField
                                label="Prix par travailleur"
                                name="price_per_worker"
                                type="number"
                                value={form.values.price_per_worker}
                                onChange={form.handleChange}
                                error={store.errors.values.price_per_worker}
                                placeholder="Saisir le prix par travailleur"
                            />
                            <InputField
                                label="Prix par véhicule"
                                name="price_per_car"
                                type="number"
                                value={form.values.price_per_car}
                                onChange={form.handleChange}
                                error={store.errors.values.price_per_car}
                                placeholder="Saisir le prix par véhicule"
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
    );
}
