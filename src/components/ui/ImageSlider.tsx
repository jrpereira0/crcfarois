"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideImage {
  desktop: string;
  tablet: string;
  mobile: string;
  alt: string;
}

const slides: SlideImage[] = [
  {
    desktop:
      "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759202846/BANNERDK01_gfjiqi.png",
    tablet:
      "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759202847/BANNERTB01_coonel.png",
    mobile:
      "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759202847/BANNERMB01_hn6c81.png",
    alt: "CRC Faróis - O melhor preço para a sua revenda",
  },
  // Exemplo de como adicionar mais slides:
  // {
  //   desktop: "https://seudominio.com/banner2-desktop-1920x700.jpg",
  //   tablet: "https://seudominio.com/banner2-tablet-1024x500.jpg",
  //   mobile: "https://seudominio.com/banner2-mobile-768x400.jpg",
  //   alt: "Segundo banner - Descrição para SEO",
  // },
  // {
  //   desktop: "https://seudominio.com/banner3-desktop-1920x700.jpg",
  //   tablet: "https://seudominio.com/banner3-tablet-1024x500.jpg",
  //   mobile: "https://seudominio.com/banner3-mobile-768x400.jpg",
  //   alt: "Terceiro banner - Descrição para SEO",
  // },
];

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false); // Iniciar como false
  const [isClient, setIsClient] = useState(false);

  // Verificar se está no cliente para evitar hidratação mismatch
  useEffect(() => {
    setIsClient(true);
    // Só ativar auto-play após montar no cliente
    setIsAutoPlaying(true);
  }, []);

  // Auto-play do slider
  useEffect(() => {
    if (!isAutoPlaying || !isClient) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isClient]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div
      className="relative w-full bg-gray-100"
      onMouseEnter={() => isClient && setIsAutoPlaying(false)}
      onMouseLeave={() => isClient && setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="relative w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } ${index !== currentSlide ? "absolute inset-0" : ""}`}
          >
            {/* Sistema responsivo que troca imagens E adapta tamanhos */}

            {/* Desktop: Imagem grande (1920x700) */}
            <img
              src={slide.desktop}
              alt={slide.alt}
              className="hidden lg:block w-full h-auto max-h-[700px] object-contain"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Tablet: Imagem média (1024x500) */}
            <img
              src={slide.tablet}
              alt={slide.alt}
              className="hidden md:block lg:hidden w-full h-auto max-h-[500px] object-contain"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Mobile: Imagem pequena (768x400) */}
            <img
              src={slide.mobile}
              alt={slide.alt}
              className="block md:hidden w-full h-auto max-h-[400px] object-contain"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Controles de navegação - só aparecem após hidratação */}
      {isClient && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 md:p-3 lg:p-4 rounded-full transition-all duration-300 group"
          >
            <ChevronLeft className="group-hover:scale-110 transition-transform w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 md:p-3 lg:p-4 rounded-full transition-all duration-300 group"
          >
            <ChevronRight className="group-hover:scale-110 transition-transform w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-3 md:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 md:h-1 bg-white/20">
            <div
              className="h-full bg-primary transition-all ease-linear"
              style={{
                width: isAutoPlaying ? "100%" : "0%",
                transitionDuration: isAutoPlaying ? "5000ms" : "300ms",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
