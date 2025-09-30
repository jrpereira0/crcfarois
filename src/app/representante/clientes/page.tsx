"use client";

import { useState, useEffect } from "react";
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
  MoreHorizontal,
  MessageCircle,
  FileText,
  MapPin,
  Building2,
  User,
  CheckCircle,
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
  _count: {
    pedidos: number;
  };
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

export default function RepresentanteClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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

      const response = await fetch(`/api/representante/clientes?${params}`);
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
            Meus Clientes
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie seus clientes atribuídos
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
              Meus Clientes Atribuídos
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
                    : "Você ainda não tem clientes atribuídos. Entre em contato com o administrador para atribuir clientes."}
                </p>
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
                      Pedidos
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
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">
                            {cliente._count.pedidos}
                          </span>
                          <div className="text-xs text-gray-500">
                            {cliente._count.pedidos === 1
                              ? "pedido"
                              : "pedidos"}
                          </div>
                        </div>
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
                            href={`/representante/clientes/${cliente.id}`}
                            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
                            title="Visualizar cliente"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
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
    </div>
  );
}
