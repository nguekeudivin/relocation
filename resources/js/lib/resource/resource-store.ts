import { useLoading } from '@/hooks/use-loading';
import { create } from 'zustand';
import { apiClient } from '../http';
import { createQuery, execute, shape } from '../query';
import { createPrimitive, destroyPrimitive, fakePagination, loadingKey, updatePrimitive, withLoading } from './primitives';
import { BaseResourceStore, ID, Operation, Pagination } from './type';

export const initResourceStore = <T>(index: string, set: any, get: any): BaseResourceStore<T> => {
    const runQuery = <T>(q: any, one: boolean = false): Promise<any> => {
        return execute(q).then((res: any) => {
            // If there is no data on the result.
            if (!res.hasOwnProperty('data')) {
                return Promise.resolve(one ? {} : []);
            }

            if (res.data == undefined) return Promise.resolve(one ? {} : []);

            if (!res.data.hasOwnProperty(index)) return Promise.resolve(one ? {} : []);

            if (res.data[index].length == 0) return Promise.resolve(one ? {} : []);

            if (one) {
                set({ current: res.data[index][0], pagination: fakePagination([]) });
                return Promise.resolve(res.data[index][0]);
            } else {
                if (q[index].paginate) {
                    if (res.data[index].hasOwnProperty('data')) {
                        get().setPaginated(res.data[index], res.data[index].data as T[]);
                        return Promise.resolve(res.data[index].data);
                    } else {
                        return Promise.resolve([]);
                    }
                } else {
                    get().setPaginated(fakePagination(res.data[index]), res.data[index] as T[]);
                    return Promise.resolve(res.data[index]);
                }
            }
        });
    };

    return {
        items: [],
        pagination: fakePagination([]) as Pagination,
        transform: (item: T) => item,

        setCurrent: (inputs: Partial<T> | undefined) =>
            set((state: any) => ({
                current:
                    inputs == undefined
                        ? undefined
                        : get().transform({
                              ...state.current,
                              ...inputs,
                          }),
            })),
        setItems: (items: T[]) => {
            set(() => ({
                items: items.map((item) => get().transform(item)),
            }));
        },
        setPaginated: (pagination: Pagination, items: T[]) => {
            set(() => {
                return {
                    pagination,
                    items: items.map((item: T) => get().transform(item)),
                };
            });
        },

        queryFetch: (q: any = {}) => {
            return runQuery(createQuery({ [index]: q }));
        },

        queryFetchOne: (q: any = {}) => {
            return runQuery(createQuery({ [index]: shape(q).limit(1) }), true);
        },

        fetch: (params: any = {}) => {
            return apiClient()
                .get(`${index}`, { params })
                .then((res) => {
                    if (res.data.hasOwnProperty('current_page')) {
                        get().setPaginated(res.data, res.data.data);
                        return Promise.resolve(res.data.data);
                    } else {
                        get().setItems(res.data);
                        return Promise.resolve(res.data);
                    }
                });
        },

        fetchOne: (id: ID) => {
            return apiClient()
                .get(`${index}/${id}`)
                .then((res) => {
                    get().setCurrent(res.data);
                    return Promise.resolve(res.data);
                });
        },

        add: (item: T, addFirst: boolean = false) => {
            const { items, setItems } = get();
            setItems(addFirst ? [item, ...items] : [...items, item]);
        },
        filter: (predicate: (item: T, index: number) => boolean) => {
            const { items, setItems } = get();
            setItems(items.filter(predicate));
        },

        remove: (index: number) => {
            get().filter((_: T, i: number) => i != index);
        },

        sync: (data: Partial<T>, predicate: (item: T) => boolean) => {
            const { items, setItems } = get();
            setItems(items.map((item: T) => (predicate(item) ? { ...item, ...data } : item)));
        },

        syncWithId: (data: Partial<T>) => {
            get().sync(data, (item: T) => (item as any).id == (data as any).id);
        },

        update: (id: ID, data: Partial<T> | FormData, options?: any) => {
            return withLoading(`update_${index}_${id}`, async () => {
                const updated = await updatePrimitive<T>({ data, index, id, options });
                if (options?.sync !== false) {
                    get().syncWithId(updated);
                }
                return updated;
            });
        },

        create: (data: Partial<T> | FormData, options?: any) => {
            return withLoading(`create_${index}`, async () => {
                const created = await createPrimitive<T>({ index, data, options });
                if (options?.sync !== false) {
                    get().add(created, options?.addFirst === true);
                }
                return created;
            });
        },

        destroy: (id: ID, options?: any) => {
            return withLoading(loadingKey('destroy', index, id), async () => {
                const deleted = await destroyPrimitive({ index, id, options });
                if (options?.sync !== false) {
                    get().filter((item: T) => (item as any).id !== id);
                }
                return deleted;
            });
        },

        loading: (operation: Operation, id?: ID) => {
            return useLoading.getState().status[loadingKey(operation, index, id)];
        },
        updateCurrent: (data: Partial<T>, options?: any) => {
            const current = get().current;
            if (!current) {
                return Promise.reject('No current element selected.');
            }
            return get().update(current.id, data, options);
        },

        destroyCurrent: (options?: any) => {
            const current = get().current;
            if (!current) {
                return Promise.reject('No current element selected.');
            }

            return get().destroy(current.id, options);
        },

        loadingCurrent: (operation: Operation) => {
            const current = get().current;
            if (!current) {
                return false;
            } else {
                return useLoading.getState().status[loadingKey(operation, index, current.id)];
            }
        },
    };
};

export const createResourceStore = <T, S = {}>(index: string, stateSlice?: (set: any, get: any) => S) => {
    return create<BaseResourceStore<T> & S>((set, get) => ({
        ...initResourceStore<T>(index, set, get),
        ...(stateSlice ? stateSlice(set, get) : ({} as S)),
    }));
};
