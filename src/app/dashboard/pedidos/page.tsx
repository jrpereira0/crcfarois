"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatWhatsAppUrl } from "@/lib/formatters";
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
  User,
  Phone,
  Mail,
  Edit,
  MoreVertical,
  Download,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";

interface Pedido {
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
    };
  }[];
}

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tipoEntregaFilter, setTipoEntregaFilter] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Estados do filtro de calendário
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilterType, setDateFilterType] = useState<string>("");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

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

  // Funções para o calendário
  const formatDateShort = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }, []);

  const getDateRangeForFilter = useCallback(
    (filterType: string) => {
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
          const startOfWeek = new Date(startOfDay);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59);
          return { start: startOfWeek, end: endOfWeek };
        }
        case "semana-passada": {
          const startOfLastWeek = new Date(startOfDay);
          startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
          const endOfLastWeek = new Date(startOfLastWeek);
          endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
          endOfLastWeek.setHours(23, 59, 59);
          return { start: startOfLastWeek, end: endOfLastWeek };
        }
        case "este-mes": {
          const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );
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
        case "customizado":
          if (customStartDate && customEndDate) {
            const start = new Date(customStartDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            return { start, end };
          }
          return null;
        default:
          return null;
      }
    },
    [customStartDate, customEndDate]
  );

  const isDateInRange = useCallback((date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  }, []);

  // Buscar pedidos
  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/pedidos");

      if (!response.ok) {
        throw new Error("Erro ao buscar pedidos");
      }

      const data = await response.json();
      setPedidos(data.pedidos || []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // Fechar dropdown ao clicar fora ou ao rolar
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    const handleScroll = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [openDropdown]);

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchSearch =
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.user.cliente?.razaoSocial
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      pedido.itens.some(
        (item) =>
          item.produtoTitulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.produtoSku.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchStatus = !statusFilter || pedido.status === statusFilter;
    const matchTipoEntrega =
      !tipoEntregaFilter || pedido.tipoEntrega === tipoEntregaFilter;

    // Filtro de data
    let matchDate = true;
    if (dateFilterType) {
      const dateRange = getDateRangeForFilter(dateFilterType);
      if (dateRange) {
        const pedidoDate = new Date(pedido.createdAt);
        matchDate = isDateInRange(pedidoDate, dateRange.start, dateRange.end);
      }
    }

    return matchSearch && matchStatus && matchTipoEntrega && matchDate;
  });

  // Opções de status com cores e ícones
  const statusOptions = [
    {
      value: "PENDENTE",
      label: "Pendente",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      value: "CONFIRMADO",
      label: "Confirmado",
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "PREPARANDO",
      label: "Preparando",
      icon: Package,
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      value: "PRONTO",
      label: "Pronto",
      icon: Package,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "ENVIADO",
      label: "Enviado",
      icon: Truck,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    {
      value: "ENTREGUE",
      label: "Entregue",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "CANCELADO",
      label: "Cancelado",
      icon: AlertCircle,
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  // Atualizar status do pedido
  const updateStatus = useCallback(
    async (pedidoId: string, novoStatus: string) => {
      try {
        setUpdatingStatus(pedidoId);
        setOpenDropdown(null); // Fechar dropdown

        const response = await fetch(`/api/admin/pedidos/${pedidoId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: novoStatus }),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar status");
        }

        // Atualizar lista local com animação
        setPedidos((prev) =>
          prev.map((pedido) =>
            pedido.id === pedidoId
              ? {
                  ...pedido,
                  status: novoStatus,
                  updatedAt: new Date().toISOString(),
                }
              : pedido
          )
        );

        // Mostrar feedback de sucesso
        console.log(`✅ Status atualizado para: ${novoStatus}`);
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        console.log("❌ Erro ao atualizar status do pedido");
      } finally {
        setTimeout(() => setUpdatingStatus(null), 300); // Delay para melhor UX
      }
    },
    []
  );

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

  // Gerar mensagem do WhatsApp
  const generateWhatsAppMessage = useCallback(
    (pedido: Pedido) => {
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
        pedido.tipoEntrega === "ENTREGA"
          ? "🚚 Entrega"
          : pedido.tipoEntrega === "DROPSHIPPING"
          ? "📦 Dropshipping"
          : "🏪 Retirada"
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

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTipoEntregaFilter("");
    setDateFilterType("");
    setCustomStartDate(null);
    setCustomEndDate(null);
  };

  // Componente do dropdown de status
  const StatusDropdown = ({ pedido }: { pedido: Pedido }) => {
    const currentStatus = statusOptions.find((s) => s.value === pedido.status);
    const isOpen = openDropdown === pedido.id;
    const isUpdating = updatingStatus === pedido.id;

    // Calcular se deve abrir para cima ou para baixo
    const shouldOpenUpward = useCallback(() => {
      const button = document.querySelector(`[data-pedido-id="${pedido.id}"]`);
      if (!button) return false;

      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 300; // Altura estimada do dropdown

      return spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    }, [pedido.id]);

    return (
      <div
        className={`relative ${isOpen ? "z-[200]" : "z-10"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          data-pedido-id={pedido.id}
          onClick={(e) => {
            e.stopPropagation();
            // Fechar outros dropdowns primeiro
            if (openDropdown && openDropdown !== pedido.id) {
              setOpenDropdown(null);
              setTimeout(() => setOpenDropdown(pedido.id), 50);
            } else {
              setOpenDropdown(isOpen ? null : pedido.id);
            }
          }}
          disabled={isUpdating}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed transition-all hover:shadow-md ${
            currentStatus?.color || getStatusColor(pedido.status)
          }`}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            currentStatus && <currentStatus.icon className="h-4 w-4" />
          )}
          <span>{currentStatus?.label || getStatusText(pedido.status)}</span>
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            {/* Overlay para fechar dropdown */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 9998 }}
              onClick={() => setOpenDropdown(null)}
            />

            {/* Dropdown menu */}
            <div
              className={`absolute bg-white border border-gray-200 rounded-lg shadow-2xl min-w-[200px] max-w-[250px] dropdown-enter ${
                shouldOpenUpward() ? "bottom-full mb-1" : "top-full mt-1"
              }`}
              style={{
                zIndex: 9999,
                position: "absolute",
                left: "0",
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              {/* Header do dropdown */}
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Alterar Status
                </span>
              </div>

              <div className="py-1">
                {statusOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = option.value === pedido.status;

                  return (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (option.value !== pedido.status) {
                          updateStatus(pedido.id, option.value);
                        }
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{option.label}</span>
                      {isSelected && (
                        <CheckCircle className="h-3 w-3 ml-auto text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Pedidos
            </h1>
            <p className="text-gray-600">
              Gerencie todos os pedidos dos clientes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {pedidosFiltrados.length}{" "}
              {pedidosFiltrados.length === 1 ? "pedido" : "pedidos"} encontrado
              {pedidosFiltrados.length !== 1 ? "s" : ""}
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Pedidos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Número, cliente ou produto..."
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

            {/* Tipo de Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrega
              </label>
              <select
                value={tipoEntregaFilter}
                onChange={(e) => setTipoEntregaFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="RETIRADA">Retirada</option>
                <option value="ENTREGA">Entrega</option>
                <option value="DROPSHIPPING">Dropshipping</option>
              </select>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                dateFilterType
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Calendar className="h-4 w-4" />
              {dateFilterType
                ? dateFilterType === "customizado" &&
                  customStartDate &&
                  customEndDate
                  ? `${formatDateShort(customStartDate)} - ${formatDateShort(
                      customEndDate
                    )}`
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
                  : "Período"
                : "Filtrar por data"}
            </button>

            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Modal do filtro de calendário */}
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
                    Selecione o período desejado para filtrar os pedidos
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
                        ? "Apenas pedidos de hoje"
                        : dateFilterType === "esta-semana"
                        ? "Pedidos desta semana"
                        : dateFilterType === "semana-passada"
                        ? "Pedidos da semana passada"
                        : dateFilterType === "este-mes"
                        ? "Pedidos deste mês"
                        : dateFilterType === "mes-passado"
                        ? "Pedidos do mês passado"
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

      {/* Lista de pedidos */}
      <div style={{ overflow: "visible" }}>
        {loading ? (
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
        ) : pedidosFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            {pedidos.length === 0 ? (
              <>
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600">
                  Aguardando os primeiros pedidos dos clientes
                </p>
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
                style={{ overflow: "visible" }}
              >
                <div className="p-6">
                  {/* Header do pedido */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido {pedido.numero}
                        </h3>
                        <StatusDropdown pedido={pedido} />
                      </div>

                      {/* Informações do cliente */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {pedido.user.cliente?.razaoSocial || pedido.user.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {pedido.user.email}
                        </span>
                        {pedido.user.cliente?.whatsapp && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {pedido.user.cliente.whatsapp}
                          </span>
                        )}
                      </div>

                      {/* Representante responsável */}
                      {pedido.user.cliente?.representantes?.[0]
                        ?.representante && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md w-fit mb-2">
                          <User className="h-3 w-3" />
                          <span className="font-medium">Representante:</span>
                          <span>
                            {
                              pedido.user.cliente.representantes[0]
                                .representante.user.name
                            }
                          </span>
                          {pedido.user.cliente.representantes[0].representante
                            .whatsapp && (
                            <>
                              <span className="text-gray-300">•</span>
                              <Phone className="h-3 w-3" />
                              <span>
                                {
                                  pedido.user.cliente.representantes[0]
                                    .representante.whatsapp
                                }
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Informações do pedido */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(pedido.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          {pedido.tipoEntrega === "ENTREGA" ? (
                            <Truck className="h-4 w-4" />
                          ) : pedido.tipoEntrega === "DROPSHIPPING" ? (
                            <Package className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                          {pedido.tipoEntrega === "ENTREGA"
                            ? "Entrega"
                            : pedido.tipoEntrega === "DROPSHIPPING"
                            ? "Dropshipping"
                            : "Retirada"}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {pedido.formaPagamento.replace("_", " ")}
                          {pedido.condicaoPagamento && (
                            <span className="text-gray-400">
                              • {pedido.condicaoPagamento}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Valor e ações */}
                    <div className="flex flex-col lg:items-end gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(pedido.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pedido.itens.length}{" "}
                          {pedido.itens.length === 1 ? "item" : "itens"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/pedidos/${pedido.id}`}
                          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalhes
                        </Link>
                        <Link
                          href={`/dashboard/pedidos/${pedido.id}/editar`}
                          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Link>

                        {(pedido.user.cliente?.whatsapp ||
                          pedido.user.cliente?.telefone) && (
                          <button
                            onClick={() => {
                              const mensagem = generateWhatsAppMessage(pedido);
                              const numeroCompleto = formatWhatsAppUrl(
                                pedido.user.cliente?.whatsapp ||
                                  pedido.user.cliente?.telefone ||
                                  ""
                              );
                              window.open(
                                `https://wa.me/${numeroCompleto}?text=${mensagem}`
                              );
                            }}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            title="Enviar detalhes do pedido por WhatsApp"
                          >
                            <Phone className="h-4 w-4" />
                            WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preview dos produtos */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Produtos do pedido
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {pedido.itens.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="relative w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            {item.produto.imagemPrincipal ? (
                              <Image
                                src={item.produto.imagemPrincipal}
                                alt={item.produtoTitulo}
                                fill
                                className="object-contain p-1"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-gray-900 truncate">
                              {item.produtoTitulo}
                            </h4>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                              SKU: {item.produtoSku}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.quantidade}x{" "}
                              {formatPrice(item.precoUnitario)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {pedido.itens.length > 3 && (
                        <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <span className="text-xs text-gray-500">
                            +{pedido.itens.length - 3} produto
                            {pedido.itens.length - 3 > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
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
