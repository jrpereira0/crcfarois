"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
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
} from "lucide-react";

export default function CarrinhoPage() {
  const { state, isLoaded, isOnline, updateQuantity, removeItem, clearCart } =
    useCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Estados locais
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  // Usar o estado de carregamento do contexto em vez de simulação local

  // Formatação de preço memoizada
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }, []);

  // Handlers otimizados
  const handleQuantityChange = useCallback(
    async (id: string, newQuantity: number, item: any) => {
      const minQuantity = item.compraMinima || 1;
      const maxQuantity = item.compraMaxima || item.quantidadeEstoque;

      if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
        setUpdatingItems((prev) => new Set(prev).add(id));

        try {
          await updateQuantity(id, newQuantity);
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
        await removeItem(id);
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
      await clearCart();
      setShowClearConfirm(false);
      showToast("Carrinho limpo com sucesso", "success");
    } catch (error) {
      showToast("Erro ao limpar carrinho", "error");
    }
  }, [clearCart, showToast]);

  const handleContinueShopping = useCallback(() => {
    router.push("/b2b/produtos");
  }, [router]);

  // Memoização dos cálculos
  const cartSummary = useMemo(
    () => ({
      itemsCount: state.totalItems,
      total: state.total,
      isEmpty: state.items.length === 0,
    }),
    [state.totalItems, state.total, state.items.length]
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
            {!isOnline && (
              <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Offline
              </div>
            )}
          </div>
        </div>

        {/* Barra de ações superior */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/b2b/produtos"
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
          {state.items.map((item) => {
            const isUpdating = updatingItems.has(item.id);
            const isRemoving = removingItems.has(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
                  isRemoving ? "opacity-50 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Imagem do produto */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagemPrincipal ? (
                        <Image
                          src={item.imagemPrincipal}
                          alt={item.titulo}
                          fill
                          className="object-contain p-1 sm:p-2"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      ) : item.imagensUrls.length > 0 ? (
                        <Image
                          src={item.imagensUrls[0]}
                          alt={item.titulo}
                          fill
                          className="object-contain p-1 sm:p-2"
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
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                            {item.titulo}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                              {item.sku}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span className="hidden sm:inline">
                                {item.categoria.nome}
                              </span>
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id, item.titulo)}
                          disabled={isRemoving}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                          title="Remover item"
                        >
                          {isRemoving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Controles e preços */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm text-gray-600 font-medium">
                            Qtd:
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantidade - 1,
                                  item
                                )
                              }
                              disabled={
                                item.quantidade <= item.compraMinima ||
                                isUpdating
                              }
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <div className="px-3 sm:px-4 py-1.5 sm:py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm font-medium border-l border-r border-gray-300 flex items-center justify-center">
                              {isUpdating ? (
                                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                              ) : (
                                item.quantidade
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantidade + 1,
                                  item
                                )
                              }
                              disabled={
                                item.quantidade >=
                                  (item.compraMaxima ||
                                    item.quantidadeEstoque) || isUpdating
                              }
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Preços */}
                        <div className="text-left sm:text-right">
                          <div className="text-xs sm:text-sm text-gray-500">
                            {formatPrice(item.preco)} × {item.quantidade}
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-primary">
                            {formatPrice(item.subtotal)}
                          </div>
                        </div>
                      </div>

                      {/* Informações adicionais */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>Min: {item.compraMinima}</span>
                        <span>
                          Max: {item.compraMaxima || item.quantidadeEstoque}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {item.quantidadeEstoque} em estoque
                        </span>
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

            {/* Lista de itens resumida */}
            <div className="space-y-3 mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate pr-2">
                    {item.titulo} × {item.quantidade}
                  </span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    {formatPrice(item.subtotal)}
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
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Link
                href="/b2b/checkout"
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                <CreditCard className="h-5 w-5" />
                Finalizar Pedido
              </Link>
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
