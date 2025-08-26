import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { Users, Bed, CalendarCheck, LayoutDashboard, Sun, Moon, UserCog, Truck, UserCircle, FileText } from 'lucide-react';
import AppLogo from './app-logo';
import { useAppearance } from '@/hooks/use-appearance';
import { NavItem, Auth } from '@/types';

// Menú Admin
const mainNavItemsAdmin: NavItem[] = [
  { title: 'Panel de control', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Reservas', href: '/admin/reservacion', icon: CalendarCheck },
  { title: 'Habitaciones', href: '/admin/habitaciones', icon: Bed },
  { title: 'Usuarios', href: '/admin/usuarios', icon: Users },
  { title: 'Recepcionistas', href: '/admin/recepcion', icon: UserCog },
  { title: 'Proveedores', href: '/admin/proveedores', icon: Truck },
  { title: 'Huespedes', href: '/admin/huespedes', icon: UserCircle },
  { title: 'Facturación', href: '/admin/facturacion', icon: FileText },
];

// Menú Recepcionista
const mainNavItemsRecep: NavItem[] = [
  { title: 'Reservas', href: '/admin/reservacion', icon: CalendarCheck },
  { title: 'Habitaciones', href: '/admin/habitaciones', icon: Bed },
  { title: 'Huespedes', href: '/admin/huespedes', icon: UserCircle },
  { title: 'Facturación', href: '/admin/facturacion', icon: FileText },
];

export function AppSidebar() {
  const { appearance, updateAppearance } = useAppearance();
  const { state } = useSidebar();

  // Traemos datos de Inertia
  const { auth } = usePage<{ auth: Auth }>().props;

  // Determinamos el menú según el rol
  const navItems = auth.user.role === 'admin' ? mainNavItemsAdmin : mainNavItemsRecep;

  const toggleTheme = () => {
    updateAppearance(appearance === 'light' ? 'dark' : 'light');
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter className="flex flex-col items-center gap-3">
        <SidebarMenuButton
          size="lg"
          onClick={toggleTheme}
          variant="outline"
          className="bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors w-full"
        >
          {appearance === 'light' ? (
            <div className={`grid items-center w-full ${state === 'expanded' ? 'grid-cols-[30px_auto]' : 'grid-cols-[30px]'} gap-3`}>
              <Moon className="h-8 w-8 rounded-full text-white bg-sky-200 p-0.5" />
              {state === 'expanded' && (
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Modo oscuro
                </span>
              )}
            </div>
          ) : (
            <div className={`grid items-center w-full ${state === 'expanded' ? 'grid-cols-[30px_auto]' : 'grid-cols-[30px]'} gap-3`}>
              <Sun className="h-8 w-8 rounded-full text-white bg-yellow-400 p-0.5" />
              {state === 'expanded' && (
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Modo claro
                </span>
              )}
            </div>
          )}
        </SidebarMenuButton>

        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
