"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  User,
  LogOut,
  Home,
  Info,
  MessageSquare,
} from "lucide-react";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fechar sidebar ao clicar fora (mobile)
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  // Detectar scroll para esconder a barra amarela
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      {/* Barra superior com informações de contato */}
      <div
        className={`bg-yellow-300 text-primary py-2 transition-all duration-300 overflow-hidden ${
          isScrolled ? "max-h-0 opacity-0 py-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4">
          {/* Mobile - Animação contínua */}
          <div className="md:hidden overflow-hidden">
            <div className="flex items-center animate-scroll-left">
              {/* Duplicar o conteúdo para animação infinita */}
              <div className="flex items-center space-x-6 text-xs whitespace-nowrap py-1 pr-6">
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Phone size={12} />
                  <span>(11) 99226-8645</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Mail size={12} />
                  <span>contato@crcfarois.ind.br</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <MapPin size={12} />
                  <span>Seg. - Qui. 08h-17h / Sex. 08h-16h</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <MapPin size={12} />
                  <span>São Bernardo do Campo - SP</span>
                </div>
              </div>
              {/* Duplicata para loop infinito */}
              <div className="flex items-center space-x-6 text-xs whitespace-nowrap py-1 pr-6">
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Phone size={12} />
                  <span>(11) 99226-8645</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Mail size={12} />
                  <span>contato@crcfarois.ind.br</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <MapPin size={12} />
                  <span>Seg. - Qui. 08h-17h / Sex. 08h-16h</span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <MapPin size={12} />
                  <span>São Bernardo do Campo - SP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop - Layout original */}
          <div className="hidden md:flex flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone size={14} />
                <span>(11) 99226-8645</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={14} />
              <span>contato@crcfarois.ind.br</span>
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
              className="h-10 md:h-14 w-auto"
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

            {/* Desktop - Usuário logado ou botão de login */}
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <User className="h-4 w-4 text-yellow-300" />
                  <span className="text-white text-sm font-medium">
                    {session.user.name || "Usuário"}
                  </span>
                </div>
                <Link
                  href={
                    session.user.role === "ADMIN"
                      ? "/dashboard"
                      : session.user.role === "REPRESENTANTE"
                      ? "/representante"
                      : "/b2b"
                  }
                  className="bg-yellow-300 text-primary px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {session.user.role === "ADMIN"
                    ? "Dashboard"
                    : session.user.role === "REPRESENTANTE"
                    ? "Painel"
                    : "Plataforma B2B"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-red-600"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-yellow-300 text-primary px-8 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Área do Cliente
              </Link>
            )}
          </div>

          {/* Botão do menu mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:text-yellow-300 transition-colors"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header da Sidebar */}
          <div className="bg-primary p-6 flex items-center justify-between">
            <Image
              src="/logobranca.svg"
              alt="CRC Faróis"
              width={140}
              height={51}
              className="h-10 w-auto"
            />
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-yellow-300 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Usuário logado - Mobile */}
          {session && (
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {session.user.name || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Links de Navegação */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors font-medium"
                onClick={toggleSidebar}
              >
                <Home className="h-5 w-5" />
                Início
              </Link>
              <Link
                href="/quem-somos"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors font-medium"
                onClick={toggleSidebar}
              >
                <Info className="h-5 w-5" />
                Quem Somos
              </Link>
              <Link
                href="/contato"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors font-medium"
                onClick={toggleSidebar}
              >
                <MessageSquare className="h-5 w-5" />
                Contato
              </Link>
            </div>
          </nav>

          {/* Footer da Sidebar - Ação principal */}
          <div className="border-t border-gray-200 p-6 space-y-3">
            {session ? (
              <>
                <Link
                  href={
                    session.user.role === "ADMIN"
                      ? "/dashboard"
                      : session.user.role === "REPRESENTANTE"
                      ? "/representante"
                      : "/b2b"
                  }
                  className="block w-full text-center bg-primary text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all"
                  onClick={toggleSidebar}
                >
                  {session.user.role === "ADMIN"
                    ? "Ir para Dashboard"
                    : session.user.role === "REPRESENTANTE"
                    ? "Ir para Painel"
                    : "Ir para Plataforma B2B"}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleSidebar();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-red-600 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Sair da Conta
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full text-center bg-primary text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:bg-primary/90 transition-all"
                onClick={toggleSidebar}
              >
                Área do Cliente
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
