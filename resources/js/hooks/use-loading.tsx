import { create } from 'zustand';

interface LoadingState {
    status: Record<string, boolean>;
    start: (key: string) => void;
    stop: (key: string) => void;
    reset: () => void;
}

export const useLoading = create<LoadingState>((setter) => ({
    status: {},
    start: (key) => {
        console.log(key);
        setter((state) => ({
            status: {
                ...state.status,
                [key]: true,
            },
        }));
    },
    stop: (key) => {
        console.log('stop ', key);
        setter((state) => {
            const newValues: Record<string, any> = {};
            for (const k in state.status) {
                if (k != key) {
                    newValues[k] = state.status[k];
                }
            }
            return {
                status: newValues,
            };
        });
    },

    reset: () => setter(() => ({})),
}));
