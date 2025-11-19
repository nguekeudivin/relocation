import cities from '@/config/cities.json';
import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { SelectField, TextAreaField } from '../ui/form';

export default function BookingHomeForm() {
    const form = useSimpleForm({
        date: '',
    });
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
            <div className="col-span-2">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    <aside className="space-y-4 bg-gray-200 p-6">
                        <h3 className="font-semibold"> Move From</h3>
                        <SelectField
                            onChange={form.handleChange}
                            options={cities.map((item) => ({ label: item, value: item }))}
                            label={t('City')}
                            value={form.values.from_city}
                        />
                        <TextAreaField
                            name="from_street"
                            onChange={form.handleChange}
                            label={t('Address')}
                            rows={2}
                            value={form.values.from_street}
                        />
                    </aside>
                    <aside className="bg-primary-50 space-y-4 p-6">
                        <h3 className="font-semibold"> to</h3>
                        <SelectField
                            onChange={form.handleChange}
                            options={cities.map((item) => ({ label: item, value: item }))}
                            label={t('City')}
                            value={form.values.to_city}
                        />
                        <TextAreaField name="to_street" onChange={form.handleChange} label={t('Address')} rows={2} value={form.values.to_street} />
                    </aside>
                </div>
                <div className="mt-8">
                    <Button color="secondary" className="hover:bg-primary-600 transition duration-300 hover:text-gray-900">
                        Continue <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
