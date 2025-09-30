"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  FileText,
  MapPin,
  Building2,
  User,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { formatCnpjCpfDisplay, formatTelefoneDisplay } from "@/lib/formatters";

interface Solicitacao {
  id: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  tipoEmpresa?: string;
  nomeResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel?: string;
  whatsappResponsavel: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoConta?: string;
  status: "PENDENTE" | "APROVADA" | "NEGADA";
  motivoRejeicao?: string;
  createdAt: string;
  aprovadaEm?: string;
  aprovadoPor?: {
    name: string;
    email: string;
  };
  representante?: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  };
}

interface Representante {
  id: string;
  user: {
    name: string;
    email: string;
  };
  comissaoPercentual: number;
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<"APROVAR" | "NEGAR" | null>(
    null
  );
  const [selectedRepresentante, setSelectedRepresentante] = useState("");
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [processing, setProcessing] = useState(false);

  // Buscar solicitações
  const fetchSolicitacoes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(
        `/api/solicitacoes-cadastro?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setSolicitacoes(data.solicitacoes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Buscar representantes
  const fetchRepresentantes = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/representantes");
      if (response.ok) {
        const data = await response.json();
        setRepresentantes(data.representantes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar representantes:", error);
    }
  }, []);

  useEffect(() => {
    fetchSolicitacoes();
    fetchRepresentantes();
  }, [fetchSolicitacoes, fetchRepresentantes]);

  // Filtrar solicitações
  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    const matchSearch =
      !searchTerm ||
      solicitacao.razaoSocial
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      solicitacao.cnpj.includes(searchTerm) ||
      solicitacao.nomeResponsavel
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      solicitacao.emailResponsavel
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchStatus = !statusFilter || solicitacao.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // Processar solicitação
  const processarSolicitacao = async () => {
    if (!showModal || !modalAction) return;

    if (modalAction === "APROVAR" && !selectedRepresentante) {
      alert("Selecione um representante para aprovar a solicitação");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/solicitacoes-cadastro/${showModal}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acao: modalAction,
          representanteId:
            modalAction === "APROVAR" ? selectedRepresentante : undefined,
          motivoRejeicao: modalAction === "NEGAR" ? motivoRejeicao : undefined,
        }),
      });

      if (response.ok) {
        await fetchSolicitacoes(); // Recarregar lista
        setShowModal(null);
        setModalAction(null);
        setSelectedRepresentante("");
        setMotivoRejeicao("");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao processar solicitação");
      }
    } catch (error) {
      console.error("Erro ao processar solicitação:", error);
      alert("Erro de conexão");
    } finally {
      setProcessing(false);
    }
  };

  // Abrir modal de aprovação/rejeição
  const openModal = (solicitacaoId: string, action: "APROVAR" | "NEGAR") => {
    setShowModal(solicitacaoId);
    setModalAction(action);
    setSelectedRepresentante("");
    setMotivoRejeicao("");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800";
      case "APROVADA":
        return "bg-green-100 text-green-800";
      case "NEGADA":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <Clock className="h-4 w-4" />;
      case "APROVADA":
        return <CheckCircle className="h-4 w-4" />;
      case "NEGADA":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";
      case "APROVADA":
        return "Aprovada";
      case "NEGADA":
        return "Negada";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Solicitações de Cadastro
          </h1>
          <p className="text-gray-600">
            Gerencie as solicitações de cadastro de novos clientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {solicitacoesFiltradas.length}{" "}
            {solicitacoesFiltradas.length === 1
              ? "solicitação"
              : "solicitações"}{" "}
            encontrada
            {solicitacoesFiltradas.length !== 1 ? "s" : ""}
          </span>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Solicitações
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Empresa, responsável, CNPJ ou email..."
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
              <option value="APROVADA">Aprovada</option>
              <option value="NEGADA">Negada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de solicitações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        ) : solicitacoesFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter
                ? "Tente ajustar os filtros de busca"
                : "Aguardando novas solicitações de cadastro"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {solicitacoesFiltradas.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Header da solicitação */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {solicitacao.razaoSocial}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                          solicitacao.status
                        )}`}
                      >
                        {getStatusIcon(solicitacao.status)}
                        {getStatusText(solicitacao.status)}
                      </span>
                    </div>

                    {/* Informações da empresa */}
                    <div className="space-y-1 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>
                          CNPJ: {formatCnpjCpfDisplay(solicitacao.cnpj)}
                        </span>
                      </div>
                      {solicitacao.tipoEmpresa && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{solicitacao.tipoEmpresa}</span>
                        </div>
                      )}
                    </div>

                    {/* Informações do responsável */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {solicitacao.nomeResponsavel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {solicitacao.emailResponsavel}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {formatTelefoneDisplay(solicitacao.whatsappResponsavel)}
                      </span>
                    </div>

                    {/* Localização */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {solicitacao.cidade}, {solicitacao.estado} -{" "}
                        {solicitacao.bairro}
                      </span>
                    </div>

                    {/* Data da solicitação */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Solicitado em {formatDate(solicitacao.createdAt)}
                      </span>
                    </div>

                    {/* Informações de aprovação/rejeição */}
                    {solicitacao.status !== "PENDENTE" && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">
                            {solicitacao.status === "APROVADA"
                              ? "Aprovada"
                              : "Negada"}{" "}
                            por:
                          </span>{" "}
                          {solicitacao.aprovadoPor?.name}
                        </div>
                        {solicitacao.aprovadaEm && (
                          <div className="text-xs text-gray-500">
                            {formatDate(solicitacao.aprovadaEm)}
                          </div>
                        )}
                        {solicitacao.representante && (
                          <div className="text-sm text-blue-600 mt-1">
                            Representante: {solicitacao.representante.user.name}
                          </div>
                        )}
                        {solicitacao.motivoRejeicao && (
                          <div className="text-sm text-red-600 mt-1">
                            Motivo: {solicitacao.motivoRejeicao}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações */}
                {solicitacao.status === "PENDENTE" && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => openModal(solicitacao.id, "NEGAR")}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <XCircle className="h-4 w-4" />
                      Negar
                    </button>
                    <button
                      onClick={() => openModal(solicitacao.id, "APROVAR")}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprovar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de aprovação/rejeição */}
      {showModal && modalAction && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    modalAction === "APROVAR" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {modalAction === "APROVAR" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {modalAction === "APROVAR" ? "Aprovar" : "Negar"}{" "}
                    Solicitação
                  </h3>
                  <p className="text-sm text-gray-600">
                    {modalAction === "APROVAR"
                      ? "Selecione um representante e aprove a solicitação"
                      : "Informe o motivo da rejeição"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(null);
                  setModalAction(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {modalAction === "APROVAR" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Representante *
                  </label>
                  <select
                    value={selectedRepresentante}
                    onChange={(e) => setSelectedRepresentante(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um representante</option>
                    {representantes.map((rep) => (
                      <option key={rep.id} value={rep.id}>
                        {rep.user.name} - {rep.comissaoPercentual}% comissão
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    O cliente será automaticamente atribuído ao representante
                    selecionado
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da Rejeição
                  </label>
                  <textarea
                    value={motivoRejeicao}
                    onChange={(e) => setMotivoRejeicao(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="Explique o motivo da rejeição..."
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowModal(null);
                  setModalAction(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={processarSolicitacao}
                disabled={
                  processing ||
                  (modalAction === "APROVAR" && !selectedRepresentante)
                }
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  modalAction === "APROVAR"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : modalAction === "APROVAR" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {processing
                  ? "Processando..."
                  : modalAction === "APROVAR"
                  ? "Aprovar"
                  : "Negar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
