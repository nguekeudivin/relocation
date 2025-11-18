import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export default function UserAvatar() {
    const { auth } = usePage<any>().props;
    return (
        <div className="flex flex-col items-center text-center">
            <Avatar className="flex h-36 w-36 items-center justify-center">
                <AvatarImage src="/images/avatar/avatar-1.webp" alt="Adeline Watson" className="rounded-full" />
                <AvatarFallback>AW</AvatarFallback>
            </Avatar>
            <h2 className="mt-2 text-lg font-bold">{auth.user.name}</h2>
            <p className="text-gray-500">{auth.user.current_mode == 'teacher' ? 'Formateur' : 'Apprenant'} ✨</p>
        </div>
    );
}
