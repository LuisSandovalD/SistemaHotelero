import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
  Bed, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bell,
  Star,
  MapPin,
  Phone
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  colorFrom: string;
  colorTo: string;
  trend?: string;
  trendUp?: boolean;
  [key: string]: any;
}

function StatCard({ title, value, subtitle, icon: Icon, colorFrom, colorTo, trend, trendUp = true }: StatCardProps) {
  return (
    <div className="group rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorFrom} ${colorTo} opacity-5 rounded-full -translate-y-16 translate-x-16`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorFrom} ${colorTo} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trendUp ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{String(value)}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// Componente de gráfico personalizado
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, children, className = "" }: ChartCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { props } = usePage();
  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  const days = ["Lunes","Martes","Miércoles","Jueves","Viernes",'Sábado','Domingo'];
  
  const { 
    countRoom, 
    countRoomDispo, 
    porcentaje, 
    countReservation, 
    typeRoomIndividual, 
    countTotal, 
    countUserTotal,
    countUserProvider, 
    countUserRecep,
    typeRoomDoble, 
    typeRoomSuite,
    sumTotalYear,
    RoomOcupadas,
  } = props;
  
  const { reservationsByMonth } = usePage().props as unknown as { reservationsByMonth: Record<number, number> };
  const { reservationsByDay } = usePage().props as unknown as { reservationsByDay: Record<number, number> };

  // Preparar datos para los gráficos
  const monthlyData = months.map((month, i) => ({
    name: month,
    reservas: reservationsByMonth[i + 1] ?? 0,
  }));

  const weeklyData = days.map((day, i) => ({
    name: day,
    reservas: reservationsByDay[i + 2] ?? 0,
  }));

  const roomTypeData = [
    { name: 'Individual', value: Number(typeRoomIndividual), color: '#3B82F6' },
    { name: 'Doble', value: Number(typeRoomDoble), color: '#10B981' },
    { name: 'Suite', value: Number(typeRoomSuite), color: '#F59E0B' },
  ];

  const occupancyData = [
    { name: 'Ocupadas', value: Number(RoomOcupadas), color: '#EF4444' },
    { name: 'Disponibles', value: Number(countRoom) - Number(RoomOcupadas), color: '#10B981' },
  ];

  const userTypeData = [
    { name: 'Proveedores', value: Number(countUserProvider), color: '#8B5CF6' },
    { name: 'Recepcionistas', value: Number(countUserRecep), color: '#06B6D4' },
  ];

  // Colores para los gráficos
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-8 p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Resumen del sistema hotelero</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Habitaciones Disponibles"
            value={String(countRoom)}
            subtitle={`de ${String(countRoomDispo)} habitaciones`}
            icon={Bed}
            colorFrom="from-blue-500"
            colorTo="to-blue-700"
            trend={`${String(porcentaje).slice(0,4)}%`}
            trendUp={parseFloat(String(porcentaje)) > 70}
          />
          <StatCard
            title="Reservas Activas"
            value={String(countReservation)}
            icon={Calendar}
            colorFrom="from-green-500"
            colorTo="to-green-700"
            trend="+12%"
          />
          <StatCard
            title="Total de Usuarios"
            value={String(countUserTotal)}
            icon={Users}
            colorFrom="from-purple-500"
            colorTo="to-purple-700"
            trend="+8%"
          />
          <StatCard
            title="Ingresos del Año"
            value={`$${String(sumTotalYear)}`}
            icon={DollarSign}
            colorFrom="from-amber-500"
            colorTo="to-amber-700"
            trend="+15%"
          />
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de reservas por mes */}
          <ChartCard title="Reservas por Mes" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReservas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="reservas" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorReservas)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gráfico de distribución de habitaciones */}
          <ChartCard title="Distribución de Habitaciones por Tipo">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gráfico de ocupación actual */}
          <ChartCard title="Estado de Ocupación">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gráfico de reservas por día de la semana */}
          <ChartCard title="Reservas por Día de la Semana">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px'
                  }}
                />
                <Bar 
                  dataKey="reservas" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gráfico de distribución de usuarios */}
          <ChartCard title="Distribución de Usuarios">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                {/* Eje X: valores numéricos */}
                <XAxis 
                  type="number"
                  stroke="#6B7280"
                  fontSize={12}
                />

                {/* Eje Y: categorías (roles o tipos de usuario) */}
                <YAxis 
                  type="category"
                  dataKey="name"
                  stroke="#6B7280"
                  fontSize={12}
                  width={100}
                />

                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px'
                  }}
                />

                {/* Dibujar las barras */}
                <Bar 
                  dataKey="value"
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* Métricas adicionales en cards más pequeñas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard
            title="Proveedores"
            value={String(countUserProvider)}
            icon={Users}
            colorFrom="from-purple-500"
            colorTo="to-purple-700"
          />
          <StatCard
            title="Recepcionistas"
            value={String(countUserRecep)}
            icon={Users}
            colorFrom="from-cyan-500"
            colorTo="to-cyan-700"
          />
          <StatCard
            title="Hab. Individual"
            value={String(typeRoomIndividual)}
            icon={Bed}
            colorFrom="from-blue-500"
            colorTo="to-blue-700"
          />
          <StatCard
            title="Hab. Doble"
            value={String(typeRoomDoble)}
            icon={Bed}
            colorFrom="from-green-500"
            colorTo="to-green-700"
          />
          <StatCard
            title="Hab. Suite"
            value={String(typeRoomSuite)}
            icon={Bed}
            colorFrom="from-amber-500"
            colorTo="to-amber-700"
          />
          <StatCard
            title="Ingresos Mes"
            value={`$${String(countTotal)}`}
            icon={DollarSign}
            colorFrom="from-emerald-500"
            colorTo="to-emerald-700"
          />
        </div>
      </div>
    </AppLayout>
  );
}