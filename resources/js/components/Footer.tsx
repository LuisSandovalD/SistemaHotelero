import { Mail, MapPin, Phone } from "lucide-react";
import {Link} from '@inertiajs/react';


const navigationItems = [
  { title: "Inicio", route: "/" },
  { title: "Habitaciones", route: "/habitaciones" },
  { title: "Servicios", route: "/servicios" },
  { title: "Galería", route: "/galeria" },
  { title: "Contacto", route: "/contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-sky-800 text-white">
      <div className=" mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Hotel Info */}
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 gradient-gold rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-extrabold text-xl">LS</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-wide">Hotel Maravillas del Mar</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-base max-w-xs">
              Un oasis de lujo y confort en el corazón de la ciudad. 
              Experiencias únicas te esperan en cada rincón de nuestro hotel.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-xl font-semibold text-gold mb-3 tracking-wide">Enlaces Rápidos</h4>
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                    href={item.route}
                    className={`nav-link p-2 flex items-center`}
                    >
                    {item.title}
                    </Link>
                ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h4 className="text-xl font-semibold text-gold mb-3 tracking-wide">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-gold transition-colors duration-300 hover:text-yellow-400" />
                <a href="tel:+15551234567" className="text-gray-300 hover:text-gold transition-colors duration-300 font-medium">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-gold transition-colors duration-300 hover:text-yellow-400" />
                <a href="mailto:info@hotelMaravillas del Mar.com" className="text-gray-300 hover:text-gold transition-colors duration-300 font-medium">
                  info@hotelMaravillas del Mar.com
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-gold transition-colors duration-300 hover:text-yellow-400" />
                <address className="not-italic text-gray-300 font-medium">
                  123 Luxury Ave, Ciudad
                </address>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-5">
            <h4 className="text-xl font-semibold text-gold mb-3 tracking-wide">Servicios</h4>
            <ul className="space-y-2 text-gray-300 list-disc list-inside font-medium text-base">
              <li>Spa & Wellness</li>
              <li>Restaurante Gourmet</li>
              <li>Piscina Infinita</li>
              <li>Centro de Negocios</li>
              <li>Servicio 24/7</li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm font-light">
          <p>© 2024 Hotel Maravillas del Mar. Todos los derechos reservados.</p>
          <p className="mt-3 sm:mt-0">Diseñado con ♥ por Luis Sandoval</p>
        </div>
      </div>
    </footer>
  );
}
