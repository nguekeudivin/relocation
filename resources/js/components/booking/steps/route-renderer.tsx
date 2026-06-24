import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

export default function RouteRenderer({ directions }: { directions: google.maps.DirectionsResult }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !directions) return;

        const renderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
        });

        renderer.setMap(map);
        renderer.setDirections(directions);

        return () => {
            renderer.setMap(null);
        };
    }, [map, directions]);

    return null;
}
