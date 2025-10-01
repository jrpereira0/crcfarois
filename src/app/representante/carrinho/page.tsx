"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRepresentanteCart } from "@/contexts/RepresentanteCartContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  CreditCard,
  ArrowLeft,
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  User,
} from "lucide-react";

export default function RepresentanteCarrinhoPage() {
  const {
    items,
    selectedClient,
    isLoaded,
    updateQuantity,
    removeItem,
    clearCart,
    selectClient,
    getTotal,
    getItemCount,
  } = useRepresentanteCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Estados locais
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Usar o estado de carregamento do contexto em vez de simulação local

  // Formatação de preço memoizada
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }, []);

  // Buscar clientes do representante
  const fetchClientes = useCallback(async () => {
    if (loadingClientes) return;

    try {
      setLoadingClientes(true);
      const response = await fetch("/api/representante/clientes");
      if (response.ok) {
        const data = await response.json();
        setClientes(data.clientes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      showToast("Erro ao carregar clientes", "error");
    } finally {
      setLoadingClientes(false);
    }
  }, [loadingClientes, showToast]);

  // Filtrar clientes por busca
  const clientesFiltrados = useMemo(() => {
    if (!searchTerm) return clientes;
    return clientes.filter(
      (cliente) =>
        cliente.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cnpjCpf.includes(searchTerm)
    );
  }, [clientes, searchTerm]);

  // Handlers otimizados
  const handleQuantityChange = useCallback(
    async (id: string, newQuantity: number, produto: any) => {
      const minQuantity = produto.compraMinima || 1;
      const maxQuantity = produto.compraMaxima || produto.quantidadeEstoque;

      if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
        setUpdatingItems((prev) => new Set(prev).add(id));

        try {
          updateQuantity(id, newQuantity);
          showToast("Quantidade atualizada", "success", 2000);
        } catch (error) {
          showToast("Erro ao atualizar quantidade", "error");
        } finally {
          setUpdatingItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      }
    },
    [updateQuantity, showToast]
  );

  const handleRemoveItem = useCallback(
    async (id: string, titulo: string) => {
      setRemovingItems((prev) => new Set(prev).add(id));

      try {
        removeItem(id);
        showToast(`${titulo} removido do carrinho`, "success");
      } catch (error) {
        showToast("Erro ao remover item", "error");
      } finally {
        setRemovingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    },
    [removeItem, showToast]
  );

  const handleClearCart = useCallback(async () => {
    try {
      clearCart();
      setShowClearConfirm(false);
      showToast("Carrinho limpo com sucesso", "success");
    } catch (error) {
      showToast("Erro ao limpar carrinho", "error");
    }
  }, [clearCart, showToast]);

  const handleContinueShopping = useCallback(() => {
    router.push("/representante/produtos");
  }, [router]);

  const handleSelectClient = useCallback(
    (cliente: any) => {
      selectClient(cliente);
      setShowClientModal(false);
      showToast(`Cliente ${cliente.razaoSocial} selecionado`, "success");
    },
    [selectClient, showToast]
  );

  const handleOpenClientModal = useCallback(() => {
    setShowClientModal(true);
    fetchClientes();
  }, [fetchClientes]);

  // Memoização dos cálculos
  const cartSummary = useMemo(
    () => ({
      itemsCount: getItemCount(),
      total: getTotal(),
      isEmpty: items.length === 0,
    }),
    [getItemCount, getTotal, items.length]
  );

  // Loading skeleton otimizado - usar estado do contexto
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state otimizado
  if (cartSummary.isEmpty) {
    return (
      <div className="space-y-6">
        {/* Header seguindo padrão da página de produtos */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Carrinho de Compras
              </h1>
              <p className="text-gray-600">
                Gerencie os produtos do seu pedido
              </p>
            </div>
            <div className="text-sm text-gray-500">0 itens no carrinho</div>
          </div>
        </div>

        {/* Empty State Card */}
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Seu carrinho está vazio
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Explore nosso catálogo e adicione produtos ao seu carrinho para
            continuar com a compra.
          </p>
          <button
            onClick={handleContinueShopping}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Package className="h-5 w-5" />
            Ver Produtos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header seguindo exatamente o padrão da página de produtos */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Carrinho de Compras
            </h1>
            <p className="text-gray-600">Gerencie os produtos do seu pedido</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {cartSummary.itemsCount}{" "}
              {cartSummary.itemsCount === 1 ? "item" : "itens"} no carrinho
            </div>
          </div>
        </div>

        {/* Barra de ações superior */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/representante/produtos"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continuar Comprando</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">
                Total: {formatPrice(cartSummary.total)}
              </span>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const isUpdating = updatingItems.has(item.produto.id);
            const isRemoving = removingItems.has(item.produto.id);

            return (
              <div
                key={item.produto.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
                  isRemoving ? "opacity-50 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Imagem do produto */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.produto.imagemPrincipal ? (
                        <Image
                          src={item.produto.imagemPrincipal}
                          alt={item.produto.titulo}
                          fill
                          className="object-contain p-1.5 sm:p-2"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      ) : item.produto.imagensUrls.length > 0 ? (
                        <Image
                          src={item.produto.imagensUrls[0]}
                          alt={item.produto.titulo}
                          fill
                          className="object-contain p-1.5 sm:p-2"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0 mr-2">
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item.produto.titulo}
                          </h3>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 sm:py-1 rounded-full font-medium">
                              {item.produto.sku}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.produto.id,
                              item.produto.titulo
                            )
                          }
                          disabled={isRemoving}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                          title="Remover item"
                        >
                          {isRemoving ? (
                            <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          )}
                        </button>
                      </div>

                      {/* Controles e preços */}
                      <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium">
                            Qtd:
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.produto.id,
                                  item.quantidade - 1,
                                  item.produto
                                )
                              }
                              disabled={
                                item.quantidade <= item.produto.compraMinima ||
                                isUpdating
                              }
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <div className="px-3 sm:px-4 py-1.5 sm:py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center font-medium border-l border-r border-gray-300 flex items-center justify-center text-sm">
                              {isUpdating ? (
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                              ) : (
                                item.quantidade
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.produto.id,
                                  item.quantidade + 1,
                                  item.produto
                                )
                              }
                              disabled={
                                item.quantidade >=
                                  (item.produto.compraMaxima ||
                                    item.produto.quantidadeEstoque) ||
                                isUpdating
                              }
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Preços */}
                        <div className="flex items-center justify-between sm:block sm:text-right">
                          <div className="text-xs sm:text-sm text-gray-500">
                            {formatPrice(item.produto.preco)} × {item.quantidade}
                          </div>
                          <div className="text-base sm:text-xl font-bold text-primary">
                            {formatPrice(item.produto.preco * item.quantidade)}
                          </div>
                        </div>

                        {/* Informações adicionais */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                          <span>Min: {item.produto.compraMinima}</span>
                          <span>
                            Max: {item.produto.compraMaxima || item.produto.quantidadeEstoque}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item.produto.quantidadeEstoque} em estoque
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Resumo do Pedido
            </h2>

            {/* Seleção de Cliente */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Cliente do Pedido
              </h3>
              {selectedClient ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedClient.razaoSocial}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedClient.cnpjCpf}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenClientModal}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Alterar
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenClientModal}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-primary hover:border-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  Selecionar Cliente
                </button>
              )}
            </div>

            {/* Lista de itens resumida */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.produto.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 truncate pr-2">
                    {item.produto.titulo} × {item.quantidade}
                  </span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    {formatPrice(item.produto.preco * item.quantidade)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(cartSummary.total)}
                </span>
              </div>
            </div>

            {/* Informações importantes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Importante:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Preços sujeitos à confirmação</li>
                    <li>• Prazo de entrega será informado</li>
                    <li>• Frete será consultado e informado</li>
                    <li>• Pedido será feito em nome do cliente selecionado</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              {selectedClient ? (
                <Link
                  href="/representante/checkout"
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  <CreditCard className="h-5 w-5" />
                  Finalizar Pedido
                </Link>
              ) : (
                <button
                  onClick={handleOpenClientModal}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  <User className="h-5 w-5" />
                  Selecionar Cliente
                </button>
              )}
              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Package className="h-5 w-5" />
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de seleção de cliente */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header do Modal */}
            <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Selecionar Cliente
                </h2>
                <p className="text-gray-600 mt-1">
                  Escolha o cliente para este pedido
                </p>
              </div>
              <button
                onClick={() => setShowClientModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Busca */}
            <div className="p-6 border-b border-gray-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, razão social ou CNPJ/CPF..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Lista de clientes */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingClientes ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : clientesFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm
                      ? "Nenhum cliente encontrado"
                      : "Nenhum cliente disponível"}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? "Tente ajustar os termos de busca"
                      : "Você ainda não tem clientes atribuídos"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientesFiltrados.map((cliente) => (
                    <button
                      key={cliente.id}
                      onClick={() => handleSelectClient(cliente)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {cliente.razaoSocial}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {cliente.cnpjCpf}
                          </p>
                          <p className="text-sm text-gray-500">
                            {cliente.user.name}
                          </p>
                        </div>
                        {selectedClient?.id === cliente.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para limpar carrinho */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Limpar Carrinho
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover todos os itens do carrinho? Esta
                ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
