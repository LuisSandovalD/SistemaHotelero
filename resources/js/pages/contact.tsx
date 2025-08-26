import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Globe,
  Wifi,
  Car,
  Coffee,
  Shield,
  Award,
  Users,
  Star,
  Heart,
  Zap,
  CheckCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      details: ["+51 986 123 456", "+51 986 123 457"],
      description: "Disponible 24/7",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@maravillasdelmar.com", "reservas@maravillasdelmar.com"],
      description: "Respuesta en 2 horas",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: MapPin,
      title: "Dirección",
      details: ["Av. San Martín 456", "San Vicente de Cañete, Lima"],
      description: "Frente al malecón",
      color: "from-red-400 to-red-600"
    },
    {
      icon: Clock,
      title: "Horarios",
      details: ["Check-in: 3:00 PM", "Check-out: 12:00 PM"],
      description: "Recepción 24 horas",
      color: "from-purple-400 to-purple-600"
    }
  ];

  const socialNetworks = [
    {
      icon: MessageCircle,
      name: "WhatsApp",
      handle: "+51 986 123 456",
      color: "from-green-400 to-green-600",
      followers: "Contacto Directo"
    },
    {
      icon: Facebook,
      name: "Facebook",
      handle: "@MaravillasDelMarHotel",
      color: "from-blue-500 to-blue-700",
      followers: "15.2k seguidores"
    },
    {
      icon: Instagram,
      name: "Instagram",
      handle: "@maravillasdelmar_hotel",
      color: "from-pink-400 via-red-500 to-yellow-500",
      followers: "28.7k seguidores"
    },
    {
      icon: Globe,
      name: "Website",
      handle: "www.maravillasdelmar.com",
      color: "from-indigo-400 to-indigo-600",
      followers: "Sitio Oficial"
    }
  ];

  const facilities = [
    { 
      icon: Wifi, 
      title: "WiFi Premium", 
      description: "Fibra óptica 500 Mbps",
      color: "from-cyan-400 to-cyan-600"
    },
    { 
      icon: Car, 
      title: "Valet Parking", 
      description: "Servicio gratuito 24h",
      color: "from-gray-400 to-gray-600"
    },
    { 
      icon: Coffee, 
      title: "Restaurante Gourmet", 
      description: "Chef internacional",
      color: "from-amber-400 to-amber-600"
    },
    { 
      icon: Shield, 
      title: "Seguridad Total", 
      description: "Vigilancia profesional",
      color: "from-emerald-400 to-emerald-600"
    }
  ];

  const stats = [
    { number: "150+", label: "Huéspedes Felices", icon: Users },
    { number: "4.9", label: "Calificación Promedio", icon: Star },
    { number: "98%", label: "Satisfacción", icon: Heart },
    { number: "24/7", label: "Servicio", icon: Zap }
  ];

  const awards = [
    { 
      title: "Best Coastal Hotel 2024", 
      organization: "Travel Awards Peru",
      icon: Award,
      color: "from-yellow-400 to-yellow-600"
    },
    { 
      title: "Excelencia en Servicio", 
      organization: "TripAdvisor",
      icon: CheckCircle,
      color: "from-green-400 to-green-600"
    },
    { 
      title: "Hotel Sostenible", 
      organization: "Green Hotels",
      icon: Heart,
      color: "from-emerald-400 to-emerald-600"
    }
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="w-full mx-auto ">
          
          {/* Hero Section */}
          <div className="text-center bg-white p-5 dark:bg-gray-800">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-8 shadow-lg">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Tu destino perfecto frente al mar
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-white mb-8">
              <span className="font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                Maravillas del Mar
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              Conecta con nosotros y descubre un paraíso costero donde la hospitalidad peruana 
              se encuentra con el lujo moderno. Estamos aquí para crear momentos inolvidables.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid  gap-16 mb-20 p-10">
            {/* Contact Information */}
            <div className="space-y-8 ">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-10">
                  Información de Contacto
                </h2>
                
                <div className="grid gap-6 grid-cols-1 xl:grid-cols-4">
                  {contactInfo.map((info, index) => (
                    <Card 
                      key={index} 
                      className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl group hover:-translate-y-2 overflow-hidden"
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start space-x-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                            <info.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3">
                              {info.title}
                            </h3>
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-gray-700 dark:text-gray-300 font-medium text-lg mb-1">
                                {detail}
                              </p>
                            ))}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Map */}
              <Card className="p-0">
                  <div className="bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3')] bg-cover py-10 rounded-xl bg-center">
                    <div className="text-white text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-cyan-400 drop-shadow-lg" />
                      <p className="font-bold text-2xl mb-2">Maravillas del Mar</p>
                      <p className="text-lg opacity-90 mb-4">San Vicente de Cañete, Lima</p>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 rounded-full px-8 py-3 font-semibold shadow-lg">
                        Ver Ubicación
                      </Button>
                    </div>
                  </div>
              </Card>
            </div>

            {/* Social Networks & Additional Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-10">
                  Síguenos en Redes
                </h2>
                
                <div className="grid gap-6 grid-cols-1 xl:grid-cols-4">
                  {socialNetworks.map((social, index) => (
                    <Card 
                      key={index} 
                      className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl group hover:-translate-y-2 cursor-pointer overflow-hidden"
                    >
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${social.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                            <social.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                              {social.name}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 font-mono text-lg mb-1">
                              {social.handle}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {social.followers}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Design Credit */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Diseño Web
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Creado con ❤️ por
                  </p>
                  <p className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Luis Sandoval
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Experiencias digitales únicas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Facilities Section */}
          <div className="mb-20 p-10">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-16">
              Nuestras Facilidades Premium
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {facilities.map((facility, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl group hover:-translate-y-3">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${facility.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                      <facility.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3">
                      {facility.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {facility.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Awards Section */}
          <div className="mb-20 p-10">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-16">
              Reconocimientos y Premios
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {awards.map((award, index) => (
                <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-lg rounded-3xl group hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${award.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <award.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3">
                      {award.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {award.organization}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 rounded-3xl overflow-hidden m-10 p-0">
            <CardContent className="p-16 text-center text-white relative">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Tu Paraíso Te Espera
                </h2>
                <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto">
                  Donde el océano Pacífico abraza la costa peruana y cada momento se convierte en un recuerdo eterno
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:scale-105 transition-all duration-300">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    WhatsApp
                  </Button>
                  <Button className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:scale-105 transition-all duration-300">
                    <Phone className="w-5 h-5 mr-3" />
                    Llamar Ahora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}