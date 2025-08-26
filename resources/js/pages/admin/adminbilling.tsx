import { useState, useMemo, FormEvent } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { 
  CreditCard, 
  FileText, 
  Download, 
  TrendingUp, 
  X, 
  DollarSign, 
  CreditCardIcon,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Save,
  Info,
  List,
  Home,
  XCircle,
  Calculator,
  Percent,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Facturación', href: '/admin/facturacion' },
];

interface Invoice{
  id:number; 
  reservation_id:number; 
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
  numero_factura:string;
  fecha_emision:string;
  subtotal:number;
  impuestos:number;
  descuento:number;
  total: string | number; 
  estado:string;
}

interface Reservation {
  id: number;
  user_id: string;
  room_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  adultos: number;
  ninos: number;
  reservation_status_id: number;
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
  reservation_status?: {
    id: number;
    nombre: string;
    descripcion?: string;
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

interface PageProps {
  pagination: Pagination<Invoice>; 
  
  invoices: Invoice[]; 
  reservations: Reservation[]; // Agregamos las reservaciones disponibles

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
  InvmentMethods: { id: number; nombre: string }[];
  InvmentStatuses: { id: number; nombre: string }[];
  montosArray: { [key: number]: number };
  [key: string]: any;
}

export default function AdminBilling() {
  const {invoices,users,rooms,pagination,roomStatuses,typeRoom,reservationStatus,montosArray,reservations, paymentPendiente
,paymentConfirmadas
,paymentAnuladas} = usePage<PageProps>().props

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    reservation_id: "",
    numero_factura: "",
    fecha_emision: new Date().toISOString().split('T')[0],
    estado: "emitida",
    descuento: 6
  });

  // Estados de factura disponibles
  const estadosFactura = [
    { value: "emitida", label: "emitida", color: "yellow" },
    { value: "pagada", label: "pagada", color: "green" },
    { value: "anulada", label: "anulada", color: "red" }
  ];

  // Generar número de factura automático
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FAC-${year}${month}-${random}`;
  };

  // Abrir modal para crear factura
  function openModalCreate() {
    setModalType('create');
    setSelectedInvoice(null);
    setForm({
      reservation_id: "",
      numero_factura: generateInvoiceNumber(),
      fecha_emision: new Date().toISOString().split('T')[0],
      estado: "emitida",
      descuento: 6
    });
    setIsModalOpen(true);
  }

  // Abrir modal para editar factura (solo estado)
  function openModalEdit(invoice: Invoice) {
    setModalType('edit');
    setSelectedInvoice(invoice);
    setForm({
      reservation_id: invoice.reservation_id.toString(),
      numero_factura: invoice.numero_factura,
      fecha_emision: invoice.fecha_emision,
      estado: invoice.estado,
      descuento: invoice.descuento || 6
    });
    setIsModalOpen(true);
  }

  // Abrir modal para ver factura completa
  function openModalView(invoice: Invoice) {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  }

  // Manejar envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const subtotal = montosArray[parseInt(form.reservation_id)] || 0;
    const descuentoMonto = (subtotal * form.descuento) / 100;
    const impuestos = (subtotal - descuentoMonto) * 0.18; // 18% de impuestos
    const total = subtotal - descuentoMonto + impuestos;

    const data = {
      ...form,
      subtotal: subtotal,
      impuestos: parseFloat(impuestos.toFixed(2)),
      descuento: parseFloat(descuentoMonto.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };

    if (modalType === 'create') {
      router.post('/admin/facturacion', data, {
        onSuccess: () => {
          setIsModalOpen(false);
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        }
      });
    } else if (modalType === 'edit') {
      router.put(`/admin/facturacion/${selectedInvoice?.id}`, { estado: form.estado }, {
        onSuccess: () => {
          setIsModalOpen(false);
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        }
      });
    }
  };

  // Descargar factura PDF
  const downloadInvoice = (invoice: Invoice) => {
    // Crear contenido HTML para la factura
    const invoiceHTML = generateInvoiceHTML(invoice);
    
    // Crear un blob con el HTML
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${invoice.numero_factura}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generar HTML de la factura para descarga
  const generateInvoiceHTML = (invoice: Invoice) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Factura ${invoice.numero_factura}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .client-info, .invoice-details { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total-final { font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>FACTURA</h1>
            <h2>Hotel Management System</h2>
        </div>
        
        <div class="invoice-info">
            <div>
                <strong>Factura N°:</strong> ${invoice.numero_factura}<br>
                <strong>Fecha de Emisión:</strong> ${invoice.fecha_emision}<br>
                <strong>Estado:</strong> ${invoice.estado.toUpperCase()}
            </div>
        </div>

        <div class="client-info">
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${invoice.reservation?.user?.name || 'N/A'}</p>
            <p><strong>Documento:</strong> ${invoice.reservation?.user?.identity_document || 'N/A'}</p>
            <p><strong>Email:</strong> ${invoice.reservation?.user?.email || 'N/A'}</p>
            <p><strong>Teléfono:</strong> ${invoice.reservation?.user?.phone || 'N/A'}</p>
        </div>

        <div class="invoice-details">
            <h3>Detalles de la Reserva</h3>
            <p><strong>Habitación:</strong> ${invoice.reservation?.room?.numero_habitacion || 'N/A'}</p>
            <p><strong>Tipo:</strong> ${invoice.reservation?.room?.type_room?.nombre || 'N/A'}</p>
            <p><strong>Fecha Inicio:</strong> ${invoice.reservation?.fecha_inicio || 'N/A'}</p>
            <p><strong>Fecha Fin:</strong> ${invoice.reservation?.fecha_fin || 'N/A'}</p>
            <p><strong>Huéspedes:</strong> ${invoice.reservation?.adultos || 0} adultos, ${invoice.reservation?.ninos || 0} niños</p>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Hospedaje - Habitación ${invoice.reservation?.room?.numero_habitacion}</td>
                    <td>1</td>
                    <td>$${invoice.subtotal}</td>
                    <td>$${invoice.subtotal}</td>
                </tr>
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${invoice.subtotal}</span>
            </div>
            <div class="total-row">
                <span>Descuento (6%):</span>
                <span>-$${invoice.descuento}</span>
            </div>
            <div class="total-row">
                <span>Impuestos (18%):</span>
                <span>$${invoice.impuestos}</span>
            </div>
            <div class="total-row total-final">
                <span>TOTAL:</span>
                <span>$${invoice.total}</span>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  // Filtrar facturas basado en búsqueda
  const filteredInvoice = useMemo(() => {
    const lup = search.toLowerCase();

    return invoices.filter((pay) => {
      const res = pay.reservation;
      
      // Usuario
      const userName = res?.user?.name.toLowerCase() || users.find(u => u.id === Number(res?.user_id))?.name.toLowerCase() || "";

      // Habitación
      const roomNumber = res?.room?.numero_habitacion.toString() || rooms.find(r => r.id === Number(res?.room_id))?.numero_habitacion.toString() || "";

      // Estado reserva
      const status = res?.reservation_status?.nombre.toLowerCase() || reservationStatus.find(s => s.id === Number(res?.reservation_status_id))?.nombre.toLowerCase() || "";

      // Datos del pago
      const numero_factura = pay.numero_factura.toString();
      const fecha_emision = pay.fecha_emision.toString() || "";
      const subtotal = pay.subtotal.toString()|| "";
      const impuestos = pay.impuestos.toString();
      const total = pay.total.toString() || "";
      const descuento = pay.descuento.toString()|| "";

      return userName.includes(lup) || roomNumber.includes(lup) || status.includes(lup) || numero_factura.includes(lup) || fecha_emision.includes(lup) || subtotal.includes(lup) || impuestos.includes(lup) || total.includes(lup) || descuento.includes(lup);
    });
  }, [search, invoices, users, rooms, reservationStatus]);

  // Obtener reservaciones sin factura para el select
  const availableReservations = useMemo(() => {
    const invoicedReservationIds = invoices.map(inv => inv.reservation_id);
    return reservations?.filter(res => !invoicedReservationIds.includes(res.id)) || [];
  }, [reservations, invoices]);

return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión Financiera" />
      <main className="p-6">
        {/* Hero Section con estadísticas */}
        <div >
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    Gestión de Facturación
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Control total sobre la facturación del hotel
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openModalCreate}
                className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                <span className="relative z-10">Nueva Factura</span>
              </button>
            </div>
          </div>

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {paymentConfirmadas}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pagadas</p>
                </div>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(filteredInvoice.filter(inv => inv.estado === 'pagada').length / filteredInvoice.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-700 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {paymentPendiente}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
                </div>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(filteredInvoice.filter(inv => inv.estado === 'emitida').length / filteredInvoice.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-700 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {paymentAnuladas}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Anuladas</p>
                </div>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(filteredInvoice.filter(inv => inv.estado === 'anulada').length / filteredInvoice.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${filteredInvoice.reduce((sum, inv) => sum + (parseFloat(String(inv.total))), 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                </div>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full w-full transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda mejorada */}
        <div className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-2">
              <div className="flex items-center gap-4 px-4">
                <div className="flex-shrink-0">
                  <Search className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>

                <input
                  id="search-invoices"
                  type="text"
                  name="search"
                  placeholder="Buscar facturas por número, cliente o estado..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Buscar facturas"
                  className="flex-1 py-3 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 text-lg transition-colors"
                />
                </div>
            </div>
          </div>
        </div>

        {/* Lista de facturas con diseño premium */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Facturas Registradas
              </h2>
              <div className="px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {filteredInvoice.length} resultados
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredInvoice.map((res, index) => {
              const [open, setOpen] = React.useState(false);
              const statusNombre = reservationStatus.find(
                (s) => s.id === res.reservation?.reservation_status_id
              )?.nombre;

              const estadoConfig = {
                'pagada': { color: 'green', icon: CheckCircle, bg: 'from-green-500 to-emerald-600' },
                'anulada': { color: 'red', icon: XCircle, bg: 'from-red-500 to-rose-600' },
                'pendiente': { color: 'yellow', icon: Clock, bg: 'from-yellow-500 to-orange-500' }
              };


              return (
              <div>
                <div className="grid grid-cols-1 xl:grid-cols-4 bg-white dark:bg-gray-800  shadow-xl rounded-2xl border border-gray-100  dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                  
                  {/* Sección Principal - Información */}
                  <div className="xl:col-span-3 p-6">
                    {/* Header con ID y Número de Factura */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-1">
                        <div className='flex items-center gap-4 mb-3'>
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold ">#{res.id}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-1 group-hover:text-blue-600 transition-colors">
                            {res.numero_factura}
                          </h3>
                        </div>
                        <div className="h-px bg-gradient-to-r from-blue-200 to-transparent mb-4"></div>
                        
                        {/* Grid de Información */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                              <User className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">Cliente:</span>
                              <span>{res.reservation?.user?.name || 'Sin cliente'}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">Emisión:</span>
                              <span>{res.fecha_emision}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                              <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              </span>
                              <span className="font-medium">Estado Reserva:</span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                {res.reservation?.reservation_status?.nombre}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Adultos:</span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {res.reservation?.adultos}
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Niños:</span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {res.reservation?.ninos}
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                              <span className="font-medium">Descuento:</span>
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                S/ {res.descuento}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tipo de Habitación */}
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-100">Tipo de habitación:</span>
                          <p className="text-gray-900 font-semibold dark:text-gray-100">{res.reservation?.room?.type_room?.nombre}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Precio y Acciones */}
                  <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-6 flex flex-col justify-between ">
                    {/* Precios */}
                    <div className="text-center mb-6">
                      {res.descuento >=0 ? (
                        <div className="mb-3">
                          <p className="text-gray-300 text-sm mb-1">Precio original</p>
                          <p className="text-gray-400 text-lg line-through">S/ {res.subtotal}</p>
                      </div>):(<>Por ahora no hay descuento</>)

                      }
                      
                      <div className="mb-4">
                        <p className="text-gray-300 text-sm mb-1">Total a pagar</p>
                        <p className="text-white text-4xl font-bold">S/ {res.total}</p>
                      </div>
                      
                      <div className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                        {res.estado}
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="space-y-3 grid grid-cols-1 xl:grid-cols-3 gap-3">
                      <button
                        onClick={() => openModalView(res)}
                        className="w-full flex items-center justify-center gap-2 p-3 h-full text-white border border-white/20 hover:bg-white hover:text-slate-900 rounded-xl transition-all duration-300 hover:shadow-lg group/btn xl:grid"
                        title="Ver factura completa"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform  text-center xl:w-full" />
                        <span className="font-medium xl:text-sm">Ver Detalles</span>
                      </button>
                      
                      <button
                        onClick={() => openModalEdit(res)}
                        className="w-full flex items-center justify-center gap-2 p-3 h-full text-white border border-amber-400/50 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all duration-300 hover:shadow-lg group/btn xl:grid"
                        title="Editar estado"
                      >
                        <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform text-center xl:w-full" />
                        <span className="font-medium xl:text-sm">Editar</span>
                      </button>
                      
                      <button
                        onClick={() => downloadInvoice(res)}
                        className="w-full flex items-center justify-center gap-2 p-3 h-full text-white border border-emerald-400/50 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all duration-300 hover:shadow-lg group/btn xl:grid "
                        title="Descargar PDF"
                      >
                        <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform text-center xl:w-full" />
                        <span className="font-medium xl:text-sm">Descargar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Empty State mejorado */}
          {filteredInvoice.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700">
              <div className="relative mx-auto mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Receipt className="w-16 h-16 text-gray-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {search ? 'No se encontraron resultados' : 'Comienza tu gestión financiera'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                {search 
                  ? 'Intenta ajustar los términos de búsqueda o revisar los filtros aplicados' 
                  : 'Crea tu primera factura para comenzar a llevar el control financiero del hotel'
                }
              </p>
              {!search && (
                <button 
                  onClick={openModalCreate}
                  className="group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 mx-auto"
                >
                  <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
                  Crear Primera Factura
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modales existentes... (mantener los mismos modales pero aplicar los mismos principios de diseño) */}
        {/* Modal para Crear/Editar Factura */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-10">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl  overflow-hidden transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {modalType === 'create' ? 'Nueva Factura' : 'Editar Estado'}
                      </h2>
                      <p className="text-blue-100">
                        {modalType === 'create' ? 'Crear factura para reservación' : 'Actualizar estado de factura'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="max-h-[85vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {modalType === 'create' ? (
                    <>
                      {/* Seleccionar Reservación */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          Seleccionar Reservación
                        </label>
                        <select
                          value={form.reservation_id}
                          onChange={(e) => setForm({...form, reservation_id: e.target.value})}
                          required
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-gray-100 text-lg"
                        >
                          <option value="">Seleccionar reservación...</option>
                          {availableReservations.map((reservation) => (
                            <option key={reservation.id} value={reservation.id}>
                              Reserva #{reservation.id} - {reservation.user?.name} - Hab. {reservation.room?.numero_habitacion} 
                              ({reservation.fecha_inicio} - {reservation.fecha_fin})
                            </option>
                          ))}
                        </select>
                        {availableReservations.length === 0 && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <p className="text-amber-700 dark:text-amber-300 font-medium">No hay reservaciones disponibles para facturar</p>
                          </div>
                        )}
                      </div>

                      {/* Grid para campos principales */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Número de Factura */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <Receipt className="w-5 h-5 text-blue-600" />
                            Número de Factura
                          </label>
                          <input
                            type="text"
                            value={form.numero_factura}
                            onChange={(e) => setForm({...form, numero_factura: e.target.value})}
                            required
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-gray-100 text-lg"
                            placeholder="FAC-2024-001"
                          />
                        </div>

                        {/* Fecha de Emisión */}
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Fecha de Emisión
                          </label>
                          <input
                            type="date"
                            value={form.fecha_emision}
                            onChange={(e) => setForm({...form, fecha_emision: e.target.value})}
                            required
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-gray-100 text-lg"
                          />
                        </div>
                      </div>

                      {/* Descuento */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          <Percent className="w-5 h-5 text-blue-600" />
                          Descuento (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={form.descuento}
                          onChange={(e) => setForm({...form, descuento: parseFloat(e.target.value) || 0})}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-gray-100 text-lg"
                        />
                      </div>

                      {/* Cálculos automáticos */}
                      {form.reservation_id && montosArray[parseInt(form.reservation_id)] && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-blue-200 dark:border-blue-700">
                          <h4 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            <Calculator className="w-6 h-6 text-blue-600" />
                            Cálculos Automáticos
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-blue-200 dark:border-blue-700">
                              <span className="text-lg text-gray-700 dark:text-gray-300">Subtotal:</span>
                              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">S/ {montosArray[parseInt(form.reservation_id)]}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-blue-200 dark:border-blue-700">
                              <span className="text-lg text-gray-700 dark:text-gray-300">Descuento ({form.descuento}%):</span>
                              <span className="text-xl font-semibold text-red-600">-S/ {((montosArray[parseInt(form.reservation_id)] * form.descuento) / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-blue-200 dark:border-blue-700">
                              <span className="text-lg text-gray-700 dark:text-gray-300">Impuestos (18%):</span>
                              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">S/ {(((montosArray[parseInt(form.reservation_id)] - ((montosArray[parseInt(form.reservation_id)] * form.descuento) / 100)) * 0.18)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl px-6 mt-4">
                              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">TOTAL:</span>
                              <span className="text-3xl font-bold text-green-600 dark:text-green-400">S/ {(montosArray[parseInt(form.reservation_id)] - ((montosArray[parseInt(form.reservation_id)] * form.descuento) / 100) + ((montosArray[parseInt(form.reservation_id)] - ((montosArray[parseInt(form.reservation_id)] * form.descuento) / 100)) * 0.18)).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Modal de edición
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Factura: {selectedInvoice?.numero_factura}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Cliente:</span> {selectedInvoice?.reservation?.user?.name}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Total:</span> <span className="text-green-600 font-bold text-lg">${selectedInvoice?.total}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Estado de la Factura */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      Estado de la Factura *
                    </label>
                    <select
                      value={form.estado}
                      onChange={(e) => setForm({...form, estado: e.target.value})}
                      required
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-gray-100 text-lg"
                    >
                      {estadosFactura.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-4 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 font-semibold text-lg"
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || (modalType === 'create' && availableReservations.length === 0)}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isLoading && <RefreshCw className="animate-spin w-5 h-5" />}
                      {modalType === 'create' ? 'Crear Factura' : 'Actualizar Estado'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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


        {/* Modal para Ver Factura Completa */}
        {isViewModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-5xl w-full mx-4 max-h-[95vh] overflow-hidden">
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                      <Receipt className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">Sistema de facturación</h2>
                      <p className="text-indigo-100">Vista completa de factura</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => downloadInvoice(selectedInvoice)}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Descargar PDF
                    </button>
                    <button
                      onClick={() => setIsViewModalOpen(false)}
                      className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-colors backdrop-blur-sm"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="max-h-[85vh] overflow-y-auto font-serif">
                <div className="p-8">
                  {/* Header de la factura */}
                  <div className="text-center mb-12 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 border border-indigo-200 dark:border-indigo-700">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Receipt className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">FACTURA </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Hotel Maravillas del Mar</p>
                  </div>

                  {/* Grid principal de información */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Información de la factura */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Información de Factura</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-600">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Número:</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.numero_factura}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-600">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Fecha:</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.fecha_emision}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Estado:</span>
                          <span className={`
                            inline-flex items-center px-4 py-2 rounded-full text-sm font-bold gap-2 shadow-sm
                            ${selectedInvoice.estado === 'pagada' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : selectedInvoice.estado === 'anulada'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }
                          `}>
                            {selectedInvoice.estado === 'pagada' && <CheckCircle className="w-4 h-4" />}
                            {selectedInvoice.estado === 'anulada' && <XCircle className="w-4 h-4" />}
                            {selectedInvoice.estado === 'pendiente' && <Clock className="w-4 h-4" />}
                            {selectedInvoice.estado.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Información del cliente */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-6 border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cliente</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-600">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Nombre:</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.user?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-600">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Documento:</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.user?.identity_document || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-600">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 break-all">{selectedInvoice.reservation?.user?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Teléfono:</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.user?.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Tabla de servicios */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center">
                        <List className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Servicios</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-600">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                            <th className="px-8 py-6 text-left text-lg font-bold text-gray-900 dark:text-gray-100">Descripción</th>
                            <th className="px-8 py-6 text-center text-lg font-bold text-gray-900 dark:text-gray-100">Cantidad</th>
                            <th className="px-8 py-6 text-right text-lg font-bold text-gray-900 dark:text-gray-100">Precio Unit.</th>
                            <th className="px-8 py-6 text-right text-lg font-bold text-gray-900 dark:text-gray-100">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <td className="px-8 py-6">
                              <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  Hospedaje - Habitación #{selectedInvoice.reservation?.room?.numero_habitacion}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {selectedInvoice.reservation?.fecha_inicio} - {selectedInvoice.reservation?.fecha_fin}
                                </p>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">1</td>
                            <td className="px-8 py-6 text-right text-lg font-semibold text-gray-900 dark:text-gray-100">S/ {selectedInvoice.subtotal}</td>
                            <td className="px-8 py-6 text-right text-lg font-bold text-green-600 dark:text-green-400">S/ {selectedInvoice.subtotal}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Detalles de la reserva */}
                  <div className="mb-5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detalles de la Reserva</h3>
                    </div>
                    <div className=" grid grid-cols-2">
                      <div className="grid grid-cols-1 gap-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-700">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Habitación:</span>
                            <span className="font-bold text-lg text-purple-600 dark:text-purple-400">#{selectedInvoice.reservation?.room?.numero_habitacion}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Piso:</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.room?.numero_piso}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Tipo:</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.room?.type_room?.nombre}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Capacidad:</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.room?.capacidad} personas</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Check-in:</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.fecha_inicio}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Check-out:</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.fecha_fin}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-purple-200 dark:border-purple-600">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Huéspedes:</span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{selectedInvoice.reservation?.adultos || 0} adultos, {selectedInvoice.reservation?.ninos || 0} niños</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Precio/Noche:</span>
                            <span className="font-bold text-green-600 dark:text-green-400 text-lg">${selectedInvoice.reservation?.room?.precio_noche}</span>
                          </div>
                        </div>
                      </div>
                       <div className="flex justify-end mb-10">
                    <div className="w-full max-w-md">
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 border border-gray-200 dark:border-gray-600 shadow-lg">
                        <div className="space-y-6">
                          <div className="flex justify-between items-center py-3 border-b border-gray-300 dark:border-gray-600">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">S/ {selectedInvoice.subtotal}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-300 dark:border-gray-600">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Descuento:</span>
                            <span className="text-xl font-bold text-red-600 dark:text-red-400">-S/ {selectedInvoice.descuento}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b border-gray-300 dark:border-gray-600">
                            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Impuestos (18%):</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">S/ {selectedInvoice.impuestos}</span>
                          </div>
                          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 mt-6">
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">TOTAL:</span>
                              <span className="text-3xl font-bold text-green-600 dark:text-green-400">S/ {selectedInvoice.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>

                
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}