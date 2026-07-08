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
  Clock,
  CreditCard,
  Shield,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserCheck,
  Plus,
  X,
} from "lucide-react";
import { formatCnpjCpfDisplay, formatTelefoneDisplay } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/Skeleton";

interface ClienteDetalhes {
  id: string;
  razaoSocial: string;
  responsavel: string;
  cnpjCpf: string;
  tipoEmpresa?: string;
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
  horarioCorteMercadoLivre?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    role: string;
    createdAt: string;
  };
  representantes: {
    id: string;
    representante: {
      id: string;
      user: {
        name: string;
        email: string;
      };
    };
  }[];
}

export default function VisualizarClientePage() {
  const params = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRepresentanteModal, setShowRepresentanteModal] = useState(false);
  const [representantes, setRepresentantes] = useState<any[]>([]);
  const [representanteSelecionado, setRepresentanteSelecionado] =
    useState<string>("");

  useEffect(() => {
    if (params.id) {
      fetchCliente(params.id as string);
    }
  }, [params.id]);

  const fetchCliente = async (id: string) => {
    try {
      const response = await fetch(`/api/clientes/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCliente(data);
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

  const handleEditarCliente = () => {
    router.push(`/dashboard/clientes/${cliente?.id}/editar`);
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

  const toggleClienteStatus = async () => {
    if (!cliente) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !cliente.ativo }),
      });

      if (response.ok) {
        const updatedCliente = await response.json();
        setCliente(updatedCliente);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCliente = async () => {
    if (!cliente) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/clientes");
      } else {
        console.error("Erro ao deletar cliente");
      }
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    } finally {
      setUpdating(false);
      setShowDeleteModal(false);
    }
  };

  const fetchRepresentantes = async () => {
    try {
      const response = await fetch("/api/admin/representantes");
      if (response.ok) {
        const data = await response.json();
        setRepresentantes(data.representantes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar representantes:", error);
    }
  };

  const handleAbrirModalRepresentante = () => {
    setShowRepresentanteModal(true);
    fetchRepresentantes();
  };

  const handleAtribuirRepresentante = async () => {
    if (!cliente || !representanteSelecionado) return;

    setUpdating(true);
    try {
      // Se já existe um representante, remover primeiro
      if (cliente.representantes.length > 0) {
        const representanteAtual = cliente.representantes[0].representante;

        // Buscar todos os clientes do representante atual
        const responseAtual = await fetch(
          `/api/admin/representantes/${representanteAtual.id}`
        );
        if (responseAtual.ok) {
          const dataAtual = await responseAtual.json();
          const representante = dataAtual.representante;

          // Remover o cliente atual da lista
          const clientesAtuais = representante.clientes
            .map((rel: any) => rel.cliente.id)
            .filter((id: string) => id !== cliente.id);

          // Atualizar a lista de clientes do representante atual
          await fetch(
            `/api/admin/representantes/${representanteAtual.id}/clientes`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ clientesIds: clientesAtuais }),
            }
          );
        }
      }

      // Atribuir o novo representante
      const response = await fetch(
        `/api/admin/representantes/${representanteSelecionado}/clientes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clientesIds: [cliente.id] }),
        }
      );

      if (response.ok) {
        // Recarregar dados do cliente
        await fetchCliente(cliente.id);
        setShowRepresentanteModal(false);
        setRepresentanteSelecionado("");
      }
    } catch (error) {
      console.error("Erro ao atribuir representante:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoverRepresentante = async (representanteId: string) => {
    if (!cliente) return;

    setUpdating(true);
    try {
      // Primeiro, buscar todos os clientes do representante
      const response = await fetch(
        `/api/admin/representantes/${representanteId}`
      );
      if (response.ok) {
        const data = await response.json();
        const representante = data.representante;

        // Remover o cliente atual da lista
        const clientesAtuais = representante.clientes
          .map((rel: any) => rel.cliente.id)
          .filter((id: string) => id !== cliente.id);

        // Atualizar a lista de clientes do representante
        const updateResponse = await fetch(
          `/api/admin/representantes/${representanteId}/clientes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ clientesIds: clientesAtuais }),
          }
        );

        if (updateResponse.ok) {
          // Recarregar dados do cliente
          await fetchCliente(cliente.id);
        }
      }
    } catch (error) {
      console.error("Erro ao remover representante:", error);
    } finally {
      setUpdating(false);
    }
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

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
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
      <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
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
    <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
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

        <div className="flex gap-3">
          <button
            onClick={handleEditarCliente}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </button>
          <button
            onClick={handleEnviarWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Horário de corte (Mercado Livre)
                  </label>
                  <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {cliente.horarioCorteMercadoLivre || "Não informado"}
                  </p>
                </div>
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

          {/* Representante */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Representante
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {cliente.representantes.length > 0 ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {cliente.representantes[0].representante.user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {cliente.representantes[0].representante.user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoverRepresentante(
                          cliente.representantes[0].representante.id
                        )
                      }
                      disabled={updating}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Remover representante"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">
                    Nenhum representante atribuído
                  </p>
                </div>
              )}

              <button
                onClick={handleAbrirModalRepresentante}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {cliente.representantes.length > 0
                  ? "Alterar Representante"
                  : "Atribuir Representante"}
              </button>
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Ações</h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={handleEditarCliente}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar Cliente
              </button>

              <button
                onClick={handleEnviarWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Enviar WhatsApp
              </button>

              <button
                onClick={toggleClienteStatus}
                disabled={updating}
                className={`w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
                  cliente.ativo
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                    : "bg-green-100 hover:bg-green-200 text-green-700"
                } disabled:opacity-50`}
              >
                {updating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    {cliente.ativo ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {cliente.ativo ? "Desativar" : "Ativar"} Cliente
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Excluir Cliente
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Tem certeza que deseja excluir o cliente{" "}
                <strong>{cliente?.razaoSocial}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Isso também removerá o acesso do cliente ao sistema.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={updating}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCliente}
                disabled={updating}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Representante */}
      {showRepresentanteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {cliente?.representantes.length > 0
                  ? "Alterar Representante"
                  : "Atribuir Representante"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {cliente?.representantes.length > 0
                  ? "Selecione um novo representante para este cliente (substituirá o atual)"
                  : "Selecione um representante para atribuir a este cliente"}
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {representantes.map((representante) => (
                  <label
                    key={representante.id}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/30 ${
                      representanteSelecionado === representante.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="representante"
                      value={representante.id}
                      checked={representanteSelecionado === representante.id}
                      onChange={(e) =>
                        setRepresentanteSelecionado(e.target.value)
                      }
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            representanteSelecionado === representante.id
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {representanteSelecionado === representante.id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {representante.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {representante.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {representantes.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Nenhum representante disponível
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowRepresentanteModal(false);
                  setRepresentanteSelecionado("");
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAtribuirRepresentante}
                disabled={!representanteSelecionado || updating}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {cliente?.representantes.length > 0
                      ? "Alterando..."
                      : "Atribuindo..."}
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    {cliente?.representantes.length > 0
                      ? "Alterar"
                      : "Atribuir"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
