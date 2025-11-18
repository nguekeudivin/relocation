'use client';

import { FileValue, ImageFile } from '@/components/ui/form';
import { pick } from '@/lib/utils';
import { useState } from 'react';

export const createFormData = (values: any, fd = new FormData(), prefix = '') => {
    if (typeof values === 'object' && values !== null) {
        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                const value = values[key];
                const newPrefix = prefix ? `${prefix}[${key}]` : key;

                if (value instanceof File) {
                    fd.append(newPrefix, value);
                } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                    if (
                        (typeof value == 'object' &&
                            Object.prototype.hasOwnProperty.call(value, 'file') &&
                            Object.prototype.hasOwnProperty.call(value, 'src')) ||
                        Object.prototype.hasOwnProperty.call(value, 'url')
                    ) {
                        // This is the case we have and ImageFile. We need to keep only the binary
                        if (value.file) fd.append(newPrefix, value.file);
                    } else {
                        createFormData(value, fd, newPrefix);
                    }
                } else if (value !== undefined && value !== null) {
                    fd.append(newPrefix, String(value));
                }
            }
        }
    } else {
        // Handle cases where the initial `values` object is not a simple object or array
        fd.append(prefix, String(values));
    }
    return fd;
};

export function useSimpleForm(
    defaultValues: any,
    options?: {
        schema?: any;
        onUpdate?: any;
        // We can bind a resource store to the form. This way the form will updates directly the store is needed
        // The store is only call when we use the setValue method.
        // When binding a store to form we should avoid using the setValue() for initialization.
        store?: any;
    },
) {
    const [values, setValues] = useState<any>(defaultValues);
    const [errors, setErrors] = useState<any>({});

    // setters
    const setValue = (name: string, value: any) => {
        setValues((prevValues: any) => {
            const newValues = {
                ...prevValues,
                [name]: value,
            };
            if (options?.onUpdate) options.onUpdate(newValues, name);
            if (options?.store) {
                options.store.setCurrent({ [name]: value });
            }
            return newValues;
        });
    };

    function resetValues() {
        setValues(defaultValues);
        if (options?.onUpdate) options.onUpdate(defaultValues);
    }

    function resetValue(name: string) {
        setValue(name, defaultValues[name]);
    }

    function mergeValue(name: string, obj: any) {
        setValue(name, {
            ...values[name],
            ...obj,
        });
    }

    // A special function to handle easly array update.
    // If the is true the function add the value to the array hold by the name key
    // otherwise we remove the value.
    function pushToggle(name: string, value: any, condition: boolean) {
        setValue(name, condition ? [...values[name], value] : values[name].filter((el: string) => el != value));
    }

    function hasError(name: string) {
        return errors[name] != undefined && errors[name] != '';
    }

    // handlers.

    function handleImageValue(key: string) {
        return (image: ImageFile | undefined) => setValue(key, image as ImageFile);
    }

    function handleFileValue(key: string) {
        return (file: FileValue | undefined) => setValue(key, file as FileValue);
    }

    function handleChange(e: any) {
        const { name, value } = e.target;
        setValue(name, value);
    }

    function handleNumberChange(e: any) {
        const { name, value } = e.target;
        let bool = false;

        if (typeof value === 'string') {
            bool = /^\d+$/.test(value);
        }

        if (typeof value === 'number' || value == '') {
            bool = true;
        }

        if (bool) {
            setValue(name, value);
        }
    }

    function handlePhoneNumber(key: string = 'phone_number') {
        return (value: string) => setValue(key, value);
    }

    function getPhoneNumber(key: string = 'phone_number') {
        return values[key] && values[key] != '' ? values[key] : undefined;
    }

    function getFileValue(key: string) {
        return values[key]?.file || values[key]?.url ? values[key] : undefined;
    }

    function getImageValue(key: string) {
        return values[key]?.file || values[key]?.src ? values[key] : undefined;
    }

    // Accessors

    function check(inputs: any = undefined) {
        setErrors({});
        if (options?.schema != undefined) {
            const result = options.schema.safeParse(inputs != undefined ? inputs : values);
            if (!result.success) {
                const errorObj: { [key: string]: string } = {};
                result.error.errors.forEach((err: any) => {
                    errorObj[err.path[0]] = err.message;
                });

                setErrors(errorObj);
                return false;
            } else {
                setErrors({});
                return true;
            }
        } else {
            return true;
        }
    }

    function getValidValues(values: any) {
        const result = options?.schema?.safeParse(values);

        if (result.success) {
            // If the data is valid, return the entire object
            return result.data;
        } else {
            // If the data is invalid, extract valid fields
            const validFields: any = {};
            const errors = result.error.errors;

            for (const key of Object.keys(values)) {
                // Check if the field has no errors
                if (!errors.some((error: any) => error.path.includes(key))) {
                    validFields[key] = values[key];
                }
            }
            return validFields;
        }
    }

    // Validation.

    function validateAsync() {
        if (options?.schema != undefined) {
            const result = options.schema.safeParse(values);
            if (!result.success) {
                const errorObj: { [key: string]: string } = {};
                result.error.errors.forEach((err: any) => {
                    errorObj[err.path[0]] = err.message;
                });
                setErrors(errorObj);
                return Promise.reject(errorObj);
            } else {
                setErrors({});
                return Promise.resolve(result.data);
            }
        } else {
            return Promise.resolve(values);
        }
    }

    function validate() {
        setErrors({});
        if (options?.schema != undefined) {
            const result = options.schema.safeParse(values);
            if (!result.success) {
                const errorObj: { [key: string]: string } = {};
                result.error.errors.forEach((err: any) => {
                    errorObj[err.path[0]] = err.message;
                });
                setErrors(errorObj);
                return { valid: false, errors: errorObj };
            } else {
                return { valid: true, values: result.data };
            }
        } else {
            return {
                valid: true,
            };
        }
    }

    // Rendering.

    function renderErrors(...keys: any) {
        const errorsToRenders = keys.length ? pick(errors, keys) : errors;
        if (Object.keys(errorsToRenders).length == 0) return null;
        return (
            <ul className="rounded-lg border-red-500 bg-red-50 p-3 text-red-500">
                {Object.entries(errorsToRenders).map(([key, value], index) => (
                    <li key={`error${key}${index}`}>{value as string}</li>
                ))}
            </ul>
        );
    }

    return {
        getValidValues,
        getImageValue,
        handleImageValue,
        handleNumberChange,
        handleFileChange: handleFileValue,
        handleImageChange: handleImageValue,
        handlePhoneNumber,
        getPhoneNumber,
        getFileValue,
        setValue,
        setValues,
        resetValue,
        resetValues,
        values,
        handleChange,
        validate,
        check,
        validateAsync,
        errors,
        hasError,
        setErrors,
        renderErrors,
        reset: resetValues,
        pushToggle,
        mergeValue,
        getFormData: () => {
            return createFormData(values);
        },
    };
}

export const validateObject = (values: any, schema: any) => {
    if (schema != undefined) {
        const result = schema.safeParse(values);
        if (!result.success) {
            const errorObj: { [key: string]: string } = {};
            result.error.errors.forEach((err: any) => {
                errorObj[err.path[0]] = err.message;
            });
            return { valid: false, errors: errorObj };
        } else {
            return { valid: true, values: result.data };
        }
    } else {
        return { valid: true, values };
    }
};
