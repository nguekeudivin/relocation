import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import PlaceAutocomplete from './place-autocomplete';
import RouteRenderer from './route-renderer';

const API_KEY = 'AIzaSyD3PITTwBkMx8IzrnVpIm2H2ywvKsTVy30';
const MAP_ID = '393332a91128db2695d4ee31';

export default function BookingLocationStep({ form }: any) {
    const [origin, setOrigin] = useState<any>(null);
    const [destination, setDestination] = useState<any>(null);

    const [distance, setDistance] = useState<string>('');
    const [duration, setDuration] = useState<string>('');

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    useEffect(() => {
        if (!origin || !destination) return;

        console.log('compute the distance');

        const service = new google.maps.DirectionsService();

        service.route(
            {
                origin: {
                    lat: origin.lat,
                    lng: origin.lng,
                },
                destination: {
                    lat: destination.lat,
                    lng: destination.lng,
                },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status !== google.maps.DirectionsStatus.OK || !result) {
                    return;
                }

                setDirections(result);

                const leg: any = result.routes[0].legs[0];

                setDistance(leg.distance.text);
                setDuration(leg.duration.text);

                form.setValue('distance_km', leg.distance.value / 1000);

                form.setValue('duration_seconds', leg.duration.value);
            },
        );
    }, [origin, destination]);

    return (
        <APIProvider apiKey={API_KEY} libraries={['places']}>
            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Adresse de départ</label>

                    <PlaceAutocomplete
                        placeholder="Rechercher une adresse..."
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
                    <label className="mb-1 block text-sm font-medium">Adresse d'arrivée</label>

                    <PlaceAutocomplete
                        placeholder="Rechercher une adresse..."
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

                <div className="h-[450px] overflow-hidden rounded-lg border">
                    <Map
                        mapId={MAP_ID}
                        defaultZoom={6}
                        defaultCenter={{
                            lat: 5.9631,
                            lng: 10.1591,
                        }}
                        gestureHandling="greedy"
                    >
                        {origin && (
                            <AdvancedMarker
                                position={{
                                    lat: origin.lat,
                                    lng: origin.lng,
                                }}
                            />
                        )}

                        {destination && (
                            <AdvancedMarker
                                position={{
                                    lat: destination.lat,
                                    lng: destination.lng,
                                }}
                            />
                        )}

                        {directions && <RouteRenderer directions={directions} />}
                    </Map>
                </div>

                {distance && (
                    <div className="rounded bg-green-50 p-4">
                        <div>
                            <strong>Distance :</strong> {distance}
                        </div>

                        <div>
                            <strong>Durée :</strong> {duration}
                        </div>
                    </div>
                )}
            </div>
        </APIProvider>
    );
}
