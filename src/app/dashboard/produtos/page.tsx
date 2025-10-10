"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Tag,
  DollarSign,
  Truck,
  Calendar,
  Trash2,
  Power,
  PowerOff,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface Produto {
  id: string;
  titulo: string;
  sku: string;
  categoria: {
    id: string;
    nome: string;
    slug: string;
  };
  origem?: string;
  aplicacao?: string;
  preco: number;
  quantidadeEstoque: number;
  compraMinima: number;
  compraMaxima?: number;
  descricao?: string;
  ativo: boolean;
  // Campos do Cloudinary
  imagemPrincipal?: string;
  imagensUrls: string[];
  cloudinaryIds: string[];
  createdAt: string;
}

interface ProdutosResponse {
  produtos: Produto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface Filtros {
  search: string;
  categoria: string;
  marca: string;
  ativo: string;
  orderBy: string;
  orderDirection: "asc" | "desc";
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Estados para ações
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState<Produto | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [filtros, setFiltros] = useState<Filtros>({
    search: "",
    categoria: "",
    marca: "",
    ativo: "",
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  const fetchProdutos = async (page = 1, filtrosAtivos = filtros) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");

      if (filtrosAtivos.search) params.append("search", filtrosAtivos.search);
      if (filtrosAtivos.categoria)
        params.append("categoria", filtrosAtivos.categoria);
      if (filtrosAtivos.marca) params.append("origem", filtrosAtivos.marca); // Usando origem no lugar de marca
      if (filtrosAtivos.ativo) params.append("ativo", filtrosAtivos.ativo);
      if (filtrosAtivos.orderBy) params.append("orderBy", filtrosAtivos.orderBy);
      if (filtrosAtivos.orderDirection) params.append("orderDirection", filtrosAtivos.orderDirection);

      const response = await fetch(`/api/produtos?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const data = await response.json();
      setProdutos(data.produtos || []);
      setPagination(
        data.pagination || {
          page,
          limit: 10,
          total: 0,
          pages: 0,
        }
      );
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Buscar categorias para o filtro
  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/categorias");
      if (response.ok) {
        const data = await response.json();

        // Converter estrutura hierárquica para lista plana
        const flattenCategorias = (cats: any[]): any[] => {
          let result: any[] = [];
          cats.forEach((cat) => {
            result.push(cat);
            if (cat.children && cat.children.length > 0) {
              result = [...result, ...flattenCategorias(cat.children)];
            }
          });
          return result;
        };

        const categoriasFlat = flattenCategorias(data.categorias || []);
        setCategorias(categoriasFlat);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchProdutos();
      fetchCategorias();
    }
  }, [mounted]);

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProdutos(1, filtros);
  };

  const handleFilterChange = (key: keyof Filtros, value: string) => {
    const novosFiltros = { ...filtros, [key]: value };
    setFiltros(novosFiltros);
    fetchProdutos(1, novosFiltros);
  };

  const limparFiltros = () => {
    const filtrosLimpos = { 
      search: "", 
      categoria: "", 
      marca: "", 
      ativo: "",
      orderBy: "createdAt",
      orderDirection: "desc" as "desc"
    };
    setFiltros(filtrosLimpos);
    fetchProdutos(1, filtrosLimpos);
  };

  // Função para abrir menu de ações
  const handleOpenMenu = (
    produtoId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 5,
      right: window.innerWidth - rect.right,
    });
    setOpenMenuId(openMenuId === produtoId ? null : produtoId);
  };

  // Função para alternar status do produto
  const toggleProdutoStatus = async (produto: Produto) => {
    setUpdatingId(produto.id);
    try {
      const response = await fetch(`/api/produtos/${produto.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !produto.ativo }),
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar status do produto");
      }

      // Atualizar produto na lista
      setProdutos((prev) =>
        prev.map((p) => (p.id === produto.id ? { ...p, ativo: !p.ativo } : p))
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status do produto");
    } finally {
      setUpdatingId(null);
    }
  };

  // Função para confirmar exclusão
  const handleDeleteProduto = (produto: Produto) => {
    setProdutoToDelete(produto);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  // Função para excluir produto
  const confirmDeleteProduto = async () => {
    if (!produtoToDelete) return;

    setUpdatingId(produtoToDelete.id);
    try {
      const response = await fetch(`/api/produtos/${produtoToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir produto");
      }

      // Remover produto da lista
      setProdutos((prev) => prev.filter((p) => p.id !== produtoToDelete.id));
      setShowDeleteModal(false);
      setProdutoToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
            <Package className="h-6 w-6 text-primary" />
            Produtos
          </h1>
          <p className="text-gray-600">
            Gerencie o catálogo de auto peças da CRC Faróis
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
            href="/dashboard/produtos/novo"
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo Produto
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
                  placeholder="Nome, código, marca..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={filtros.categoria}
                onChange={(e) =>
                  handleFilterChange("categoria", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origem
              </label>
              <select
                value={filtros.marca}
                onChange={(e) => handleFilterChange("marca", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todas as origens</option>
                <option value="Exclusivos">Exclusivos</option>
                <option value="Importados">Importados</option>
                <option value="Nacionais">Nacionais</option>
                <option value="Produção CRC">Produção CRC</option>
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

      {/* Lista de Produtos */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Catálogo de Produtos
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm text-gray-500">
                {pagination.total} produto{pagination.total !== 1 ? "s" : ""}{" "}
                encontrado{pagination.total !== 1 ? "s" : ""}
              </span>
              
              {/* Ordenação */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</label>
                <select
                  value={filtros.orderBy}
                  onChange={(e) => handleFilterChange("orderBy", e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="createdAt">Data de cadastro</option>
                  <option value="titulo">Nome (A-Z)</option>
                  <option value="sku">SKU</option>
                  <option value="preco">Preço</option>
                  <option value="quantidadeEstoque">Estoque</option>
                  <option value="categoria">Categoria</option>
                  <option value="origem">Origem</option>
                </select>
                
                <button
                  onClick={() => handleFilterChange("orderDirection", filtros.orderDirection === "asc" ? "desc" : "asc")}
                  className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={filtros.orderDirection === "asc" ? "Crescente" : "Decrescente"}
                >
                  {filtros.orderDirection === "asc" ? (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  )}
                </button>
              </div>

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
                <div key={i} className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : produtos.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  {Object.values(filtros).some((f) => f)
                    ? "Nenhum produto corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
                    : "Comece cadastrando seus primeiros produtos de auto peças"}
                </p>
                <Link
                  href="/dashboard/produtos/novo"
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  Cadastrar Primeiro Produto
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtos.map((produto) => (
                    <tr
                      key={produto.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex-shrink-0 w-12 h-12">
                          {produto.imagemPrincipal ? (
                            <img
                              src={produto.imagemPrincipal}
                              alt={produto.titulo}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {produto.titulo}
                          </div>
                          {produto.origem && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {produto.origem}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-gray-900">
                          {produto.sku}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {produto.categoria.nome}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          {formatPrice(produto.preco)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3 text-gray-400" />
                          <span
                            className={`text-sm font-medium ${
                              produto.quantidadeEstoque > 10
                                ? "text-green-600"
                                : produto.quantidadeEstoque > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {produto.quantidadeEstoque} un.
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            produto.ativo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2 relative">
                          <Link
                            href={`/dashboard/produtos/${produto.id}/editar`}
                            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
                            title="Editar produto"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={(e) => handleOpenMenu(produto.id, e)}
                            disabled={updatingId === produto.id}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                            title="Mais opções"
                          >
                            {updatingId === produto.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === produto.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div
                                className="absolute z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px]"
                                style={{
                                  top: menuPosition.top,
                                  right: menuPosition.right,
                                  position: "fixed",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => toggleProdutoStatus(produto)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                  {produto.ativo ? (
                                    <>
                                      <PowerOff className="h-4 w-4 text-red-500" />
                                      <span className="text-red-700">
                                        Desativar
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Power className="h-4 w-4 text-green-500" />
                                      <span className="text-green-700">
                                        Ativar
                                      </span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteProduto(produto)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Excluir
                                </button>
                              </div>
                            </>
                          )}
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
                  onClick={() => fetchProdutos(pagination.page - 1, filtros)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  Página {pagination.page} de {pagination.pages}
                </span>
                <button
                  onClick={() => fetchProdutos(pagination.page + 1, filtros)}
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

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && produtoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirmar Exclusão
                  </h3>
                  <p className="text-sm text-gray-500">
                    Esta ação não pode ser desfeita
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Tem certeza que deseja excluir o produto{" "}
                  <strong>"{produtoToDelete.titulo}"</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Todas as imagens associadas também serão removidas
                  permanentemente.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProdutoToDelete(null);
                  }}
                  disabled={updatingId === produtoToDelete.id}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteProduto}
                  disabled={updatingId === produtoToDelete.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingId === produtoToDelete.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Excluir Produto
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
