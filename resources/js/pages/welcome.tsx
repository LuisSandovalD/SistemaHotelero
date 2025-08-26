import React from "react";
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Waves, 
  Utensils, 
  Shield,
  Calendar,
  ArrowRight,
  Quote
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  
  const features = [
    { icon: Wifi, title: "WiFi Gratis", description: "Internet de alta velocidad" },
    { icon: Car, title: "Estacionamiento", description: "Valet parking incluido" },
    { icon: Coffee, title: "Desayuno Gourmet", description: "Buffet internacional" },
    { icon: Waves, title: "Piscina Infinita", description: "Vista panorámica" },
    { icon: Utensils, title: "Restaurante", description: "Cocina de autor" },
    { icon: Shield, title: "Seguridad 24/7", description: "Personal especializado" },
  ];


  const testimonials = [
    {
      name: "María González",
      text: "Una experiencia absolutamente increíble. El servicio fue excepcional y las instalaciones de primera clase.",
      rating: 5
    },
    {
      name: "Carlos Martínez", 
      text: "El hotel superó todas mis expectativas. La atención al detalle es extraordinaria.",
      rating: 5
    },
    {
      name: "Ana Rodríguez",
      text: "Sin duda el mejor hotel donde me he hospedado. Volveré pronto.",
      rating: 5
    }
  ];

  return (
    <div className="overflow-hidden">
      <Header />
      {/* Hero Section */}
     <main className="dark:bg-slate-800 ">
      <section
        className="relative h-screen flex items-center justify-center text-white"
        style={{
            backgroundImage:
           "linear-gradient(to bottom, rgba(39, 39, 39, 0.8), rgba(0, 0, 0, 0.5), rgb(255, 255, 255)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-light mb-6">
            Bienvenido al
            <span className="block font-bold text-bold text-cyan-400">
                Maravillas del Mar
            </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light leading-relaxed">
            Donde el lujo se encuentra con la comodidad
            <br />
            Una experiencia inolvidable te espera
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/habitaciones">
                <Button className="animate-bounce cursor-pointer  group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 p-6 text-lg font-semibold text-white shadow-md hover:from-blue-500 hover:to-cyan-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-700 hover:animate-none">
                Explorar Habitaciones
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
            </Link>
            <Link href="/contacto">
                <Button
                variant="outline"
                className="animate-bounce  cursor-pointer group flex items-center gap-2 rounded-xl border-2 border-cyan-400 p-6 text-lg font-semibold text-cyan-400 bg-transparent hover:bg-cyan-400 hover:text-white shadow-sm transition-all duration-700 hover:animate-none"
                >
                Contactar
                </Button>
            </Link>
            </div>
        </div>



        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 dark:text-white">
                Una experiencia
                <span className="block font-bold text-gold text-sky-500">extraordinaria</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-white">
                En Hotel <span className="text-sky-500 font-bold">Maravillas del Mar</span>, cada detalle ha sido cuidadosamente diseñado 
                para ofrecerte una estancia incomparable. Nuestro compromiso con la 
                excelencia se refleja en cada aspecto de tu experiencia, desde el 
                momento en que cruzas nuestras puertas hasta tu último recuerdo.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2 text-sky-500">50+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide text-sky-500">Habitaciones de lujo</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2 text-sky-500">24/7</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide text-sky-500">Servicio personalizado</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3" 
                alt="Hotel interior" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -top-6 -left-6 w-24 h-24 gradient-gold rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-sky-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Servicios
              <span className="font-bold text-gold  text-sky-500"> Premium</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Disfruta de amenidades de clase mundial diseñadas para hacer 
              de tu estancia una experiencia memorable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-slate-800">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-dark dark:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 dark:text-white">
              Lo que dicen
              <span className="font-bold text-gold text-sky-500"> nuestros huéspedes</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 ">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white text-sky-500 ">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-gold mb-4" />
                  <p className="text-gray-700 leading-relaxed mb-6 ">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col w-100 items-center">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="flex items-center mt-1 text-sky-500">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gold fill-current " />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 text-white relative h-[600px]"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.31), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            ¿Listo para una experiencia
            <span className="block font-bold text-gold text-sky-500 animate-pulse">inolvidable?</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed ">
            Reserva tu habitación hoy y descubre por qué somos el destino 
            preferido de los viajeros más exigentes
          </p>
          <Link href="/contacto">
            <Button className="group  items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 p-8 text-lg font-semibold text-white shadow-md hover:from-blue-500 hover:to-cyan-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300">
              <Calendar className="mr-2 w-5 h-5" />
              Hacer Reserva
            </Button>
          </Link>
        </div>
      </section>
     </main>
      <Footer />
    </div>
  );
}