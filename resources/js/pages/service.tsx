import React from "react";
import { type SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  Wifi, Car, Waves, Utensils, Shield,
  Sparkles,
  Dumbbell,
  Briefcase,
  Clock,
  Phone,
  Heart,
  Plane
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Services() {
    const {auth} = usePage<SharedData>().props;

    const mainServices = [
        {
        icon: Waves,
        title: "Piscina Infinita",
        description: "Relájate en nuestra espectacular piscina con vista panorámica de la ciudad.",
        features: ["Vista 360°", "Bar acuático", "Área VIP", "Servicio de toallas"],
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3"
        },
        {
        icon: Utensils,
        title: "Restaurante Gourmet",
        description: "Experiencia culinaria excepcional con chef internacional y ingredientes premium.",
        features: ["Cocina de autor", "Vinos selectos", "Terraza privada", "Menú degustación"],
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3"
        },
        {
        icon: Sparkles,
        title: "Spa & Wellness",
        description: "Centro de bienestar completo para rejuvenecer cuerpo y mente.",
        features: ["Masajes terapéuticos", "Sauna finlandés", "Jacuzzi", "Tratamientos faciales"],
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3"
        }
    ];

    const additionalServices = [
        { icon: Dumbbell, title: "Gimnasio 24/7", description: "Equipos de última generación disponibles todo el día" },
        { icon: Car, title: "Valet Parking", description: "Servicio de estacionamiento con valet personalizado" },
        { icon: Briefcase, title: "Centro de Negocios", description: "Salas de juntas y servicios ejecutivos" },
        { icon: Clock, title: "Concierge 24h", description: "Asistencia personalizada las 24 horas del día" },
        { icon: Phone, title: "Room Service", description: "Servicio a la habitación disponible 24/7" },
        { icon: Wifi, title: "WiFi Premium", description: "Internet de alta velocidad en todo el hotel" },
        { icon: Shield, title: "Seguridad Total", description: "Sistema de seguridad avanzado y personal especializado" },
        { icon: Heart, title: "Eventos Especiales", description: "Organización de bodas, conferencias y celebraciones" },
        { icon: Plane, title: "Transfer Aeropuerto", description: "Traslados privados desde y hacia el aeropuerto" }
    ];

    const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    
    <div className="overflow-hidden">
        <Header />
        <main className="mx-auto pt-30 pb-10">
            {/* Hero */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 dark:text-gray-200">
                    Servicios
                    <span className="font-bold text-gold text-sky-500"> Excepcionales</span>
                </h2>
                <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-400">
                    Descubre una amplia gama de servicios premium diseñados para hacer 
                    de tu estancia una experiencia única e inolvidable.
                </p>
            </div>

            {/* Main Services */}
            <div className="grid lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto ">
                {mainServices.map((service, index) => (
                    <Card key={index} className="overflow-hidden shadow-xl border transform hover:-translate-y-2 transition-all duration-300 pt-0 dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-60 object-cover rounded-t-xl"
                            />
                            <div className="absolute top-4 left-4">
                            <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center bg-sky-50 dark:bg-gray-800">
                                <service.icon className="w-6 h-6 text-dark " />
                            </div>
                            </div>
                        </div>
                        
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-amber-300 text-center">
                            {service.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                            
                            <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-3">Características destacadas:</h4>
                            <ul className="space-y-2">
                                {service.features.map((feature, idx) => (
                                <li key={idx} className="text-sm list-disc ml-4">
                                    <div className="w-2 h-2 bg-gold rounded-full "></div>
                                    {feature}
                                </li>
                                ))}
                            </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Additional Services */}
            <div className="bg-white dark:bg-slate-900 from-white to-blue-50 w-full p-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 dark:text-white">
                    Servicios
                    <span className="font-bold text-sky-500"> Adicionales</span>
                    </h2>
                    <p className="text-lg text-gray-500">
                    Comodidades adicionales para garantizar tu máximo confort
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {additionalServices.map((service, index) => (
                    <div
                        key={index}
                        className="flex items-start space-x-4 p-6 rounded-xl transition-all duration-300 m-2 bg-white shadow-md hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                            <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-2 text-amber-500">{service.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>


           {/* Hours & Contact */}
            <div className="flex justify-center mt-16">
                <div className="flex gap-16">
                    <Card className="border-0 shadow-lg bg-gradient-to-b from-white to-blue-50 hover:shadow-xl transition-all duration-300 min-w-[500px]">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-sky-600 text-center items-center flex justify-center items-center flex-col">
                                <Clock className="w-10 h-10 mb-3 text-yellow-500" />
                                Horarios de Servicios
                                </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-1 border-b border-gray-200">
                                <span className="font-medium">Restaurante</span>
                                <span className="text-amber-500">6:00 AM - 11:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-200">
                                <span className="font-medium">Spa & Wellness</span>
                                <span className="text-amber-500">9:00 AM - 9:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-200">
                                <span className="font-medium">Piscina</span>
                                <span className="text-amber-500">6:00 AM - 10:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-gray-200">
                                <span className="font-medium">Gimnasio</span>
                                <span className="text-amber-500">24 Horas</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="font-medium">Room Service</span>
                                <span className="text-amber-500">24 Horas</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-b from-white to-blue-50 hover:shadow-xl transition-all duration-300 min-w-[500px]">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-sky-600 text-center items-center flex justify-center items-center flex-col">
                                <Phone className="w-10 h-10 mb-3 text-yellow-500" />
                                <p>Contacto Directo</p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 ">
                                <div className="flex justify-between">
                                    <span className="font-medium block">Concierge</span>
                                    <span className="text-yellow-500 font-semibold">Ext. 100</span>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <span className="font-medium block">Room Service</span>
                                    <span className="text-yellow-500 font-semibold">Ext. 200</span>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <span className="font-medium block">Spa</span>
                                    <span className="text-yellow-500 font-semibold">Ext. 300</span>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <span className="font-medium block">Restaurante</span>
                                    <span className="text-yellow-500 font-semibold">Ext. 400</span>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <span className="font-medium block">Emergencias</span>
                                    <span className="text-yellow-500 font-semibold">Ext. 911</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
         <Footer />
    </div>
  );
}