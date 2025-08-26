// resources/js/Pages/Admin/Reservations/AdminReservation.tsx
import React, { useState, useMemo, Fragment } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, router, usePage } from "@inertiajs/react";
import { 
  Plus, Edit, Trash2, Link, LogOut, Settings, User, ChevronDown, Search, Filter, 
  Calendar, Users, CreditCard, MapPin, Clock, Star, Wifi, Car, Coffee, Dumbbell,
  Download, Printer, Eye, FileText, CheckCircle, AlertCircle, XCircle,
  Moon, Sun
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import AppLayout from "@/layouts/app-layout";
import { type SharedData } from '@/types';
import { BreadcrumbItem} from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface ReservationHistories{
  user_id: number;
  reservation_id: number;
  reservation?:{
    id: string;
    fecha_inicio: string;
    reservation_status_id: string;
    reservation_status?:{
      id:string;
      nombre:string;
    }
  }
}

interface Reservation{
  id: string;
  fecha_inicio: string;
  fecha_fin:string;
  reservation_status_id: string;
  reservation_status?:{
    id:string;
    nombre:string;
  }
}

interface ReservationStatus{
  id:string;
  nombre:string;
}

interface Invoices{
  id:string;
  reservation_id:string;
  numero_factura:string;
  fecha_emision:string;
  subtotal:string;
  impuestos:string;
  descuento:string;
  total:string;
  estado:string;
}

interface Payments{
  id:string;
  reservation_id: string;
  payment_method_id:  string;
  payment_status_id:  string;
  payment_status?:{
    id:string;
    nombre:string;
  }
  monto:  string;
  fecha_pago:  string;
}

interface PaymentStatus{
  id:string;
  nombre:string;
}

interface PageProps{
  reservationhistories: ReservationHistories[];
  reservation: Reservation[];
  invoice: Invoices[];
  payment:Payments[];
  payment_status : PaymentStatus[],
  reservationstatus :ReservationStatus[];
  [key:string]:any;
}

export default function ReservationHistories() {
  const { auth } = usePage<SharedData>().props;
  const {reservationhistories, reservation, reservationstatus, invoice, payment, payment_status} = usePage<PageProps>().props;
  
  const [darkMode, setDarkMode] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoices | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dateReservationHistories = reservationhistories.filter(search => search.user_id == auth.user.id);

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmado':
        return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30';
      case 'pendiente':
        return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30';
      case 'cancelado':
        return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30';
      default:
        return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-900/30';
    }
  };

  // Función para obtener el ícono del estado
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmado':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendiente':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelado':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Función para descargar PDF
  const handleDownloadPDF = (invoiceData: any) => {
    // Aquí implementarías la lógica de descarga PDF
    console.log('Descargando PDF para factura:', invoiceData);
  };

  // Función para imprimir
  const handlePrint = (invoiceData: any) => {
    // Aquí implementarías la lógica de impresión
    window.print();
  };

  // Función para ver factura
  const handleViewInvoice = (invoiceData: Invoices) => {
    setSelectedInvoice(invoiceData);
    setIsInvoiceModalOpen(true);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Función para formatear moneda
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(parseFloat(amount));
  };

  const themeClasses = darkMode ? 'dark' : '';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <Header />
        
        {/* Barra superior con controles */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mt-20">
          <div className="o px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Historial de Reservaciones
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Gestiona y revisa tus reservaciones anteriores
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar reservaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Toggle modo oscuro */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de reservaciones */}
        <div className=" px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Check-in
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Check-out
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Estado Reserva
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Estado Pago
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dateReservationHistories.map((p, index) => {
                    const reserva = reservation.find(r => r.id == String(p.reservation_id));
                    const status = reservationstatus.find(e => reserva?.reservation_status_id == e.id);
                    const invoiceReservation = invoice.find(f => reserva?.id == f.reservation_id);
                    const paymentReservation = payment.find(a => invoiceReservation?.id == a.reservation_id);
                    const paymentStatus = payment_status.find(s => paymentReservation?.payment_status_id == s.id);
                    const isConfirmed = paymentStatus?.nombre?.toLowerCase() === 'confirmado';

                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {/* Usuario */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {auth.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {auth.user.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {auth.user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Check-in */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {reserva?.fecha_inicio ? formatDate(reserva.fecha_inicio) : 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Check-out */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {reserva?.fecha_fin ? formatDate(reserva.fecha_fin) : 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Estado de la reserva */}
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status?.nombre || '')}`}>
                            {getStatusIcon(status?.nombre || '')}
                            <span className="ml-2">{status?.nombre || 'N/A'}</span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {paymentReservation?.monto ? formatCurrency(paymentReservation.monto) : 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Estado del pago */}
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(paymentStatus?.nombre || '')}`}>
                            {getStatusIcon(paymentStatus?.nombre || '')}
                            <span className="ml-2">{paymentStatus?.nombre || 'N/A'}</span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {isConfirmed ? (
                              <>
                                {/* Botón ver factura */}
                                <button
                                  onClick={() => handleViewInvoice(invoiceReservation!)}
                                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                  title="Ver factura"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                
                                {/* Botón descargar PDF */}
                                <button
                                  onClick={() => handleDownloadPDF(invoiceReservation)}
                                  className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title="Descargar PDF"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                
                                {/* Botón imprimir */}
                                <button
                                  onClick={() => handlePrint(invoiceReservation)}
                                  className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                  title="Imprimir"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                Pago pendiente
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {dateReservationHistories.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No hay reservaciones
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  No tienes reservaciones en tu historial.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal para ver factura */}
        <Transition appear show={isInvoiceModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsInvoiceModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                      Detalle de Factura
                    </Dialog.Title>
                    
                    {selectedInvoice && (
                      <div className="space-y-6">
                        {/* Header de la factura */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                Factura #{selectedInvoice.numero_factura}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                Fecha de emisión: {formatDate(selectedInvoice.fecha_emision)}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInvoice.estado)}`}>
                              {selectedInvoice.estado}
                            </div>
                          </div>
                        </div>

                        {/* Detalles financieros */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(selectedInvoice.subtotal)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Impuestos:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(selectedInvoice.impuestos)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Descuento:</span>
                              <span className="font-medium text-red-600 dark:text-red-400">
                                -{formatCurrency(selectedInvoice.descuento)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                  {formatCurrency(selectedInvoice.total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Acciones del modal */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => setIsInvoiceModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            Cerrar
                          </button>
                          <button
                            onClick={() => handlePrint(selectedInvoice)}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Imprimir</span>
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(selectedInvoice)}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Descargar PDF</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Footer />
      </div>
    </div>
  );
}