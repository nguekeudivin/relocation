import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import useAppStore from '@/store';

export const InfoElement = ({ detail, className }: { detail: { label: string; value: any }; className?: string }) => {
    return (
        <li key={detail.label} className={className}>
            <div className="text-gray-500">{detail.label}</div>
            <div className="font-medium">{detail.value}</div>
        </li>
    );
};

export const PriceItem = ({ label, value, color, surfix }: { label: string; value: number; color?: string; surfix?: string }) => {
    const { t } = useTranslation();
    const store = useAppStore();
    return (
        <div className="flex justify-between">
            <span className="text-sm text-gray-700">{t(label)}</span>
            {/* <span className={color}>{surfix ? `${formatNumber(value)} ${surfix}` : store.shop.formatAmount(value)}</span> */}
        </div>
    );
};

export const StatusItem = ({ label, status, color, children }: any) => {
    return (
        <>
            <label className="mb-1.5 block font-medium text-gray-600">{label}</label>
            <div className="flex items-center gap-8">
                <div>
                    <div className={cn('flex w-[100px] items-center justify-center rounded-full px-6 py-1.5 text-sm', color)}>{status}</div>
                </div>
                {children}
            </div>
        </>
    );
};
