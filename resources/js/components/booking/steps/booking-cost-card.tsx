import useAppStore from '@/store';
import { getSettingObject } from '@/store/Setting';
import { useEffect, useState } from 'react';

export default function BookingCostCard({ form }: { form: any }) {
    const store = useAppStore();
    const [settings, setSettings] = useState<Record<string, any>>({
        price_per_worker: 0,
        price_per_hour: 0,
        price_per_car: 0,
    });

    useEffect(() => {
        store.setting.fetch().then((items: any) => {
            setSettings(getSettingObject(items));
        });
    }, []);

    return (
        <>
            <div className="bg-gray-200 p-4">
                <h4 className="font-semibold"> Cost</h4>
                <ul className="mt-2 text-sm">
                    <li className="flex justify-between">
                        <span>
                            {form.values.workers} Workers x {`${parseFloat(settings.price_per_worker)}`}
                        </span>
                        <span className="md:hidden"> =</span>
                        <span className="font-semibold">
                            {form.values.workers * parseFloat(settings.price_per_worker)} {`€`}
                        </span>
                    </li>
                    <li className="flex justify-between border-t border-gray-300 py-1">
                        <span>
                            {form.values.duration} Hours x {`${parseFloat(settings.price_per_hour)}`}
                        </span>
                        <span className="md:hidden"> =</span>
                        <span className="font-semibold">
                            {form.values.duration * parseFloat(settings.price_per_hour)} {`€`}
                        </span>
                    </li>
                    <li className="flex justify-between border-t border-gray-300 py-1">
                        <span>
                            {form.values.cars} Vehicles x {`${parseFloat(settings.price_per_car)}`}
                        </span>
                        <span className="md:hidden"> =</span>
                        <span className="font-semibold">
                            {form.values.cars * parseFloat(settings.price_per_car)} {`€`}
                        </span>
                    </li>
                </ul>
                <div className="border-primary-600 my-4 border-t border-dashed"></div>
                <div className="font-semibold">
                    You paid :
                    {form.values.workers * parseFloat(settings.price_per_worker) +
                        form.values.duration * parseFloat(settings.price_per_hour) +
                        form.values.cars * parseFloat(settings.price_per_car)}
                    {` €`}
                </div>
            </div>
        </>
    );
}
