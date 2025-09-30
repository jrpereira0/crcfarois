"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  ShoppingBag,
  Plus,
  Eye,
  Calendar,
  Package,
} from "lucide-react";

interface Cliente {
  id: string;
  razaoSocial: string;
  cnpjCpf: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  whatsapp?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  pedidos: {
    id: string;
    numero: string;
    status: string;
    total: number;
    createdAt: string;
    itens: {
      id: string;
      quantidade: number;
      produtoTitulo: string;
    }[];
  }[];
}

export default function RepresentanteClienteDetalhesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  const clienteId = params.id as string;

  // Buscar detalhes do cliente
  const fetchCliente = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/representante/clientes/${clienteId}`);

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/representante/clientes");
          return;
        }
        throw new Error("Erro ao buscar cliente");
      }

      const data = await response.json();
      setCliente(data.cliente);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      router.push("/representante/clientes");
    } finally {
      setLoading(false);
    }
  }, [clienteId, router]);

  useEffect(() => {
    if (session?.user.role === "REPRESENTANTE") {
      fetchCliente();
    }
  }, [session, fetchCliente]);

  // Formatar CNPJ/CPF para exibição
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

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
        <div className="flex items-center gap-4">
          <Link
            href="/representante/clientes"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar aos Clientes
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/representante/clientes"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar aos Clientes
          </Link>
        </div>

        <button
          onClick={() =>
            router.push(`/representante/novo-pedido?cliente=${cliente.id}`)
          }
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          Novo Pedido
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do cliente */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados básicos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Informações do Cliente
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações básicas */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Razão Social
                  </label>
                  <div className="text-gray-900 font-medium">
                    {cliente.razaoSocial || cliente.user.name}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    CNPJ/CPF
                  </label>
                  <div className="text-gray-900">
                    {formatCnpjCpfDisplay(cliente.cnpjCpf)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    E-mail
                  </label>
                  <div className="text-gray-900">{cliente.user.email}</div>
                </div>
              </div>

              {/* Contatos e endereço */}
              <div className="space-y-4">
                {(cliente.whatsapp || cliente.telefone) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contato
                    </label>
                    <div className="text-gray-900 space-y-1">
                      {cliente.whatsapp && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            WhatsApp
                          </span>
                          {cliente.whatsapp}
                        </div>
                      )}
                      {cliente.telefone && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Telefone
                          </span>
                          {cliente.telefone}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {cliente.endereco && cliente.numero && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Endereço
                    </label>
                    <div className="text-gray-900 text-sm">
                      {cliente.endereco}, {cliente.numero}
                      {cliente.complemento && `, ${cliente.complemento}`}
                      <br />
                      {cliente.bairro && `${cliente.bairro} - `}
                      {cliente.cidade}/{cliente.estado}
                      <br />
                      {cliente.cep && `CEP: ${cliente.cep}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Histórico de pedidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Histórico de Pedidos
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                {cliente.pedidos.length} pedido
                {cliente.pedidos.length !== 1 ? "s" : ""}
              </span>
            </div>

            {cliente.pedidos.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Este cliente ainda não fez nenhum pedido.
                </p>
                <button
                  onClick={() =>
                    router.push(
                      `/representante/novo-pedido?cliente=${cliente.id}`
                    )
                  }
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Pedido
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cliente.pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Pedido {pedido.numero}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              pedido.status
                            )}`}
                          >
                            {getStatusText(pedido.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(pedido.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {pedido.itens.reduce(
                              (acc, item) => acc + item.quantidade,
                              0
                            )}{" "}
                            itens
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(pedido.total)}
                        </div>
                        <button
                          onClick={() =>
                            router.push(`/representante/pedidos/${pedido.id}`)
                          }
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm mt-1"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalhes
                        </button>
                      </div>
                    </div>

                    {/* Preview dos itens */}
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Itens: </span>
                      {pedido.itens.slice(0, 3).map((item, index) => (
                        <span key={item.id}>
                          {item.quantidade}x {item.produtoTitulo}
                          {index < Math.min(pedido.itens.length, 3) - 1 && ", "}
                        </span>
                      ))}
                      {pedido.itens.length > 3 && (
                        <span> e mais {pedido.itens.length - 3} itens...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar com resumo */}
        <div className="space-y-6">
          {/* Resumo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total de Pedidos</span>
                <span className="font-medium text-gray-900">
                  {cliente.pedidos.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor Total</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(
                    cliente.pedidos.reduce(
                      (acc, pedido) => acc + pedido.total,
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Itens Comprados</span>
                <span className="font-medium text-gray-900">
                  {cliente.pedidos.reduce(
                    (acc, pedido) =>
                      acc +
                      pedido.itens.reduce(
                        (itemAcc, item) => itemAcc + item.quantidade,
                        0
                      ),
                    0
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Ações rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <button
                onClick={() =>
                  router.push(
                    `/representante/novo-pedido?cliente=${cliente.id}`
                  )
                }
                className="w-full flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                Novo Pedido
              </button>
              <button
                onClick={() =>
                  router.push(`/representante/pedidos?cliente=${cliente.id}`)
                }
                className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <ShoppingBag className="h-4 w-4" />
                Ver Todos os Pedidos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
