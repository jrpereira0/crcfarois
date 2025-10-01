"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  ShoppingBag,
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
} from "lucide-react";

interface DashboardStats {
  totalClientes: number;
  pedidosHoje: number;
  pedidosMes: number;
  comissaoMes: number;
  pedidosRecentes: {
    id: string;
    numero: string;
    status: string;
    total: number;
    createdAt: string;
    cliente: {
      razaoSocial: string;
      user: {
        name: string;
      };
    };
  }[];
}

export default function RepresentanteDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar estatísticas
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/representante/dashboard");

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Formatação de preço
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }, []);

  // Formatação de data
  const formatDate = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  }, []);

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMADO":
        return "bg-blue-100 text-blue-800";
      case "PREPARANDO":
        return "bg-purple-100 text-purple-800";
      case "PRONTO":
        return "bg-green-100 text-green-800";
      case "ENVIADO":
        return "bg-indigo-100 text-indigo-800";
      case "ENTREGUE":
        return "bg-green-100 text-green-800";
      case "CANCELADO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao portal do representante</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Meus Clientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats?.totalClientes || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pedidos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats?.pedidosHoje || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pedidos Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats?.pedidosMes || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Comissão Mês</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : formatPrice(stats?.comissaoMes || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/representante/clientes"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Meus Clientes</h3>
              <p className="text-sm text-gray-600">
                Visualizar clientes atribuídos
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/representante/produtos"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Catálogo</h3>
              <p className="text-sm text-gray-600">
                Visualizar produtos disponíveis
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/representante/novo-pedido"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Novo Pedido</h3>
              <p className="text-sm text-gray-600">Criar pedido para cliente</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Pedidos recentes */}
      {stats?.pedidosRecentes && stats.pedidosRecentes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Pedidos Recentes
            </h2>
            <Link
              href="/representante/pedidos"
              className="text-primary hover:text-primary/80 transition-colors font-medium text-sm sm:text-base"
            >
              Ver todos
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {stats.pedidosRecentes.slice(0, 5).map((pedido) => (
              <div
                key={pedido.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3"
              >
                {/* Desktop/Tablet Layout */}
                <div className="hidden sm:flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">
                      {pedido.numero}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {pedido.cliente.razaoSocial || pedido.cliente.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(pedido.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="flex sm:hidden items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {pedido.numero}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {pedido.cliente.razaoSocial || pedido.cliente.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(pedido.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                      pedido.status
                    )}`}
                  >
                    {pedido.status}
                  </span>
                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(pedido.total)}
                    </p>
                  </div>
                  <Link
                    href={`/representante/pedidos/${pedido.id}`}
                    className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
                  >
                    <Eye className="h-3 w-3" />
                    Ver
                  </Link>
                </div>

                {/* Mobile Actions */}
                <div className="flex sm:hidden items-center justify-between gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      pedido.status
                    )}`}
                  >
                    {pedido.status}
                  </span>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatPrice(pedido.total)}
                  </p>
                  <Link
                    href={`/representante/pedidos/${pedido.id}`}
                    className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-xs"
                  >
                    <Eye className="h-3 w-3" />
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
