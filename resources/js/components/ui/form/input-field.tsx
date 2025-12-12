'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { ChangeEvent, FC, FocusEvent, useState } from 'react';
import InputLabel from './input-label';

interface InputFieldProps {
    id?: string;
    type?: string;
    name?: string;
    label?: string;
    canToggleType?: boolean;
    error?: string | string[];
    labelClass?: string;
    inputClass?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    value: string | number | readonly string[] | undefined;
    placeholder?: string;
    className?: string;
    step?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    min?: number;
    max?: number;
}

export const InputField: FC<InputFieldProps> = ({
    label,
    id,
    type = 'text',
    name,
    canToggleType = false,
    error,
    labelClass,
    inputClass,
    onChange,
    onFocus,
    value,
    placeholder,
    disabled = false,
    onBlur,
    className,
    step,
    autoFocus,
    readOnly,
    max,
    min,
}) => {
    const [inputType, setInputType] = useState(type);
    const hasError = !!error && (Array.isArray(error) ? error.length > 0 : true);

    const generatedId = id ?? `input-${name}`;

    return (
        <div className={cn('relative', className)}>
            <div>
                {label && (
                    <InputLabel htmlFor={generatedId} className={labelClass}>
                        {label}
                    </InputLabel>
                )}

                <div className="relative">
                    <input
                        id={generatedId}
                        name={name}
                        type={inputType}
                        disabled={disabled}
                        value={value != null ? value : ''}
                        placeholder={placeholder}
                        step={step}
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        autoFocus={autoFocus}
                        readOnly={readOnly}
                        min={min}
                        max={max}
                        className={cn(
                            'focus:ring-secondary-300 block w-full border border-gray-300 bg-transparent p-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:outline-none',
                            { 'border-red-500 focus:ring-red-500': hasError },
                            inputClass,
                        )}
                    />
                    {canToggleType && type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            tabIndex={-1}
                        >
                            {inputType === 'password' ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
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
};
