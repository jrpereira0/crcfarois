"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RepresentanteCartProvider,
  useRepresentanteCart,
} from "@/contexts/RepresentanteCartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import {
  Users,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Package,
  ShoppingBag,
  ShoppingCart,
  Plus,
} from "lucide-react";

interface RepresentanteLayoutProps {
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
  const { items, isLoaded } = useRepresentanteCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(0);

  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

  // Animar quando items são adicionados
  useEffect(() => {
    if (totalItems > prevTotalItems && prevTotalItems > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    setPrevTotalItems(totalItems);
  }, [totalItems, prevTotalItems]);

  const handleCartClick = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  return (
    <Link
      href="/representante/carrinho"
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        pathname === "/representante/carrinho"
          ? "bg-primary text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      } ${isAnimating ? "scale-110" : "scale-100"}`}
      onClick={handleCartClick}
    >
      <div className="relative">
        <ShoppingCart
          className={`h-5 w-5 transition-transform duration-300 ${
            isAnimating ? "scale-125" : "scale-100"
          }`}
        />
        {totalItems > 0 && (
          <span
            className={`absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
              isAnimating ? "scale-125 bg-green-500" : "scale-100"
            }`}
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>
      <span className="font-medium">Carrinho</span>
      {totalItems > 0 && (
        <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
          {totalItems}
        </span>
      )}
    </Link>
  );
});

// Componente interno que usa o contexto
function RepresentanteLayoutContent({ children }: RepresentanteLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

    if (session.user.role !== "REPRESENTANTE") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  const handleLogout = () => {
    router.push("/api/auth/signout");
  };

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "REPRESENTANTE") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:flex lg:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Image
                  src="/logobranca.svg"
                  alt="CRC Faróis"
                  width={120}
                  height={44}
                  className="h-8 w-auto"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CRC Vendas</h1>
                <p className="text-xs text-gray-500">Representante</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Link
              href="/representante"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/representante"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Início</span>
            </Link>

            <Link
              href="/representante/clientes"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/representante/clientes")
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Meus Clientes</span>
            </Link>

            <Link
              href="/representante/produtos"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/representante/produtos")
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Package className="h-5 w-5" />
              <span className="font-medium">Catálogo</span>
            </Link>

            <Link
              href="/representante/pedidos"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/representante/pedidos")
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-medium">Pedidos</span>
            </Link>

            <CartLink pathname={pathname} setSidebarOpen={setSidebarOpen} />

            <Link
              href="/representante/novo-pedido"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith("/representante/novo-pedido")
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Novo Pedido</span>
            </Link>
          </nav>

          {/* User info and logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.user.name || "Representante"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Portal do Representante
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-6 max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function RepresentanteLayout({
  children,
}: RepresentanteLayoutProps) {
  return (
    <ToastProvider>
      <RepresentanteCartProvider>
        <RepresentanteLayoutContent>{children}</RepresentanteLayoutContent>
      </RepresentanteCartProvider>
    </ToastProvider>
  );
}
