export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
            <div className="bg-my-gray flex items-center">
                <div className="h-screen w-1/2 bg-white p-4 shadow-xl md:p-8">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-white">
                        <div className="w-[400px] rounded-lg bg-white md:w-[450px]">{children}</div>
                    </div>
                </div>

                <div className="flex h-screen w-1/2 items-center justify-center">
                    <div className="relative h-[400px] w-[400px]">
                        {/* Wavy SVG ripples, perfectly centered */}
                        <svg className="absolute inset-0 -top-[200px] -left-[200px] h-[800px] w-[800px]" viewBox="0 0 800 800">
                            <defs>
                                <filter id="turbulence">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
                                </filter>
                            </defs>

                            {/* Ripple 1 */}
                            <circle cx="400" cy="400" r="200" fill="none" stroke="#facc15" strokeWidth="4" filter="url(#turbulence)">
                                <animate attributeName="r" from="200" to="400" dur="4s" begin="0s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.6" to="0" dur="4s" begin="0s" repeatCount="indefinite" />
                            </circle>

                            {/* Ripple 2 */}
                            <circle cx="400" cy="400" r="200" fill="none" stroke="#facc15" strokeWidth="4" filter="url(#turbulence)">
                                <animate attributeName="r" from="200" to="400" dur="4s" begin="1s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.6" to="0" dur="4s" begin="1s" repeatCount="indefinite" />
                            </circle>

                            {/* Ripple 3 */}
                            <circle cx="400" cy="400" r="200" fill="none" stroke="#facc15" strokeWidth="4" filter="url(#turbulence)">
                                <animate attributeName="r" from="200" to="400" dur="4s" begin="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.6" to="0" dur="4s" begin="2s" repeatCount="indefinite" />
                            </circle>
                        </svg>

                        {/* Your logo div, centered */}
                        <div
                            className="absolute inset-0 h-[400px] w-[400px] rounded-full bg-cover bg-center"
                            style={{ backgroundImage: 'url(/images/logo.jpeg)' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
