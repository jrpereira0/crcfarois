"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatWhatsAppUrl } from "@/lib/formatters";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  FileText,
  Phone,
  Mail,
  Edit,
  Loader2,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface PedidoDetalhes {
  id: string;
  numero: string;
  status: string;
  tipoEntrega: string;
  formaPagamento: string;
  condicaoPagamento?: string;
  subtotal: number;
  frete: number;
  total: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  // Endereço
  enderecoEntrega?: string;
  numeroEntrega?: string;
  complementoEntrega?: string;
  bairroEntrega?: string;
  cidadeEntrega?: string;
  estadoEntrega?: string;
  cepEntrega?: string;
  // Usuário
  user: {
    id: string;
    name: string;
    email: string;
    cliente?: {
      razaoSocial: string;
      cnpjCpf: string;
      telefone?: string;
      whatsapp?: string;
      endereco?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      cidade?: string;
      estado?: string;
      cep?: string;
    };
  };
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
      preco: number;
    };
  }[];
}

export default function RepresentantePedidoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Formatação de CNPJ/CPF
  const formatCnpjCpfDisplay = (cnpjCpf: string) => {
    const numbers = cnpjCpf.replace(/\D/g, "");
    if (numbers.length === 14) {
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    } else if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cnpjCpf;
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PENDENTE: "Pendente",
      CONFIRMADO: "Confirmado",
      PREPARANDO: "Preparando",
      ENVIADO: "Enviado",
      ENTREGUE: "Entregue",
      CANCELADO: "Cancelado",
    };
    return statusMap[status] || status;
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PENDENTE: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMADO: "bg-blue-100 text-blue-800 border-blue-200",
      PREPARANDO: "bg-purple-100 text-purple-800 border-purple-200",
      ENVIADO: "bg-indigo-100 text-indigo-800 border-indigo-200",
      ENTREGUE: "bg-green-100 text-green-800 border-green-200",
      CANCELADO: "bg-red-100 text-red-800 border-red-200",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      PENDENTE: <Clock className="h-4 w-4" />,
      CONFIRMADO: <CheckCircle className="h-4 w-4" />,
      PREPARANDO: <Package className="h-4 w-4" />,
      ENVIADO: <Truck className="h-4 w-4" />,
      ENTREGUE: <CheckCircle className="h-4 w-4" />,
      CANCELADO: <AlertCircle className="h-4 w-4" />,
    };
    return iconMap[status] || <Clock className="h-4 w-4" />;
  };

  // Buscar detalhes do pedido
  const fetchPedido = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/representante/pedidos/${pedidoId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Pedido não encontrado");
        } else {
          throw new Error("Erro ao buscar pedido");
        }
        return;
      }

      const data = await response.json();
      setPedido(data.pedido);
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      setError("Erro ao carregar pedido");
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  // Buscar pedido ao montar
  useEffect(() => {
    if (pedidoId) {
      fetchPedido();
    }
  }, [pedidoId, fetchPedido]);

  // Gerar mensagem do WhatsApp
  const generateWhatsAppMessage = useCallback(() => {
    if (!pedido) return "";

    const itensTexto = pedido.itens
      .map(
        (item) =>
          `• ${item.produtoTitulo} (${item.produtoSku}) - Qtd: ${
            item.quantidade
          } - ${formatPrice(item.subtotal)}`
      )
      .join("\n");

    const enderecoTexto =
      pedido.tipoEntrega === "ENTREGA" && pedido.enderecoEntrega
        ? `\n\n*Endereço de Entrega:*\n${pedido.enderecoEntrega}, ${
            pedido.numeroEntrega
          }${
            pedido.complementoEntrega ? `, ${pedido.complementoEntrega}` : ""
          }\n${pedido.bairroEntrega}, ${pedido.cidadeEntrega}/${
            pedido.estadoEntrega
          }\nCEP: ${pedido.cepEntrega}`
        : "";

    return `*Pedido #${pedido.numero}*

*Cliente:* ${pedido.user.cliente?.razaoSocial || pedido.user.name}
*Status:* ${getStatusText(pedido.status)}
*Tipo de Entrega:* ${pedido.tipoEntrega === "ENTREGA" ? "Entrega" : "Retirada"}
*Forma de Pagamento:* ${pedido.formaPagamento.replace("_", " ")}${
      pedido.condicaoPagamento
        ? `\n*Condição:* ${pedido.condicaoPagamento}`
        : ""
    }

*Itens do Pedido:*
${itensTexto}

*Subtotal:* ${formatPrice(pedido.subtotal)}
*Frete:* ${pedido.frete > 0 ? formatPrice(pedido.frete) : "A consultar"}
*Total:* ${formatPrice(pedido.total)}${enderecoTexto}${
      pedido.observacoes ? `\n\n*Observações:* ${pedido.observacoes}` : ""
    }

*Data do Pedido:* ${formatDate(pedido.createdAt)}`;
  }, [pedido, formatPrice, formatDate, getStatusText]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erro</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Link
          href="/representante/pedidos"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Pedidos
        </Link>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Pedido não encontrado
        </h3>
        <p className="text-gray-500 mb-4">
          O pedido solicitado não foi encontrado ou você não tem permissão para
          visualizá-lo.
        </p>
        <Link
          href="/representante/pedidos"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/representante/pedidos"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar aos Pedidos</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido #{pedido.numero}
            </h1>
            <p className="text-gray-600">
              Criado em {formatDate(pedido.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(
                pedido.status
              )}`}
            >
              {getStatusIcon(pedido.status)}
              {getStatusText(pedido.status)}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              {/* WhatsApp */}
              {pedido.user.cliente?.whatsapp && (
                <a
                  href={formatWhatsAppUrl(
                    pedido.user.cliente.whatsapp,
                    generateWhatsAppMessage()
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              )}

              {/* Editar */}
              <Link
                href={`/representante/pedidos/${pedido.id}/editar`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Editar Pedido
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados do Cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Dados do Cliente
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {pedido.user.cliente?.razaoSocial || pedido.user.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {pedido.user.cliente?.cnpjCpf && (
                    <div>
                      <strong>CNPJ/CPF:</strong>{" "}
                      {formatCnpjCpfDisplay(pedido.user.cliente.cnpjCpf)}
                    </div>
                  )}
                  <div>
                    <strong>Contato:</strong> {pedido.user.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{pedido.user.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contatos</h4>
                <div className="space-y-2">
                  {pedido.user.cliente?.whatsapp && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        WhatsApp
                      </span>
                      <span className="text-sm text-gray-600">
                        {pedido.user.cliente.whatsapp}
                      </span>
                    </div>
                  )}
                  {pedido.user.cliente?.telefone && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Telefone
                      </span>
                      <span className="text-sm text-gray-600">
                        {pedido.user.cliente.telefone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Endereço do Cliente */}
                {pedido.user.cliente?.endereco && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Endereço Cadastral
                    </h4>
                    <div className="text-sm text-gray-600">
                      <div>
                        {pedido.user.cliente.endereco}
                        {pedido.user.cliente.numero &&
                          `, ${pedido.user.cliente.numero}`}
                        {pedido.user.cliente.complemento &&
                          `, ${pedido.user.cliente.complemento}`}
                      </div>
                      <div>
                        {pedido.user.cliente.bairro &&
                          `${pedido.user.cliente.bairro}, `}
                        {pedido.user.cliente.cidade &&
                          `${pedido.user.cliente.cidade}`}
                        {pedido.user.cliente.estado &&
                          `/${pedido.user.cliente.estado}`}
                      </div>
                      {pedido.user.cliente.cep && (
                        <div>CEP: {pedido.user.cliente.cep}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Itens do Pedido
              </h2>
            </div>

            <div className="space-y-4">
              {pedido.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.produto.imagemPrincipal ? (
                      <Image
                        src={item.produto.imagemPrincipal}
                        alt={item.produto.titulo}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.produto.titulo}
                    </h4>
                    <p className="text-sm text-gray-500">
                      SKU: {item.produto.sku}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        Qtd: {item.quantidade}
                      </span>
                      <span className="text-sm text-gray-600">
                        Preço: {formatPrice(item.precoUnitario)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(pedido.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium text-gray-900">
                    {pedido.frete > 0
                      ? formatPrice(pedido.frete)
                      : "A consultar"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">
                    {formatPrice(pedido.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar com informações adicionais */}
        <div className="space-y-6">
          {/* Informações de Entrega */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Entrega</h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Tipo:</span>
                <div className="flex items-center gap-2 mt-1">
                  {pedido.tipoEntrega === "ENTREGA" ? (
                    <Truck className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Package className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm text-gray-900">
                    {pedido.tipoEntrega === "ENTREGA" ? "Entrega" : "Retirada"}
                  </span>
                </div>
              </div>

              {pedido.tipoEntrega === "ENTREGA" && pedido.enderecoEntrega && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Endereço:
                  </span>
                  <div className="mt-1 text-sm text-gray-600">
                    <div>
                      {pedido.enderecoEntrega}, {pedido.numeroEntrega}
                      {pedido.complementoEntrega &&
                        `, ${pedido.complementoEntrega}`}
                    </div>
                    <div>
                      {pedido.bairroEntrega}, {pedido.cidadeEntrega}/
                      {pedido.estadoEntrega}
                    </div>
                    <div>CEP: {pedido.cepEntrega}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações de Pagamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Pagamento</h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Forma de Pagamento:
                </span>
                <div className="text-sm text-gray-900 mt-1">
                  {pedido.formaPagamento.replace("_", " ")}
                </div>
              </div>

              {pedido.condicaoPagamento && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Condição:
                  </span>
                  <div className="text-sm text-gray-900 mt-1">
                    {pedido.condicaoPagamento}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          {pedido.observacoes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Observações
                </h3>
              </div>
              <p className="text-sm text-gray-600">{pedido.observacoes}</p>
            </div>
          )}

          {/* Informações do Pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">
                Informações
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Criado em:</span>
                <div className="text-gray-600">
                  {formatDate(pedido.createdAt)}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Última atualização:
                </span>
                <div className="text-gray-600">
                  {formatDate(pedido.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
