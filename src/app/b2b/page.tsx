"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Truck,
  CreditCard,
  AlertCircle,
  Eye,
} from "lucide-react";

interface DashboardStats {
  pedidosRecentes: {
    id: string;
    numero: string;
    status: string;
    total: number;
    createdAt: string;
    itens: {
      quantidade: number;
    }[];
  }[];
  totalPedidos: number;
  pedidosPendentes: number;
  valorTotalCompras: number;
}

export default function B2BHomePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/b2b/cliente/dashboard");
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "CONFIRMADO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PREPARANDO":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "PRONTO":
        return "bg-green-100 text-green-800 border-green-200";
      case "ENVIADO":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "ENTREGUE":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELADO":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PENDENTE: "Pendente",
      CONFIRMADO: "Confirmado",
      PREPARANDO: "Em Preparação",
      PRONTO: "Pronto",
      ENVIADO: "Enviado",
      ENTREGUE: "Entregue",
      CANCELADO: "Cancelado",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Olá, {session?.user?.name?.split(" ")[0] || "Cliente"}! 👋
        </h1>
        <p className="text-blue-100 text-sm md:text-base">
          Seja bem-vindo à sua plataforma B2B da CRC Faróis
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Total de Pedidos */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Pedidos</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats?.totalPedidos || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Pedidos Pendentes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pedidos Pendentes</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats?.pedidosPendentes || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Valor Total */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Total Compras</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {loading ? "..." : formatPrice(stats?.valorTotalCompras || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Link
          href="/b2b/produtos"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:scale-110 transition-all">
              <Package className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Ver Catálogo</h3>
              <p className="text-sm text-gray-600">
                Navegue pelos nossos produtos
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/b2b/carrinho"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:scale-110 transition-all">
              <ShoppingBag className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Meu Carrinho</h3>
              <p className="text-sm text-gray-600">Finalize seus pedidos</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          href="/b2b/pedidos"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:scale-110 transition-all">
              <FileText className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Meus Pedidos</h3>
              <p className="text-sm text-gray-600">Acompanhe seus pedidos</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      {stats?.pedidosRecentes && stats.pedidosRecentes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Pedidos Recentes
              </h2>
              <Link
                href="/b2b/pedidos"
                className="text-primary hover:text-primary/80 transition-colors font-medium text-sm flex items-center gap-1"
              >
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {stats.pedidosRecentes.slice(0, 5).map((pedido) => (
                <div
                  key={pedido.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-medium text-gray-900">
                          {pedido.numero}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            pedido.status
                          )}`}
                        >
                          {getStatusText(pedido.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(pedido.createdAt)} •{" "}
                        {pedido.itens.reduce(
                          (acc, item) => acc + item.quantidade,
                          0
                        )}{" "}
                        {pedido.itens.reduce(
                          (acc, item) => acc + item.quantidade,
                          0
                        ) === 1
                          ? "item"
                          : "itens"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(pedido.total)}
                      </p>
                    </div>
                    <Link
                      href={`/b2b/pedidos/${pedido.id}`}
                      className="flex items-center gap-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        stats?.pedidosRecentes &&
        stats.pedidosRecentes.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum pedido ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Comece a explorar nosso catálogo e faça seu primeiro pedido!
              </p>
              <Link
                href="/b2b/produtos"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Package className="h-5 w-5" />
                Ver Produtos
              </Link>
            </div>
          </div>
        )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Condições de Pagamento
              </h3>
              <p className="text-sm text-gray-600">
                Consulte suas condições especiais de pagamento ao finalizar o
                pedido.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Entrega Facilitada
              </h3>
              <p className="text-sm text-gray-600">
                Escolha entre retirada ou entrega no endereço cadastrado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
