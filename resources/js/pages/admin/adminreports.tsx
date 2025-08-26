import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
  BarChart2,
  FileText,
  PieChart,
  Download,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Reportes', href: '/reportes' },
];

const movimientosSimulados = [
  { id: 1, tipo: 'Ingreso', monto: 200, estado: 'Pagado', fecha: '2025-08-01', clienteProveedor: 'Juan Pérez', metodoPago: 'Tarjeta' },
  { id: 2, tipo: 'Ingreso', monto: 350, estado: 'Pendiente', fecha: '2025-08-10', clienteProveedor: 'María López', metodoPago: 'Efectivo' },
  { id: 3, tipo: 'Egreso', monto: 150, estado: 'Pagado', fecha: '2025-08-05', clienteProveedor: 'Proveedor X', metodoPago: 'Transferencia' },
  { id: 4, tipo: 'Egreso', monto: 300, estado: 'Pendiente', fecha: '2025-08-12', clienteProveedor: 'Proveedor Y', metodoPago: 'Efectivo' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminReports() {
  const [tipoReporte, setTipoReporte] = useState('Facturación');
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    estadoReserva: '',
    cliente: '',
    metodoPago: '',
  });

  const datosFiltrados = useMemo(() => {
    return movimientosSimulados.filter(m => {
      if (tipoReporte === 'Facturación' && m.tipo !== 'Ingreso' && m.tipo !== 'Egreso') return false;
      if (filtros.fechaDesde && m.fecha < filtros.fechaDesde) return false;
      if (filtros.fechaHasta && m.fecha > filtros.fechaHasta) return false;
      if (filtros.estadoReserva && m.estado.toLowerCase() !== filtros.estadoReserva.toLowerCase()) return false;
      if (filtros.cliente && !m.clienteProveedor.toLowerCase().includes(filtros.cliente.toLowerCase())) return false;
      if (filtros.metodoPago && m.metodoPago.toLowerCase() !== filtros.metodoPago.toLowerCase()) return false;
      return true;
    });
  }, [tipoReporte, filtros]);

  const datosGraficoBarras = useMemo(() => {
    const resumen: Record<string, number> = {};
    datosFiltrados.forEach(m => {
      resumen[m.estado] = (resumen[m.estado] || 0) + m.monto;
    });
    return Object.entries(resumen).map(([name, value]) => ({ name, value }));
  }, [datosFiltrados]);

  const datosGraficoPastel = useMemo(() => {
    const resumen: Record<string, number> = { Ingreso: 0, Egreso: 0 };
    datosFiltrados.forEach(m => {
      if (m.tipo === 'Ingreso' || m.tipo === 'Egreso') {
        resumen[m.tipo] += m.monto;
      }
    });
    return Object.entries(resumen).map(([name, value]) => ({ name, value }));
  }, [datosFiltrados]);

  function exportCSV() {
    const header = 'ID,Tipo,Monto,Estado,Fecha,Cliente/Proveedor,Método Pago\n';
    const rows = datosFiltrados
      .map(m => `${m.id},${m.tipo},${m.monto},${m.estado},${m.fecha},"${m.clienteProveedor}",${m.metodoPago}`)
      .join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows);
    const link = document.createElement('a');
    link.href = csvContent;
    link.download = `${tipoReporte}_reporte.csv`;
    link.click();
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reportes" />
      <div className="p-6 space-y-6 h-full">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-indigo-700">
          <BarChart2 className="w-8 h-8" />
          Módulo de Reportes
        </h1>

        {/* Selección tipo reporte */}
        <div className="flex gap-4 items-center">
          <label className="font-semibold flex items-center gap-2 text-gray-700" htmlFor="tipoReporte">
            <FileText className="w-5 h-5" />
            Tipo de Reporte:
          </label>
          <select
            id="tipoReporte"
            value={tipoReporte}
            onChange={e => setTipoReporte(e.target.value)}
            className="rounded border px-3 py-2"
          >
            <option>Reservas</option>
            <option>Ocupación de habitaciones</option>
            <option>Facturación</option>
            <option>Clientes/Huéspedes</option>
            <option>Cancelaciones</option>
            <option>Estado de habitaciones</option>
          </select>
        </div>

        {/* Filtros básicos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4">
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={e => setFiltros(f => ({ ...f, fechaDesde: e.target.value }))}
            className="rounded border px-3 py-2"
            placeholder="Desde"
          />
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={e => setFiltros(f => ({ ...f, fechaHasta: e.target.value }))}
            className="rounded border px-3 py-2"
            placeholder="Hasta"
          />
          <select
            value={filtros.estadoReserva}
            onChange={e => setFiltros(f => ({ ...f, estadoReserva: e.target.value }))}
            className="rounded border px-3 py-2"
          >
            <option value="">Todos</option>
            <option>Confirmada</option>
            <option>Cancelada</option>
            <option>Pendiente</option>
          </select>
          <input
            type="text"
            value={filtros.cliente}
            onChange={e => setFiltros(f => ({ ...f, cliente: e.target.value }))}
            placeholder="Cliente"
            className="rounded border px-3 py-2"
          />
          <select
            value={filtros.metodoPago}
            onChange={e => setFiltros(f => ({ ...f, metodoPago: e.target.value }))}
            className="rounded border px-3 py-2"
          >
            <option value="">Todos</option>
            <option>Tarjeta</option>
            <option>Efectivo</option>
            <option>Transferencia</option>
          </select>
        </div>

        {/* Botón exportar */}
        <button
          onClick={exportCSV}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>

        {/* Tabla */}
        <div className="overflow-x-auto mt-6 bg-white rounded shadow p-4">
          <table className="min-w-full border-collapse">
            <thead className="bg-indigo-100 text-indigo-700 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Monto</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Cliente/Proveedor</th>
                <th className="px-6 py-3 text-left">Método Pago</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500 italic">
                    No se encontraron registros.
                  </td>
                </tr>
              ) : (
                datosFiltrados.map(m => (
                  <tr key={m.id} className="border-b hover:bg-indigo-50 transition">
                    <td className="px-6 py-3">{m.id}</td>
                    <td className={`px-6 py-3 font-semibold ${m.tipo === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                      {m.tipo}
                    </td>
                    <td className="px-6 py-3">${m.monto.toLocaleString()}</td>
                    <td className={`px-6 py-3 font-semibold ${m.estado === 'Pagado' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {m.estado}
                    </td>
                    <td className="px-6 py-3">{m.fecha}</td>
                    <td className="px-6 py-3">{m.clienteProveedor}</td>
                    <td className="px-6 py-3">{m.metodoPago}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 h-80">
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Total por Estado (Barras)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosGraficoBarras}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Proporción Ingreso / Egreso (Pastel)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={datosGraficoPastel}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {datosGraficoPastel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
