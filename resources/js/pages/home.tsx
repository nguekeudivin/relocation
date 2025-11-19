import { CreateBookingModal } from '@/components/booking/booking-modals/create-booking-modal';
import Logo from '@/components/common/Logo';
import BookingHomeForm from '@/components/home/BookingHomeForm';
import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import useAppStore from '@/store';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, Caravan } from 'lucide-react';

export default function Welcome() {
    const store = useAppStore();
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();

    return (
        <>
            <CreateBookingModal />
            <nav className="">
                {/* <div className="bg-[#1B2024] py-2">
                    <ul className="mx-auto flex max-w-7xl items-center gap-8">
                        {[
                            { icon: Phone, text: '+49 56 43 34 34' },
                            { icon: Mail, text: 'relocation@gmail.com' },
                        ].map((item) => (
                            <li className="flex items-center gap-2">
                                <item.icon className="text-primary-600 h-4 w-4" /> <span className="text-sm text-white">{item.text}</span>
                            </li>
                        ))}
                    </ul>
                </div> */}
                <div className="border-b border-gray-300">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-2">
                        <div className="flex items-center">
                            <div>
                                <Logo />
                            </div>
                            <ul className="ml-18 flex items-center gap-x-8">
                                {[1, 2, 3, 4].map((item) => (
                                    <li className="hover:bg-primary py-4"> Link Item {item} </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => {
                                    store.display.show('create_booking');
                                }}
                            >
                                {t('Book a service')}
                            </Button>
                            <Link href="/login">
                                <Button color="dark">{t('Account')}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="h-[700px] bg-cover" style={{ backgroundImage: `url(/images/image-15.png)` }}>
                <div className="h-full w-full bg-white/30">
                    <section className="mx-auto grid max-w-6xl grid-cols-1 py-[150px] md:grid-cols-2">
                        <aside className="space-y-8">
                            <div className="text-6xl font-light">
                                <h2>The best move you</h2>
                                <h2 className="mt-2 font-semibold">
                                    will <span className="bg-primary-500/50">ever make </span>
                                </h2>
                            </div>
                            <p className="text-lg">
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum, dicta! Ad doloremque enim mollitia totam. Soluta porro
                                doloremque voluptatem excepturi perferendis tempore doloribus commodi officia fugiat voluptas, sequi nemo nulla!
                            </p>
                            <div>
                                <Button
                                    onClick={() => {
                                        store.display.show('create_booking');
                                    }}
                                    className="px-8 py-3 text-lg"
                                >
                                    {t('Book a prestation')}
                                </Button>
                            </div>
                        </aside>
                        <aside></aside>
                    </section>
                </div>
            </section>
            <section className="bg-[#F2F2F2]">
                <div className="mx-auto max-w-6xl py-[50px]">
                    <h3 className="text-center text-lg font-light">We move safely</h3>
                    <div className="border-primary-600 mx-auto mt-1 w-[120px] border-2"></div>
                    <h4 className="mt-4 text-center text-4xl">
                        <span className="font-light">Safe moving</span> <span className="font-semibold"> Procedures</span>
                    </h4>

                    <div className="mt-12 grid grid-cols-1 gap-16 md:grid-cols-3">
                        {[
                            {
                                title: (
                                    <>
                                        {t('Make your')} <br />
                                        <span className="font-semibold">{t('reversation')}</span>
                                    </>
                                ),
                                subtitle: t('Explore featured'),
                                icon: Building2,
                            },
                            {
                                title: (
                                    <>
                                        {t('Load your')} <br />
                                        <span className="font-semibold"> {t('container')}</span>
                                    </>
                                ),
                                subtitle: t('Explore featured'),
                                icon: Caravan,
                            },
                            {
                                title: (
                                    <>
                                        {t('We will take it')} <br />
                                        <span className="font-semibold">{t('from there')}</span>
                                    </>
                                ),
                                subtitle: t('Explore featured'),
                                icon: Building2,
                            },
                        ].map((item, index: number) => (
                            <div className="process hover:bg-primary-500 relative h-64 bg-white p-8">
                                <h3 className="text-2xl uppercase">{item.title}</h3>
                                <div className="absolute bottom-8 left-0 flex w-full items-center justify-between px-8">
                                    <h4 className="">{item.subtitle}</h4>
                                    <item.icon className="h-12 w-12 stroke-1" />
                                </div>
                                <div className="process-index absolute top-8 right-8 text-3xl font-semibold text-gray-300">{`0${index + 1}`}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-[100px]">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
                    <aside className="bg-cover" style={{ backgroundImage: `url(images/image-16.png)` }}></aside>
                    <aside>
                        <h3 className="text-lg uppercase">Relocation Company</h3>
                        <div className="border-primary-600 mt-1 w-[220px] border-2"></div>
                        <h4 className="mt-4 text-4xl">
                            <p className="font-light">We give you complete</p> <p className="font-semibold"> control of your shipment</p>
                        </h4>
                        <p className="mt-6 text-gray-600">
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reprehenderit odit commodi accusamus reiciendis molestias,
                            veritatis consectetur. Esse dolorem eos cum, beatae veritatis nihil, quaerat sed commodi, ratione ad ipsa facere.
                        </p>
                        <ul className="mt-6 space-y-4">
                            {[
                                {
                                    title: t('Innovative Systems'),
                                    description: t('Esse dolorem eos cum, beatae veritatis nihil, quaerat sed commodi, ratione ad ipsa facere.'),
                                },
                                {
                                    title: t('Compare prices'),
                                    description: t('Esse dolorem eos cum, beatae veritatis nihil, quaerat sed commodi, ratione ad ipsa facere.'),
                                },
                            ].map((item) => (
                                <li className="">
                                    <h3 className="flex items-center gap-2 font-semibold uppercase">
                                        <div className="bg-primary-500 h-4 w-4 gap-2"></div> <span>{item.title}</span>
                                    </h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </section>

            <section className="bg-cover bg-center" style={{ backgroundImage: `url(images/image-3.jpg)` }}>
                <div className="h-full w-full bg-black/80 pt-[150px] pb-[200px] text-white">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2">
                        <aside>
                            <h3 className="text-lg uppercase">{t('Focus on quality')}</h3>
                            <div className="border-primary-600 w-[180px] border-1"></div>
                            <h4 className="mt-4 text-4xl">
                                <p className="font-light">{t('We provide the best services')}</p>
                                <p className="font-semibold">{t('for your relocation')}</p>
                            </h4>
                        </aside>
                        <aside>
                            <ul className="flex items-center gap-2">
                                {[
                                    { icon: Caravan, text: 'Transparent pricing' },
                                    { icon: Caravan, text: 'Good Equipements' },
                                    { icon: Caravan, text: 'Years of experiences' },
                                ].map((item) => (
                                    <li>
                                        <item.icon className="text-primary-500 h-12 w-12 stroke-1" />
                                        <p className="mt-2 text-lg uppercase">{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="relative h-[400px] bg-gray-300">
                <div className="relative -top-[100px] mx-auto max-w-6xl bg-white">
                    <div className="bg-primary-500 w-1/2 px-8 py-4 text-xl font-semibold uppercase">{t('Book a prestation')}</div>
                    <div className="p-8">
                        <BookingHomeForm />
                    </div>
                </div>
            </section>

            <footer className="border-t border-gray-100 bg-gray-200">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-24 py-[50px] md:grid-cols-2">
                    <div>
                        <Logo className="text-start" />
                        <p className="mt-4 text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure doloribus quas iusto aut a vero ut facilis deserunt, illo
                            unde deleniti mollitia minima aliquam delectus, repellat ipsa enim consequuntur iste.
                        </p>
                        <div></div>
                    </div>
                    <div className="pt-12">
                        <ul className="space-y-1">
                            {[
                                { text: t('Book a reservation'), link: '#bout' },
                                { text: t('Login into account'), link: '#bout' },
                                { text: t('About Us'), link: '#about' },
                                { text: t('Policy'), link: '#' },
                                { text: t('Terms and conditions'), link: '#' },
                            ].map((item) => (
                                <li>
                                    {' '}
                                    <Link className="hover:text-primary-500 transition duration-300">{item.text} </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-300 py-4 text-gray-600">
                    <div className="mx-auto max-w-6xl"> {`Copyright ${new Date().getFullYear()} Relocation`}</div>
                </div>
            </footer>
        </>
    );
}
