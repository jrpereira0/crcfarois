"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  Bell,
  Package,
  FileText,
  ChevronDown,
} from "lucide-react";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";

interface B2BLayoutProps {
  children: React.ReactNode;
}

// Componente separado para o link do carrinho que usa o contexto
const CartLink = memo(function CartLink({
  pathname,
  setSidebarOpen,
}: {
  pathname: string;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { state, isLoaded, isOnline } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(0);

  // Animar quando items são adicionados
  useEffect(() => {
    if (state.totalItems > prevTotalItems && prevTotalItems > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    setPrevTotalItems(state.totalItems);
  }, [state.totalItems, prevTotalItems]);

  const handleCartClick = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  return (
    <Link
      href="/b2b/carrinho"
      prefetch={true}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
        pathname === "/b2b/carrinho"
          ? "bg-primary text-white"
          : "text-gray-700 hover:bg-gray-100"
      } ${isAnimating ? "scale-110" : "scale-100"}`}
      onClick={handleCartClick}
    >
      <div className="relative mr-3">
        <ShoppingCart
          className={`h-5 w-5 transition-transform duration-300 ${
            isAnimating ? "scale-125" : "scale-100"
          }`}
        />
        {state.totalItems > 0 && (
          <span
            className={`absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
              isAnimating ? "scale-125 bg-green-500" : "scale-100"
            }`}
          >
            {state.totalItems > 99 ? "99+" : state.totalItems}
          </span>
        )}
        {/* Indicador de status online/offline */}
        {isLoaded && !isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      Carrinho
    </Link>
  );
});

// Componente interno que usa o contexto
function B2BLayoutContent({ children }: B2BLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "CLIENTE") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "CLIENTE") {
    return null;
  }

  return (
    <div className="bg-gray-50 flex min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 lg:left-0 lg:right-auto z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out border-l lg:border-l-0 lg:border-r border-gray-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <Image
                src="/logobranca.svg"
                alt="CRC Faróis"
                width={140}
                height={51}
                className="h-8 w-auto"
                priority
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute left-4 text-white hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <Link
              href="/b2b"
              prefetch={true}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === "/b2b"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="mr-3 h-5 w-5" />
              Início
            </Link>

            <Link
              href="/b2b/produtos"
              prefetch={true}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === "/b2b/produtos"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Package className="mr-3 h-5 w-5" />
              Produtos
            </Link>

            <CartLink pathname={pathname} setSidebarOpen={setSidebarOpen} />

            <Link
              href="/b2b/pedidos"
              prefetch={true}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname.startsWith("/b2b/pedidos")
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FileText className="mr-3 h-5 w-5" />
              Meus Pedidos
            </Link>

            <Link
              href="/b2b/perfil"
              prefetch={true}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === "/b2b/perfil"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <User className="mr-3 h-5 w-5" />
              Meu Perfil
            </Link>
          </nav>

          {/* User Menu */}
          <div className="relative border-t border-gray-200">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center w-full px-4 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">
                  {session.user.name || "Cliente"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mb-2 mx-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar - Fixed */}
        <div className="bg-primary shadow-lg flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Logo - Mobile */}
            <Link href="/b2b" className="lg:hidden">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                <Image
                  src="/logobranca.svg"
                  alt="CRC Faróis"
                  width={120}
                  height={44}
                  className="h-7 w-auto"
                  priority
                />
              </div>
            </Link>

            {/* Title - Desktop */}
            <h1 className="hidden lg:block text-lg font-semibold text-white">
              Plataforma B2B CRC Faróis
            </h1>

            <div className="flex items-center gap-4">
              {/* Notifications - Desktop only */}
              <button className="hidden lg:flex relative p-2 text-white hover:text-gray-200 rounded-lg hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Menu button - Mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content - Scrollable */}
        <main className="flex-1 bg-gray-50">
          <div className="p-6 max-w-full min-h-screen">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function B2BLayout({ children }: B2BLayoutProps) {
  return (
    <ToastProvider>
      <CartProvider>
        <B2BLayoutContent>{children}</B2BLayoutContent>
      </CartProvider>
    </ToastProvider>
  );
}
