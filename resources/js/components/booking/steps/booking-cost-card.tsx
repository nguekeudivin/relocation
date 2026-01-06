import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { getDurationCost, getVehicleTax, getWorkerTax } from '@/store/Booking';

export default function BookingCostCard({ form }: { form: any }) {
    const store = useAppStore();
    const { t } = useTranslation();
    const settings = store.setting.values;

    const workerTax = getWorkerTax(form, settings);
    const carTax = getVehicleTax(form, settings);
    const durationCost = getDurationCost(form, settings);
    const total = workerTax + carTax + durationCost;
    const tax = workerTax + (form.values.car_type == undefined ? 0 : carTax);

    return (
        <div className="bg-gray-200 p-4">
            <h4 className="font-semibold">{t('Cost calculation')}</h4>
            <ul className="mt-2 text-sm">
                <li className="flex justify-between">
                    <div>
                        <span>{t('Worker tax :')}</span>
                        <span className="ml-1 font-semibold">
                            {`( ${parseFloat(settings.worker_tax)}€ )`} {` x `} {form.values.workers} {t('workers')}
                        </span>
                    </div>
                    <div>
                        <span className="md:hidden"> = </span>
                        <span className="font-semibold">
                            {workerTax}
                            {`€`}
                        </span>
                    </div>
                </li>
                <div className="my-1 border-t border-gray-300"></div>

                <Show when={form.values.car_type != undefined}>
                    <li className="flex justify-between">
                        <div>
                            <span>{t('Vehicle tax :')}</span>
                            <span className="ml-1 font-semibold">
                                {`( ${form.values.transport_price}€ )`} {` + `} {`fee per km (${settings.fee_per_km}€)`} {`x`} {form.values.distance}{' '}
                                {t('km')} {`x 2`}
                            </span>
                        </div>
                        <div>
                            <span className="md:hidden"> = </span>
                            <span className="font-semibold">{`${carTax}€ `}</span>
                        </div>
                    </li>
                </Show>
                <div className="my-1 border-t border-gray-300"></div>

                <li className="flex justify-between">
                    <div>
                        <span>{t('Prestation cost : Rate per worker')}</span>
                        <span className="ml-1 font-semibold">
                            {`( ${parseFloat(settings.price_per_hour)}€ )`} x {form.values.workers} {t('workers')} x {form.values.duration}{' '}
                            {t('hours')}
                        </span>
                    </div>
                    <div>
                        <span className="md:hidden"> = </span>
                        <span className="font-semibold">{durationCost}€</span>
                    </div>
                </li>
            </ul>
            <div className="border-primary-600 my-2 border-t border-dashed"></div>
            <ul className="text-sm">
                <li className="flex justify-between">
                    <span>{t('Total cost of the service : ')} </span> <span className="font-semibold">{total}€ </span>
                </li>
                <li className="my-1 border-t border-gray-300"></li>
                <li className="flex justify-between">
                    <span>{t('Reversation fee (workers and vehicle taxes):')} </span> <span className="font-semibold">{tax}€ </span>
                </li>
            </ul>
        </div>
    );
}
