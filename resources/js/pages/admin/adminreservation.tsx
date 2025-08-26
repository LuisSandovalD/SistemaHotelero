// resources/js/Pages/Admin/Reservations/AdminReservation.tsx
import React, { useState, useMemo } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reservas", href: "/adminreservation" },
];
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
interface Payments {
  id: number;
  reservation_id: number;
  payment_method_id: number;
  payment_status_id: number;
  monto: number;
  fecha_pago: string;
  referencia?: string;

  payment_method?: {
    id: number;
    nombre: string;
  };

  payment_status?: {
    id: number;
    nombre: string;
  };

  // ✅ Reserva asociada
  reservation?: {
    id: number;
    user_id: string;
    room_id: string;
    fecha_inicio: string;
    fecha_fin: string;
    adultos: number;
    ninos: number;
    reservation_status_id: number;

    reservation_status?: {
      id: number;
      nombre: string;
      descripcion?: string;
    };

    user?: {
      id: number;
      name: string;
      email: string;
      phone: string;
      identity_document: string;
    };

    room?: {
      id: number;
      numero_habitacion: number;
      numero_piso: number;
      precio_noche: number;
      capacidad: number;
      room_status_id: number;
      room_status?: { id: number; nombre: string };
      type_rooms_id: number;
      type_room?: { id: number; nombre: string };
    };
  };
}

interface PageProps {
  payments: Payments[]; // eje principal ahora
  pagination: Pagination<Payments[]>
  users: {
    id: number;
    name: string;
    email: string;
    phone: string;
    identity_document: string;
  }[];

  rooms: {
    id: number;
    numero_habitacion: number;
    numero_piso: number;
    precio_noche: number;
    capacidad: number;
    room_status_id: number;
    room_status?: { id: number; nombre: string };
    type_rooms_id: number;
    type_room?: { id: number; nombre: string };
  }[];

  roomStatuses: { id: number; nombre: string }[];

  typeRoom: { id: number; nombre: string; descripcion: string }[];

  reservationStatus: { id: number; nombre: string; descripcion?: string }[];

  paymentMethods: { id: number; nombre: string }[];

  paymentStatuses: { id: number; nombre: string }[];

  [key: string]: any;
}



export default function AdminReservation() {
  const { payments, users, rooms, reservationStatus, typeRoom, roomStatuses, paymentMethods, paymentStatuses,pagination } = usePage<PageProps>().props;

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payments | null>(null);
  const [form, setForm] = useState<any>({});

  // Abrir modal para crear
  function openModalCreate() {
    setSelectedPayment(null);
    setForm({
      user_id: "",
      user_name: "",
      user_email: "",
      user_phone: "",
      user_identity_document: "",
      room_id: rooms.length > 0 ? rooms[0].id : "",
      fecha_inicio: "",
      fecha_fin: "",
      precio_noche: "",
      type_rooms_id: typeRoom.length > 0 ? typeRoom[0].id : "",
      room_status_id: roomStatuses.length > 0 ? roomStatuses[0].id : "",
      reservation_status_id: reservationStatus.length > 0 ? reservationStatus[0].id : "",
      monto: 0,
      payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : "",
      payment_status_id: paymentStatuses.length > 0 ? paymentStatuses[0].id : "",
      referencia: "",
      adultos: 1,
      ninos: 0,
    });
    setIsModalOpen(true);
  }

  // Abrir modal para editar
  function openModalEdit(pay: Payments) {
    setSelectedPayment(pay);

    const res = pay.reservation;

    setForm({
      user_id: res?.user?.id?.toString() || "",
      user_name: res?.user?.name || "",
      user_email: res?.user?.email || "",
      user_phone: res?.user?.phone || "",
      user_identity_document: res?.user?.identity_document || "",
      room_id: res?.room_id || "",
      fecha_inicio: res?.fecha_inicio || "",
      fecha_fin: res?.fecha_fin || "",
      precio_noche: res?.room?.precio_noche || "",
      room_status_id: res?.room?.room_status_id?.toString() || "",
      type_rooms_id: res?.room?.type_rooms_id?.toString() || "",
      reservation_status_id: res?.reservation_status_id?.toString() || "",
      monto: pay.monto|| 0,
      payment_method_id: pay.payment_method_id || "",
      payment_status_id: pay.payment_status_id || "",
      referencia: pay.referencia || "",
      adultos: res?.adultos ?? 1,
      ninos: res?.ninos ?? 0,
    });

    setIsModalOpen(true);
  }

  // Guardar (crear/editar)
  function submitForm() {

    const payload = {
      user_id: form.user_id ? Number(form.user_id) : null,
      user_name: form.user_name || "",
      user_email: form.user_email || "",
      user_phone: form.user_phone || "",
      user_identity_document: form.user_identity_document || "",
      room_id: Number(form.room_id),
      precio_noche: form.precio_noche || "",
      type_rooms_id: Number(form.type_rooms_id),
      room_status_id: Number(form.room_status_id),
      reservation_status_id: Number(form.reservation_status_id),
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      adultos: Number(form.adultos) || 1,
      ninos: Number(form.ninos) || 0,
      monto: Number(form.monto),
      payment_method_id: Number(form.payment_method_id),
      payment_status_id: Number(form.payment_status_id),
      referencia: form.referencia || "",
    };

    if (selectedPayment) {
      Inertia.put(`/admin/reservacion/${selectedPayment.id}`, payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      Inertia.post(`/admin/reservacion`, payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  }

  // Eliminar pago
  function deletePayment(id: number) {
    if (confirm("¿Deseas eliminar este pago?")) {
      Inertia.delete(`/admin/reservacion/${id}`);
    }
  }

  // Filtrado incluyendo pagos y datos de reserva
  const filteredPayments = useMemo(() => {
    const lup = search.toLowerCase();

    return payments.filter((pay) => {
      const res = pay.reservation;
      
      // Usuario
      const userName = res?.user?.name.toLowerCase() || users.find(u => u.id === Number(res?.user_id))?.name.toLowerCase() || "";

      // Habitación
      const roomNumber = res?.room?.numero_habitacion.toString() || rooms.find(r => r.id === Number(res?.room_id))?.numero_habitacion.toString() || "";

      // Estado reserva
      const status = res?.reservation_status?.nombre.toLowerCase() || reservationStatus.find(s => s.id === Number(res?.reservation_status_id))?.nombre.toLowerCase() || "";

      // Datos del pago
      const monto = pay.monto.toString();
      const referencia = pay.referencia?.toLowerCase() || "";
      const metodo = pay.payment_method?.nombre.toLowerCase() || paymentMethods.find(m => m.id === pay.payment_method_id)?.nombre.toLowerCase() || "";
      const estado = pay.payment_status?.nombre.toLowerCase() || paymentStatuses.find(s => s.id === pay.payment_status_id)?.nombre.toLowerCase() || "";

      return userName.includes(lup) || roomNumber.includes(lup) || status.includes(lup) || monto.includes(lup) || referencia.includes(lup) || metodo.includes(lup) || estado.includes(lup);
    });
  }, [search, payments, users, rooms, reservationStatus, paymentMethods, paymentStatuses]);



  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reservas" />
      
      {/* Hero Section con gradiente */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-6 py-8">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Reservas
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Administra y controla todas las reservaciones del sistema
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {filteredPayments.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {filteredPayments.filter(r => reservationStatus.find(s => s.id === r.reservation?.reservation_status_id)?.nombre === 'Confirmada').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Confirmadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {filteredPayments.filter(r => reservationStatus.find(s => s.id === r.reservation?.reservation_status_id)?.nombre === 'Pendiente').length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pendientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full px-6 py-8">
        {/* Controls Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, habitación, estado..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                />
              </div>
              
              <button 
                onClick={openModalCreate} 
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <Plus size={18} className="transition-transform group-hover:rotate-90" />
                <span className="relative">Nueva Reserva</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Lista de Reservaciones
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({filteredPayments.length} resultados)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {filteredPayments.map((res) => (
              <div 
                key={res.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gray-50 border-gray-100 dark:border-gray-700 dark:bg-gray-700 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{res.id}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Reserva #{res.id}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID de reserva
                        </p>
                      </div>
                    </div>
                    
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${reservationStatus.find((s) => s.id === res.reservation?.reservation_status_id)?.nombre === 'Confirmada' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : reservationStatus.find((s) => s.id === res.reservation?.reservation_status_id)?.nombre === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }
                    `}>
                      {reservationStatus.find((s) => s.id === res.reservation?.reservation_status_id)?.nombre}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 gap-5 ">
                  
                  {/* Cliente */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Información del Cliente
                      </h4>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            {res.reservation?.user?.name.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {res.reservation?.user?.name || 'Sin usuario'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {res.reservation?.user?.identity_document || "Sin identificación"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </p>
                          {res.reservation?.user ? (
                            <a 
                              href={`mailto:${res.reservation?.user?.email}`} 
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {res.reservation?.user?.email}
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sin email</p>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Teléfono
                          </p>
                          {res.reservation?.user ? (
                            <a 
                              href={`tel:${res.reservation.user.phone}`} 
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {res.reservation.user.phone}
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sin teléfono</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Habitación */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 002 2v0a2 2 0 00-2 2z" />
                      </svg>
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Detalles de Habitación
                      </h4>
                    </div>
                    
                    <div className="grid bg-gray-50 dark:bg-gray-700 rounded-md p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Número</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {res.reservation?.room?.numero_habitacion}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Piso</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {res.reservation?.room?.numero_piso}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Precio/Noche + IGV(18%)</p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            ${Number(res.reservation?.room?.precio_noche) * 0.18 + Number(res.reservation?.room?.precio_noche)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Capacidad</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {res.reservation?.room?.capacidad} personas
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tipo de Habitación</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {res.reservation?.room?.type_room?.nombre}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estado</p>
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                              ${res.reservation?.room?.room_status?.nombre === 'Disponible' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }
                            `}>
                              {res.reservation?.room?.room_status?.nombre}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Huéspedes</p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {res.reservation?.adultos} adultos • {res.reservation?.ninos} niños
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Período de Estancia
                      </h4>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-in</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {res.reservation?.fecha_inicio}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-out</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {res.reservation?.fecha_fin}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Pago */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
                      Información de Pago
                    </h4>
                  </div>
                  
                  <div className="dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="space-y-3">
                      {/* Monto Principal */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-600">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Total</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          ${res.monto}
                        </span>
                      </div>
                      
                      {/* Detalles del Pago */}
                      <div className="grid grid-cols-2 gap-3 border-b border-gray-200 dark:border-gray-600 pb-3 ">
                        <div className="space-y-1 ">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Fecha
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {res.fecha_pago}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Método
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {res.payment_method?.nombre}
                          </p>
                        </div>
                      </div>
                      
                      {/* Estado del Pago */}
                      <div className="pb-3 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Estado
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {res.payment_status?.nombre}
                          </span>
                        </div>
                      </div>
                      
                      {res.referencia && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M5 8h14l-1 13H6L5 8z" />
                            </svg>
                            <div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Referencia
                              </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 font-mono 0 px-2 py-1 rounded text-xs">
                                {res.referencia}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => openModalEdit(res)} 
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Edit size={12} className="mr-1" />
                      Editar
                    </button>
                    
                    <button 
                      onClick={() => deletePayment(res.reservation_id)} 
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 shadow-sm text-xs font-medium rounded-md text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Trash2 size={12} className="mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPayments.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No se encontraron reservas
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {search ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primera reserva'}
              </p>
              {!search && (
                <button 
                  onClick={openModalCreate}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Crear Primera Reserva
                </button>
              )}
            </div>
          )}
        </div>
        {/* Modal */}
        <Transition show={isModalOpen} as={React.Fragment}>
          <Dialog onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto ">
            {/* Backdrop mejorado */}
            <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity" />
            
            <div className="flex items-center justify-center min-h-screen p-4 ">
              <Dialog.Panel className="relative w-full  transform overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl transition-all border border-gray-200 dark:border-gray-700">
                
                {/* Header mejorado */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 p-4 overflow-hidden">
                  {/* Efectos de fondo */}
                  <div className="absolute inset-0 bg-white/10  backdrop-blur-sm"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <Dialog.Title className="text-3xl font-bold text-white">
                          {selectedPayment ? "Editar Reserva" : "Nueva Reserva"}
                        </Dialog.Title>
                        <p className="text-white/80 text-sm mt-1">
                          {selectedPayment ? "Modifica los datos de la reservación seleccionada" : "Complete la información para crear una nueva reservación"}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm group"
                    >
                      <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Contenido del formulario mejorado */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 xl:gap-8">
                    
                    {/* Columna Izquierda - Información del Usuario */}
                    <div className="flex flex-col gap-4 justify-between">
                     {/* Usuario Card */}
                      <div className="bg-white  dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Información del Cliente</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">

                          {/* DNI */}
                          <div className="group ">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              DNI <span className="text-gray-500">(opcional)</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <input
                                list="dni"
                                value={form.user_identity_document || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setForm({ ...form, user_identity_document: value });

                                  // Buscar si existe el usuario por DNI
                                  const selectedUser = users.find(u => u.identity_document === value);
                                  if (selectedUser) {
                                    setForm({
                                      ...form,
                                      user_id: selectedUser.id,
                                      user_identity_document: selectedUser.identity_document,
                                      user_name: selectedUser.name,
                                      user_email: selectedUser.email,
                                      user_phone: selectedUser.phone,
                                    });
                                  }
                                }}
                                className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                                          focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                          bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                placeholder="Seleccione o escriba el DNI"
                              />
                              <datalist id="dni">
                                {users.map((user) => (
                                  <option
                                    key={user.id}
                                    value={user.identity_document}
                                    label={`${user.name} | ${user.email} | ${user.phone}`}
                                  />
                                ))}
                              </datalist>
                            </div>
                          </div>

                          {/* Nombre Completo */}
                          <div className="groupl">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Nombre Completo
                            </label>
                            <input
                              type="text"
                              value={form.user_name || ""}
                              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                              placeholder="Nombre del cliente"
                            />
                          </div>

                          {/* Correo */}
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Correo Electrónico
                            </label>
                            <input
                              type="email"
                              value={form.user_email || ""}
                              onChange={(e) => setForm({ ...form, user_email: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                              placeholder="cliente@ejemplo.com"
                            />
                          </div>

                          {/* Teléfono */}
                          <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Número de celular
                            </label>
                            <input
                              type="tel"
                              value={form.user_phone || ""}
                              onChange={(e) => setForm({ ...form, user_phone: e.target.value })}
                              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                              placeholder="+51 987654321"
                            />
                          </div>
                        </div>
                      </div>
                       
                      {/* Información de Pago Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resumen de Pago</h3>
                        </div>
                        {/* Cálculo automático del monto */}
                        {(() => {
                          const selectedRoom = rooms.find((r) => r.id == form.room_id);
                          const fechaInicio = form.fecha_inicio ? new Date(form.fecha_inicio) : null;
                          const fechaFin = form.fecha_fin ? new Date(form.fecha_fin) : null;
                          
                          let diasEstancia = 0;
                          let montoTotal = 0;
                          let precioPorNoche = 0;
                          let impuesto = 0.18;
                          let descuento = 0.;
                          let subtotal = 0;
                          let total = 0;
                          let precioNormal=0;

                          if (fechaInicio && fechaFin && fechaFin > fechaInicio) {
                            const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
                            diasEstancia = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
                          }

                          if (selectedRoom && diasEstancia > 0) {
                            precioNormal = Number(precioPorNoche);
                            form.precio_noche = precioNormal;
                            precioPorNoche = parseFloat(selectedRoom.precio_noche.toString()) || 0;
                            montoTotal = precioPorNoche * diasEstancia;
                            subtotal = (montoTotal * impuesto) + montoTotal;
                            total = subtotal - (subtotal * descuento);
                            form.monto = total;
                          }

                          return (
                            <div className="space-y-4">
                              {/* Detalles del cálculo */}
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Precio por noche + IGV(18%):
                                  </span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    S/ {precioPorNoche * 0.18 + precioPorNoche}
                                  </span>
                                </div>
                                <div className="group hidden">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Precio de costo
                                  </label>
                                  <input
                                    type="hidden"
                                    value={form.precio_noche || ""}
                                    onChange={(e) => setForm({ ...form, monto: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                              bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                                    placeholder="+51 987654321"
                                  />
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Días de estancia:
                                  </span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {diasEstancia} {diasEstancia === 1 ? 'día' : 'días'}
                                  </span>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                      Total a pagar:
                                    </span>
                                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                      S/ {montoTotal * 0.18 + montoTotal}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Mostrar advertencias si faltan datos */}
                              {!selectedRoom && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3">
                                  <p className="text-yellow-700 dark:text-yellow-300 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Seleccione una habitación para ver el precio
                                  </p>
                                </div>
                              )}

                              {(!fechaInicio || !fechaFin) && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3">
                                  <p className="text-yellow-700 dark:text-yellow-300 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Seleccione las fechas de check-in y check-out
                                  </p>
                                </div>
                              )}

                              {fechaInicio && fechaFin && fechaFin <= fechaInicio && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-3">
                                  <p className="text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    La fecha de check-out debe ser posterior al check-in
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        {/* Estado Reserva */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-3">
                          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Estado del pago
                          </label>
                          <div className="relative">
                            <select 
                              value={form.payment_status_id || ""} 
                              onChange={(e) => setForm({ ...form, payment_status_id: e.target.value })} 
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                        hover:border-gray-400 dark:hover:border-gray-500 transition-all appearance-none"
                            >
                              {paymentStatuses.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                              ))}
                            </select>
                            <div className="absolute  inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
                          <label className="flex items-center  text-sm font-semibold text-gray-700 dark:text-gray-300">
                            metodo de pago 
                          </label>
                          <div className="relative">
                            <select 
                              value={form.payment_method_id || ""} 
                              onChange={(e) => setForm({ ...form, payment_method_id: e.target.value })} 
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                        hover:border-gray-400 dark:hover:border-gray-500 transition-all appearance-none"
                            >
                              {paymentMethods.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha - Información de Reserva y Pago */}
                    <div className="space-y-8 col-span-2 mt-3 xl:mt-0">

                      {/* Card: Detalles de Reserva */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
                        
                        {/* Encabezado */}
                        <div className="grid grid-cols-1 xl:flex  xl:items-center xl:justify-between gap-6 mb-6">
                          
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detalles de Reserva</h3>
                          </div>

                          {/* Estado Reserva */}
                          <div className="grid xl:flex xl:items-center gap-4 ">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Estado
                            </label>
                            <div className="relative">
                              <select 
                                value={form.reservation_status_id || ""} 
                                onChange={(e) => setForm({ ...form, reservation_status_id: e.target.value })} 
                                className="w-full xl:w-64  px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                          focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                          bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                          hover:border-gray-400 dark:hover:border-gray-500 transition-all appearance-none"
                              >
                                {reservationStatus.map((s) => (
                                  <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Grid Interno */}
                        <div className="flex flex-col gap-6">
                          
                          {/* Card: Detalles de la Habitación */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all space-y-6 ">

                            {/* Selects */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Tipo */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Tipo de habitación
                                </label>
                                <select
                                  value={form.type_rooms_id || ""}
                                  onChange={(e) => setForm({ ...form, type_rooms_id: e.target.value, room_id: "" })}
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                >
                                  <option value="">Seleccionar</option>
                                  {typeRoom.map((r) => (
                                    <option key={r.id} value={r.id}>{r.nombre}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Número */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Número de habitación
                                </label>
                                <select
                                  value={form.room_id || ""}
                                  onChange={(e) => setForm({ ...form, room_id: e.target.value })}
                                  disabled={!form.type_rooms_id}
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                >
                                  <option value="">Seleccionar</option>
                                  {rooms
                                    .filter(
                                      (s) =>
                                        s.type_rooms_id == form.type_rooms_id &&
                                        (s.room_status?.id === 1 || s.id == form.room_id) // incluir siempre la actual
                                    )
                                    .map((s) => (
                                      <option key={s.id} value={s.id}>
                                        Habitación {s.numero_habitacion}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              {/* Cambiar Estado */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  Cambiar estado
                                </label>
                                <select
                                  value={form.room_status_id || ""}
                                  onChange={(e) => setForm({ ...form, room_status_id: Number(e.target.value) })}
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                >
                                  <option value="">Seleccione un estado</option>
                                  {roomStatuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                      {status.nombre}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Info */}
                            {form.room_id && (() => {
                              const selectedRoom = rooms.find((r) => r.id == form.room_id);
                              if (!selectedRoom) return null;

                              form.precio_noche = selectedRoom.precio_noche;
                              

                              return (
                                <div className="border rounded-xl bg-gray-50 dark:bg-gray-900 p-5 space-y-3">
                                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    🛏️ Detalles de la habitación
                                  </h3>
                                  <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 text-sm">
                                    <p><span className="font-semibold ">Número:</span> {selectedRoom.numero_habitacion}</p>
                                    <p><span className="font-semibold">Piso:</span> {selectedRoom.numero_piso}</p>
                                    <p><span className="font-semibold">Capacidad:</span> {selectedRoom.capacidad} personas</p>
                                    <p><span className="font-semibold">Precio:</span> 
                                      <span className="text-indigo-600 font-bold"> S/ {selectedRoom.precio_noche}</span>
                                    </p>
                                    <div className="hidden">
                                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Precio por noche
                                      </label>
                                      <input 
                                        type="number" 
                                        value={form.precio_noche || ""} 
                                        onChange={(e) => setForm({ ...form, precio_noche: e.target.value })} 
                                        className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                                                  focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 
                                                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                                  hover:border-gray-400 dark:hover:border-gray-500 transition-all
                                                  font-medium shadow-sm"
                                      />
                                      </div>
                                    <p className="xl:col-span-2">
                                      <span className="font-semibold">Estado:</span>{" "}
                                      <span
                                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full 
                                          ${selectedRoom.room_status?.nombre === "Disponible"
                                            ? "bg-green-100 text-green-700"
                                            : selectedRoom.room_status?.nombre === "Ocupada"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                          }`}
                                      >
                                        {selectedRoom.room_status?.nombre}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Card: Fechas y Huéspedes */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Fechas y Huéspedes</h3>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              {/* Check-in */}
                              <div>
                                <label className="block text-sm font-semibold mb-2">Check-in</label>
                                <input 
                                  type="date" 
                                  value={form.fecha_inicio || ""} 
                                  onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} 
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                />
                              </div>

                              {/* Check-out */}
                              <div>
                                <label className="block text-sm font-semibold mb-2">Check-out</label>
                                <input 
                                  type="date" 
                                  value={form.fecha_fin || ""} 
                                  onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} 
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                />
                              </div>

                              {/* Adultos */}
                              <div>
                                <label className="block text-sm font-semibold mb-2">Adultos</label>
                                <input 
                                  type="number" 
                                  min={1} 
                                  value={form.adultos || 1} 
                                  onChange={(e) => setForm({ ...form, adultos: Number(e.target.value) })} 
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                />
                              </div>

                              {/* Niños */}
                              <div>
                                <label className="block text-sm font-semibold mb-2">Niños</label>
                                <input 
                                  type="number" 
                                  min={0} 
                                  value={form.ninos || 0} 
                                  onChange={(e) => setForm({ ...form, ninos: Number(e.target.value) })} 
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer con botones mejorados */}
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-8 py-6">
                  <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-gray-300 focus:outline-none flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar
                    </button>
                    <button 
                      onClick={submitForm} 
                      className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{selectedPayment ? "Actualizar Reserva" : "Crear Reserva"}</span>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
        <div className="flex space-x-2 justify-end mt-4">
          <div className="p-4 bg-sky-200 dark:bg-gray-800 rounded-xl py-5 ">
            {pagination.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url || "#"}
                className={`m-3 p-3 rounded-xl ${
                  link.active ? "font-bold bg-white dark:bg-gray-700" : "hover:dark:bg-gray-700"
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}