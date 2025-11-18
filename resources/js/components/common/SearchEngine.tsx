'use client';

import useAppStore from '@/store';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { InputField } from '../ui/form';

export const SearchEngine = ({ form, children, onSubmit }: { form: any; children?: any; onSubmit: any }) => {
    const store = useAppStore();

    return (
        <section className="my-6">
            <div className="mb-4 flex items-center">
                <InputField
                    placeholder="Enter a keyword to make a research"
                    name="keyword"
                    value={form.values.keyword}
                    onChange={form.handleChange}
                    inputClass="w-[400px]"
                />

                {children && (
                    <Button onClick={() => store.display.toggle('TableFilters')} className="alternative mr-2 ml-2">
                        Filtrer
                    </Button>
                )}

                <button
                    type="submit"
                    onClick={onSubmit}
                    className="border-primary-700 bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 ms-2 rounded-full border p-2 text-sm font-medium text-white focus:ring-4 focus:outline-none"
                >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>{' '}
                </button>
            </div>
            {store.display.visible.TableFilters && children && (
                <div className="rounded-md border-dashed border-gray-200 bg-gray-50 p-4">{children}</div>
            )}
        </section>
    );
};
