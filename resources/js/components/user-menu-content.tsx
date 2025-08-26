import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    cleanup();
    router.post(route('logout'));
  };

  return (
    <>
      <DropdownMenuLabel className="font-normal text-blue-900 dark:text-blue-300">
        <div className="flex items-center gap-2 py-2 px-3 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator className="border-blue-200 dark:border-blue-700" />

      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="
              block w-full px-3 py-2
              text-blue-700 dark:text-blue-400
              rounded-md
              transition-colors
              hover:bg-blue-100 dark:hover:bg-blue-700
              hover:text-blue-900 dark:hover:text-blue-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            href={route('profile.edit')}
            prefetch
            onClick={cleanup}
          >
            <Settings className="mr-2 text-blue-600 dark:text-blue-300" />
            Configuración
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator className="border-blue-200 dark:border-blue-700" />

      <DropdownMenuItem asChild>
        <a
          href={route('logout')}
          onClick={handleLogout}
          className="
            block w-full px-3 py-2
            text-red-600 dark:text-red-400
            rounded-md
            transition-colors
            hover:bg-red-100 dark:hover:bg-red-700
            hover:text-red-800 dark:hover:text-red-300
            focus:outline-none focus:ring-2 focus:ring-red-500
          "
        >
          <LogOut className="mr-2 text-red-600 dark:text-red-300" />
          Salir
        </a>
      </DropdownMenuItem>
    </>
  );
}
