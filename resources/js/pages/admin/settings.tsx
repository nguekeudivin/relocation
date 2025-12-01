// src/pages/settings.tsx
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/form';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout/app-layout';
import useAppStore from '@/store';
import { getSettingObject } from '@/store/Setting';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function SettingsPage() {
    const { t } = useTranslation();
    const store = useAppStore();

    const form = useSimpleForm({});

    useEffect(() => {
        store.setting.queryFetch({ code: '', name: '', value: '' }).then((items: any[]) => {
            const settingsObj = getSettingObject(items);

            // On prend TOUT ce qui vient de la DB → zéro filtre
            const formValues = items.reduce(
                (acc, item) => {
                    acc[item.code] = settingsObj[item.code] ?? item.value ?? '';
                    return acc;
                },
                {} as Record<string, string>,
            );

            form.setValues(formValues);
        });
    }, [store.setting]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        store.errors.reset();

        await store.setting
            .save({ settings: form.values })
            .then(() => {
                // toast.success(t('Settings saved successfully'));
            })
            .catch(store.errors.catch);
    };

    // Liste des codes pour le rendu (dans l'ordre de la réponse API)
    const settingCodes = Object.keys(form.values);

    if (settingCodes.length === 0) {
        return (
            <AppLayout>
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="text-primary-600 h-8 w-8 animate-spin" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <section className="mx-auto max-w-6xl px-4 md:px-0">
                <PageTitle title={t('Settings')} />

                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="rounded-lg border border-gray-200 bg-white">
                        <div className="p-6">
                            <h2 className="mb-6 text-lg font-semibold text-gray-900">{t('All Settings')}</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {settingCodes.map((code) => (
                                    <InputField
                                        key={code}
                                        label={t(
                                            code
                                                .split('_')
                                                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                                .join(' '),
                                        )}
                                        name={code}
                                        type="number"
                                        step="0.01"
                                        value={form.values[code] ?? ''}
                                        onChange={form.handleChange}
                                        error={store.errors.values[code]}
                                        placeholder={t('Enter value')}
                                    />
                                ))}
                            </div>
                        </div>

                        <footer className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <Button type="submit" loading={store.loading.status.setting} disabled={store.loading.status.setting}>
                                {t('Save changes')}
                            </Button>
                        </footer>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}
