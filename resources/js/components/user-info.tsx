import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-sky-200 text-dark dark:bg-neutral-700 dark:text-white font-bold">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-bold text-sky-500 dark:text-sky-400">{user.name}</span>
                {showEmail && <span className="truncate text-xs dark:text-sky-400">{user.email}</span>}
            </div>
        </>
    );
}
