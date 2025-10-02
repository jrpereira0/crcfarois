"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  UserCheck,
  FileText,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";

interface DashboardStats {
  totalClientes: number;
  clientesAtivos: number;
  clientesMesAnterior: number;
  totalRepresentantes: number;
  representantesAtivos: number;
  representantesMesAnterior: number;
  totalProdutos: number;
  produtosAtivos: number;
  produtosMesAnterior: number;
  totalPedidos: number;
  pedidosPendentes: number;
  pedidosAprovados: number;
  pedidosRecusados: number;
  pedidosMesAtual: number;
  pedidosMesAnterior: number;
  faturamentoMesAtual: number;
  faturamentoMesAnterior: number;
  faturamentoTotal: number;
  solicitacoesPendentes: number;
  solicitacoesTotal: number;
  pedidosRecentes: Array<{
    id: string;
    numeroPedido: string;
    status: string;
    total: number;
    createdAt: string;
    cliente: {
      razaoSocial: string;
    };
    representante: {
      user: {
        name: string;
      };
    };
  }>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDENTE: {
        label: "Pendente",
        className: "bg-yellow-100 text-yellow-800",
      },
      CONFIRMADO: {
        label: "Confirmado",
        className: "bg-green-100 text-green-800",
      },
      PREPARANDO: {
        label: "Preparando",
        className: "bg-blue-100 text-blue-800",
      },
      PRONTO: {
        label: "Pronto",
        className: "bg-indigo-100 text-indigo-800",
      },
      ENVIADO: { 
        label: "Enviado", 
        className: "bg-purple-100 text-purple-800" 
      },
      CANCELADO: {
        label: "Cancelado",
        className: "bg-red-100 text-red-800",
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-8 pt-16 lg:pt-0">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="animate-pulse space-y-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Erro ao carregar dados</p>
      </div>
    );
  }

  const clientesChange = calculatePercentageChange(
    stats.totalClientes,
    stats.clientesMesAnterior
  );
  const representantesChange = calculatePercentageChange(
    stats.totalRepresentantes,
    stats.representantesMesAnterior
  );
  const produtosChange = calculatePercentageChange(
    stats.totalProdutos,
    stats.produtosMesAnterior
  );
  const pedidosChange = calculatePercentageChange(
    stats.pedidosMesAtual,
    stats.pedidosMesAnterior
  );
  const faturamentoChange = calculatePercentageChange(
    stats.faturamentoMesAtual,
    stats.faturamentoMesAnterior
  );

  return (
    <div className="h-full flex flex-col space-y-8 pt-16 lg:pt-0 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Aqui está um resumo completo do seu painel administrativo da CRC
          Faróis.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Clientes */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Clientes
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalClientes}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                {clientesChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`font-medium ${
                    clientesChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(clientesChange).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-2">vs mês anterior</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.clientesAtivos} ativos
              </p>
            </div>
          </div>
        </div>

        {/* Total Representantes */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Representantes
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalRepresentantes}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                {representantesChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`font-medium ${
                    representantesChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.abs(representantesChange).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-2">vs mês anterior</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.representantesAtivos} ativos
              </p>
            </div>
          </div>
        </div>

        {/* Total Produtos */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Produtos Cadastrados
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {stats.totalProdutos}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                {produtosChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`font-medium ${
                    produtosChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(produtosChange).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-2">vs mês anterior</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.produtosAtivos} ativos
              </p>
            </div>
          </div>
        </div>

        {/* Faturamento Mês Atual */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Faturamento (Mês)
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.faturamentoMesAtual)}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                {faturamentoChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span
                  className={`font-medium ${
                    faturamentoChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(faturamentoChange).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-2">vs mês anterior</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total: {formatCurrency(stats.faturamentoTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pedidos do Mês */}
        <Link
          href="/dashboard/pedidos"
          className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-sm rounded-lg border border-blue-200 hover:shadow-md transition-all hover:scale-105"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Pedidos (Mês)
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {stats.pedidosMesAtual}
                </p>
                <div className="flex items-center mt-2 text-xs">
                  {pedidosChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span
                    className={`font-medium ${
                      pedidosChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(pedidosChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <ShoppingCart className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </div>
        </Link>

        {/* Pedidos Pendentes */}
        <Link
          href="/dashboard/pedidos?status=PENDENTE"
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden shadow-sm rounded-lg border border-yellow-200 hover:shadow-md transition-all hover:scale-105"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">
                  Aguardando Análise
                </p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">
                  {stats.pedidosPendentes}
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Requer atenção
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-600 opacity-50" />
            </div>
          </div>
        </Link>

        {/* Pedidos Aprovados */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-sm rounded-lg border border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Pedidos Aprovados
                </p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {stats.pedidosAprovados}
                </p>
                <p className="text-xs text-green-600 mt-2">Este mês</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Solicitações Pendentes */}
        <Link
          href="/dashboard/solicitacoes"
          className="bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden shadow-sm rounded-lg border border-orange-200 hover:shadow-md transition-all hover:scale-105"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Novas Solicitações
                </p>
                <p className="text-3xl font-bold text-orange-900 mt-2">
                  {stats.solicitacoesPendentes}
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Total: {stats.solicitacoesTotal}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-orange-600 opacity-50" />
            </div>
          </div>
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pedidos Recentes */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Pedidos Recentes
            </h3>
            <Link
              href="/dashboard/pedidos"
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center"
            >
              Ver todos
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {stats.pedidosRecentes.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Representante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.pedidosRecentes.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/pedidos/${pedido.id}`}
                          className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                          #{pedido.numeroPedido}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pedido.cliente.razaoSocial}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {pedido.representante.user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(pedido.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(pedido.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Ações Rápidas
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <Link
              href="/dashboard/clientes/novo"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="h-5 w-5 text-blue-600 group-hover:text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Novo Cliente
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/representantes/novo"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <UserCheck className="h-5 w-5 text-purple-600 group-hover:text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Novo Representante
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/produtos/novo"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <Package className="h-5 w-5 text-green-600 group-hover:text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Novo Produto
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/categorias"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText className="h-5 w-5 text-indigo-600 group-hover:text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Categorias
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/faturamento"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <TrendingUp className="h-5 w-5 text-emerald-600 group-hover:text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Faturamento
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            </Link>

            <Link
              href="/dashboard/solicitacoes"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <AlertCircle className="h-5 w-5 text-orange-600 group-hover:text-white" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Solicitações
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

