"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  MessageCircle,
  FileText,
  MapPin,
  Building2,
  User,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { ClienteCardSkeleton } from "@/components/ui/Skeleton";
import { formatCnpjCpfDisplay, formatTelefoneDisplay } from "@/lib/formatters";

interface Cliente {
  id: string;
  razaoSocial: string;
  responsavel: string;
  email: string;
  telefone?: string;
  whatsapp: string;
  cnpjCpf: string;
  tipoEmpresa?: string;
  condicoesPagamento: string[];
  cidade?: string;
  estado?: string;
  bairro?: string;
  ativo: boolean;
  createdAt: string;
  user: {
    name: string;
    role: string;
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

interface ClientesResponse {
  clientes: Cliente[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface Filtros {
  search: string;
  tipoEmpresa: string;
  estado: string;
  ativo: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [filtros, setFiltros] = useState<Filtros>({
    search: "",
    tipoEmpresa: "",
    estado: "",
    ativo: "",
  });

  const fetchClientes = async (page = 1, filtrosAtivos = filtros) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filtrosAtivos.search && { search: filtrosAtivos.search }),
        ...(filtrosAtivos.tipoEmpresa && {
          tipoEmpresa: filtrosAtivos.tipoEmpresa,
        }),
        ...(filtrosAtivos.estado && { estado: filtrosAtivos.estado }),
        ...(filtrosAtivos.ativo && { ativo: filtrosAtivos.ativo }),
      });

      const response = await fetch(`/api/clientes?${params}`);
      const data: ClientesResponse = await response.json();

      if (response.ok) {
        setClientes(data.clientes);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchClientes();
    }
  }, [mounted]);

  // Fechar menu ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      if (openMenuId) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [openMenuId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClientes(1, filtros);
  };

  const handleFilterChange = (key: keyof Filtros, value: string) => {
    const novosFiltros = { ...filtros, [key]: value };
    setFiltros(novosFiltros);
    fetchClientes(1, novosFiltros);
  };

  const limparFiltros = () => {
    const filtrosLimpos = {
      search: "",
      tipoEmpresa: "",
      estado: "",
      ativo: "",
    };
    setFiltros(filtrosLimpos);
    fetchClientes(1, filtrosLimpos);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const toggleClienteStatus = async (
    clienteId: string,
    novoStatus: boolean
  ) => {
    setUpdatingId(clienteId);
    try {
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: novoStatus }),
      });

      if (response.ok) {
        // Atualizar lista local
        setClientes((prev) =>
          prev.map((cliente) =>
            cliente.id === clienteId
              ? { ...cliente, ativo: novoStatus }
              : cliente
          )
        );
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteCliente = async (clienteId: string) => {
    setUpdatingId(clienteId);
    try {
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remover da lista local
        setClientes((prev) =>
          prev.filter((cliente) => cliente.id !== clienteId)
        );
        setShowDeleteModal(null);
        setOpenMenuId(null);

        // Atualizar contadores
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
        }));
      }
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenMenu = (clienteId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (openMenuId === clienteId) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }

    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const position = {
      top: buttonRect.bottom + 8,
      right: window.innerWidth - buttonRect.right,
    };

    setMenuPosition(position);
    setOpenMenuId(clienteId);
  };

  const tiposEmpresa = [
    "MEI",
    "Simples Nacional",
    "Lucro Presumido",
    "Lucro Real",
  ];
  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  if (!mounted) {
    return (
      <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-primary">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Clientes
          </h1>
          <p className="text-gray-600">
            Gerencie os clientes cadastrados no sistema
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>

          <Link
            href="/dashboard/clientes/novo"
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Novo Cliente
          </Link>
        </div>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filtros.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Nome, email, CNPJ..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Empresa
              </label>
              <select
                value={filtros.tipoEmpresa}
                onChange={(e) =>
                  handleFilterChange("tipoEmpresa", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                {tiposEmpresa.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFilterChange("estado", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todos os estados</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtros.ativo}
                onChange={(e) => handleFilterChange("ativo", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {Object.values(filtros).some((f) => f) && (
                <span>
                  Filtros ativos:{" "}
                  {Object.values(filtros).filter((f) => f).length}
                </span>
              )}
            </div>
            <button
              onClick={limparFiltros}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Clientes */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Clientes
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {pagination.total} cliente{pagination.total !== 1 ? "s" : ""}{" "}
                encontrado{pagination.total !== 1 ? "s" : ""}
              </span>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <Download className="h-4 w-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <ClienteCardSkeleton key={i} />
              ))}
            </div>
          ) : clientes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  {Object.values(filtros).some((f) => f)
                    ? "Nenhum cliente corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
                    : "Comece cadastrando seu primeiro cliente no sistema"}
                </p>
                <Link
                  href="/dashboard/clientes/novo"
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="h-5 w-5" />
                  Cadastrar Primeiro Cliente
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastro
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenMenuId(null)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {cliente.razaoSocial}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {cliente.responsavel}
                          </div>
                          {cliente.tipoEmpresa && (
                            <div className="text-xs text-gray-400 mt-1">
                              {cliente.tipoEmpresa}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {cliente.email}
                          </div>
                          {cliente.telefone && (
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {formatTelefoneDisplay(cliente.telefone)}
                            </div>
                          )}
                          <div className="text-sm text-green-600 flex items-center gap-2">
                            <MessageCircle className="h-3 w-3" />
                            {formatTelefoneDisplay(cliente.whatsapp)}
                          </div>
                          {cliente.representantes.length > 0 && (
                            <div className="text-sm text-blue-600 flex items-center gap-2">
                              <User className="h-3 w-3" />
                              Rep:{" "}
                              {
                                cliente.representantes[0].representante.user
                                  .name
                              }
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <FileText className="h-3 w-3 text-gray-400" />
                          {formatCnpjCpfDisplay(cliente.cnpjCpf)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <div>
                            {cliente.cidade && cliente.estado ? (
                              <>
                                {cliente.cidade}, {cliente.estado}
                                {cliente.bairro && (
                                  <div className="text-xs text-gray-500">
                                    {cliente.bairro}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400">
                                Não informado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            cliente.ativo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cliente.ativo ? "Ativo" : "Inativo"}
                        </span>
                        {cliente.condicoesPagamento.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {cliente.condicoesPagamento.length}{" "}
                            {cliente.condicoesPagamento.length === 1
                              ? "condição"
                              : "condições"}{" "}
                            de pagamento
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {formatDate(cliente.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/clientes/${cliente.id}`}
                            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
                            title="Visualizar cliente"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboard/clientes/${cliente.id}/editar`}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                            title="Editar cliente"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* Menu Dropdown */}
                          <button
                            onClick={(e) => handleOpenMenu(cliente.id, e)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              openMenuId === cliente.id
                                ? "bg-gray-100 text-gray-700"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            }`}
                            title="Mais opções"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginação */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                de {pagination.total} resultados
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchClientes(pagination.page - 1, filtros)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  Página {pagination.page} de {pagination.pages}
                </span>
                <button
                  onClick={() => fetchClientes(pagination.page + 1, filtros)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Dropdown Flutuante */}
      {openMenuId && menuPosition && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setOpenMenuId(null);
              setMenuPosition(null);
            }}
          />

          {/* Menu */}
          <div
            className="fixed bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-40 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
            }}
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Ações
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleClienteStatus(
                  openMenuId,
                  !clientes.find((c) => c.id === openMenuId)?.ativo
                );
              }}
              disabled={updatingId === openMenuId}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center gap-3 ${
                clientes.find((c) => c.id === openMenuId)?.ativo
                  ? "text-orange-600 hover:bg-orange-50"
                  : "text-green-600 hover:bg-green-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {updatingId === openMenuId ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : clientes.find((c) => c.id === openMenuId)?.ativo ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>
                {clientes.find((c) => c.id === openMenuId)?.ativo
                  ? "Desativar"
                  : "Ativar"}{" "}
                Cliente
              </span>
            </button>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(openMenuId);
                setOpenMenuId(null);
                setMenuPosition(null);
              }}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir Cliente</span>
            </button>
          </div>
        </>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Confirmar Exclusão
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação é permanente e não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-2">
                <strong>Cliente a ser excluído:</strong>
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {clientes.find((c) => c.id === showDeleteModal)?.razaoSocial}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                O acesso do cliente ao sistema também será removido
                permanentemente.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                disabled={updatingId === showDeleteModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteCliente(showDeleteModal)}
                disabled={updatingId === showDeleteModal}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {updatingId === showDeleteModal ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Confirmar Exclusão
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
