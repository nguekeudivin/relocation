import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface ChipOption {
    label: string;
    value: any;
    description?: string;
}

interface ChipsFieldProps {
    className?: string;
    optionClass?: string;
    optionsClass?: String;
    value: any;
    options: ChipOption[];
    onItemSelected: any;
    label?: string;
    id?: string;
    name?: string;
    labelClass?: string;
    error?: string[] | string;
}

export function ChipsField({
    className,
    value,
    options,
    optionClass,
    optionsClass,
    onItemSelected,
    label,
    id,
    name,
    labelClass,
    error,
}: ChipsFieldProps) {
    const generatedId = id ?? `input-${name}`;

    const hasError = !!error && (Array.isArray(error) ? error.length > 0 : true);

    return (
        <div className={cn(className)}>
            {label && (
                <label htmlFor={generatedId} className={cn('mb-1.5 block text-sm font-medium text-gray-900', labelClass)}>
                    {label}
                </label>
            )}

            <div className={cn('space-2 flex items-center gap-4', optionsClass, {})}>
                {options.map((item: any) => (
                    <div
                        className={cn('flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-gray-200 px-2 py-2', optionClass, {
                            'bg-secondary-600 text-white': value == item.value,
                        })}
                        onClick={() => {
                            onItemSelected(item);
                        }}
                    >
                        {value == item.value && <Check className="h-4 w-4" />}
                        {item.label}
                    </div>
                ))}
            </div>
            {hasError && (
                <div className="mt-1 text-sm text-red-500">
                    {Array.isArray(error) ? (
                        <ul>
                            {error.map((msg, i) => (
                                <li key={`${generatedId}-error-${i}`}>{msg}</li>
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
