"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Building,
  Phone,
  Mail,
  X,
} from "lucide-react";

interface Cliente {
  id: string;
  name: string;
  email: string;
  cliente?: {
    razaoSocial: string;
    cnpjCpf: string;
    telefone?: string;
    whatsapp: string;
  };
}

interface Faturamento {
  id: string;
  numero: string;
  clienteId: string;
  valor: number;
  dataVencimento: string;
  status: string;
  observacoes?: string;
  anexoUrl?: string;
  anexoNome?: string;
  dataPagamento?: string;
  createdAt: string;
  updatedAt: string;
  cliente: Cliente;
}

export default function FaturamentoPage() {
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFaturamento, setEditingFaturamento] =
    useState<Faturamento | null>(null);

  // Estados do filtro de data
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilterType, setDateFilterType] = useState("");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    clienteId: "",
    valor: "",
    dataVencimento: "",
    observacoes: "",
  });

  // Estados da busca de cliente
  const [clienteQuery, setClienteQuery] = useState("");
  const [clientesEncontrados, setClientesEncontrados] = useState<Cliente[]>([]);
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null
  );

  // Estados do upload
  const [uploading, setUploading] = useState(false);
  const [anexoFile, setAnexoFile] = useState<File | null>(null);

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
    }).format(new Date(dateString));
  }, []);

  // Formatação de input de moeda
  const formatCurrencyInput = useCallback((value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const number = parseInt(digits, 10);
    const reais = number / 100;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);
  }, []);

  // Formatação de data curta
  const formatDateShort = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  }, []);

  // Obter faixa de data para filtro
  const getDateRangeForFilter = useCallback((filterType: string) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    switch (filterType) {
      case "hoje":
        return { start: startOfDay, end: endOfDay };

      case "esta-semana": {
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return { start: startOfWeek, end: endOfWeek };
      }

      case "semana-passada": {
        const dayOfWeek = today.getDay();
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - dayOfWeek - 7);
        startOfLastWeek.setHours(0, 0, 0, 0);

        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        endOfLastWeek.setHours(23, 59, 59, 999);

        return { start: startOfLastWeek, end: endOfLastWeek };
      }

      case "este-mes": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        return { start: startOfMonth, end: endOfMonth };
      }

      case "mes-passado": {
        const startOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
          23,
          59,
          59
        );
        return { start: startOfLastMonth, end: endOfLastMonth };
      }

      default:
        return null;
    }
  }, []);

  // Verificar se data está no range
  const isDateInRange = useCallback(
    (
      dateString: string,
      filterType: string,
      customStart?: Date | null,
      customEnd?: Date | null
    ) => {
      const date = new Date(dateString);

      if (filterType === "customizado" && customStart && customEnd) {
        const start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      }

      const range = getDateRangeForFilter(filterType);
      if (!range) return true;

      return date >= range.start && date <= range.end;
    },
    [getDateRangeForFilter]
  );

  // Buscar faturamentos
  const fetchFaturamentos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/faturamentos");

      if (!response.ok) {
        throw new Error("Erro ao buscar faturamentos");
      }

      const data = await response.json();
      setFaturamentos(data.faturamentos || []);
    } catch (error) {
      console.error("Erro ao buscar faturamentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar clientes
  const searchClientes = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setClientesEncontrados([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/clientes/search?q=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setClientesEncontrados(data.clientes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }, []);

  // Salvar faturamento
  const salvarFaturamento = useCallback(async () => {
    if (!clienteSelecionado || !formData.valor || !formData.dataVencimento) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const valorNumerico = parseFloat(
        formData.valor.replace(/\./g, "").replace(",", ".")
      );

      const dadosEnvio = {
        clienteId: clienteSelecionado.id,
        valor: valorNumerico,
        dataVencimento: formData.dataVencimento,
        observacoes: formData.observacoes,
      };

      const url = editingFaturamento
        ? `/api/admin/faturamentos/${editingFaturamento.id}`
        : "/api/admin/faturamentos";

      const method = editingFaturamento ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosEnvio),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar faturamento");
      }

      // Resetar formulário e fechar modal
      setFormData({
        clienteId: "",
        valor: "",
        dataVencimento: "",
        observacoes: "",
      });
      setClienteSelecionado(null);
      setClienteQuery("");
      setEditingFaturamento(null);
      setShowModal(false);

      // Recarregar lista
      await fetchFaturamentos();
    } catch (error) {
      console.error("Erro ao salvar faturamento:", error);
      alert("Erro ao salvar faturamento");
    }
  }, [formData, clienteSelecionado, editingFaturamento, fetchFaturamentos]);

  // Excluir faturamento
  const excluirFaturamento = useCallback(
    async (id: string) => {
      if (!confirm("Tem certeza que deseja excluir este faturamento?")) {
        return;
      }

      try {
        const response = await fetch(`/api/admin/faturamentos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir faturamento");
        }

        await fetchFaturamentos();
      } catch (error) {
        console.error("Erro ao excluir faturamento:", error);
        alert("Erro ao excluir faturamento");
      }
    },
    [fetchFaturamentos]
  );

  // Abrir modal para edição
  const abrirEdicao = useCallback(
    (faturamento: Faturamento) => {
      setEditingFaturamento(faturamento);
      setClienteSelecionado(faturamento.cliente);
      setClienteQuery(
        faturamento.cliente.cliente?.razaoSocial || faturamento.cliente.name
      );
      setFormData({
        clienteId: faturamento.clienteId,
        valor: formatCurrencyInput((faturamento.valor * 100).toString()),
        dataVencimento: faturamento.dataVencimento.split("T")[0],
        observacoes: faturamento.observacoes || "",
      });
      setShowModal(true);
    },
    [formatCurrencyInput]
  );

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAGO":
        return "bg-green-100 text-green-800 border-green-200";
      case "VENCIDO":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELADO":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <Clock className="h-4 w-4" />;
      case "PAGO":
        return <CheckCircle className="h-4 w-4" />;
      case "VENCIDO":
        return <AlertCircle className="h-4 w-4" />;
      case "CANCELADO":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Verificar se está vencido
  const isVencido = useCallback((dataVencimento: string, status: string) => {
    if (status === "PAGO" || status === "CANCELADO") return false;
    return new Date(dataVencimento) < new Date();
  }, []);

  // Effects
  useEffect(() => {
    fetchFaturamentos();
  }, [fetchFaturamentos]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchClientes(clienteQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [clienteQuery, searchClientes]);

  // Filtrar faturamentos
  const faturamentosFiltrados = faturamentos.filter((faturamento) => {
    const matchesSearch =
      faturamento.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faturamento.cliente.cliente?.razaoSocial || faturamento.cliente.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      faturamento.cliente.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || faturamento.status === statusFilter;

    const matchDate =
      !dateFilterType ||
      isDateInRange(
        faturamento.dataVencimento,
        dateFilterType,
        customStartDate,
        customEndDate
      );

    return matchesSearch && matchesStatus && matchDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faturamento</h1>
          <p className="text-gray-600 mt-1">
            Gerencie o faturamento e cobrança dos clientes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingFaturamento(null);
            setClienteSelecionado(null);
            setClienteQuery("");
            setFormData({
              clienteId: "",
              valor: "",
              dataVencimento: "",
              observacoes: "",
            });
            setShowModal(true);
          }}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="h-5 w-5" />
          Novo Faturamento
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Faturamentos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por número, cliente ou email..."
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
              <option value="PAGO">Pago</option>
              <option value="VENCIDO">Vencido</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            {/* Botão de filtro de data */}
            <button
              onClick={() => setShowDateFilter(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                dateFilterType
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <Calendar className="h-4 w-4" />
              {dateFilterType
                ? dateFilterType === "customizado"
                  ? customStartDate && customEndDate
                    ? `${formatDateShort(customStartDate)} - ${formatDateShort(
                        customEndDate
                      )}`
                    : "Período personalizado"
                  : dateFilterType === "hoje"
                  ? "Hoje"
                  : dateFilterType === "esta-semana"
                  ? "Esta semana"
                  : dateFilterType === "semana-passada"
                  ? "Semana passada"
                  : dateFilterType === "este-mes"
                  ? "Este mês"
                  : dateFilterType === "mes-passado"
                  ? "Mês passado"
                  : "Filtrar por data"
                : "Filtrar por data"}
            </button>

            {/* Indicador de filtros ativos */}
            {(searchTerm || statusFilter || dateFilterType) && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>
                  {[
                    searchTerm && "Busca",
                    statusFilter && "Status",
                    dateFilterType && "Data",
                  ]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  ativo
                  {[searchTerm, statusFilter, dateFilterType].filter(Boolean)
                    .length > 1
                    ? "s"
                    : ""}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setDateFilterType("");
              setCustomStartDate(null);
              setCustomEndDate(null);
            }}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Lista de faturamentos */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : faturamentosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter
                ? "Nenhum faturamento encontrado"
                : "Nenhum faturamento cadastrado"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter
                ? "Tente ajustar os filtros para encontrar o que procura."
                : "Comece criando seu primeiro faturamento."}
            </p>
          </div>
        ) : (
          faturamentosFiltrados.map((faturamento) => {
            const vencido = isVencido(
              faturamento.dataVencimento,
              faturamento.status
            );

            return (
              <div
                key={faturamento.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faturamento.numero}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full border flex items-center gap-1 text-sm font-medium ${
                            vencido && faturamento.status === "PENDENTE"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : getStatusColor(faturamento.status)
                          }`}
                        >
                          {getStatusIcon(
                            vencido && faturamento.status === "PENDENTE"
                              ? "VENCIDO"
                              : faturamento.status
                          )}
                          {vencido && faturamento.status === "PENDENTE"
                            ? "Vencido"
                            : faturamento.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {faturamento.cliente.cliente?.razaoSocial ||
                            faturamento.cliente.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {faturamento.cliente.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Vence em {formatDate(faturamento.dataVencimento)}
                        </span>
                        {faturamento.dataPagamento && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Pago em {formatDate(faturamento.dataPagamento)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(faturamento.valor)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Criado em {formatDate(faturamento.createdAt)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirEdicao(faturamento)}
                          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => excluirFaturamento(faturamento.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  {faturamento.observacoes && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Observações:
                          </span>
                          <p className="text-sm text-gray-700 mt-1">
                            {faturamento.observacoes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Anexo */}
                  {faturamento.anexoUrl && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          Comprovante:
                        </span>
                        <a
                          href={faturamento.anexoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 underline"
                        >
                          {faturamento.anexoNome || "Ver anexo"}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingFaturamento
                      ? "Editar Faturamento"
                      : "Novo Faturamento"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {editingFaturamento
                      ? "Altere os dados do faturamento"
                      : "Preencha os dados para criar um novo faturamento"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Busca de cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={clienteQuery}
                    onChange={(e) => {
                      setClienteQuery(e.target.value);
                      setShowClienteDropdown(true);
                      if (!e.target.value) {
                        setClienteSelecionado(null);
                      }
                    }}
                    onFocus={() => setShowClienteDropdown(true)}
                    placeholder="Digite o nome ou razão social do cliente..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />

                  {/* Dropdown de clientes */}
                  {showClienteDropdown && clientesEncontrados.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {clientesEncontrados.map((cliente) => (
                        <button
                          key={cliente.id}
                          onClick={() => {
                            setClienteSelecionado(cliente);
                            setClienteQuery(
                              cliente.cliente?.razaoSocial || cliente.name
                            );
                            setShowClienteDropdown(false);
                          }}
                          className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">
                            {cliente.cliente?.razaoSocial || cliente.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cliente.cliente?.cnpjCpf} • {cliente.email}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cliente selecionado */}
                {clienteSelecionado && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Cliente selecionado:{" "}
                        {clienteSelecionado.cliente?.razaoSocial ||
                          clienteSelecionado.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="text"
                    value={formData.valor}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      setFormData((prev) => ({ ...prev, valor: formatted }));
                    }}
                    placeholder="0,00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Data de vencimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataVencimento: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observacoes: e.target.value,
                    }))
                  }
                  placeholder="Observações sobre o faturamento..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Upload de anexo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexar Comprovante
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Clique para selecionar ou arraste o arquivo aqui
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAnexoFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="anexo-upload"
                  />
                  <label
                    htmlFor="anexo-upload"
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    Selecionar Arquivo
                  </label>

                  {anexoFile && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800 font-medium">
                          {anexoFile.name}
                        </span>
                        <button
                          onClick={() => setAnexoFile(null)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarFaturamento}
                disabled={
                  !clienteSelecionado ||
                  !formData.valor ||
                  !formData.dataVencimento
                }
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                {editingFaturamento ? "Atualizar" : "Criar"} Faturamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de filtro de data */}
      {showDateFilter && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDateFilter(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filtrar por período
                  </h3>
                  <p className="text-sm text-gray-600">
                    Selecione o período desejado para filtrar os faturamentos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDateFilter(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Filtros rápidos em cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[
                  { key: "hoje", label: "Hoje", icon: Clock },
                  { key: "esta-semana", label: "Esta semana", icon: Calendar },
                  {
                    key: "semana-passada",
                    label: "Semana passada",
                    icon: Calendar,
                  },
                  { key: "este-mes", label: "Este mês", icon: Calendar },
                  { key: "mes-passado", label: "Mês passado", icon: Calendar },
                  { key: "customizado", label: "Personalizar", icon: Calendar },
                ].map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.key}
                      onClick={() => {
                        setDateFilterType(option.key);
                        if (option.key !== "customizado") {
                          setCustomStartDate(null);
                          setCustomEndDate(null);
                        }
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        dateFilterType === option.key
                          ? "bg-primary text-white border-primary shadow-lg"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Período customizado */}
              {dateFilterType === "customizado" && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Período personalizado
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Data inicial */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data inicial
                      </label>
                      <input
                        type="date"
                        value={
                          customStartDate
                            ? customStartDate.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            setCustomStartDate(new Date(e.target.value));
                          } else {
                            setCustomStartDate(null);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Data final */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data final
                      </label>
                      <input
                        type="date"
                        value={
                          customEndDate
                            ? customEndDate.toISOString().split("T")[0]
                            : ""
                        }
                        min={
                          customStartDate
                            ? customStartDate.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            setCustomEndDate(new Date(e.target.value));
                          } else {
                            setCustomEndDate(null);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Preview do período selecionado */}
                  {customStartDate && customEndDate && (
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-gray-700">
                          <strong>Período selecionado:</strong>{" "}
                          {formatDateShort(customStartDate)} até{" "}
                          {formatDateShort(customEndDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Preview do filtro ativo */}
              {dateFilterType && dateFilterType !== "customizado" && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      <strong>Filtro ativo:</strong>{" "}
                      {dateFilterType === "hoje"
                        ? "Apenas faturamentos de hoje"
                        : dateFilterType === "esta-semana"
                        ? "Faturamentos desta semana"
                        : dateFilterType === "semana-passada"
                        ? "Faturamentos da semana passada"
                        : dateFilterType === "este-mes"
                        ? "Faturamentos deste mês"
                        : dateFilterType === "mes-passado"
                        ? "Faturamentos do mês passado"
                        : "Período selecionado"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setDateFilterType("");
                  setCustomStartDate(null);
                  setCustomEndDate(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                Limpar filtro de data
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDateFilter(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowDateFilter(false)}
                  disabled={
                    dateFilterType === "customizado" &&
                    (!customStartDate || !customEndDate)
                  }
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Aplicar filtro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
