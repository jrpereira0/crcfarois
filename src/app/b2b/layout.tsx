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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out border-r border-gray-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary relative">
            <Image
              src="/logobranca.svg"
              alt="CRC Faróis"
              width={140}
              height={51}
              className="h-9 w-auto"
              priority
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute right-4 text-white hover:text-gray-200"
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
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 h-screen overflow-hidden">
        {/* Top bar - Fixed */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>

              {/* Title */}
              <h1 className="text-lg font-semibold text-gray-900">
                Plataforma B2B CRC Faróis
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content - Scrollable */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-6">{children}</div>
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
