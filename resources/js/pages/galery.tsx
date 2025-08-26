import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type ImageType = {
  id: number;
  src: string;
  category: string;
  title: string;
  description: string;
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { key: "all", label: "Todo" },
    { key: "rooms", label: "Habitaciones" },
    { key: "facilities", label: "Instalaciones" },
    { key: "dining", label: "Gastronomía" },
    { key: "spa", label: "Spa & Wellness" }
  ];

  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
      category: "rooms",
      title: "Suite Presidencial",
      description: "Vista panorámica de la ciudad"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3",
      category: "rooms",
      title: "Habitación Deluxe",
      description: "Elegancia y confort"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3",
      category: "facilities",
      title: "Piscina Infinita",
      description: "Vista espectacular de la ciudad"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3",
      category: "dining",
      title: "Restaurante Principal",
      description: "Cocina gourmet internacional"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3",
      category: "spa",
      title: "Centro de Spa",
      description: "Relajación y bienestar total"
    },
    
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3",
      category: "rooms",
      title: "Habitación Standard",
      description: "Comodidad y estilo"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3",
      category: "dining",
      title: "Bar Terraza",
      description: "Cóceles con vista panorámica"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3",
      category: "facilities",
      title: "Gimnasio",
      description: "Equipos de última generación"
    }
  ];

  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const openLightbox = (image: ImageType, index: number) => {
    setSelectedImage(image);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  };

  const showPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setSelectedImage(filteredImages[lightboxIndex - 1]);
      setLightboxIndex(lightboxIndex - 1);
    }
  };
  const showNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[lightboxIndex + 1]);
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <div className="overflow-hidden">
        <Header />
        <main className="mx-auto pt-30 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 dark:text-white">
            Galería
            <span className="font-bold text-gold text-sky-500"> Fotográfica</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre la belleza y elegancia de nuestras instalaciones a través 
            de estas imágenes cuidadosamente seleccionadas.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-3 rounded-full transition-all  duration-300 ${
                selectedCategory === category.key 
                  ? "gradient-gold text-white shadow-lg bg-amber-400" 
                  : "hover:border-gold hover:text-gold"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-0">
          {filteredImages.map((image, idx) => (
            <Card 
              key={image.id} 
              className="overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0 group p-0"
              onClick={() => openLightbox(image, idx)}
            >
              <div className="relative aspect-square">
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                  <div className="bg-black/60 text-white p-4 rounded-b-lg w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadein"
            style={{ animation: 'fadein 0.4s ease-out' }}
        >
            <div className="relative max-w-5xl max-h-full flex flex-col items-center  overflow-hidden ">
                {/* Botón cerrar */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition z-20"
                    onClick={closeLightbox}
                >
                    <X className="w-6 h-6" />
                </Button>

                {/* Contenedor de imagen con overlay */}
                <div className="relative w-full h-full">
                    <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[80vh] object-contain rounded-xl "
                    />

                    {/* Overlay degradado y texto */}
                    <div className="absolute inset-0 bg-gradient-to-t rounded-xl from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                    {selectedImage.title && (
                        <h2 className="text-white text-2xl font-bold drop-shadow-md">
                        {selectedImage.title}
                        </h2>
                    )}
                    {selectedImage.description && (
                        <p className="text-gray-200 mt-2 text-sm drop-shadow-sm">
                        {selectedImage.description}
                        </p>
                    )}
                    </div>
                </div>

                {/* Controles */}
                <div className="flex justify-between w-full mt-4 px-4">
                    <Button
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all rounded-full px-6"
                    disabled={lightboxIndex === 0}
                    onClick={(e) => {
                        e.stopPropagation();
                        showPrev();
                    }}
                    >
                    ⟵ Anterior
                    </Button>
                    <Button
                    variant="outline"
                    className="border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-500 transition-all rounded-full px-6"
                    disabled={lightboxIndex === filteredImages.length - 1}
                    onClick={(e) => {
                        e.stopPropagation();
                        showNext();
                    }}
                    >
                    Siguiente ⟶
                    </Button>
                </div>
            </div>
        </div>
        )}

        </div>
        </main>
       <Footer />
    </div>
  );
}