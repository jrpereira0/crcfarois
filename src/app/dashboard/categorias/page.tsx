"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  parentId?: string;
  ordem: number;
  ativo: boolean;
  produtosCount: number;
  children?: Categoria[];
  createdAt: string;
  updatedAt: string;
}

interface CategoriasResponse {
  categorias: Categoria[];
  total: number;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [todasCategorias, setTodasCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Categoria | null>(
    null
  );
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (showInactive) params.append("showInactive", "true");

      const response = await fetch(`/api/categorias?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }

      const data = await response.json();

      // Manter uma lista plana para facilitar as buscas no dropdown
      const flattenCategorias = (cats: Categoria[]): Categoria[] => {
        let result: Categoria[] = [];

        cats.forEach((cat) => {
          result.push(cat);
          if (cat.children && cat.children.length > 0) {
            result = [...result, ...flattenCategorias(cat.children)];
          }
        });

        return result;
      };

      const todasCategorias = flattenCategorias(data.categorias || []);
      setCategorias(data.categorias || []);
      setTodasCategorias(todasCategorias);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchCategorias();
    }
  }, [mounted, searchTerm, showInactive]);

  // Fechar menu ao fazer scroll
  useEffect(() => {
    if (!openMenuId) return;

    const handleScroll = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [openMenuId]);

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (cats: Categoria[]) => {
      cats.forEach((cat) => {
        if (cat.children && cat.children.length > 0) {
          allIds.add(cat.id);
          collectIds(cat.children);
        }
      });
    };
    collectIds(categorias);
    setExpandedCategories(allIds);
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const handleOpenMenu = (categoriaId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (openMenuId === categoriaId) {
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
    setOpenMenuId(categoriaId);
  };

  const toggleCategoriaStatus = async (
    categoriaId: string,
    novoStatus: boolean
  ) => {
    setUpdatingId(categoriaId);
    setOpenMenuId(null);
    setMenuPosition(null);

    try {
      // Buscar dados completos da categoria
      const categoria = todasCategorias.find((c) => c.id === categoriaId);
      if (!categoria) return;

      const response = await fetch(`/api/categorias/${categoriaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: categoria.nome,
          slug: categoria.slug,
          descricao: categoria.descricao || "",
          parentId: categoria.parentId || "",
          ordem: categoria.ordem,
          ativo: novoStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar categoria");
      }

      // Recarregar categorias
      await fetchCategorias();

      setToast({
        type: "success",
        text: `Categoria ${novoStatus ? "ativada" : "desativada"} com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      setToast({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar categoria",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteCategory = (categoria: Categoria) => {
    setCategoryToDelete(categoria);
    setShowDeleteModal(true);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`/api/categorias/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir categoria");
      }

      // Recarregar categorias
      await fetchCategorias();
      setShowDeleteModal(false);
      setCategoryToDelete(null);

      setToast({
        type: "success",
        text: "Categoria excluída com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setToast({
        type: "error",
        text:
          error instanceof Error ? error.message : "Erro ao excluir categoria",
      });
    }
  };

  const renderCategory = (categoria: Categoria, level: number = 0) => {
    const hasChildren = categoria.children && categoria.children.length > 0;
    const isExpanded = expandedCategories.has(categoria.id);
    const isSelected = selectedCategory === categoria.id;
    const indentClass = level > 0 ? `ml-${level * 6}` : "";

    return (
      <div key={categoria.id} className="select-none">
        <div
          className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
            isSelected
              ? "bg-primary/5 border-primary/20"
              : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
          } ${indentClass}`}
          onClick={() => setSelectedCategory(categoria.id)}
          draggable
          onDragStart={() => setDraggedItem(categoria.id)}
          onDragEnd={() => setDraggedItem(null)}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(categoria.id);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <div className="flex items-center gap-2">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-5 w-5 text-blue-500" />
                ) : (
                  <Folder className="h-5 w-5 text-blue-500" />
                )
              ) : (
                <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-medium ${
                      categoria.ativo ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {categoria.nome}
                  </h3>
                  {!categoria.ativo && (
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Inativo
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    <Package className="h-3 w-3" />
                    {categoria.produtosCount}
                  </span>
                </div>
                {categoria.descricao && (
                  <p className="text-sm text-gray-500 mt-1">
                    {categoria.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/dashboard/categorias/${categoria.id}/editar`;
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Editar categoria"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => handleOpenMenu(categoria.id, e)}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                openMenuId === categoria.id ? "bg-gray-100" : ""
              }`}
              title="Mais opções"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {categoria.children!.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredCategorias = categorias;
  const totalCategorias = categorias.reduce((acc, cat) => {
    const countChildren = (c: Categoria): number => {
      return (
        1 +
        (c.children?.reduce((sum, child) => sum + countChildren(child), 0) || 0)
      );
    };
    return acc + countChildren(cat);
  }, 0);

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
            <FolderTree className="h-6 w-6 text-primary" />
            Categorias
          </h1>
          <p className="text-gray-600">
            Organize seus produtos em categorias e subcategorias
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard/categorias/nova"
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nova Categoria
          </Link>
        </div>
      </div>

      {/* Filtros e Controles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar categorias..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Mostrar inativas</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Expandir Todas
            </button>
            <button
              onClick={collapseAll}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Recolher Todas
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalCategorias}</span> categoria
            {totalCategorias !== 1 ? "s" : ""} total
            {searchTerm && (
              <span className="ml-2">
                •{" "}
                <span className="font-medium">{filteredCategorias.length}</span>{" "}
                encontrada
                {filteredCategorias.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Estrutura de Categorias
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Monte a estrutura perfeita para seus produtos
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCategorias.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <FolderTree className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm
                    ? "Nenhuma categoria encontrada"
                    : "Nenhuma categoria criada"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  {searchTerm
                    ? "Tente ajustar os termos de busca ou limpar os filtros."
                    : "Comece criando suas primeiras categorias para organizar seus produtos."}
                </p>
                <Link
                  href="/dashboard/categorias/nova"
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  Criar Primeira Categoria
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCategorias.map((categoria) => renderCategory(categoria))}
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCategoriaStatus(
                  openMenuId,
                  !todasCategorias.find((c) => c.id === openMenuId)?.ativo
                );
              }}
              disabled={updatingId === openMenuId}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors flex items-center gap-3 ${
                todasCategorias.find((c) => c.id === openMenuId)?.ativo
                  ? "text-orange-600 hover:bg-orange-50"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              {updatingId === openMenuId ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : todasCategorias.find((c) => c.id === openMenuId)?.ativo ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>
                {todasCategorias.find((c) => c.id === openMenuId)?.ativo
                  ? "Desativar"
                  : "Ativar"}{" "}
                Categoria
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                const categoria = todasCategorias.find(
                  (c) => c.id === openMenuId
                );
                if (categoria) {
                  handleDeleteCategory(categoria);
                }
              }}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir Categoria</span>
            </button>
          </div>
        </>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Excluir Categoria
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Tem certeza que deseja excluir a categoria:
              </p>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900">
                    {categoryToDelete.nome}
                  </span>
                  {!categoryToDelete.ativo && (
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Inativo
                    </span>
                  )}
                </div>
                {categoryToDelete.descricao && (
                  <p className="text-sm text-gray-600 mt-1">
                    {categoryToDelete.descricao}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
