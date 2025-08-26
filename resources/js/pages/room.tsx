// resources/js/Pages/Admin/Reservations/AdminReservation.tsx
import React, { useState, useMemo } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, router, usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2, Link, LogOut, Settings, User, ChevronDown, Search, Filter, Calendar, Users, CreditCard, MapPin, Clock, Star, Wifi, Car, Coffee, Dumbbell } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import AppLayout from "@/layouts/app-layout";
import { type SharedData } from '@/types';

import { BreadcrumbItem} from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reservas", href: "/adminreservation" },
];

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

interface Room{
  id: number;
  numero_habitacion: number;
  numero_piso: number;
  precio_noche: number;
  capacidad: number;
  room_status_id: number;
  room_status?: { id: number; nombre: string };
  type_rooms_id: number;
  type_room?: { id: number; nombre: string };
}

interface PageProps {
  payments: Payments[];
  pagination: Pagination<Room>;
  users: {
    id: number;
    name: string;
    email: string;
    phone: string;
    identity_document: string;
  }[];
  roomStatuses: { id: number; nombre: string }[];
  typeRoom: { id: number; nombre: string; descripcion: string }[];
  reservationStatus: { id: number; nombre: string; descripcion?: string }[];
  paymentMethods: { id: number; nombre: string }[];
  paymentStatuses: { id: number; nombre: string }[];
  [key: string]: any;
}

export default function room({ showEmail = false }: { showEmail?: boolean }) {
  const { auth } = usePage<SharedData>().props;
  const { payments, pagination, reservationStatus, typeRoom, paymentMethods, paymentStatuses } = usePage<PageProps>().props;
  const rooms = pagination.data;
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payments | null>(null);
  const [form, setForm] = useState<any>({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Estados para el filtro de fechas y disponibilidad
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  // Función para verificar disponibilidad de habitación en fechas específicas
  const checkRoomAvailability = (roomId: number, checkIn: string, checkOut: string, existingReservations: Payments[]) => {
    if (!checkIn || !checkOut) return { available: true, message: "" };
    
    const requestedCheckIn = new Date(checkIn);
    const requestedCheckOut = new Date(checkOut);
    
    // Validar que checkout sea después de checkin
    if (requestedCheckOut <= requestedCheckIn) {
      return {
        available: false,
        message: "La fecha de salida debe ser posterior a la fecha de entrada"
      };
    }
    
    // Filtrar reservas de esta habitación que estén confirmadas o pendientes
    const roomReservations = existingReservations.filter(payment => payment.reservation?.room_id == String( roomId) && payment.reservation?.reservation_status?.nombre?.toLowerCase() !== 'cancelada');
    
    // Verificar conflictos con reservas existentes
    for (const payment of roomReservations) {
      if (!payment.reservation) continue;
      
      const existingCheckIn = new Date(payment.reservation.fecha_inicio);
      const existingCheckOut = new Date(payment.reservation.fecha_fin);
      
      // Verificar si las fechas se superponen
      const hasOverlap = (
        // La nueva reserva empieza antes de que termine la existente
        // Y la nueva reserva termina después de que empiece la existente
        requestedCheckIn < existingCheckOut && requestedCheckOut > existingCheckIn
      );
      
      if (hasOverlap) {
        const formatDate = (date: Date) => date.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric'
        });
        
        return {
          available: false,
          message: `Esta habitación estará ocupada del ${formatDate(existingCheckIn)} al ${formatDate(existingCheckOut)}. Por favor selecciona otras fechas.`,
          conflictDates: {
            checkIn: existingCheckIn,
            checkOut: existingCheckOut
          }
        };
      }
    }
    
    return { available: true, message: "" };
  };

  // Función para obtener el estado visual de la habitación
  const getRoomDisplayStatus = (room: Room, checkIn: string, checkOut: string, existingReservations: Payments[]) => {
    // Si no hay fechas seleccionadas, mostrar el estado base
    if (!checkIn || !checkOut) {
      return {
        status: room.room_status?.nombre || 'Desconocido',
        color: getStatusColor(room.room_status?.nombre || ''),
        icon: getStatusIcon(room.room_status?.nombre || ''),
        canReserve: room.room_status?.nombre?.toLowerCase() === 'disponible'
      };
    }
    
    // Verificar disponibilidad para las fechas específicas
    const availability = checkRoomAvailability(room.id, checkIn, checkOut, existingReservations);
    
    if (!availability.available) {
      return {
        status: 'No disponible',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <div className="w-3 h-3 bg-red-500 rounded-full"></div>,
        canReserve: false,
        message: availability.message
      };
    }
    
    // Si está disponible para las fechas, mostrar como disponible
    return {
      status: 'Disponible',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>,
      canReserve: true
    };
  };

  // Abrir modal para crear con validación de disponibilidad
  function openModalCreate(room: Room) {
    // Verificar disponibilidad si hay fechas seleccionadas
    if (checkInDate && checkOutDate) {
      const availability = checkRoomAvailability(room.id, checkInDate, checkOutDate, payments);
      if (!availability.available) {
        setAvailabilityMessage(availability.message);
        // Mostrar el mensaje por unos segundos y luego ocultarlo
        setTimeout(() => setAvailabilityMessage(""), 8000);
        return;
      }
    }
    
    setSelectedPayment(null);
    setForm({
      user_id: auth.user.id,
      user_name: auth.user.name,
      user_email: auth.user.email,
      user_phone: auth.user.phone || "",
      user_identity_document: auth.user.identity_document || "",
      room_id: room.id,
      fecha_inicio: checkInDate || "",
      fecha_fin: checkOutDate || "",
      precio_noche: room.precio_noche,
      type_rooms_id: room.type_rooms_id || (typeRoom.length > 0 ? typeRoom[0].id : ""),
      reservation_status_id: reservationStatus.length > 0 ? reservationStatus[0].id : "",
      monto: room.precio_noche || 0,
      payment_method_id: paymentMethods.length > 0 ? paymentMethods[0].id : "",
      payment_status_id: paymentStatuses.length > 0 ? paymentStatuses[0].id : "",
      referencia: "",
      adultos: 1,
      ninos: 0,
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
      precio_noche: form.precio_noche,
      type_rooms_id: Number(form.type_rooms_id),
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
    
   Inertia.post(`/creando/reserva`, payload)
  }


  // Función para obtener el ícono del estado
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'disponible':
        return <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>;
      case 'ocupada':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      case 'mantenimiento':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'disponible':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ocupada':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'mantenimiento':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filtrar habitaciones
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.numero_habitacion.toString().includes(search) ||room.type_room?.nombre.toLowerCase().includes(search.toLowerCase()) ||room.type_room?.nombre.toLowerCase().includes(search.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || room.type_room?.nombre.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [search, filterStatus, rooms]);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 overflow-hidden dark:bg-gray-900">
          <div className="absolute inset-0"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
                <MapPin className="w-4 h-4 mr-2" />
                Sistema de Gestión Hotelera
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700 dark:text-white mb-6">
                Habitaciones
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Premium</span>
              </h1>
              <p className="text-xl  max-w-3xl mx-auto text-gray-600 dark:text-gray-100">
                Descubre nuestras elegantes habitaciones diseñadas para brindarte el máximo confort y una experiencia inolvidable
              </p>
            </div>
          </div>
        </div>

        {/* Selector de Fechas */}
        <div className=" px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Seleccionar Fechas de Estadía</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verifica la disponibilidad para tus fechas preferidas</p>
              </div>
            </div>
            
            <div className="flex w-full">
              <div className="grid grid-cols-14 w-full gap-6 antialiased transition-colors duration-300 ease-in-out">
                {/* Fecha de Entrada */}
                <div className="col-span-3">
                  <label
                    htmlFor="checkIn"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
                  >
                    Fecha de Entrada
                  </label>
                  <input
                    id="checkIn"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium "
                  />
                </div>

                {/* Fecha de Salida */}
                <div className="col-span-3">
                  <label
                    htmlFor="checkOut"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
                  >
                    Fecha de Salida
                  </label>
                  <input
                    id="checkOut"
                    type="date"
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                    value={checkOutDate}
                    onChange={(e) => {
                      if (checkInDate && e.target.value < checkInDate) {
                        setCheckOutDate(checkInDate);
                      } else {
                        setCheckOutDate(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                  />
                </div>

                {/* Search Bar */}
                <div className="col-span-4 relative flex-1 w-full items-end">
                  <label
                    htmlFor="checkOut"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
                  >
                    Buscar habitaciones
                  </label>

                  <input
                    type="text"
                    placeholder="Buscar habitaciones..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all 
                              bg-gray-50 dark:bg-gray-700 hover:bg-white text-gray-800 dark:text-white"
                  />
                </div>

                {/* Status Filter */}
                <div className="col-span-2 gap-2 ">
                  <label
                    htmlFor="filt"
                    className="text-sm  flex gap-4 font-semibold text-gray-700 dark:text-gray-300 mb-3"
                  >
                    <Filter className="w-5 h-5"/>
                    Filtro
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all 
                              bg-gray-50 dark:bg-gray-700 hover:bg-white text-gray-800 dark:text-white w-full"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="individual">Individual</option>
                    <option value="doble">Doble</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="col-span-12 lg:col-span-2 flex justify-center items-center bg-gray-100 dark:bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-7 py-4 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900 "
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1 w-4 h-4">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-7 py-4 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600  hover:text-gray-900"
                    }`}
                  >
                    <div className="space-y-1 w-4 h-4">
                      <div className="bg-current h-1 rounded"></div>
                      <div className="bg-current h-1 rounded"></div>
                      <div className="bg-current h-1 rounded"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>


            
            {checkInDate && checkOutDate && checkOutDate > checkInDate && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    Estancia de {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24))} 
                    {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 3600 * 24)) === 1 ? ' día' : ' días'}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Mensaje de disponibilidad */}
          {availabilityMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl shadow-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">Habitación no disponible</h4>
                  <p className="text-red-700 dark:text-red-400">{availabilityMessage}</p>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Rooms Display */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-16">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {filteredRooms.map((room, index) => {
                const roomStatus = getRoomDisplayStatus(room, checkInDate, checkOutDate, payments);
                
                return (
                  <div
                    key={room.id}
                    className="group bg-white dark:bg-gray-800  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 hover:dark:border-blue-600 transform hover:-translate-y-2"
                  >
                    {/* Room Image Placeholder */}
                    <div className="relative h-64 bg-[url(https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221_1280.jpg)] bg-cover bg-center  ">
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {roomStatus.icon}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roomStatus.color}`}>
                          {roomStatus.status}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-3xl font-bold">N° {room.numero_habitacion}</div>
                        <div className="text-sm opacity-90">Piso {room.numero_piso}</div>
                      </div>
                      
                      {/* Floating amenities */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="w-8 h-8 bg-white/20  backdrop-blur-md rounded-full flex items-center justify-center">
                          <Wifi className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                          <Coffee className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                          <Car className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-300">
                            {room.type_room?.nombre || 'Habitación Premium'}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-3 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Hasta {room.capacidad} huéspedes</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            S/ {(Number(room.precio_noche) * 1.18).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">por noche</div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-200">Precio base</span>
                          <span className="font-medium">S/ {Number(room.precio_noche).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-200">IGV (18%)</span>
                          <span className="font-medium">S/ {(Number(room.precio_noche) * 0.18).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between font-bold text-blue-600">
                          <span>Total</span>
                          <span>S/ {(Number(room.precio_noche) * 1.18).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Wi-Fi gratuito
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Aire acondicionado
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Minibar
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          TV cable
                        </div>
                      </div>

                      {/* Reserve Button */}
                      <button
                        onClick={() => openModalCreate(room)}
                        disabled={!roomStatus.canReserve}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 focus:outline-none shadow-lg ${
                          roomStatus.canReserve
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {roomStatus.canReserve ? (
                          auth.user ? (
                            <>
                              <div className="flex items-center justify-center gap-2">
                              <Calendar className="w-5 h-5" />Reservar Ahora
                              </div>
                            </>
                          ):(
                            <>
                              <a className="flex items-center justify-center gap-2" href="login">
                                <User className="w-5 h-5" />Iniciar Sesión
                              </a>
                            </>)
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-5 h-5" />
                            {roomStatus.status}
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <tr>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Habitación
                      </th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Capacidad
                      </th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-6 text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredRooms.map((room, index) => {
                      const roomStatus = getRoomDisplayStatus(room, checkInDate, checkOutDate, payments);
                      
                      return (
                        <tr
                          key={room.id}
                          className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            index % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-gray-50/50 dark:bg-gray-800/50"
                          }`}
                        >
                          {/* Habitación */}
                          <td className="px-8 py-6">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                                <span className="text-white font-bold">
                                  N° {room.numero_habitacion}
                                </span>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  Habitación {room.numero_habitacion}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Piso {room.numero_piso}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Tipo */}
                          <td className="px-6 py-6">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {room.type_room?.nombre}
                            </span>
                          </td>

                          {/* Capacidad */}
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {room.capacidad} personas
                              </span>
                            </div>
                          </td>

                          {/* Precio */}
                          <td className="px-6 py-6">
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              S/{" "}
                              {(Number(room.precio_noche) * 1.18).toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              por noche (inc. IGV)
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                              {roomStatus.icon}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${roomStatus.color}`}
                              >
                                {roomStatus.status}
                              </span>
                            </div>
                          </td>

                          {/* Botón */}
                          <td className="px-6 py-6 text-center">
                            <button
                              onClick={() => openModalCreate(room)}
                              disabled={!roomStatus.canReserve}
                              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                                roomStatus.canReserve
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {roomStatus.canReserve ? (
                                auth.user ? (
                                  <>
                                    <div className="flex items-center justify-center gap-2">
                                    <Calendar className="w-5 h-5" />Reservar Ahora
                                    </div>
                                  </>
                                ):(
                                  <>
                                    <a className="flex items-center justify-center gap-2" href="login">
                                      <User className="w-5 h-5" />Iniciar Sesión
                                    </a>
                                  </>)
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <Clock className="w-5 h-5" />
                                  {roomStatus.status}
                                </div>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          )}

          {/* Empty State */}
          {filteredRooms.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron habitaciones</h3>
              <p className="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatus("all");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-2 justify-end mt-4 mb-4">
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


        {auth.user ? (
          <>
            {/* Modal mejorado */}
            <Transition show={isModalOpen} as={React.Fragment}>
              <Dialog onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
                <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity" />
                
                <div className="flex items-center justify-center min-h-screen p-4">
                  <Dialog.Panel className="relative w-full  transform overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl transition-all border border-gray-200 dark:border-gray-700">
                    
                    {/* Enhanced Header */}
                    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 p-6 overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                            <Calendar className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <Dialog.Title className="text-4xl font-bold text-white">
                              {selectedPayment ? "Editar Reserva" : "Nueva Reserva"}
                            </Dialog.Title>
                            <p className="text-white/90 text-lg mt-2">
                              {selectedPayment ? "Modifica los datos de la reservación seleccionada" : "Complete la información para crear una nueva reservación"}
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setIsModalOpen(false)}
                          className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all backdrop-blur-sm group"
                        >
                          <svg className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Modal Content */}
                    <div className="p-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                      <div className="grid grid-cols-1 xl:grid-cols-6 gap-10">

                        {/* Customer Information */}
                        <div className="col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300">
                            <div className="flex items-center gap-4 mb-8">
                              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg">
                                <User className="w-7 h-7 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Información del Cliente</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                              {/* DNI */}
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                  DNI <span className="text-gray-500">(opcional)</span>
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                  </div>
                                  <input 
                                    type="text" 
                                    value={auth.user.identity_document || ''} 
                                    readOnly
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl 
                                              bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white 
                                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                                              font-medium"
                                  />
                                </div>
                              </div>

                              {/* Nombre Completo */}
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                  Nombre Completo
                                </label>
                                <input 
                                  type="text" 
                                  value={form.user_name || ''} 
                                  readOnly
                                  className="w-full px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl 
                                            bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                                            font-medium"
                                />
                              </div>

                              {/* Correo */}
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                  Correo Electrónico
                                </label>
                                <input 
                                  type="email" 
                                  value={auth.user.email || ''} 
                                  readOnly
                                  className="w-full px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl 
                                            bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                                            font-medium"
                                />
                              </div>

                              {/* Teléfono */}
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                  Número de celular
                                </label>
                                <input 
                                  type="tel" 
                                  value={auth.user.phone || ''} 
                                  readOnly
                                  className="w-full px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl 
                                            bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white 
                                            focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                                            font-medium"
                                />
                              </div>
                            </div>
                        </div>

                        {/* Room Details */}
                        <div className="col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                              <MapPin className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detalles de la habitación</h3>
                          </div>

                          {/* Room Information Display */}
                          {form.room_id && (() => {
                            const selectedRoom = rooms.find((r) => r.id == form.room_id);
                            if (!selectedRoom) return null;

                            return (
                              <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 shadow-md">
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tipo de habitación</div>
                                  <div className="text-xl font-bold text-gray-900 dark:text-white">{selectedRoom.type_room?.nombre}</div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 shadow-md">
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Número</div>
                                  <div className="text-xl font-bold text-gray-900 dark:text-white">{selectedRoom.numero_habitacion}</div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 shadow-md">
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Piso</div>
                                  <div className="text-xl font-bold text-gray-900 dark:text-white">{selectedRoom.numero_piso}</div>
                                </div>
                                
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 shadow-md">
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Capacidad</div>
                                  <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    {selectedRoom.capacidad}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                          <div className="grid grid-cols-1 gap-8">
                            {/* Check-in */}
                            <div className="space-y-3">
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
                            </div>
                        </div>

                        {/* Enhanced Dates and Guests Card */}
                        <div className="col-span-4 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Fechas y Huéspedes</h4>
                          </div>

                          <div className="grid grid-cols-1 gap-8">
                            {/* Check-in */}
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Check-in
                              </label>
                              <input 
                                type="date" 
                                value={form.fecha_inicio || ""} 
                                onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} 
                                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                                          focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 
                                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                          hover:border-gray-400 dark:hover:border-gray-500 transition-all
                                          font-medium shadow-sm"
                              />
                            </div>

                            {/* Check-out */}
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Check-out
                              </label>
                              <input 
                                type="date" 
                                value={form.fecha_fin || ""} 
                                onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} 
                                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                                          focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 
                                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                          hover:border-gray-400 dark:hover:border-gray-500 transition-all
                                          font-medium shadow-sm"
                              />
                            </div>

                            {/* Adults */}
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" />
                                Adultos
                              </label>
                              <input 
                                type="number" 
                                min={1} 
                                value={form.adultos || 1} 
                                onChange={(e) => setForm({ ...form, adultos: Number(e.target.value) })} 
                                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                                          focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 
                                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                          hover:border-gray-400 dark:hover:border-gray-500 transition-all
                                          font-medium shadow-sm"
                              />
                            </div>

                            {/* Children */}
                            <div className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Users className="w-4 h-4 text-purple-500" />
                                Niños
                              </label>
                              <input 
                                type="number" 
                                min={0} 
                                value={form.ninos || 0} 
                                onChange={(e) => setForm({ ...form, ninos: Number(e.target.value) })} 
                                className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                                          focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 
                                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                          hover:border-gray-400 dark:hover:border-gray-500 transition-all
                                          font-medium shadow-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Payment Information Card */}
                        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 hover:shadow-3xl transition-all duration-300">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg">
                              <CreditCard className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Resumen de Pago</h3>
                          </div>

                          {/* Enhanced Payment Calculation */}
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

                            if (fechaInicio && fechaFin && fechaFin > fechaInicio) {
                              const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
                              diasEstancia = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
                            }

                            if (selectedRoom && diasEstancia > 0) {
                              precioPorNoche = parseFloat(selectedRoom.precio_noche.toString()) || 0;
                              montoTotal = precioPorNoche * diasEstancia;
                              subtotal = (montoTotal * impuesto) + montoTotal;
                              total = subtotal - (subtotal * descuento);
                              form.monto = total;
                            }

                            return (
                              <div className="space-y-6">
                                {/* Enhanced Calculation Details */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 space-y-4">
                                  <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      Precio base por noche:
                                    </span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                      S/ {precioPorNoche.toFixed(2)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                      IGV (18%):
                                    </span>
                                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                      S/ {(precioPorNoche * 0.18).toFixed(2)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex justify-between items-center py-2">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      Días de estancia:
                                    </span>
                                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                      {diasEstancia} {diasEstancia === 1 ? 'día' : 'días'}
                                    </span>
                                  </div>

                                  <div className="border-t-2 border-gray-200 dark:border-gray-500 pt-4 mt-4">
                                    <div className="flex justify-between items-center py-2">
                                      <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Star className="w-5 h-5 text-indigo-500" />
                                        Total a pagar:
                                      </span>
                                      <div className="text-right">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                          S/ {total.toFixed(2)}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">Incluye todos los impuestos</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Warning Messages */}
                                {!selectedRoom && (
                                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                      </div>
                                      <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                                        Seleccione una habitación para ver el precio
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {(!fechaInicio || !fechaFin) && (
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                      </div>
                                      <p className="text-blue-800 dark:text-blue-300 font-medium">
                                        Seleccione las fechas de check-in y check-out
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {fechaInicio && fechaFin && fechaFin <= fechaInicio && (
                                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                      <p className="text-red-800 dark:text-red-300 font-medium">
                                        La fecha de check-out debe ser posterior al check-in
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Payment Method Selection */}
                                <div className="space-y-3">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Método de Pago
                                  </label>
                                  <div className="relative">
                                    <select 
                                      value={form.payment_method_id || ""} 
                                      onChange={(e) => setForm({ ...form, payment_method_id: e.target.value })} 
                                      className="w-full px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl 
                                                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                                bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                                hover:border-gray-400 dark:hover:border-gray-500 transition-all appearance-none
                                                font-medium shadow-sm"
                                    >
                                      {paymentMethods.map((method) => (
                                        <option key={method.id} value={method.id}>{method.nombre}</option>
                                      ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                      <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>

                                {/* Reference Field */}
                                <div className="space-y-3">
                                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Referencia <span className="text-gray-500">(opcional)</span>
                                  </label>
                                  <input 
                                    type="file" id="foto" name="foto" accept="image/*" 
                                    value={form.referencia || ""} 
                                    onChange={(e) => setForm({ ...form, referencia: e.target.value })} 
                                    placeholder="Número de transacción, comprobante, etc."
                                    className="w-full px-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl 
                                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                                              hover:border-gray-400 dark:hover:border-gray-500 transition-all
                                              font-medium shadow-sm"
                                  />
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Footer with Buttons */}
                    <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t-2 border-gray-100 dark:border-gray-700 px-10 py-8">
                      <div className="flex flex-col sm:flex-row justify-end gap-6">
                        <button 
                          onClick={() => setIsModalOpen(false)} 
                          className="px-10 py-5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 
                                    hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 
                                    text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg transition-all duration-300 
                                    transform hover:scale-105 focus:ring-4 focus:ring-gray-300 focus:outline-none 
                                    flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancelar
                        </button>
                        
                        <button 
                          onClick={submitForm} 
                          disabled={!form.fecha_inicio || !form.fecha_fin || !form.room_id}
                          className={`px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 
                                    transform hover:scale-105 focus:ring-4 focus:outline-none 
                                    shadow-2xl hover:shadow-3xl flex items-center justify-center gap-4 ${
                                      form.fecha_inicio && form.fecha_fin && form.room_id
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white focus:ring-indigo-300'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    }`}
                        >
                          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>{selectedPayment ? "Actualizar Reserva" : "Confirmar Reserva"}</span>
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </div>
              </Dialog>
            </Transition>
          </>
        ):(
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-100 dark:border-gray-700">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Inicia sesión para continuar
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Para realizar una reserva necesitas tener una cuenta activa en nuestro sistema
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/login" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                           text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 
                           focus:ring-4 focus:ring-blue-300 focus:outline-none shadow-lg hover:shadow-xl 
                           flex items-center justify-center gap-3"
                >
                  <User className="w-6 h-6" />
                  Iniciar Sesión
                </a>
                <a 
                  href="/register" 
                  className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 
                           hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 
                           text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg transition-all duration-300 
                           transform hover:scale-105 focus:ring-4 focus:ring-gray-300 focus:outline-none 
                           flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-6 h-6" />
                  Crear Cuenta
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}