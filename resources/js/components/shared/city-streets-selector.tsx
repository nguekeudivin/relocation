// components/CityStreetSelector.tsx
import locations from '@/config/locations.json'; // ← ton fichier de données
import { useEffect, useState } from 'react';

type Location = {
    n: string; // nom de la ville
    cp: string; // code postal (PLZ)
    lg: string; // longitude
    lt: string; // latitude
};

type Street = {
    name: string;
};

export default function CityStreetSelector() {
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [streets, setStreets] = useState<Street[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedCity) {
            setStreets([]);
            return;
        }

        const fetchStreets = async () => {
            setLoading(true);
            setError(null);

            try {
                const city = locations.find((loc) => loc.n === selectedCity);
                if (!city) throw new Error('Ville non trouvée dans les données');

                // Query Overpass API avec le nom de la ville (admin_level=8 = commune en Allemagne)
                const overpassQuery = `
          [out:json][timeout:180];
          area[name="${city.n}"]["admin_level"="8"]["ISO3166-1"="DE"]->.searchArea;
          (
            way["highway"~"^(primary|secondary|tertiary|residential|living_street|pedestrian|service|track|unclassified)$"]["name"](area.searchArea);
          );
          out body;
        `;

                const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
                const res = await fetch(url);

                if (!res.ok) throw new Error('Erreur Overpass API');

                const data = await res.json();

                const uniqueStreets = [...new Set(data.elements.map((el: any) => el.tags?.name).filter(Boolean))]
                    .sort((a: string, b: string) => a.localeCompare(b, 'de'))
                    .map((name) => ({ name }));

                setStreets(uniqueStreets);
            } catch (err: any) {
                setError(`Impossible de charger les rues pour ${selectedCity}`);
                console.error(err);
                setStreets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStreets();
    }, [selectedCity]);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px' }}>
            <h2>Sélectionne une commune</h2>

            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '16px' }}
            >
                <option value="">-- Choisir une commune --</option>
                {locations.map((loc) => (
                    <option key={`${loc.n}-${loc.cp}`} value={loc.n}>
                        {loc.n} {loc.cp && `(${loc.cp})`}
                    </option>
                ))}
            </select>

            <div style={{ marginTop: '30px' }}>
                {loading && <p>Chargement des rues en cours... (peut prendre 5–30 secondes selon la taille de la ville)</p>}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && streets.length === 0 && selectedCity && <p>Aucune rue trouvée (ville trop petite ou ambiguë).</p>}

                {!loading && streets.length > 0 && (
                    <>
                        <h3>
                            {streets.length} rue(s) trouvée(s) à <strong>{selectedCity}</strong>
                        </h3>
                        <ul style={{ columns: 3, gap: '20px', listStyle: 'none', padding: 0 }}>
                            {streets.map((street, i) => (
                                <li key={i}>• {street.name}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
