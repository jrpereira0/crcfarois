"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      {/* Barra superior com informações de contato */}
      <div className="bg-yellow-300 text-primary py-2">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>(11) 99226-8645</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={14} />
              <span>contato@crc.ind.br</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>Seg. - Qui. 08:00h às 17:00h / Sex. 08:00h às 16:00h</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>São Bernardo do Campo - SP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logobranca.svg"
              alt="CRC Faróis"
              width={200}
              height={73}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Menu Desktop - Elegante */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link
              href="/"
              className="relative text-white hover:text-yellow-300 font-medium transition-colors py-2 group"
            >
              Início
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/quem-somos"
              className="relative text-white hover:text-yellow-300 font-medium transition-colors py-2 group"
            >
              Quem Somos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contato"
              className="relative text-white hover:text-yellow-300 font-medium transition-colors py-2 group"
            >
              Contato
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/login"
              className="bg-yellow-300 text-primary px-8 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Área do Cliente
            </Link>
          </div>

          {/* Botão do menu mobile */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-yellow-300 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className="text-white hover:text-yellow-300 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/quem-somos"
                className="text-white hover:text-yellow-300 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Quem Somos
              </Link>
              <Link
                href="/contato"
                className="text-white hover:text-yellow-300 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link
                href="/login"
                className="bg-yellow-300 text-primary hover:text-primary px-6 py-2 rounded-lg transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Área do Cliente
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
