"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  Copy,
} from "lucide-react";

interface PedidoDetalhes {
  id: string;
  numero: string;
  status: string;
  tipoEntrega: string;
  formaPagamento: string;
  subtotal: number;
  frete: number;
  total: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  // Endereço de entrega
  enderecoEntrega?: string;
  numeroEntrega?: string;
  complementoEntrega?: string;
  bairroEntrega?: string;
  cidadeEntrega?: string;
  estadoEntrega?: string;
  cepEntrega?: string;
  // Itens
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
      categoria: {
        id: string;
        nome: string;
        slug: string;
      };
    };
  }[];
  // Usuário
  user: {
    id: string;
    name: string;
    email: string;
    cliente?: {
      razaoSocial: string;
      cnpjCpf: string;
      telefone?: string;
      whatsapp: string;
    };
  };
}

export default function PedidoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [pedido, setPedido] = useState<PedidoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);

  const pedidoId = params.id as string;

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

  // Buscar pedido
  const fetchPedido = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pedidos/${pedidoId}`);

      if (!response.ok) {
        if (response.status === 404) {
          showToast("Pedido não encontrado", "error");
          router.push("/b2b/pedidos");
          return;
        }
        throw new Error("Erro ao buscar pedido");
      }

      const data = await response.json();
      setPedido(data.pedido);
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      showToast("Erro ao carregar pedido", "error");
      router.push("/b2b/pedidos");
    } finally {
      setLoading(false);
    }
  }, [pedidoId, showToast, router]);

  useEffect(() => {
    if (pedidoId) {
      fetchPedido();
    }
  }, [pedidoId, fetchPedido]);

  // Copiar número do pedido
  const copyPedidoNumber = useCallback(() => {
    if (pedido) {
      navigator.clipboard.writeText(pedido.numero);
      showToast("Número do pedido copiado!", "success");
    }
  }, [pedido, showToast]);

  // Obter cor do status
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

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <Clock className="h-5 w-5" />;
      case "CONFIRMADO":
      case "PREPARANDO":
      case "PRONTO":
        return <Package className="h-5 w-5" />;
      case "ENVIADO":
        return <Truck className="h-5 w-5" />;
      case "ENTREGUE":
        return <CheckCircle className="h-5 w-5" />;
      case "CANCELADO":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/b2b/pedidos"
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Voltar aos Pedidos</span>
          <span className="sm:hidden">Voltar</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Pedido {pedido.numero}
                </h1>
                <button
                  onClick={copyPedidoNumber}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                  title="Copiar número do pedido"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(pedido.createdAt)}
              </p>
            </div>
          </div>

          <div
            className={`px-3 py-2 rounded-lg border flex items-center justify-center gap-2 font-medium text-sm ${getStatusColor(
              pedido.status
            )}`}
          >
            {getStatusIcon(pedido.status)}
            <span>{getStatusText(pedido.status)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itens do pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Itens do Pedido
            </h2>

            <div className="space-y-3">
              {pedido.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    {item.produto.imagemPrincipal ? (
                      <Image
                        src={item.produto.imagemPrincipal}
                        alt={item.produtoTitulo}
                        fill
                        className="object-contain p-1.5 sm:p-2"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">
                      {item.produtoTitulo}
                    </h3>
                    <div className="text-xs sm:text-sm text-gray-500 mb-2">
                      <div>SKU: {item.produtoSku}</div>
                      <div className="sm:inline sm:before:content-['•'] sm:before:mx-1">
                        {item.produto.categoria.nome}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs sm:text-sm text-gray-600">
                        {item.quantidade} × {formatPrice(item.precoUnitario)}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                        {formatPrice(item.subtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações de entrega */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              {pedido.tipoEntrega === "ENTREGA" ? (
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              ) : (
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              )}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {pedido.tipoEntrega === "ENTREGA" ? "Entrega" : "Retirada"}
              </h2>
            </div>

            {pedido.tipoEntrega === "ENTREGA" ? (
              <div className="space-y-2 text-sm sm:text-base">
                <div className="font-medium text-gray-900">
                  Endereço de entrega:
                </div>
                <div className="text-gray-600">
                  {pedido.enderecoEntrega}, {pedido.numeroEntrega}
                  {pedido.complementoEntrega &&
                    `, ${pedido.complementoEntrega}`}
                </div>
                <div className="text-gray-600">
                  {pedido.bairroEntrega} - {pedido.cidadeEntrega}/
                  {pedido.estadoEntrega}
                </div>
                <div className="text-gray-600">CEP: {pedido.cepEntrega}</div>
              </div>
            ) : (
              <div className="text-sm sm:text-base text-gray-600">
                O pedido será retirado na loja. Você será notificado quando
                estiver pronto para retirada.
              </div>
            )}
          </div>

          {/* Observações */}
          {pedido.observacoes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Observações
                </h2>
              </div>
              <div className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">
                {pedido.observacoes}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Resumo do pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Resumo do Pedido
            </h2>

            <div className="space-y-3 mb-4 sm:mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Subtotal</span>
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  {formatPrice(pedido.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Frete</span>
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  {pedido.frete > 0
                    ? formatPrice(pedido.frete)
                    : pedido.tipoEntrega === "RETIRADA"
                    ? "Grátis"
                    : "A consultar"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold text-gray-900">Total</span>
                <span className="text-base sm:text-lg font-semibold text-primary">
                  {formatPrice(pedido.total)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 break-words">
                  {pedido.formaPagamento.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 break-words">
                  Realizado em {formatDate(pedido.createdAt)}
                </span>
              </div>
              {pedido.updatedAt !== pedido.createdAt && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 break-words">
                    Atualizado em {formatDate(pedido.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dados do cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Dados do Cliente
              </h2>
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <div>
                <div className="font-medium text-gray-900 break-words">
                  {pedido.user.cliente?.razaoSocial || pedido.user.name}
                </div>
                {pedido.user.cliente?.cnpjCpf && (
                  <div className="text-gray-600 mt-1">
                    CNPJ/CPF: {pedido.user.cliente.cnpjCpf}
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 break-all">{pedido.user.email}</span>
              </div>

              {pedido.user.cliente?.whatsapp && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    {pedido.user.cliente.whatsapp}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
