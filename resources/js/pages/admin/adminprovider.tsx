import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Search, Edit, Trash2, Plus, User, Check, Phone, Mail, X, UserPlus, Filter, ArrowUpDown, Eye, MapPin } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Proveedores', href: '/admin/proveedores' },
];

interface Pagination<T> {
  data: T[];
}

interface Guest {
  id: number;
  name: string;
  identity_document: string;
  phone: string;
  email: string;
}

export default function adminprovider() {
  const { users, errors: serverErrors, flash } = usePage().props;
  const usersTyped = users as Pagination<Guest>;

  // Estados principales
  const [provider, setprovider] = useState<Guest[]>(usersTyped.data);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Guest>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Estados para animaciones y efectos
  const [animatingCard, setAnimatingCard] = useState<number | null>(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    identity_document: '',
    phone: '',
    email: '',
  });

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Sincronizar formulario cuando se edita
  useEffect(() => {
    if (editingGuest) {
      setFormData({
        name: editingGuest.name,
        identity_document: editingGuest.identity_document,
        phone: editingGuest.phone,
        email: editingGuest.email,
      });
      setLocalErrors({});
    } else {
      setFormData({ name: '', identity_document: '', phone: '', email: '' });
      setLocalErrors({});
    }
  }, [editingGuest]);

  // Filtrar y ordenar Proveedores
  const filteredAndSortedprovider = provider
    .filter(g =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.identity_document.includes(search) ||
      g.phone.includes(search) ||
      g.email.toLowerCase().includes(search.toLowerCase())
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

  // Funciones de ordenamiento
  const handleSort = (column: keyof Guest) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Funciones del modal
  function openAddModal() {
    setEditingGuest(null);
    setModalOpen(true);
  }

  function openEditModal(guest: Guest) {
    setEditingGuest(guest);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingGuest(null);
    setLocalErrors({});
  }

  // Manejar envío del formulario
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validación local
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'El nombre es obligatorio.';
    if (!formData.identity_document.trim()) errs.identity_document = 'Documento es obligatorio.';
    if (!formData.phone.trim()) errs.phone = 'Teléfono es obligatorio.';
    if (!formData.email.trim()) errs.email = 'Email es obligatorio.';

    setLocalErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);

    if (editingGuest) {
      Inertia.put(`/admin/recepcion/${editingGuest.id}`, formData, {
        onSuccess: () => {
          closeModal();
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        },
      });
    } else {
      Inertia.post('/admin/recepcion', formData, {
        onSuccess: () => {
          closeModal();
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        },
      });
    }
  }

  // Eliminar Proveedor
  function handleDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar este Proveedor?')) {
      setAnimatingCard(id);
      setIsLoading(true);
      Inertia.delete(`/admin/recepcion/${id}`, {
        onSuccess: () => {
          setIsLoading(false);
          setAnimatingCard(null);
        },
        onError: () => {
          setIsLoading(false);
          setAnimatingCard(null);
        },
      });
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Proveedores" />

      {/* Loading Overlay Global */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Procesando...</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div>
          {/* Header Section Mejorado */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-cyan-800 to-blue-800 dark:from-white dark:via-cyan-200 dark:to-blue-200 bg-clip-text text-transparent mb-2">
                    Gestión de Proveedores
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Administra y controla la información de tus Proveedores de manera profesional
                  </p>
                </div>
              </div>
              
              <button
                onClick={openAddModal}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-cyan-400/50"
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-3 relative z-10">
                  <Plus className="w-6 h-6" />
                  <span>Nuevo Proveedor</span>
                </div>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 dark:from-emerald-500/20 dark:to-green-600/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Proveedores</p>
                    <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{provider.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 dark:from-blue-500/20 dark:to-cyan-600/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Resultados</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{filteredAndSortedprovider.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 dark:from-purple-500/20 dark:to-indigo-600/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Búsqueda Activa</p>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      {search ? 'Sí' : 'No'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar Mejorada */}
            <div className="mt-8">
              <div className="relative ">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Buscar por nombre, DNI, teléfono o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Section Completamente Rediseñada */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <tr>
                    {[
                      { key: 'name', label: 'Proveedor', icon: User },
                      { key: 'identity_document', label: 'Documento', icon: Check },
                      { key: 'phone', label: 'Teléfono', icon: Phone },
                      { key: 'email', label: 'Email', icon: Mail },
                    ].map((column) => (
                      <th
                        key={column.key}
                        onClick={() => handleSort(column.key as keyof Guest)}
                        className="px-6 py-5 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 select-none group"
                      >
                        <div className="flex items-center space-x-3">
                          <column.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <span>{column.label}</span>
                          <div className="flex flex-col ml-auto">
                            <ArrowUpDown className={`w-4 h-4 transition-all duration-200 ${
                              sortBy === column.key 
                                ? 'text-cyan-600 dark:text-cyan-400 scale-110' 
                                : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400 scale-90'
                            }`} />
                          </div>
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-5 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      <div className="flex items-center justify-center space-x-2">
                        <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span>Acciones</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSortedprovider.map((guest, index) => (
                    <tr 
                      key={guest.id} 
                      className={`hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/20 dark:hover:to-blue-900/20 transition-all duration-300 group ${
                        animatingCard === guest.id ? 'animate-pulse bg-red-50 dark:bg-red-900/20' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Columna Nombre con Avatar */}
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                            {getInitials(guest.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-200">
                              {guest.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {guest.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Columna Documento */}
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                            {guest.identity_document}
                          </span>
                        </div>
                      </td>

                      {/* Columna Teléfono */}
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <a 
                            href={`tel:${guest.phone}`}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:underline transition-colors duration-200"
                          >
                            {guest.phone}
                          </a>
                        </div>
                      </td>

                      {/* Columna Email */}
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <a 
                            href={`mailto:${guest.email}`}
                            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 hover:underline transition-colors duration-200 max-w-48 truncate"
                          >
                            {guest.email}
                          </a>
                        </div>
                      </td>

                      {/* Columna Acciones */}
                      <td className="px-6 py-5">
                        <div className="flex justify-evenly space-x-2">
                          <button
                            onClick={() => openEditModal(guest)}
                            className="group relative p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                              Editar Proveedor
                            </div>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(guest.id)}
                            className="group relative p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                              Eliminar Proveedor
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State Mejorado */}
              {filteredAndSortedprovider.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
                    <UserPlus className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {search ? 'No se encontraron Proveedores' : 'Aún no tienes Proveedores'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    {search 
                      ? 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas'
                      : 'Comienza agregando tu primer Proveedor al sistema'
                    }
                  </p>
                  {!search && (
                    <button
                      onClick={openAddModal}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Agregar Primer Proveedor
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Completamente Rediseñado */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  {editingGuest ? (
                    <Edit className="w-6 h-6 text-white" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-cyan-800 dark:from-white dark:to-cyan-200 bg-clip-text text-transparent">
                  {editingGuest ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                disabled={isLoading}
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Nombre */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Ingresa el nombre completo"
                      required
                    />
                  </div>
                  {localErrors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">{localErrors.name}</p>
                  )}
                </div>

                {/* Campo DNI */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Documento de Identidad
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Check className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.identity_document}
                      onChange={(e) => setFormData({ ...formData, identity_document: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono"
                      placeholder="12345678"
                      required
                    />
                  </div>
                  {localErrors.identity_document && (
                    <p className="text-sm text-red-600 dark:text-red-400">{localErrors.identity_document}</p>
                  )}
                </div>

                {/* Campo Teléfono */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="+51 999 888 777"
                      required
                    />
                  </div>
                  {localErrors.phone && (
                    <p className="text-sm text-red-600 dark:text-red-400">{localErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Campo Email - Ancho completo */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                {localErrors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{localErrors.email}</p>
                )}
              </div>

              {/* Información Adicional */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">
                      Información
                    </h4>
                    <p className="text-sm text-cyan-600 dark:text-cyan-300 leading-relaxed">
                      Esta información será utilizada para el registro de reservas, comunicaciones y gestión de estadías. 
                      Asegúrate de que todos los datos sean correctos y estén actualizados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Errores del Servidor */}
              {Object.keys(localErrors).length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-medium text-red-800 dark:text-red-200">
                      Por favor, corrige los siguientes errores:
                    </span>
                  </div>
                  <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                    {Object.entries(localErrors).map(([field, error]) => (
                      <li key={field}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className={`flex items-center space-x-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    {editingGuest ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Guardar Cambios</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>Agregar Proveedor</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}