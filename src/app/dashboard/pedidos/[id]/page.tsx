"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatWhatsAppUrl } from "@/lib/formatters";
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
  Edit,
  Save,
  X,
  Building,
  MapPinIcon,
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
  descontoTipo?: string;
  descontoValor?: number;
  desconto: number;
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
      quantidadeEstoque: number;
      preco: number;
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
      whatsapp?: string;
      endereco?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      cidade?: string;
      estado?: string;
      cep?: string;
      representantes?: {
        representante: {
          id: string;
          whatsapp?: string;
          user: {
            name: string;
            email: string;
          };
        };
      }[];
    };
  };
}

export default function PedidoAdminDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
      const response = await fetch(`/api/admin/pedidos/${pedidoId}`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard/pedidos");
          return;
        }
        throw new Error("Erro ao buscar pedido");
      }

      const data = await response.json();
      setPedido(data.pedido);
      setNewStatus(data.pedido.status);
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      router.push("/dashboard/pedidos");
    } finally {
      setLoading(false);
    }
  }, [pedidoId, router]);

  useEffect(() => {
    if (pedidoId) {
      fetchPedido();
    }
  }, [pedidoId, fetchPedido]);

  // Atualizar status
  const updateStatus = useCallback(async () => {
    if (!pedido || newStatus === pedido.status) {
      setEditingStatus(false);
      return;
    }

    try {
      setUpdatingStatus(true);

      const response = await fetch(`/api/admin/pedidos/${pedido.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      // Atualizar estado local
      setPedido((prev) =>
        prev
          ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() }
          : null
      );
      setEditingStatus(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  }, [pedido, newStatus]);

  // Copiar número do pedido
  const copyPedidoNumber = useCallback(() => {
    if (pedido) {
      navigator.clipboard.writeText(pedido.numero);
    }
  }, [pedido]);

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

  // Gerar mensagem do WhatsApp
  const generateWhatsAppMessage = useCallback(
    (pedido: PedidoDetalhes) => {
      const nomeCliente = pedido.user.cliente?.razaoSocial || pedido.user.name;
      const statusFormatado = getStatusText(pedido.status);
      const dataFormatada = formatDate(pedido.createdAt);

      let mensagem = `🛒 *ATUALIZAÇÃO DO SEU PEDIDO*\n\n`;
      mensagem += `Olá, ${nomeCliente}!\n\n`;
      mensagem += `📋 *Detalhes do Pedido:*\n`;
      mensagem += `• Número: #${pedido.numero}\n`;
      mensagem += `• Status: ${statusFormatado}\n`;
      mensagem += `• Data: ${dataFormatada}\n`;
      mensagem += `• Tipo: ${
        pedido.tipoEntrega === "ENTREGA" ? "🚚 Entrega" : "🏪 Retirada"
      }\n`;
      mensagem += `• Pagamento: ${pedido.formaPagamento.replace("_", " ")}`;
      if (pedido.condicaoPagamento) {
        mensagem += ` (${pedido.condicaoPagamento})`;
      }
      mensagem += `\n\n`;

      mensagem += `📦 *Itens do Pedido:*\n`;
      pedido.itens.forEach((item, index) => {
        mensagem += `${index + 1}. ${item.produtoTitulo}\n`;
        mensagem += `   • SKU: ${item.produtoSku}\n`;
        mensagem += `   • Qtd: ${item.quantidade}x\n`;
        mensagem += `   • Valor: ${formatPrice(item.precoUnitario)} cada\n`;
        mensagem += `   • Subtotal: ${formatPrice(item.subtotal)}\n\n`;
      });

      if (pedido.tipoEntrega === "ENTREGA" && pedido.enderecoEntrega) {
        mensagem += `📍 *Endereço de Entrega:*\n`;
        mensagem += `${pedido.enderecoEntrega}, ${pedido.numeroEntrega}\n`;
        if (pedido.complementoEntrega)
          mensagem += `${pedido.complementoEntrega}\n`;
        mensagem += `${pedido.bairroEntrega} - ${pedido.cidadeEntrega}/${pedido.estadoEntrega}\n`;
        mensagem += `CEP: ${pedido.cepEntrega}\n\n`;
      }

      mensagem += `💰 *Resumo Financeiro:*\n`;
      mensagem += `• Subtotal: ${formatPrice(pedido.subtotal)}\n`;
      mensagem += `• Frete: ${
        pedido.frete > 0
          ? formatPrice(pedido.frete)
          : pedido.tipoEntrega === "RETIRADA"
          ? "Grátis"
          : "A consultar"
      }\n`;
      if (pedido.desconto > 0) {
        mensagem += `• Desconto ${
          pedido.descontoTipo === "PORCENTAGEM"
            ? `(${pedido.descontoValor}%)`
            : "(Valor Fixo)"
        }: -${formatPrice(pedido.desconto)}\n`;
      }
      mensagem += `• *Total: ${formatPrice(pedido.total)}*\n\n`;

      if (pedido.observacoes) {
        mensagem += `📝 *Observações:*\n${pedido.observacoes}\n\n`;
      }

      mensagem += `---\n`;
      mensagem += `CRC Faróis - Seu parceiro em iluminação automotiva\n`;
      mensagem += `Para dúvidas, entre em contato conosco!`;

      return encodeURIComponent(mensagem);
    },
    [formatPrice, formatDate]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
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
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/dashboard/pedidos"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar aos Pedidos</span>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Pedido {pedido.numero}
              </h1>
              <button
                onClick={copyPedidoNumber}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copiar número do pedido"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-600">
              Cliente: {pedido.user.cliente?.razaoSocial || pedido.user.name} •{" "}
              {formatDate(pedido.createdAt)}
            </p>
          </div>

          {/* Status com edição */}
          <div className="flex items-center gap-3">
            {editingStatus ? (
              <div className="flex items-center gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="PREPARANDO">Preparando</option>
                  <option value="PRONTO">Pronto</option>
                  <option value="ENVIADO">Enviado</option>
                  <option value="ENTREGUE">Entregue</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
                <button
                  onClick={updateStatus}
                  disabled={updatingStatus}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingStatus(false);
                    setNewStatus(pedido.status);
                  }}
                  className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 font-medium ${getStatusColor(
                    pedido.status
                  )}`}
                >
                  {getStatusIcon(pedido.status)}
                  {getStatusText(pedido.status)}
                </div>
                <button
                  onClick={() => setEditingStatus(true)}
                  className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Editar status"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados do cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Dados do Cliente
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações básicas */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Nome/Razão Social
                  </label>
                  <div className="text-gray-900 font-medium">
                    {pedido.user.cliente?.razaoSocial || pedido.user.name}
                  </div>
                </div>

                {pedido.user.cliente?.cnpjCpf && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      CNPJ/CPF
                    </label>
                    <div className="text-gray-900">
                      {pedido.user.cliente.cnpjCpf}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    E-mail
                  </label>
                  <div className="text-gray-900">{pedido.user.email}</div>
                </div>

                {/* Representante responsável */}
                {pedido.user.cliente?.representantes?.[0]?.representante && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Representante Responsável
                    </label>
                    <div className="text-gray-900">
                      <div className="font-medium">
                        {
                          pedido.user.cliente.representantes[0].representante
                            .user.name
                        }
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 mt-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {
                            pedido.user.cliente.representantes[0].representante
                              .user.email
                          }
                        </div>
                        {pedido.user.cliente.representantes[0].representante
                          .whatsapp && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {
                              pedido.user.cliente.representantes[0]
                                .representante.whatsapp
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contatos e Endereço */}
              <div className="space-y-3">
                {/* Contatos */}
                {(pedido.user.cliente?.whatsapp ||
                  pedido.user.cliente?.telefone) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contato
                    </label>
                    <div className="text-gray-900 space-y-1">
                      {pedido.user.cliente?.whatsapp && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            WhatsApp
                          </span>
                          {pedido.user.cliente.whatsapp}
                        </div>
                      )}
                      {pedido.user.cliente?.telefone && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Telefone
                          </span>
                          {pedido.user.cliente.telefone}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Endereço do cliente */}
                {pedido.user.cliente && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Endereço
                    </label>
                    <div className="text-gray-900 text-sm">
                      {pedido.user.cliente.endereco &&
                      pedido.user.cliente.numero ? (
                        <>
                          {pedido.user.cliente.endereco},{" "}
                          {pedido.user.cliente.numero}
                          {pedido.user.cliente.complemento &&
                            `, ${pedido.user.cliente.complemento}`}
                          <br />
                          {pedido.user.cliente.bairro &&
                            `${pedido.user.cliente.bairro} - `}
                          {pedido.user.cliente.cidade &&
                            pedido.user.cliente.estado &&
                            `${pedido.user.cliente.cidade}/${pedido.user.cliente.estado}`}
                          <br />
                          {pedido.user.cliente.cep &&
                            `CEP: ${pedido.user.cliente.cep}`}
                        </>
                      ) : (
                        <span className="text-gray-500 italic">
                          Endereço não informado
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Representante (se houver) */}
                {pedido.user.cliente?.representante && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Representante
                    </label>
                    <div className="text-gray-900">
                      {pedido.user.cliente.representante.nome}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itens do pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Itens do Pedido
            </h2>

            <div className="space-y-4">
              {pedido.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.produto.imagemPrincipal ? (
                      <Image
                        src={item.produto.imagemPrincipal}
                        alt={item.produtoTitulo}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Produto */}
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.produtoTitulo}
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        SKU: {item.produtoSku} • Categoria:{" "}
                        {item.produto.categoria.nome}
                      </div>
                      <div className="text-sm text-gray-600">
                        Estoque atual: {item.produto.quantidadeEstoque} unidades
                      </div>
                      <div className="text-sm text-gray-600">
                        Preço atual: {formatPrice(item.produto.preco)}
                      </div>
                    </div>

                    {/* Valores */}
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">
                        {item.quantidade} × {formatPrice(item.precoUnitario)}
                      </div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {formatPrice(item.subtotal)}
                      </div>
                      {item.precoUnitario !== item.produto.preco && (
                        <div className="text-xs text-amber-600">
                          Preço alterado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações de entrega */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {pedido.tipoEntrega === "ENTREGA" ? (
                <Truck className="h-6 w-6 text-primary" />
              ) : (
                <MapPin className="h-6 w-6 text-primary" />
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {pedido.tipoEntrega === "ENTREGA" ? "Entrega" : "Retirada"}
              </h2>
            </div>

            {pedido.tipoEntrega === "ENTREGA" ? (
              <div className="space-y-2">
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
              <div className="text-gray-600">
                Cliente irá retirar o pedido na loja.
              </div>
            )}
          </div>

          {/* Observações */}
          {pedido.observacoes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Observações do Cliente
                </h2>
              </div>
              <div className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {pedido.observacoes}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Resumo financeiro */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Resumo Financeiro
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(pedido.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium text-gray-900">
                  {pedido.frete > 0
                    ? formatPrice(pedido.frete)
                    : pedido.tipoEntrega === "RETIRADA"
                    ? "Grátis"
                    : "A consultar"}
                </span>
              </div>
              {pedido.desconto > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">
                    Desconto{" "}
                    {pedido.descontoTipo === "PORCENTAGEM"
                      ? `(${pedido.descontoValor}%)`
                      : "(Valor Fixo)"}
                  </span>
                  <span className="font-medium text-green-600">
                    - {formatPrice(pedido.desconto)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">
                  {formatPrice(pedido.total)}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  {pedido.formaPagamento.replace("_", " ")}
                  {pedido.condicaoPagamento && (
                    <span className="text-gray-500 ml-2">
                      ({pedido.condicaoPagamento})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  Realizado em {formatDate(pedido.createdAt)}
                </span>
              </div>
              {pedido.updatedAt !== pedido.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Atualizado em {formatDate(pedido.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>

            <div className="space-y-3">
              <Link
                href={`/dashboard/pedidos/${pedido.id}/editar`}
                className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Edit className="h-4 w-4" />
                Editar Pedido
              </Link>

              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium">
                <Mail className="h-4 w-4" />
                Enviar E-mail ao Cliente
              </button>

              {pedido.user.cliente?.whatsapp && (
                <button
                  onClick={() => {
                    const mensagem = generateWhatsAppMessage(pedido);
                    const numeroCompleto = formatWhatsAppUrl(
                      pedido.user.cliente?.whatsapp || ""
                    );
                    window.open(
                      `https://wa.me/${numeroCompleto}?text=${mensagem}`
                    );
                  }}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Phone className="h-4 w-4" />
                  Enviar Detalhes por WhatsApp
                </button>
              )}

              <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium">
                <FileText className="h-4 w-4" />
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
