import React, { HTMLAttributes, useState } from "react";
import { type SharedData } from '@/types';
import {Link, router, usePage} from '@inertiajs/react';
import { ChevronDown, LogOut, Moon, Sun, } from "lucide-react";
import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LucideIcon, Monitor} from 'lucide-react';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, User } from "lucide-react"

function Theme({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance();

  // Opciones de tema
  const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  // Buscar la opción actual
  const currentIndex = tabs.findIndex((tab) => tab.value === appearance);
  const currentTab = tabs[currentIndex] ?? tabs[0];

  // Función para rotar el tema
  const toggleTheme = () => {
    const nextIndex = (currentIndex + 1) % tabs.length;
    updateAppearance(tabs[nextIndex].value);
  };

  return (
    <div className={cn("inline-flex", className)} {...props}>
      <button
        onClick={toggleTheme}
        className={cn(
          "flex items-center justify-center rounded-md px-3 py-1 transition-colors cursor-pointer ",
          "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100"
        )}
      >
        <currentTab.icon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Header({ showEmail = false }: { showEmail?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [menuOpen, setMenuOpen] = React.useState(false);
    const getInitials = useInitials();
    

  return (
    <header>
      {/* Menú de navegación superior */}
        <nav className="bg-white dark:bg-[#1A1A1A] shadow-sm fixed w-full z-50 top-0 left-0 ">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                {/* Logo */}
                <section className="flex items-center">
                <Link
                    href={route("home")}
                    className="flex items-center "
                >
                    <span className="rounded-md bg-sky-500 p-3 text-white mr-2 font-bold" >MDM</span>
                    <div>
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white text-base font-medium tracking-tight">Maravillas del Mar</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Lorem ipsum
                    </p>
                    </div>
                </Link>
                </section>

                {/* Botón hamburguesa */}
                <button
                className="md:hidden flex items-center px-3 py-2 border rounded text-gray-800 dark:text-gray-200 border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menú"
                >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                </button>

                {/* Menú desktop */}
                <div className="hidden md:flex md:gap-6">
                <section className="flex flex-nowrap gap-2">
                    <Link
                    href={route("home")}
                    className={`nav-link p-2 flex items-center ${
                        route().current("home")
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "border-b-2 border-transparent hover:border-blue-400"
                    }`}
                    >
                    Inicio
                    </Link>

                    <Link
                    href={route("Habitaciones")}
                    className={`nav-link p-2 flex items-center ${
                        route().current("Habitaciones")
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "border-b-2 border-transparent hover:border-blue-400"
                    }`}
                    >
                    Habitaciones
                    </Link>

                    <Link
                    href={route("Servicios")}
                    className={`nav-link p-2 flex items-center ${
                        route().current("Servicios")
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "border-b-2 border-transparent hover:border-blue-400"
                    }`}
                    >
                    Servicios
                    </Link>

                    <Link
                    href={route("Galeria")}
                    className={`nav-link p-2 flex items-center ${
                        route().current("Galeria")
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "border-b-2 border-transparent hover:border-blue-400"
                    }`}
                    >
                    Galería
                    </Link>

                    <Link
                        href={route("Contacto")}
                        className={`nav-link p-2 flex items-center ${
                            route().current("Contacto")
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "border-b-2 border-transparent hover:border-blue-400"
                        }`}
                        >
                        Contacto
                    </Link>                    
                    {auth.user ? (
                        <>
                        <Link
                            href={route("Reservaciones")}
                            className={`nav-link p-2 flex items-center ${
                                route().current("Reservaciones")
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "border-b-2 border-transparent hover:border-blue-400"
                            }`}
                            >
                            Reservas
                        </Link>

                        </>
                    ) : (
                    <></>)

                    }
                </section>
                <section className="flex gap-2">
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900">
                                <Avatar className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-neutral-800 shadow-sm">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} className="object-cover" />
                                    <AvatarFallback className="rounded-full flex items-center justify-center h-full bg-sky-400 text-white font-semibold text-sm shadow-inner ">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="hidden md:flex flex-col items-start min-w-0">
                                    <span className="truncate font-semibold text-gray-900 dark:text-white text-sm max-w-[120px] ">
                                        {auth.user.name}
                                    </span>
                                    {showEmail && (
                                        <span className="truncate text-xs text-gray-500 dark:text-gray-400 max-w-[120px]">
                                            {auth.user.email}
                                        </span>
                                    )}
                                </div>
                                
                            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent 
                                    className="w-64 p-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl rounded-xl animate-in slide-in-from-top-2 duration-200" 
                                    align="end"
                                    sideOffset={8}
                                >
                                    {/* Header del usuario */}
                                    <div className="px-3 py-3 mb-2 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 rounded-full ring-2 ring-white dark:ring-neutral-700">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                <AvatarFallback className="rounded-full flex items-center justify-center h-full bg-sky-400 text-white font-semibold text-sm shadow-inner ">
                                                    {getInitials(auth.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-neutral-700" />

                                    {/* Opciones del menú */}
                                    <div className="space-y-1 py-2">
                                        <DropdownMenuItem 
                                            onClick={() => router.visit(route("profile"))}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-150 group"
                                        >
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/50 transition-colors">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">Perfil</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Administra tu cuenta</span>
                                            </div>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem 
                                            onClick={() => router.visit(route("settings"))}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-150 group"
                                        >
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                                <Settings className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">Configuración</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Preferencias y ajustes</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </div>

                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-neutral-700" />

                                    {/* Cerrar sesión */}
                                    <div className="pt-2">
                                        <DropdownMenuItem
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-150 text-red-600 dark:text-red-400 group"
                                            onClick={() => router.post(route("logout"))}
                                        >
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/40 transition-colors">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Cerrar sesión</span>
                                                <span className="text-xs text-red-500 dark:text-red-400/70">Salir de la aplicación</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        ) : (
                            <>
                                <Link
                                href={route("login")}
                                className={`text-center rounded-md border border-sky-500 p-3 text-sm font-medium text-sky-600 bg-white dark:bg-transparent dark:text-sky-400 shadow-sm hover:bg-sky-50 dark:hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200 ${route().current("login") ? "bg-sky-50 border-b-2 border-blue-500 text-blue-600" : "border-b-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}
                                >
                                Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className={`text-center flex items-center rounded-md bg-sky-600 p-3 text-sm font-medium text-white shadow-md 
                                            hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 
                                            focus:ring-offset-2 transition-all duration-200 ${route().current("register") ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 shadow" : "border-b-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                        <Theme/>
                    
                </section>

                </div>
            </div>

            {/* Menú móvil debajo del navbar */}
            <div
                className={`md:hidden bg-white dark:bg-[#1A1A1A] shadow-md transition-all duration-300 overflow-hidden ${
                menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <section className="flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                 <Link
                    href={route("home")}
                    className={`nav-link p-1 flex items-center text-center  justify-center transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        route().current("home")
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 shadow"
                        : "border-b-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    >
                    Inicio
                    </Link>

                    <Link
                    href={route("Habitaciones")}
                    className={`nav-link p-1 flex items-center justify-center transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        route().current("Habitaciones")
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 shadow"
                        : "border-b-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    >
                    Habitaciones
                    </Link>

                    <Link
                    href={route("Servicios")}
                    className={`nav-link p-1 flex items-center justify-center transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        route().current("Servicios")
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 shadow"
                        : "border-b-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    >
                    Servicios
                    </Link>

                    <Link
                    href={route("Galeria")}
                    className={`nav-link p-1 flex items-center justify-center transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        route().current("Galeria")
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 shadow"
                        : "border-b-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    >
                    Galería
                    </Link>

                    <Link
                    href={route("Contacto")}
                    className={`nav-link p-1 flex items-center justify-center transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        route().current("Contacto")
                        ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50 shadow"
                        : "border-b-2 border-transparent hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    >
                    Contacto
                    </Link>
                </section>
                <section className="flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="shadow-lg flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900">
                                <Avatar className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-neutral-800 shadow-sm">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} className="object-cover" />
                                    <AvatarFallback className="rounded-full flex items-center justify-center h-full bg-sky-400 text-white font-semibold text-sm shadow-inner">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                
                                {/* Información del usuario - siempre visible pero adaptativa */}
                                <div className="flex flex-col items-start min-w-0 flex-1">
                                    <span className="truncate font-semibold text-gray-900 dark:text-white text-sm w-full">
                                        {auth.user.name}
                                    </span>
                                    {/* Email solo visible en tablets y desktop */}
                                    {showEmail && (
                                        <span className="hidden sm:block truncate text-xs text-gray-500 dark:text-gray-400 w-full">
                                            {auth.user.email}
                                        </span>
                                    )}
                                </div>
                                
                                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent 
                                className="w-64 p-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl rounded-xl animate-in slide-in-from-top-2 duration-200" 
                                align="end"
                                sideOffset={8}
                            >
                                {/* Header del usuario */}
                                <div className="px-3 py-3 mb-2 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 rounded-full ring-2 ring-white dark:ring-neutral-700">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-full flex items-center justify-center h-full bg-sky-400 text-white font-semibold text-sm shadow-inner">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenuSeparator className="bg-gray-200 dark:bg-neutral-700" />

                                {/* Opciones del menú */}
                                <div className="space-y-1 py-2">
                                    <DropdownMenuItem 
                                        onClick={() => router.visit(route("profile"))}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-150 group"
                                    >
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/50 transition-colors">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">Perfil</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Administra tu cuenta</span>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem 
                                        onClick={() => router.visit(route("settings"))}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors duration-150 group"
                                    >
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                            <Settings className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">Configuración</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Preferencias y ajustes</span>
                                        </div>
                                    </DropdownMenuItem>
                                </div>

                                <DropdownMenuSeparator className="bg-gray-200 dark:bg-neutral-700" />

                                {/* Cerrar sesión */}
                                <div className="pt-2">
                                    <DropdownMenuItem
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-150 text-red-600 dark:text-red-400 group"
                                        onClick={() => router.post(route("logout"))}
                                    >
                                        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/40 transition-colors">
                                            <LogOut className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Cerrar sesión</span>
                                            <span className="text-xs text-red-500 dark:text-red-400/70">Salir de la aplicación</span>
                                        </div>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="text-center rounded-md border border-sky-500 p-3 text-sm font-medium text-sky-600 bg-white dark:bg-transparent dark:text-sky-400 shadow-sm hover:bg-sky-50 dark:hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="text-center rounded-md bg-sky-600 p-3 text-sm font-medium text-white shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </section>
            </div>
        </nav>
    </header>
  );
}

