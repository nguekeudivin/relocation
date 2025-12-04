import { Modal } from '@/components/ui/modal';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { Booking } from '@/store/Booking';
import { router } from '@inertiajs/react';
import { ArrowRight, CreditCard } from 'lucide-react'; // ou tes icônes habituelles
import { PaymentMethodMap } from '../payment-meta';

function PaypalIcon({ className }: { className?: string }) {
    return (
        <svg className="h-8 w-8" viewBox="-3.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs></defs>
            <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Color-" transform="translate(-804.000000, -660.000000)" fill="#022B87">
                    <path
                        d="M838.91167,663.619443 C836.67088,661.085983 832.621734,660 827.440097,660 L812.404732,660 C811.344818,660 810.443663,660.764988 810.277343,661.801472 L804.016136,701.193856 C803.892151,701.970844 804.498465,702.674333 805.292267,702.674333 L814.574458,702.674333 L816.905967,688.004562 L816.833391,688.463555 C816.999712,687.427071 817.894818,686.662083 818.95322,686.662083 L823.363735,686.662083 C832.030541,686.662083 838.814901,683.170138 840.797138,673.069296 C840.856106,672.7693 840.951363,672.194809 840.951363,672.194809 C841.513828,668.456868 840.946827,665.920407 838.91167,663.619443 Z M843.301017,674.10803 C841.144899,684.052874 834.27133,689.316292 823.363735,689.316292 L819.408334,689.316292 L816.458414,708 L822.873846,708 C823.800704,708 824.588458,707.33101 824.733611,706.423525 L824.809211,706.027531 L826.284927,696.754676 L826.380183,696.243184 C826.523823,695.335698 827.313089,694.666708 828.238435,694.666708 L829.410238,694.666708 C836.989913,694.666708 842.92604,691.611256 844.660308,682.776394 C845.35583,679.23045 845.021677,676.257496 843.301017,674.10803 Z"
                        id="Paypal"
                    ></path>
                </g>
            </g>
        </svg>
    );
}

export function ChoosePaymentMethod() {
    const name = 'choose_payment_method';
    const { t } = useTranslation();
    const store = useAppStore();
    const booking = store.booking.current as Booking;

    const handlePaypalClick = () => {
        // Exemple : store.setPaymentMethod('paypal')
        // puis redirection ou ouverture du provider PayPal
        console.log('→ Redirection vers PayPal...');
        // window.location.href = '/api/payment/paypal/create';
    };

    const handleCardClick = () => {
        //console.log('→ Ouverture du formulaire carte bancaire (Stripe, etc.)');
        // store.setPaymentMethod('card')
        // store.openModal('card_payment_form')
        router.visit(`/bookings/${booking.id}/pay`);
    };

    const methods = [
        {
            value: 'paypal',
            label: PaymentMethodMap.paypal,
            icon: <PaypalIcon className="h-8 w-8" />,
            color: 'bg-blue-500/20 text-blue-700 border-blue-200',
            hover: 'hover:bg-blue-500/30 hover:border-blue-200',
            description: t('Secure payment via PayPal or credit card'),
        },
        {
            value: 'card',
            label: PaymentMethodMap.card,
            icon: <CreditCard className="h-8 w-8" />,
            color: 'bg-indigo-500/20 text-indigo-700 border-indigo-200',
            hover: 'hover:bg-indigo-500/30 hover:border-indigo-200',
            description: t('Pay securely with your credit/debit card'),
        },
    ];

    if (!booking) return undefined;

    return (
        <Modal title={t('Choose payment method')} name={name} className="w-[500px] max-w-[95vw]">
            <div className="space-y-4 py-4">
                <div className="text-secondary-600">
                    <p className="text-secondary-500 mt-1 text-sm">{t('All payments are secure and encrypted')}</p>
                </div>

                <div className="space-y-4">
                    {methods.map((method) => (
                        <button
                            key={method.value}
                            onClick={() => {
                                if (method.value === 'paypal') handlePaypalClick();
                                if (method.value === 'card') handleCardClick();
                            }}
                            className={`group relative w-full transform overflow-hidden border-2 bg-white p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${method.color} ${method.hover} focus:ring-primary-500/20 focus:ring-4 focus:outline-none`}
                        >
                            <div className="relative flex items-start gap-5">
                                <div className="flex-shrink-0 rounded-xl bg-white/70 p-4 shadow-md backdrop-blur-sm">{method.icon}</div>

                                <div className="flex-1">
                                    <h3 className="text-my-dark text-xl font-semibold">{method.label}</h3>
                                    <p className="text-secondary-600 mt-2 text-sm leading-relaxed">{method.description}</p>

                                    {/* Petit badge de sécurité */}
                                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-700">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>{t('256-bit SSL encrypted')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Flèche décorative au hover */}
                            <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                                <ArrowRight />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Pied de page rassurant */}
                <div className="border-secondary-200 mt-4 text-center">
                    <p className="text-secondary-500 text-xs">
                        {t('By continuing, you agree to our')}{' '}
                        <a href="/terms" className="hover:text-primary-600 underline">
                            {t('Terms of Service')}
                        </a>{' '}
                        {t('and')}{' '}
                        <a href="/privacy" className="hover:text-primary-600 underline">
                            {t('Privacy Policy')}
                        </a>
                    </p>
                </div>
            </div>
        </Modal>
    );
}
