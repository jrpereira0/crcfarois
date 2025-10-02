"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  MapPin,
  Building2,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Eye,
  Package,
} from "lucide-react";
import { formatCnpjCpfDisplay, formatTelefoneDisplay } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/Skeleton";

interface ClienteDetalhes {
  id: string;
  razaoSocial: string;
  responsavel: string;
  cnpjCpf: string;
  tipoEmpresa?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  condicoesPagamento: string[];
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  email: string;
  telefone?: string;
  whatsapp: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
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

export default function VisualizarClientePage() {
  const params = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchCliente(params.id as string);
    }
  }, [params.id]);

  const fetchCliente = async (id: string) => {
    try {
      const response = await fetch(`/api/representante/clientes/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCliente(data.cliente);
      } else {
        setError(data.error || "Cliente não encontrado");
      }
    } catch (error) {
      setError("Erro ao carregar cliente");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleEnviarWhatsApp = () => {
    if (!cliente) return;

    const numero = cliente.whatsapp.replace(/\D/g, "");
    const mensagem = encodeURIComponent(
      `Olá ${cliente.responsavel}, tudo bem? Sou da CRC Faróis e gostaria de entrar em contato.`
    );
    const url = `https://wa.me/55${numero}?text=${mensagem}`;

    window.open(url, "_blank");
  };

  const formatEnderecoCompleto = (cliente: ClienteDetalhes) => {
    const endereco = [cliente.endereco, cliente.numero, cliente.complemento]
      .filter(Boolean)
      .join(", ");

    const localidade = [cliente.bairro, cliente.cidade, cliente.estado]
      .filter(Boolean)
      .join(", ");

    return { endereco, localidade };
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
      <div className="h-full flex flex-col space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="h-full flex flex-col space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cliente não encontrado
            </h1>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar cliente
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { endereco, localidade } = formatEnderecoCompleto(cliente);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {cliente.razaoSocial}
            </h1>
            <p className="text-gray-600">Detalhes do cliente</p>
          </div>
        </div>

        <button
          onClick={handleEnviarWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 overflow-auto">
        {/* Coluna Esquerda - Informações Principais */}
        <div className="xl:col-span-2 space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informações da Empresa
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Razão Social
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {cliente.razaoSocial}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Responsável
                  </label>
                  <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {cliente.responsavel}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    CNPJ/CPF
                  </label>
                  <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    {formatCnpjCpfDisplay(cliente.cnpjCpf)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tipo de Empresa
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {cliente.tipoEmpresa || "Não informado"}
                  </p>
                </div>
                {cliente.inscricaoEstadual && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Inscrição Estadual
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {cliente.inscricaoEstadual}
                    </p>
                  </div>
                )}
                {cliente.inscricaoMunicipal && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Inscrição Municipal
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {cliente.inscricaoMunicipal}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Condições de Pagamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Condições de Pagamento
              </h2>
            </div>
            <div className="p-6">
              {cliente.condicoesPagamento.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cliente.condicoesPagamento.map((condicao) => (
                    <div
                      key={condicao}
                      className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-medium text-center"
                    >
                      {condicao}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Nenhuma condição de pagamento definida
                </p>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Endereço Completo
                  </label>
                  <p className="text-lg text-gray-900 mt-1">{endereco}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      CEP
                    </label>
                    <p className="text-gray-900 mt-1">{cliente.cep}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Bairro
                    </label>
                    <p className="text-gray-900 mt-1">
                      {cliente.bairro || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Cidade/Estado
                    </label>
                    <p className="text-gray-900 mt-1">
                      {localidade || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de Pedidos */}
          {cliente.pedidos && cliente.pedidos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Pedidos Recentes
                  </h2>
                  <span className="text-sm text-gray-500">
                    {cliente.pedidos.length} pedido
                    {cliente.pedidos.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {cliente.pedidos.slice(0, 5).map((pedido) => (
                    <div
                      key={pedido.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {pedido.numero}
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
                            {index < Math.min(pedido.itens.length, 3) - 1 &&
                              ", "}
                          </span>
                        ))}
                        {pedido.itens.length > 3 && (
                          <span>
                            {" "}
                            e mais {pedido.itens.length - 3} itens...
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita - Informações Secundárias */}
        <div className="space-y-6">
          {/* Status e Informações Gerais */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Status do Cliente
                </span>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    cliente.ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {cliente.ativo ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Inativo
                    </>
                  )}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Cadastrado em
                </label>
                <p className="text-gray-900 mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(cliente.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Última atualização
                </label>
                <p className="text-gray-900 mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(cliente.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contato
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900 mt-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${cliente.email}`}
                    className="text-primary hover:underline"
                  >
                    {cliente.email}
                  </a>
                </p>
              </div>

              {cliente.telefone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Telefone
                  </label>
                  <p className="text-gray-900 mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${cliente.telefone}`}
                      className="text-primary hover:underline"
                    >
                      {formatTelefoneDisplay(cliente.telefone)}
                    </a>
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">
                  WhatsApp
                </label>
                <p className="text-gray-900 mt-1 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <a
                    href={`https://wa.me/55${cliente.whatsapp.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    {formatTelefoneDisplay(cliente.whatsapp)}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Resumo de Pedidos */}
          {cliente.pedidos && cliente.pedidos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resumo de Vendas
                </h2>
              </div>
              <div className="p-6 space-y-3">
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
          )}

          {/* Ações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Ações</h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={handleEnviarWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Enviar WhatsApp
              </button>

              <button
                onClick={() =>
                  router.push(`/representante/pedidos?cliente=${cliente.id}`)
                }
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
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
