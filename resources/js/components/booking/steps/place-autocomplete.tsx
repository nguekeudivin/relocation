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

    return (
        <input
            ref={inputRef}
            placeholder={placeholder}
            className="focus:ring-secondary-300 block w-full border border-gray-300 bg-transparent p-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:outline-none"
        />
    );
}
