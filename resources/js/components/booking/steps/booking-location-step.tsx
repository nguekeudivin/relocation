import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import PlaceAutocomplete from './place-autocomplete';
import RouteRenderer from './route-renderer';
import useAppStore from '@/store';
import useTranslation from '@/hooks/use-translation';

const API_KEY = 'AIzaSyD3PITTwBkMx8IzrnVpIm2H2ywvKsTVy30';
const MAP_ID = '393332a91128db2695d4ee31';
const PADERBORN = { lat: 51.719601, lng: 8.757301, name: 'Paderborn' };

function parseAddressComponents(components: google.maps.GeocoderAddressComponent[]) {
    let city = '';
    let street = '';
    let postalCode = '';

    for (const component of components) {
        if (component.types.includes('locality') || component.types.includes('postal_town')) {
            city = component.long_name;
        }
        if (component.types.includes('route')) {
            street = component.long_name;
        }
        if (component.types.includes('street_number')) {
            street = street ? `${street} ${component.long_name}` : component.long_name;
        }
        if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
        }
    }

    return { city, street, postalCode };
}

export default function BookingLocationStep({ form }: any) {
    const store = useAppStore();
    const { t } = useTranslation();

    const [origin, setOrigin] = useState<any>(null);
    const [destination, setDestination] = useState<any>(null);

    const [movingDistance, setMovingDistance] = useState<string>('');
    const [movingDuration, setMovingDuration] = useState<string>('');
    const [paderbornDistance, setPaderbornDistance] = useState<string>('');
    const [paderbornDuration, setPaderbornDuration] = useState<string>('');

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    useEffect(() => {
        if (!origin || !destination) {
            setDirections(null);
            setMovingDistance('');
            setMovingDuration('');
            return;
        }

        const service = new google.maps.DirectionsService();

        service.route(
            {
                origin: { lat: origin.lat, lng: origin.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status !== google.maps.DirectionsStatus.OK || !result) {
                    return;
                }

                setDirections(result);

                const leg: any = result.routes[0].legs[0];
                setMovingDistance(leg.distance.text);
                setMovingDuration(leg.duration.text);
                form.setValue('distance', leg.distance.value / 1000);
            },
        );
    }, [origin, destination]);

    useEffect(() => {
        if (!origin) {
            setPaderbornDistance('');
            setPaderbornDuration('');
            form.setValue('distance_paderborn', 0);
            return;
        }

        const service = new google.maps.DirectionsService();

        service.route(
            {
                origin: { lat: PADERBORN.lat, lng: PADERBORN.lng },
                destination: { lat: origin.lat, lng: origin.lng },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status !== google.maps.DirectionsStatus.OK || !result) {
                    return;
                }

                const leg: any = result.routes[0].legs[0];
                setPaderbornDistance(leg.distance.text);
                setPaderbornDuration(leg.duration.text);
                form.setValue('distance_paderborn', leg.distance.value / 1000);
            },
        );
    }, [origin]);

    return (
        <>
            {store.errors.render()}

            <APIProvider apiKey={API_KEY} libraries={['places']}>
                <div className="space-y-4">
                    <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-900">
                        <p className="font-semibold text-lg">{t('location.how_it_works.title')}</p>
                        <p className="mt-1">{t('location.how_it_works.description')}</p>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">{t('Moving out address')}</label>
                            <PlaceAutocomplete
                                placeholder={t('Search for an address...')}
                                onSelect={(place) => {
                                    const lat = place.geometry?.location?.lat();
                                    const lng = place.geometry?.location?.lng();

                                    const data = {
                                        address: place.formatted_address,
                                        lat,
                                        lng,
                                    };

                                    setOrigin(data);
                                    form.setValue('from_address', data.address);
                                    form.setValue('from_lat', lat);
                                    form.setValue('from_lng', lng);
                                }}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">{t('Moving in address')}</label>
                            <PlaceAutocomplete
                                placeholder={t('Search for an address...')}
                                onSelect={(place: any) => {
                                    const lat = place.geometry?.location?.lat();
                                    const lng = place.geometry?.location?.lng();

                                    const data = {
                                        address: place.formatted_address,
                                        lat,
                                        lng,
                                    };

                                    setDestination(data);
                                    form.setValue('to_address', data.address);
                                    form.setValue('to_lat', lat);
                                    form.setValue('to_lng', lng);
                                }}
                            />
                        </div>
                    </div>

                    <div className="h-[450px] overflow-hidden rounded-lg border">
                        <Map
                            mapId={MAP_ID}
                            defaultZoom={6}
                            defaultCenter={{ lat: PADERBORN.lat, lng: PADERBORN.lng }}
                            gestureHandling="greedy"
                        >
                            <AdvancedMarker position={{ lat: PADERBORN.lat, lng: PADERBORN.lng }} />
                            {origin && <AdvancedMarker position={{ lat: origin.lat, lng: origin.lng }} />}
                            {destination && <AdvancedMarker position={{ lat: destination.lat, lng: destination.lng }} />}
                            {directions && <RouteRenderer directions={directions} />}
                        </Map>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {paderbornDistance && (
                            <div className="rounded bg-blue-50 p-4">
                                <div>
                                    <strong>{t('Distance Paderborn → departure')}:</strong> {paderbornDistance}
                                </div>
                            </div>
                        )}

                        {movingDistance && (
                            <div className="rounded bg-green-50 p-4">
                                <div>
                                    <strong>{t('Distance departure → arrival')}:</strong> {movingDistance}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </APIProvider>
        </>
    );
}
