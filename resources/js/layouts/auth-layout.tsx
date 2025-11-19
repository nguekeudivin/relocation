export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
            <div className="bg-my-gray flex items-center">
                <div className="h-screen w-1/2 bg-white p-4 shadow-xl md:p-8">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-white">
                        <div className="w-[400px] rounded-lg bg-white md:w-[450px]">{children}</div>
                    </div>
                </div>

                <div
                    className="flex h-screen w-1/2 items-center justify-center bg-cover p-12"
                    // style={{ backgroundImage: 'url(/images/login.svg)' }}
                >
                    <img className="h-full w-3/4 bg-cover" src="/images/login-2.svg" />
                </div>
            </div>
        </div>
    );
}
