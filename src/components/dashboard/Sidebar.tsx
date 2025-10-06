"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Users,
  Package,
  FolderTree,
  ShoppingBag,
  DollarSign,
  UserCheck,
  FileText,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Clientes",
    href: "/dashboard/clientes",
    icon: Users,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Representantes",
    href: "/dashboard/representantes",
    icon: UserCheck,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Solicitações",
    href: "/dashboard/solicitacoes",
    icon: FileText,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Produtos",
    href: "/dashboard/produtos",
    icon: Package,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Categorias",
    href: "/dashboard/categorias",
    icon: FolderTree,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Pedidos",
    href: "/dashboard/pedidos",
    icon: ShoppingBag,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Faturamento",
    href: "/dashboard/faturamento",
    icon: DollarSign,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
  {
    name: "Usuários",
    href: "/dashboard/usuarios",
    icon: UserCog,
    roles: ["ADMIN"], // Apenas ADMIN pode gerenciar usuários
  },
  {
    name: "Meu Perfil",
    href: "/dashboard/perfil",
    icon: User,
    roles: ["ADMIN", "FUNCIONARIO"],
  },
];

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [contadores, setContadores] = useState({
    solicitacoesPendentes: 0,
    pedidosPendentes: 0,
  });
  const pathname = usePathname();
  const { data: session } = useSession();

  // Buscar contadores
  useEffect(() => {
    const fetchContadores = async () => {
      try {
        const response = await fetch("/api/admin/contadores");
        if (response.ok) {
          const data = await response.json();
          setContadores(data);
        }
      } catch (error) {
        console.error("Erro ao buscar contadores:", error);
      }
    };

    // Buscar contadores inicialmente
    if (session?.user?.role === "ADMIN" || session?.user?.role === "FUNCIONARIO") {
      fetchContadores();

      // Atualizar contadores a cada 30 segundos
      const interval = setInterval(fetchContadores, 30000);

      return () => clearInterval(interval);
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-primary">
          <div className="flex-1 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <Image
                src="/logobranca.svg"
                alt="CRC Faróis"
                width={120}
                height={44}
                className="h-7 w-auto"
                priority
              />
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-200 ml-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          {navigation
            .filter((item) => item.roles.includes(session?.user?.role as any))
            .map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard/clientes" &&
                  pathname.startsWith("/dashboard/clientes")) ||
                (item.href === "/dashboard/representantes" &&
                  pathname.startsWith("/dashboard/representantes")) ||
                (item.href === "/dashboard/produtos" &&
                  pathname.startsWith("/dashboard/produtos")) ||
                (item.href === "/dashboard/categorias" &&
                  pathname.startsWith("/dashboard/categorias")) ||
                (item.href === "/dashboard/faturamento" &&
                  pathname.startsWith("/dashboard/faturamento")) ||
                (item.href === "/dashboard/usuarios" &&
                  pathname.startsWith("/dashboard/usuarios"));
              
              // Determinar se deve mostrar badge
              const showBadge = 
                (item.href === "/dashboard/solicitacoes" && contadores.solicitacoesPendentes > 0) ||
                (item.href === "/dashboard/pedidos" && contadores.pedidosPendentes > 0);
              
              const badgeCount = 
                item.href === "/dashboard/solicitacoes" 
                  ? contadores.solicitacoesPendentes 
                  : item.href === "/dashboard/pedidos" 
                    ? contadores.pedidosPendentes 
                    : 0;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md mb-2 transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {showBadge && (
                    <span className={cn(
                      "ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full",
                      isActive
                        ? "bg-white text-primary"
                        : "bg-red-500 text-white"
                    )}>
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
        </nav>

        {/* Mobile user menu */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary">
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
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2">
            {navigation
              .filter((item) => item.roles.includes(session?.user?.role as any))
              .map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/dashboard/clientes" &&
                    pathname.startsWith("/dashboard/clientes")) ||
                  (item.href === "/dashboard/representantes" &&
                    pathname.startsWith("/dashboard/representantes")) ||
                  (item.href === "/dashboard/produtos" &&
                    pathname.startsWith("/dashboard/produtos")) ||
                  (item.href === "/dashboard/categorias" &&
                    pathname.startsWith("/dashboard/categorias")) ||
                  (item.href === "/dashboard/pedidos" &&
                    pathname.startsWith("/dashboard/pedidos")) ||
                  (item.href === "/dashboard/faturamento" &&
                    pathname.startsWith("/dashboard/faturamento")) ||
                  (item.href === "/dashboard/usuarios" &&
                    pathname.startsWith("/dashboard/usuarios"));
                
                // Determinar se deve mostrar badge
                const showBadge = 
                  (item.href === "/dashboard/solicitacoes" && contadores.solicitacoesPendentes > 0) ||
                  (item.href === "/dashboard/pedidos" && contadores.pedidosPendentes > 0);
                
                const badgeCount = 
                  item.href === "/dashboard/solicitacoes" 
                    ? contadores.solicitacoesPendentes 
                    : item.href === "/dashboard/pedidos" 
                      ? contadores.pedidosPendentes 
                      : 0;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {showBadge && (
                      <span className={cn(
                        "ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full",
                        isActive
                          ? "bg-white text-primary"
                          : "bg-red-500 text-white"
                      )}>
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
          </nav>

          {/* User menu */}
          <div className="relative border-t border-gray-200">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center w-full px-4 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full mr-3">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  userMenuOpen && "rotate-180"
                )}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mb-2 mx-4">
                <button
                  onClick={handleSignOut}
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

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-white p-2 rounded-md shadow-lg border border-gray-200"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </>
  );
}
