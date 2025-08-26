import { useState, useMemo, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { BedDouble, DollarSign, MapPin, Plus, Trash2, Users, Edit, Star } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import React from "react";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Habitaciones", href: "/admin/adminrooms" }];

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

interface Room { 
  id: number; 
  numero_habitacion: string; 
  numero_piso: string; 
  precio_noche: number; 
  capacidad: number; 
  type_rooms_id: number | string; 
  room_status_id: number | string; 
  type_room?: { id: number; nombre: string }; 
  room_status?: { id: number; nombre: string }; 
  services?: { id: number; nombre: string }[];
}
interface TypeRoom { id: number; nombre: string; }
interface StatusRoom { id: number; nombre: string; }
interface Services { id: number; nombre: string; }

interface PageProps { 
  rooms: Pagination<Room>; 
  type_rooms: TypeRoom[]; 
  room_status: StatusRoom[]; 
  room_service: Services[]; 
  errors: Record<string, string>; 
  flash?: any; 
  [key: string]: any;
}

// ===================== COMPONENTE CARD =====================
function RoomCard({ room, type_rooms, room_status, onEdit, onDelete }: { room: Room; type_rooms: TypeRoom[]; room_status: StatusRoom[]; onEdit: (room: Room) => void; onDelete: (id: number) => void }) {
  const typeName = type_rooms.find(t => t.id === Number(room.type_rooms_id))?.nombre || "Tipo desconocido";
  const statusName = room_status.find(s => s.id === Number(room.room_status_id))?.nombre || "Estado desconocido";

  return (
   <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    {/* Header con imagen y acciones */}
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
      <img
        src="https://www.cataloniahotels.com/es/blog/wp-content/uploads/2016/05/Habitaci%C3%B3n-suite-catalonia.jpg"
        alt={`Habitación ${room.numero_habitacion}`}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      {/* Badges flotantes */}
      <div className="absolute top-4 left-4 flex gap-2 z-20">
        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full shadow-sm">
          {typeName}
        </span>
        <span className={`px-3 py-1.5 backdrop-blur-sm text-xs font-medium rounded-full shadow-sm ${
          statusName === 'Disponible' ? 'bg-green-500/90 text-white' : 
          statusName === 'Ocupada' ? 'bg-red-500/90 text-white' : 
          'bg-yellow-500/90 text-white'
        }`}>
          {statusName}
        </span>
      </div>

      {/* Botones de acción */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button 
          onClick={() => onEdit(room)} 
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(room.id)} 
          className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-600 p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Número de habitación grande */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <BedDouble className="text-gray-600 w-5 h-5" />
            <div>
              <h3 className="font-bold text-xl text-gray-800">{room.numero_habitacion}</h3>
              <div className="flex items-center text-gray-500 text-sm gap-1">
                <MapPin className="w-3 h-3" />
                <span>Piso {room.numero_piso}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Contenido */}
    <div className="p-6 space-y-4">
      {/* Información principal */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Capacidad</span>
          </div>
          <span className="font-semibold text-gray-800 dark:text-gray-200">{room.capacidad}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
          <div className="flex items-center gap-2 text-green-600">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Por noche</span>
          </div>
          <span className="font-bold text-green-700 dark:text-green-400">${room.precio_noche}</span>
        </div>
      </div>

      {/* Servicios */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Star className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-800 dark:text-gray-200">Servicios incluidos</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {room.services?.map(s => (
            <span 
              key={s.id} 
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors duration-200 cursor-default"
            >
              {s.nombre}
            </span>
          ))}
        </div>
      </div>


    </div>
  </div>
  );
}

// ===================== COMPONENTE MODAL =====================
function RoomFormModal({ isOpen, onClose, type_rooms, room_status, room_service, roomToEdit, setRoomToEdit }: { isOpen: boolean; onClose: () => void; type_rooms: TypeRoom[]; room_status: StatusRoom[]; room_service: Services[]; roomToEdit?: Room | null; setRoomToEdit: (room: Room | null) => void }) {
  const [form, setForm] = useState({
    numero_habitacion: "",
    numero_piso: "",
    precio_noche: "",
    capacidad: "",
    type_rooms_id: "",
    room_status_id: "",
    room_service_id: [] as string[],
  });

  useEffect(() => {
    if (roomToEdit) {
      setForm({
        numero_habitacion: roomToEdit.numero_habitacion,
        numero_piso: roomToEdit.numero_piso,
        precio_noche: roomToEdit.precio_noche.toString(),
        capacidad: roomToEdit.capacidad.toString(),
        type_rooms_id: roomToEdit.type_rooms_id.toString(),
        room_status_id: roomToEdit.room_status_id.toString(),
        room_service_id: roomToEdit.services?.map(s => s.id.toString()) || [],
      });
    } else {
      setForm({ numero_habitacion: "", numero_piso: "", precio_noche: "", capacidad: "", type_rooms_id: "", room_status_id: "", room_service_id: [] });
    }
  }, [roomToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, selectedOptions } = e.target as HTMLSelectElement;
    if (name === "room_service_id") {
      const values = Array.from(selectedOptions).map(o => o.value);
      setForm({ ...form, [name]: values });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (roomToEdit) {
      // Creamos un objeto solo con los campos que hayan cambiado respecto a roomToEdit
      const payload: any = {};
      Object.entries(form).forEach(([key, value]) => {
        const original = (roomToEdit as any)[key];
        // Convertimos todo a string para comparar correctamente
        if (Array.isArray(value)) {
          // Para arrays (servicios)
          if (JSON.stringify(value) !== JSON.stringify(original?.map((v: any) => v.toString()))) {
            payload[key] = value;
          }
        } else if (value.toString() !== (original?.toString() || "")) {
          payload[key] = value;
        }
      });

      // Enviar solo los cambios al backend
      Inertia.put(`/admin/habitaciones/${roomToEdit.id}`, payload);
    } else {
      // Crear nuevo registro
      Inertia.post("/admin/habitaciones", form);
    }

    setRoomToEdit(null);
    onClose();
  };


return (
  <Transition appear show={isOpen} as={React.Fragment}>
    <Dialog as="div" className="relative z-50" onClose={() => { setRoomToEdit(null); onClose(); }}>
      <Transition.Child
        as={React.Fragment}
        enter="ease-out duration-300" 
        enterFrom="opacity-0" 
        enterTo="opacity-100"
        leave="ease-in duration-200" 
        leaveFrom="opacity-100" 
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" 
            enterFrom="opacity-0 scale-90 translate-y-8" 
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200" 
            leaveFrom="opacity-100 scale-100 translate-y-0" 
            leaveTo="opacity-0 scale-90 translate-y-8"
          >
            <Dialog.Panel className="  bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all border border-gray-100 dark:border-gray-800 overflow-hidden">
              
              {/* Header con gradiente y patrón */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 px-8 py-8 dark:bg-gray-700">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <Dialog.Title className="text-3xl font-bold text-white mb-2 text-start">
                      {roomToEdit ? "Editar Habitación" : "Nueva Habitación"}
                    </Dialog.Title>

                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => { setRoomToEdit(null); onClose(); }}
                    className="ml-4 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:rotate-90 hover:scale-110 backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Formulario */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Sección: Información Básica */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-start">Información Básica</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Datos principales y características de la habitación</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { label: "Número de Habitación", name: "numero_habitacion", icon: "🏠", placeholder: "Ej: 101, 201A" },
                        { label: "Número de Piso", name: "numero_piso", icon: "🏢", placeholder: "Ej: 1, 2, 3" },
                        { label: "Precio por Noche", name: "precio_noche", type: "number", icon: "💰", placeholder: "0.00" },
                        { label: "Capacidad de Huéspedes", name: "capacidad", type: "number", icon: "👥", placeholder: "Número de personas" }
                      ].map(field => (
                        <div key={field.name} className="group">
                          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            <span className="text-xl">{field.icon}</span>
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              name={field.name}
                              type={field.type || "text"}
                              value={form[field.name as keyof typeof form]}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              className="w-full h-14 px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 hover:border-gray-300 dark:hover:border-gray-600 group-hover:shadow-md"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sección: Clasificación */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-start">Clasificación y Estado</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Tipo de habitación y estado actual de disponibilidad</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <span className="text-xl">🏷️</span>
                          Tipo de Habitación
                        </label>
                        <div className="relative">
                          <select
                            name="type_rooms_id"
                            value={form.type_rooms_id}
                            onChange={handleChange}
                            className="w-full h-14 px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 outline-none text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 group-hover:shadow-md appearance-none cursor-pointer"
                          >
                            <option value="">Selecciona el tipo de habitación</option>
                            {type_rooms.map(t => (
                              <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <span className="text-xl">📊</span>
                          Estado Actual
                        </label>
                        <div className="relative">
                          <select
                            name="room_status_id"
                            value={form.room_status_id}
                            onChange={handleChange}
                            className="w-full h-14 px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 outline-none text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 group-hover:shadow-md appearance-none cursor-pointer"
                          >
                            <option value="">Selecciona el estado</option>
                            {room_status.map(s => (
                              <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Servicios */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white text-start">Servicios Incluidos</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Selecciona todos los servicios disponibles en esta habitación</p>
                      </div>
                    </div>

                    <div className="group">
                      <div className="relative">
                        <select
                          name="room_service_id"
                          value={form.room_service_id}
                          onChange={handleChange}
                          multiple
                          className="w-full min-h-[200px] px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 outline-none text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 group-hover:shadow-md"
                        >
                          {room_service.map(s => (
                            <option 
                              key={s.id} 
                              value={s.id} 
                              className="py-3 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              {s.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="text-sm text-blue-800 dark:text-blue-200 text-start">
                            <p className="font-medium mb-1">Selección múltiple:</p>
                            <p>• <strong>Windows/Linux:</strong> Mantén presionado Ctrl y haz clic</p>
                            <p>• <strong>Mac:</strong> Mantén presionado Cmd (⌘) y haz clic</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t-2 border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => { setRoomToEdit(null); onClose(); }}
                      className="px-8 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg transform hover:scale-105"
                    >
                      Cancelar
                    </button>
                    
                    <button
                      type="submit"
                      className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-500/30"
                    >
                      {roomToEdit ? "💾 Actualizar Habitación" : "✨ Crear Habitación"}
                    </button>
                  </div>

                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
}

// ===================== COMPONENTE PRINCIPAL =====================
export default function AdminRooms() {
  const { rooms, type_rooms = [], room_status = [], room_service = [] } = usePage<PageProps>().props;
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  

  function handleDelete(id: number) {
    if (confirm('¿Estás seguro de eliminar esta habitación?')) {
      Inertia.delete(`/admin/habitaciones/${id}`);
    }
  }
  // Abrir modal para editar habitación
  function openEditModal(room: Room) {
    setRoomToEdit(room);
    setModalOpen(true);
  }
  const filteredRooms = useMemo(() => {
    const term = search.toLowerCase();
    return rooms.data.filter(room => {
      const typeName = type_rooms.find(t => t.id === Number(room.type_rooms_id))?.nombre.toLowerCase() || "";
      const statusName = room_status.find(s => s.id === Number(room.room_status_id))?.nombre.toLowerCase() || "";
      const roomService = room.services?.map(s => s.nombre.toLowerCase()).join(" ") || "";

      return (
        room.numero_habitacion.toString().includes(term) ||
        room.numero_piso.toString().includes(term) ||
        room.precio_noche.toString().includes(term) ||
        room.capacidad.toString().includes(term) ||
        typeName.includes(term) ||
        statusName.includes(term) ||
        roomService.includes(term)
      );
    });
  }, [search, rooms, type_rooms, room_status]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Habitaciones" />
      <main className="p-8 space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-sky-500 mb-2">Gestión de Habitaciones</h2>
            <p className="text-gray-500 text-sm dark:text-gray-100">Administra y controla la información de las habitaciones.</p>
          </div>
          <button onClick={() => { setRoomToEdit(null); setModalOpen(true); }} className="flex items-center bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200">
            <Plus className="w-5 h-5 mr-2" /> Nueva Habitación
          </button>
        </div>

        <input
          type="search"
          placeholder="Buscar por habitación, piso, tipo, estado o servicio..."
          className="w-full pl-3 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={search} onChange={e => setSearch(e.target.value)} aria-label="Buscar habitaciones"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.length > 0 ? filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} type_rooms={type_rooms} room_status={room_status} onEdit={openEditModal} onDelete={handleDelete} />
          )) : (
            <p className="col-span-full text-center text-gray-500">No hay habitaciones registradas</p>
          )}
        </div>

        <div className="flex space-x-2 justify-end mt-4">
          <div className="p-4 bg-sky-200 dark:bg-gray-800 rounded-xl py-5 ">
            {rooms.links.map((link, idx) => (
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

        <RoomFormModal
          isOpen={modalOpen}
          room_service={room_service}
          onClose={() => setModalOpen(false)}
          type_rooms={type_rooms}
          room_status={room_status}
          roomToEdit={roomToEdit}
          setRoomToEdit={setRoomToEdit}
        />

        
      </main>
    </AppLayout>
  );
}
function setLocalErrors(arg0: {}) {
  throw new Error("Function not implemented.");
}

