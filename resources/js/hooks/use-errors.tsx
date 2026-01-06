import { pick } from '@/lib/utils';
import { create } from 'zustand';

const SERVER_ERROR = 'Something wrong just happens. Please try again.';

interface ErrorsState {
    values: Record<string, string[]>;
    set: (key: string, value: string | string[]) => void;
    setMany: (values: any) => void;
    unset: (key: string) => void;
    catch: (error: any) => void;
    reset: () => void;
    log: (error: any) => void;
    render: () => React.ReactNode;
    hasErrors: () => boolean;
}

export const useErrors = create<ErrorsState>((setter, getter) => ({
    values: {},
    set: (key, value) =>
        setter((state) => ({
            values: {
                ...state.values,
                [key]: typeof value == 'string' ? [value] : value,
            },
        })),
    setMany: (errors: any) => {
        setter((state) => ({
            values: {
                ...state.values,
                ...errors,
            },
        }));
    },
    unset: (key) =>
        setter((state) => ({
            values: Object.fromEntries(Object.entries(state.values).filter(([k, v]) => k != key)),
        })),
    catch: (error) => {
        let isServerError = true;

        if (error.response != undefined) {
            if ([422, 401, 409, 404, 400].includes(error.response.status)) {
                isServerError = false;
                let values = { error: ['Something wrong just happens. Please try again.'] };

                if (error.response.data.hasOwnProperty('errors')) {
                    values = error.response.data.errors;

                    return setter(() => ({
                        values: values,
                    }));
                }

                if (error.response.data.hasOwnProperty('message')) {
                    if (typeof error.response.data.message == 'string') {
                        values = {
                            error: [error.response.data.message],
                        };
                    }

                    if (typeof error.response.data.message == 'object') {
                        values = error.response.data.message;
                    }

                    return setter(() => ({
                        values: values,
                    }));
                }
            }
        } else {
            if (error.message != undefined) {
                return setter(() => ({
                    values: {
                        error_message: [error.message],
                    },
                }));
            }
        }

        if (isServerError) {
            return setter(() => ({
                values: {
                    server_error: [SERVER_ERROR],
                },
            }));
        }
    },
    reset: () => {
        setter(() => ({
            values: {},
        }));
    },
    log(error: any) {
        //logError(error);
    },
    hasErrors: () => {
        return (
            Object.values(getter().values)
                .flat()
                .filter((value) => value != '').length != 0
        );
    },
    render(...keys: any) {
        const values = keys.length ? pick(getter().values, keys) : getter().values;

        if (Object.keys(values).length == 0) return null;

        return (
            <div
                // initial={{ opacity: 0, scale: 0 }}
                // animate={{ opacity: 1, scale: 1 }}
                // transition={{
                //     duration: 0.4,
                //     scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
                // }}
                id="alert-border-1"
                className="mb-4 flex border-t-4 border-red-300 bg-red-50 p-4 text-red-800"
                role="alert"
            >
                <div className="ms-3 text-sm font-medium">
                    {Object.entries(values).map(([key, value]: any, index) => (
                        <div key={`error${key}${index}`} className="ms-3 text-sm font-medium">
                            {Array.isArray(value) ? (
                                <ul>
                                    {value.map((msg, i) => (
                                        <li key={`error-${i}`}>{msg}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span>{value}</span>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={() =>
                        setter(() => ({
                            values: {},
                        }))
                    }
                    type="button"
                    className="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-200 focus:ring-2 focus:ring-red-400"
                    data-dismiss-target="#alert-border-1"
                    aria-label="Close"
                >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                </button>
            </div>
        );
    },
}));
