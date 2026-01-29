import Show from '@/components/ui/show';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { getCarTax, getCarTransport, getDurationCost, getPaderbornTransport, getWorkerTax } from '@/store/Booking';

export default function BookingCostCard({ form }: { form: any }) {
    const store = useAppStore();
    const { t } = useTranslation();
    const settings = store.setting.values;

    const workerTax = getWorkerTax(form, settings);
    const carTax = getCarTax(form, settings);

    const carTransport = getCarTransport(form, settings);
    const paderbornTransport = getPaderbornTransport(form, settings);

    const durationCost = getDurationCost(form, settings);

    const transport = carTransport + paderbornTransport;
    const total = workerTax + carTax + carTransport + paderbornTransport + durationCost;
    const tax = workerTax + carTax;

    return (
        <div className="bg-gray-200 p-4">
            <h4 className="font-semibold">{t('Cost calculation')}</h4>
            <ul className="mt-2 text-sm">
                <li className="flex justify-between">
                    <div>
                        <span>{t('Workers tax')}</span>
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

                <Show when={carTax != 0}>
                    <li className="flex justify-between">
                        <div>
                            <span>{t('Vehicle tax')}</span>
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
                        <span>{t('Transport')}</span>
                    </div>
                    <div>
                        <span className="md:hidden"> = </span>
                        <span className="font-semibold">{`${transport}€ `}</span>
                    </div>
                </li>
                <div className="my-1 border-t border-gray-300"></div>

                <li className="flex justify-between">
                    <div>
                        <span>{t('Prestation cost')}</span>
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
