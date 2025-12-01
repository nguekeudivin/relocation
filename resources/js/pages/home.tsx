// FULL UPDATED RESPONSIVE + TRANSLATED COMPONENT

import { SuccessBookingModal } from '@/components/booking/booking-modals/booking-success-modal';
import { CreateBookingModal } from '@/components/booking/booking-modals/create-booking-modal';
import Logo from '@/components/common/Logo';
import ChangeLanguage from '@/components/shared/change-language';
import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgePercent, Caravan, Clock, LampDesk, NotebookPen, Package } from 'lucide-react';
import { useEffect } from 'react';

export default function Welcome() {
    const store = useAppStore();
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();

    useEffect(() => {
        store.display.show('create_booking');
    }, []);

    return (
        <>
            <CreateBookingModal />
            <SuccessBookingModal />

            {/* --- NAV --- */}
            <nav className="absolute top-0 w-full bg-transparent px-4 py-6 md:px-0">
                <div className="bg-[]"></div>
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <Logo />
                        <div className="">
                            <p className="text-2xl font-semibold">Arnold Umzug</p>
                            <p className="text-primary-400 text-2xl font-semibold">01514 7353235</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 md:mt-0">
                        <Button className="hidden md:inline-flex" onClick={() => store.display.show('create_booking')}>
                            {t('Book a prestation')}
                        </Button>

                        <Link href="/login" className="hidden md:inline-flex">
                            <Button color="dark">{t('Account')}</Button>
                        </Link>

                        <div>
                            <ChangeLanguage />
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO --- */}
            <section className="h-[750px] bg-cover" style={{ backgroundImage: `url(/images/image-17.png)` }}>
                <div className="h-full w-full bg-white/30 px-4">
                    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 pt-[180px] md:grid-cols-2">
                        <aside className="space-y-6">
                            <div className="text-3xl font-light md:text-5xl">
                                <h2>{t('The best move you')}</h2>
                                <h2 className="mt-2 font-semibold">
                                    {t('will')} <span className="bg-primary-500/50">{t('ever make')}</span>
                                </h2>
                            </div>

                            <p className="bg-white/40 text-lg md:bg-transparent md:p-2">
                                {t(
                                    'We provide top-quality relocation services designed to ensure safety, efficiency, and complete client satisfaction — from careful handling of your belongings to seamless coordination at every stage of your move.',
                                )}
                            </p>

                            <Button onClick={() => store.display.show('create_booking')} className="px-8 py-3 text-lg">
                                {t('Book a prestation')}
                            </Button>

                            <div>
                                <Link href="/login" className="md:hidden">
                                    <Button color="dark">{t('Account')}</Button>
                                </Link>
                            </div>
                        </aside>

                        <aside></aside>
                    </section>
                </div>
            </section>

            {/* --- SAFE MOVING PROCEDURES --- */}
            <section className="bg-[#F2F2F2] px-4">
                <div className="mx-auto max-w-6xl py-[50px] md:py-[120px]">
                    <h3 className="text-center text-xl font-light">{t('We move safely')}</h3>
                    <div className="border-primary-600 mx-auto mt-1 w-[120px] border-2"></div>
                    <h4 className="mt-4 text-center text-4xl">
                        <span className="font-light">{t('Safe moving')}</span> <span className="font-semibold">{t('Procedures')}</span>
                    </h4>

                    <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
                        {[
                            {
                                title: (
                                    <>
                                        {t('Make your')} <br />
                                        <span className="font-semibold">{t('reservation')}</span>
                                    </>
                                ),
                                subtitle: t('Explore featured'),
                                icon: NotebookPen,
                            },
                            {
                                title: (
                                    <>
                                        {t('Load your')} <br />
                                        <span className="font-semibold">{t('container')}</span>
                                    </>
                                ),
                                subtitle: t('Explore featured'),
                                icon: Package,
                            },
                            {
                                title: (
                                    <>
                                        {t('We will take it')} <br />
                                        <span className="font-semibold">{t('from there')}</span>
                                    </>
                                ),
                                subtitle: t('Explore featured'),
                                icon: Caravan,
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    store.display.show('create_booking');
                                }}
                                className="hover:bg-primary-500 relative h-48 bg-white p-8 transition hover:text-white md:h-64"
                            >
                                <h3 className="w-4/5 text-xl uppercase">{item.title}</h3>
                                <div className="absolute bottom-8 left-0 flex w-full items-center justify-between px-8">
                                    <h4>{item.subtitle}</h4>
                                    <item.icon className="h-12 w-12 stroke-1" />
                                </div>
                                <div className="absolute top-8 right-8 text-3xl font-semibold text-gray-300">{`0${index + 1}`}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COMPANY SECTION --- */}
            <section className="bg-white px-4 py-[50px] md:py-[150px]">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
                    <aside
                        className="h-[300px] rounded-lg bg-cover bg-center md:h-auto"
                        style={{ backgroundImage: `url(images/image-16.png)` }}
                    ></aside>

                    <aside>
                        <h3 className="font-semibold uppercase">{t('Relocation Company')}</h3>
                        <div className="border-primary-600 w-[220px] border-2"></div>

                        <h4 className="mt-4 text-4xl font-light">
                            {t('We give you complete')}
                            <br />
                            <span className="font-semibold">{t('control of your shipment')}</span>
                        </h4>

                        <p className="mt-6 text-gray-600">
                            {t(
                                'We ensure a smooth and stress-free moving experience through high-quality logistics, professional staff, and reliable coordination at every step of your relocation.',
                            )}
                        </p>

                        <ul className="mt-6 space-y-4">
                            {[
                                {
                                    title: t('Innovative Systems'),
                                    icon: LampDesk,
                                    description: t(
                                        'Our advanced tools, digital tracking, and modern logistics systems enhance efficiency and offer you complete visibility throughout the process.',
                                    ),
                                },
                                {
                                    title: t('Best prices'),
                                    icon: BadgePercent,
                                    description: t(
                                        'We provide competitive and transparent pricing, ensuring excellent value without compromising the quality or safety of your move.',
                                    ),
                                },
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <div>
                                        <div className="bg-primary-400 rounded-full p-4 text-white">
                                            <item.icon className="h-8 w-8 stroke-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </section>

            {/* --- QUALITY SECTION --- */}
            <section className="bg-cover bg-center" style={{ backgroundImage: `url(images/image-3.jpg)` }}>
                <div className="h-full w-full bg-black/50 px-4 pt-[100px] pb-[200px] text-white">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
                        <aside>
                            <h3 className="text-lg font-semibold uppercase">{t('Focus on quality')}</h3>
                            <div className="border-primary-600 w-[180px] border"></div>

                            <h4 className="mt-4 text-4xl">
                                <p className="font-light">{t('We provide the best services')}</p>
                                <p className="font-semibold">{t('for your relocation')}</p>
                            </h4>

                            <Button onClick={() => store.display.show('create_booking')} className="mt-12 px-8 py-3 text-lg">
                                {t('Book a prestation')}
                            </Button>
                        </aside>

                        <aside>
                            <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {[
                                    { icon: BadgePercent, text: t('Transparent pricing') },
                                    { icon: Caravan, text: t('Good Equipements') },
                                    { icon: Clock, text: t('Years of experiences') },
                                ].map((item, index) => (
                                    <li key={index} className="flex-col items-center text-start md:flex md:text-center">
                                        <item.icon className="text-primary-400 h-12 w-12 stroke-1" />
                                        <p className="mt-2 text-lg uppercase">{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-gray-100 bg-gray-200 px-4">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-24 py-[50px] md:grid-cols-2">
                    <div>
                        {/* <Logo className="text-start" /> */}

                        <div className="flex items-center gap-2">
                            <Logo />
                            <div className="">
                                <p className="text-2xl font-semibold">Arnold Umzug</p>
                                <p className="text-primary-400 text-2xl font-semibold">01514 7353235</p>
                            </div>
                        </div>

                        <p className="mt-4 text-gray-600">
                            {t('We are committed to delivering professional and reliable relocation services to all our clients.')}
                        </p>
                    </div>

                    <div className="md:pt-12">
                        <ul className="space-y-1 text-sm">
                            {[
                                { text: t('Book a reservation'), link: '#booking' },
                                { text: t('Login into account'), link: '/login' },
                                { text: t('About Us'), link: '#about' },
                                { text: t('Policy'), link: '#policy' },
                                { text: t('Terms and conditions'), link: '#terms' },
                            ].map((item, index) => (
                                <li key={index}>
                                    <Link className="hover:text-primary-500 transition duration-300" href={item.link}>
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mx-auto max-w-6xl border-t border-gray-300 py-4 text-gray-600">{`Copyright ${new Date().getFullYear()} Relocation`}</div>
            </footer>
        </>
    );
}
