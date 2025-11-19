import { useAway } from '@/hooks/use-away';
import { cn, parsePhoneNumber } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronDown, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { FieldLabel } from './field-label';

interface Country {
    name: string;
    ab: string;
    code: string;
}

const sampleCountries = [
    //{ name: "France", ab: "fr", code: "+33" },
    //  { name: 'Cameroon', ab: 'cm', code: '+237' },
    //{ name: "United States", ab: "us", code: "+1" },
    //{ name: "Canada", ab: "ca", code: "+1" },
    { name: 'Germany', ab: 'de', code: '+49' },
    //   { name: "United Kingdom", ab: "gb", code: "+44" },
    //   { name: "Nigeria", ab: "ng", code: "+234" },
    //   { name: "India", ab: "in", code: "+91" },
    //   { name: "Brazil", ab: "br", code: "+55" },
    //   { name: "South Africa", ab: "za", code: "+27" },
];

interface InputPhoneProps {
    onValueChange: (value: string) => void;
    value?: string;
    placeholder?: string;
    id?: string;
    name?: string;
    className?: string;
    countryClassName?: string;
    inputClassName?: string;
    label?: string;
    defaultCountry?: string;
    countriesList?: Country[];
    error?: string | string[];
}

export default function PhoneNumberField({
    onValueChange,
    value,
    placeholder,
    id,
    name,
    className,
    countryClassName,
    inputClassName,
    label,
    defaultCountry,
    countriesList,
    error,
}: InputPhoneProps) {
    const [country, setCountry] = useState<Country | undefined>(undefined);
    const [countries, setCountries] = useState<Country[]>([]);
    const [showCountries, setShowCountries] = useState<boolean>(false);
    //const [inputValue, setInputValue] = useState<string>(parsed.value as string);
    const [focus, setFocus] = useState<boolean>(false);

    const getParsed = (value: string) => {
        if (country) {
            return {
                code: country.code,
                value: (value as string).split(country.code)[1],
            };
        } else {
            return parsePhoneNumber(value as string);
        }
    };

    useEffect(() => {
        // Choose the country list.
        const list = countriesList == undefined ? sampleCountries : countriesList;
        // Choose the country item.
        let item = list[0];

        // Select the item base on the code of the parsed phone number.
        const codeSearchResult = list.find((item) => item.code == getParsed(value as string).code);
        if (codeSearchResult) item = codeSearchResult;

        // Update the country item according to the defaultCountry provided.
        if (defaultCountry != undefined) {
            item = list.find((item) => item.name.toLowerCase() == defaultCountry.toLowerCase()) as Country;
        }

        setCountries(list);
        setCountry(item);
    }, [defaultCountry, countriesList]);

    useEffect(() => {
        if (country) onValueChange(value as string);
    }, [country]);

    const handleChange = (event: FormEvent) => {
        if (country) onValueChange(`${country.code}${(event.target as HTMLInputElement).value}`);
    };

    const countriesListRef = useRef(undefined);
    useAway(countriesListRef, () => {
        setShowCountries(false);
    });

    const hasError = error != undefined && error != '';

    return (
        <div>
            <div
                ref={countriesListRef as any}
                className={clsx(cn('relative flex h-10 items-center rounded-md border border-gray-300', className), {
                    'border-primary border-2': focus,
                    'border-red-500 focus:ring-red-500': hasError,
                })}
            >
                {label != undefined && (
                    <FieldLabel
                        label={label}
                        error={error}
                        className={cn({
                            'font-bold': focus,
                        })}
                    />
                )}

                <div className={cn('flex items-center border-r border-gray-300 p-2 pr-3', countryClassName)}>
                    <div
                        className="h-6 w-6 shrink-0 rounded-full bg-gray-200 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://flagcdn.com/w80/${country?.ab}.png)`,
                        }}
                    ></div>

                    <button
                        className="text-muted-foreground ml-2 rounded-full p-1 hover:bg-gray-100"
                        onClick={(e: any) => {
                            e.preventDefault();
                            setShowCountries(!showCountries);
                        }}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </div>

                <ul
                    className={clsx(
                        'scrollbar-thin scrollbar-thumb-gray-primary scrollbar-track-gray-200 absolute top-10 left-0 z-40 max-h-[300px] w-[200px] w-full overflow-auto rounded-xl bg-white p-2 shadow-xl',
                        { block: showCountries, hidden: !showCountries },
                    )}
                >
                    {countries.map((item, index) => (
                        <li
                            onClick={(e: any) => {
                                e.preventDefault();
                                setCountry(item);
                                setShowCountries(false);
                            }}
                            key={`country${index}`}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100"
                        >
                            <div
                                className="h-6 w-6 shrink-0 rounded-full bg-gray-200 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(https://flagcdn.com/w80/${item?.ab}.png)`,
                                }}
                            ></div>

                            <div className="item-center flex gap-2">
                                <p className="text-base font-semibold">{item.name}</p>
                                <p className="text-muted-foreground text-base uppercase">
                                    {item.ab}({item.code})
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>

                <input
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={getParsed(value as string).value || ''}
                    onChange={handleChange}
                    onFocus={() => {
                        setFocus(true);
                    }}
                    onBlur={() => {
                        setFocus(false);
                    }}
                    className={cn('w-full border-none px-3 py-1.5 text-sm focus:border-none focus:outline-none', inputClassName)}
                />

                {value != undefined && value != '' && (
                    <button onClick={() => onValueChange('')} className="absolute top-[20%] right-2 rounded-full p-1 hover:bg-gray-200">
                        <X className="text-muted-foreground h-4 w-4" />
                    </button>
                )}
            </div>
            {hasError && (
                <div className="mt-1 text-base text-sm text-red-500">
                    {Array.isArray(error) ? (
                        <ul>
                            {error.map((msg, i) => (
                                <li key={`phone-numbers-error-${i}`}>{msg}</li>
                            ))}
                        </ul>
                    ) : (
                        <span>{error}</span>
                    )}
                </div>
            )}
        </div>
    );
}
