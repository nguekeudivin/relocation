import { useDisplay } from '@/hooks/use-display';
import { useLoading } from '@/hooks/use-loading';

import { useResponsive } from '@/hooks/use-responsive';
import { useSimpleForm } from '@/hooks/use-simple-form';
import axios from 'axios';
import { Loader2, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import LocationPopoverSearch from './location-popover-search';
import ModalLocationSearch from './modal-location-sarch';

export default function SearchBox({ onSubmit, defaultParams }: { onSubmit: any; defaultParams?: any }) {
    const display = useDisplay();
    const loading = useLoading();
    const { isMobile } = useResponsive();

    const form = useSimpleForm({
        origin: '',
    });

    const [locations, setLocations] = useState<any[]>([]);

    function getCityFromAddress(address: any) {
        return address.city || address.town || address.village || address.municipality || address.county || address.state || null;
    }

    const fetchData = (name: string, value: string) => {
        axios
            .get(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=10&countrycodes=de`)
            .then((res) => {
                if (res.data.length) {
                    display.show(`${name}LocationPopover`);
                    setLocations(() =>
                        res.data.map((item: any) => ({
                            name: item.display_name,
                            city: getCityFromAddress(item.address),
                        })),
                    );
                }
            })
            .finally(() => {
                loading.stop(name);
            });
    };

    function useDebounce(callback: (...args: any[]) => void, delay: number) {
        const timer = useRef<NodeJS.Timeout | null>(null);
        return (...args: any[]) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    }

    const debouncedFetchData = useDebounce(fetchData, 300);
    const handleAutoComplete = (e: any) => {
        const { name, value } = e.target;
        form.setValue(name, value);
        display.hide(`${name}LocationPopover`);
        loading.start(name);
        debouncedFetchData(name, value);
    };

    useEffect(() => {
        if (defaultParams) {
            form.setValue('origin', defaultParams.origin);
        }
    }, [defaultParams]);

    return (
        <div className="grid-cols grid md:grid-cols-9">
            <div className="md:border-b-none border-r-none relative flex h-16 items-center border-b border-gray-300 px-4 md:col-span-2 md:border-r">
                {loading.status.origin ? <Loader2 className="text-secondary-700 animate-spin" /> : <MapPin className="h-5 w-5 text-gray-500" />}
                <input
                    name="origin"
                    value={form.values.origin}
                    onChange={(e: any) => {
                        if (!isMobile) handleAutoComplete(e);
                    }}
                    onFocus={(e: any) => {
                        if (isMobile) display.show('originLocationModal');
                    }}
                    placeholder="Departure"
                    className="inset-0 h-full w-full cursor-pointer px-4 py-3 text-gray-700 focus:border-none focus:outline-none"
                />
                <ModalLocationSearch
                    name="originLocationModal"
                    placeholder="Departure"
                    attribute="origin"
                    locations={locations}
                    form={form}
                    handleAutoComplete={handleAutoComplete}
                />
                <LocationPopoverSearch name="originLocationPopover" attribute="origin" locations={locations} form={form} />
            </div>
        </div>
    );
}
