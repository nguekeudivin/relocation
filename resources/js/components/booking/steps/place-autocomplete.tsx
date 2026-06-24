import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';

interface Props {
    placeholder: string;
    onSelect: (place: google.maps.places.PlaceResult) => void;
}

export default function PlaceAutocomplete({ placeholder, onSelect }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const autocomplete = new places.Autocomplete(inputRef.current, {
            fields: ['formatted_address', 'geometry', 'address_components', 'name'],
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) return;

            onSelect(place);
        });

        return () => {
            google.maps.event.clearInstanceListeners(autocomplete);
        };
    }, [places, onSelect]);

    return <input ref={inputRef} placeholder={placeholder} className="w-full rounded border px-3 py-2" />;
}
