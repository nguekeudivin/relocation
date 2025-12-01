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
        form.values.duration * parseFloat(settings.price_per_hour) +
        parseFloat(form.values.transport_price);

    return (
        <div className="bg-gray-200 p-4">
            <h4 className="font-semibold">{t('Cost')}</h4>
            <ul className="mt-2 text-sm">
                <li className="flex justify-between">
                    <span>
                        {form.values.workers} {t('workers')} x {`${parseFloat(settings.price_per_worker)}€`}
                    </span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{form.values.workers * parseFloat(settings.price_per_worker)}€</span>
                </li>
                <li className="flex justify-between border-t border-gray-300 py-1">
                    <span>
                        {form.values.duration} {t('hours')} x {`${parseFloat(settings.price_per_hour)}€`}
                    </span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{form.values.duration * parseFloat(settings.price_per_hour)}€</span>
                </li>
                <li className="flex justify-between border-t border-gray-300 py-1">
                    <span>{t('Transport')}</span>
                    <span className="md:hidden"> = </span>
                    <span className="font-semibold">{form.values.transport_price}€</span>
                </li>
            </ul>
            <div className="border-primary-600 my-4 border-t border-dashed"></div>
            <div className="font-semibold">
                {t('You pay')} : {total}€
            </div>
        </div>
    );
}
