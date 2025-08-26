import {Hotel} from 'lucide-react'

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sky-800 text-sidebar-primary-foreground">
                <Hotel/>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-sky-500">Maravillas del Mar</span>
                <span className='text-xs text-sm text-gray-500'>Sistema de Gestión</span>
            </div>
        </>
    );
}
