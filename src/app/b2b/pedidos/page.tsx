"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MapPin,
  CreditCard,
  Eye,
  Search,
  Filter,
  Calendar,
} from "lucide-react";

interface Pedido {
  id: string;
  numero: string;
  status: string;
  tipoEntrega: string;
  formaPagamento: string;
  subtotal: number;
  frete: number;
  total: number;
  createdAt: string;
  itens: {
    id: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    produtoTitulo: string;
    produtoSku: string;
    produto: {
      id: string;
      titulo: string;
      sku: string;
      imagemPrincipal?: string;
      imagensUrls: string[];
    };
  }[];
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { showToast } = useToast();

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

  // Buscar pedidos
  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pedidos");

      if (!response.ok) {
        throw new Error("Erro ao buscar pedidos");
      }

      const data = await response.json();
      setPedidos(data.pedidos || []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      showToast("Erro ao carregar pedidos", "error");
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchSearch =
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.itens.some(
        (item) =>
          item.produtoTitulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.produtoSku.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchStatus = !statusFilter || pedido.status === statusFilter;

    return matchSearch && matchStatus;
  });

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

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <Clock className="h-4 w-4" />;
      case "CONFIRMADO":
      case "PREPARANDO":
      case "PRONTO":
        return <Package className="h-4 w-4" />;
      case "ENVIADO":
        return <Truck className="h-4 w-4" />;
      case "ENTREGUE":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELADO":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  // Obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";
      case "CONFIRMADO":
        return "Confirmado";
      case "PREPARANDO":
        return "Preparando";
      case "PRONTO":
        return "Pronto";
      case "ENVIADO":
        return "Enviado";
      case "ENTREGUE":
        return "Entregue";
      case "CANCELADO":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Pedidos</h1>
            <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
          </div>
          <div className="text-sm text-gray-500">
            {pedidosFiltrados.length}{" "}
            {pedidosFiltrados.length === 1 ? "pedido" : "pedidos"} encontrado
            {pedidosFiltrados.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Pedidos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Número do pedido ou produto..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todos os status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="PREPARANDO">Preparando</option>
                <option value="PRONTO">Pronto</option>
                <option value="ENVIADO">Enviado</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            {pedidos.length === 0 ? (
              <>
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não fez nenhum pedido. Que tal começar agora?
                </p>
                <Link
                  href="/b2b/produtos"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Package className="h-5 w-5" />
                  Ver Produtos
                </Link>
              </>
            ) : (
              <>
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros de busca
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header do pedido */}
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido {pedido.numero}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 w-fit ${getStatusColor(
                            pedido.status
                          )}`}
                        >
                          {getStatusIcon(pedido.status)}
                          {getStatusText(pedido.status)}
                        </span>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(pedido.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pedido.itens.length}{" "}
                          {pedido.itens.length === 1 ? "item" : "itens"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {formatDate(pedido.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        {pedido.tipoEntrega === "ENTREGA" ? (
                          <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        {pedido.tipoEntrega === "ENTREGA"
                          ? "Entrega"
                          : "Retirada"}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                        {pedido.formaPagamento.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Produtos do pedido */}
                  <div className="space-y-3 mb-4">
                    {pedido.itens.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          {item.produto.imagemPrincipal ? (
                            <Image
                              src={item.produto.imagemPrincipal}
                              alt={item.produtoTitulo}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.produtoTitulo}
                          </h4>
                          <div className="text-xs text-gray-500">
                            SKU: {item.produtoSku} • {item.quantidade}x{" "}
                            {formatPrice(item.precoUnitario)}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.subtotal)}
                        </div>
                      </div>
                    ))}
                    {pedido.itens.length > 2 && (
                      <div className="text-sm text-gray-500 text-center py-2 border-t border-gray-100">
                        +{pedido.itens.length - 2} produto
                        {pedido.itens.length - 2 > 1 ? "s" : ""} adiciona
                        {pedido.itens.length - 2 > 1 ? "is" : "l"}
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex justify-end">
                    <Link
                      href={`/b2b/pedidos/${pedido.id}`}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
