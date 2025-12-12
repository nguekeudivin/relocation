import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { getSettingObject } from '@/store/Setting';
import { useEffect, useState } from 'react';

export default function BookingCostCard({ form }: { form: any }) {
    const store = useAppStore();
    const { t } = useTranslation();

    const [settings, setSettings] = useState<Record<string, any>>({
        price_per_worker: 0,
        price_per_hour: 0,
    });

    useEffect(() => {
        store.setting.fetch().then((items: any) => {
            setSettings(getSettingObject(items));
        });
    }, []);

    const total =
        form.values.workers * parseFloat(settings.price_per_worker) +
        form.values.workers * form.values.duration * parseFloat(settings.price_per_hour) +
        parseFloat(form.values.transport_price);

    const tax = parseFloat(settings.worker_tax) + (form.values.car_type == undefined ? 0 : parseFloat(settings.car_tax));

    return (
        <div className="bg-gray-200 p-4">
            <h4 className="font-semibold">{t('Rate')}</h4>

            <ul className="mt-2 text-sm">
                <li className="flex justify-between">
                    <span>{t('Rate per worker')}</span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{`${parseFloat(settings.price_per_worker)}€ `}</span>
                </li>
                <li className="flex justify-between">
                    <span>{t('Rate per worker per hour')}</span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{`${parseFloat(settings.price_per_hour)}€ `}</span>
                </li>
                <li className="flex justify-between">
                    <span>{t('Tax on worker')}</span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{`${parseFloat(settings.worker_tax)}€ `}</span>
                </li>

                <Show when={form.values.car_type != undefined}>
                    <li className="flex justify-between">
                        <span>{t('Tax on vehicle')}</span>
                        <span className="md:hidden"> = </span>
                        <span className="font-semibold">{`${parseFloat(settings.car_tax)}€ `}</span>
                    </li>
                </Show>
            </ul>
            <div className="border-primary-600 my-2 border-t border-dashed"></div>

            <h4 className="font-semibold">{t('Cost calculation')}</h4>

            <ul className="mt-2 text-sm">
                <li className="flex justify-between">
                    <span>
                        {form.values.workers} {t('workers')} x {`${parseFloat(settings.price_per_worker)}€ `}
                    </span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{form.values.workers * parseFloat(settings.price_per_worker)}€</span>
                </li>
                <li className="flex justify-between border-t border-gray-300 py-1">
                    <span>
                        {form.values.workers} {t('workers')} x {form.values.duration} {t('hours')} x {`${parseFloat(settings.price_per_hour)}€`}
                    </span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{form.values.workers * form.values.duration * parseFloat(settings.price_per_hour)}€</span>
                </li>
                <Show when={form.values.car_type != undefined}>
                    <li className="flex justify-between border-t border-gray-300 py-1">
                        <span>{t('Transport')}</span>
                        <span className="md:hidden"> = </span>
                        <span className="font-semibold">{form.values.transport_price}€</span>
                    </li>
                </Show>
            </ul>
            <div className="border-primary-600 my-2 border-t border-dashed"></div>
            <ul className="text-sm">
                <li className="flex justify-between">
                    <span>{t('Total HT : ')} </span> <span className="font-semibold">{total}€ </span>
                </li>
                <li className="flex justify-between">
                    <span>{t('Tax : ')} </span> <span className="font-semibold">{tax}€ </span>
                </li>
            </ul>
            <div className="border-primary-600 my-2 border-t border-dashed"></div>
            <div className="flex justify-between">
                <span>{t('Total : ')} </span> <span className="font-semibold">{total + tax}€ </span>
            </div>
        </div>
    );
}
