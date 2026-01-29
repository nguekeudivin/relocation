import useTranslation from '@/hooks/use-translation';
import { Modal } from '../ui/modal';

export default function TermsModal() {
    const { t } = useTranslation();
    const name = 'terms_and_conditions';

    return (
        <Modal title={t('Terms and conditions')} name={name} className="max-w-[700px]">
            <h4 className="font-semibold"> {t('Customer obligations')}</h4>
            <p className="mt-4 text-sm text-gray-600">{t('terms_and_conditions')}</p>
        </Modal>
    );
}
