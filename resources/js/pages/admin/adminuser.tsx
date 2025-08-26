import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    identity_document: string;
    roles: string[];
}
export interface Pagination<T> {
  data: T[];
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}
interface PageProps { 
  pagination: Pagination<User>; 
  errors: Record<string, string>; 
  flash?: any; 
  [key: string]: any;
}



const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/admin/usuarios' },
];

export default function AdminUser() {
    const { props } = usePage();
    const { pagination } = usePage<PageProps>().props;
    const { users: initialUsers } = props as unknown as { users: User[] };
    const [users, setUsers] = useState<User[]>(initialUsers);

    // Estados para modales
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        identity_document: "",
        password: "",
        password_confirmation: "",
        roles: [] as string[],
    });

    // Estados adicionales para efectos
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<keyof User>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isLoading, setIsLoading] = useState(false);

    /** ----- FUNCIONES MODAL ----- **/
    const openEditModal = (user: User) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            identity_document: user.identity_document,
            password: "",
            password_confirmation: "",
            roles: user.roles,
        });
        setIsEditModalOpen(true);
    };

    const openCreateModal = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            identity_document: "",
            password: "",
            password_confirmation: "",
            roles: [],
        });
        setIsCreateModalOpen(true);
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setCurrentUser(null);
    };

    /** ----- FUNCIONES CRUD ----- **/
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.post(route("admin.adminuser.store"), formData, {
            onSuccess: (page) => {
                setUsers(page.props.users as User[]);
                closeModal();
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setIsLoading(true);

        router.put(route("admin.adminuser.update", currentUser.id), formData, {
            onSuccess: (page) => {
                setUsers(page.props.users as User[]);
                closeModal();
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
        setIsLoading(true);

        router.delete(route("admin.adminuser.destroy", id), {
            onSuccess: (page) => {
                setUsers(page.props.users as User[]);
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    };

    // Filtros y ordenamiento
    const filteredAndSortedUsers = users
        .filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm) ||
            user.identity_document.includes(searchTerm)
        )
        .sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return sortOrder === 'asc' ? comparison : -comparison;
            }
            
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            return 0;
        });

    const handleSort = (column: keyof User) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    function getRoleColor(role: string) {
        switch(role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'user':
                return 'bg-blue-100 text-blue-800';
            case 'recepcionista':
                return 'bg-green-100 text-green-800';
            case 'proveedor':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Procesando...</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
                <div className="mx-auto">
                    {/* Header Section */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 mb-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-2">
                                    Gestión de Usuarios
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Administra y controla los usuarios del sistema
                                </p>
                            </div>
                            
                            <button
                                onClick={openCreateModal}
                                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-emerald-400/50"
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="flex items-center space-x-3 relative z-10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Crear Usuario</span>
                                </div>
                            </button>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="mt-8 flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar usuarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center px-4 py-2 bg-white/30 dark:bg-gray-700/30 rounded-xl">
                                <span className="font-medium">{filteredAndSortedUsers.length}</span>
                                <span className="ml-1">usuarios encontrados</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                    <tr>
                                        {[
                                            { key: 'id', label: 'ID' },
                                            { key: 'name', label: 'Nombre' },
                                            { key: 'email', label: 'Email' },
                                            { key: 'phone', label: 'Teléfono' },
                                            { key: 'identity_document', label: 'Documento' },
                                        ].map((column) => (
                                            <th
                                                key={column.key}
                                                onClick={() => handleSort(column.key as keyof User)}
                                                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 select-none group"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <span>{column.label}</span>
                                                    <div className="flex flex-col">
                                                        <svg 
                                                            className={`w-3 h-3 transition-colors duration-200 ${
                                                                sortBy === column.key && sortOrder === 'asc' 
                                                                    ? 'text-blue-600 dark:text-blue-400' 
                                                                    : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400'
                                                            }`} 
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <svg 
                                                            className={`w-3 h-3 -mt-1 transition-colors duration-200 ${
                                                                sortBy === column.key && sortOrder === 'desc' 
                                                                    ? 'text-blue-600 dark:text-blue-400' 
                                                                    : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400'
                                                            }`} 
                                                            fill="currentColor" 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Roles</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredAndSortedUsers.map((user, index) => (
                                        <tr 
                                            key={user.id} 
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 group"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                        {user.id}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{user.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{user.identity_document}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getRoleColor(role)}`}
                                                        >
                                                            {role === 'admin' ? 'Administrador' :
                                                            role === 'user' ? 'Usuario' :
                                                            role === 'recepcionista' ? 'Recepcionista' :
                                                            role === 'proveedor' ? 'Proveedor' : role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="group relative p-2 mr-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                            Editar
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="group relative p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                            Eliminar
                                                        </div>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredAndSortedUsers.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron usuarios</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex space-x-2 justify-end mt-4">
                <div className="p-4 bg-sky-200 dark:bg-gray-800 rounded-xl py-5 ">
                    {pagination.links.map((link, idx) => (
                        <a
                        key={idx}
                        href={link.url || "#"}
                        className={`m-3 p-3 rounded-xl ${
                            link.active ? "font-bold bg-white dark:bg-gray-700" : "hover:dark:bg-gray-700"
                        }`}>
                        {link.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Modales */}
            {isCreateModalOpen && (
                <Modal 
                    title="Crear Usuario" 
                    onClose={closeModal} 
                    onSubmit={handleCreate} 
                    formData={formData} 
                    setFormData={setFormData}
                    isLoading={isLoading}
                />
            )}

            {isEditModalOpen && currentUser && (
                <Modal 
                    title="Editar Usuario" 
                    onClose={closeModal} 
                    onSubmit={handleUpdate} 
                    formData={formData} 
                    setFormData={setFormData}
                    isLoading={isLoading}
                />
            )}
        </AppLayout>
    );
}

/** ----- COMPONENTE MODAL MEJORADO ----- **/
interface ModalProps {
    title: string;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    isLoading?: boolean;
}

function Modal({ title, onClose, onSubmit, formData, setFormData, isLoading = false }: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                    >
                        <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder="Ingresa el nombre completo"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder="123-456-7890"
                                required
                            />
                        </div>

                        {/* Documento */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Documento de Identidad
                            </label>
                            <input
                                type="text"
                                value={formData.identity_document}
                                onChange={(e) => setFormData({ ...formData, identity_document: e.target.value })}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder="12345678"
                                required
                            />
                        </div>
                    </div>
                    {/* Roles */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Rol del Usuario
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {['admin', 'user', 'recepcionista', 'proveedor'].map((role) => (
                                <label
                                    key={role}
                                    className="flex items-center space-x-3 p-4 bg-white/30 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                                >
                                    <input
                                        type="radio"
                                        name="role" // mismo nombre para que funcione como radio
                                        value={role}
                                        checked={formData.roles?.[0] === role}
                                        onChange={(e) => setFormData({ ...formData, roles: [role] })}
                                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {role === 'admin'
                                            ? '🛡️ Administrador'
                                            : role === 'user'
                                            ? '👤 Usuario'
                                            : role === 'recepcionista'
                                            ? '🛎️ Recepcionista'
                                            : '📦 Proveedor'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>



                    {/* Contraseñas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {title.includes("Crear") ? "Contraseña" : "Nueva Contraseña (opcional)"}
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="••••••••"
                                    required={title.includes("Crear")}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {title.includes("Crear") && (
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Validation Messages */}
                    {formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-sm text-red-700 dark:text-red-400">Las contraseñas no coinciden</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading || (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation)}
                            className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                </div>
                            )}
                            <div className={`flex items-center space-x-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{title.includes("Crear") ? "Crear Usuario" : "Guardar Cambios"}</span>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}