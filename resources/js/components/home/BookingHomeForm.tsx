import { useSimpleForm } from '@/hooks/use-simple-form';
import useTranslation from '@/hooks/use-translation';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { TextAreaField } from '../ui/form';

export default function BookingHomeForm() {
    const form = useSimpleForm({
        date: '',
        from_address: '',
        to_address: '',
    });
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
            <div className="col-span-2">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    <aside className="space-y-4 bg-gray-200 p-6">
                        <h3 className="font-semibold">{t('Move From')}</h3>
                        <TextAreaField
                            name="from_address"
                            onChange={form.handleChange}
                            label={t('Moving out address')}
                            rows={2}
                            value={form.values.from_address}
                        />
                    </aside>
                    <aside className="bg-primary-50 space-y-4 p-6">
                        <h3 className="font-semibold">{t('Move To')}</h3>
                        <TextAreaField
                            name="to_address"
                            onChange={form.handleChange}
                            label={t('Moving in address')}
                            rows={2}
                            value={form.values.to_address}
                        />
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
