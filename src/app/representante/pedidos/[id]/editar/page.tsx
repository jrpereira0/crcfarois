"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Plus,
  Minus,
  Trash2,
  Save,
  X,
  Search,
  CreditCard,
  Truck,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Calendar,
  FileText,
  Tag,
} from "lucide-react";

interface ProdutoDisponivel {
  id: string;
  titulo: string;
  sku: string;
  preco: number;
  quantidadeEstoque: number;
  compraMinima: number;
  compraMaxima?: number;
  imagemPrincipal?: string;
  imagensUrls: string[];
  categoria: {
    id: string;
    nome: string;
    slug: string;
  };
}

interface ItemPedido {
  id: string;
  produtoId: string;
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
    categoria: {
      id: string;
      nome: string;
      slug: string;
    };
    quantidadeEstoque: number;
    preco: number;
  };
}

interface PedidoForm {
  id: string;
  numero: string;
  status: string;
  tipoEntrega: "RETIRADA" | "ENTREGA";
  formaPagamento: string;
  condicaoPagamento: string;
  observacoes: string;
  userId: string;
  // Endereço de entrega
  enderecoEntrega: string;
  numeroEntrega: string;
  complementoEntrega: string;
  bairroEntrega: string;
  cidadeEntrega: string;
  estadoEntrega: string;
  cepEntrega: string;
  // Itens
  itens: ItemPedido[];
}

export default function EditarPedidoRepresentantePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PedidoForm | null>(null);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<
    ProdutoDisponivel[]
  >([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [condicoesDisponiveis, setCondicoesDisponiveis] = useState<string[]>(
    []
  );
  const [searchProduto, setSearchProduto] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [freteCustomizado, setFreteCustomizado] = useState(0);
  const [freteInputValue, setFreteInputValue] = useState("");
  const [descontoTipo, setDescontoTipo] = useState<"PORCENTAGEM" | "VALOR">(
    "PORCENTAGEM"
  );
  const [descontoValor, setDescontoValor] = useState(0);
  const [descontoInputValue, setDescontoInputValue] = useState("");

  const pedidoId = params.id as string;

  // Formatação de preço
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }, []);

  // Formatação de input de moeda
  const formatCurrencyInput = useCallback((value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, "");

    // Se não há dígitos, retorna vazio
    if (!digits) return "";

    // Converte para número (centavos)
    const number = parseInt(digits, 10);

    // Converte centavos para reais
    const reais = number / 100;

    // Formata como moeda brasileira sem o símbolo
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);
  }, []);

  // Converter valor formatado para número
  const parseCurrencyInput = useCallback((value: string) => {
    if (!value) return 0;
    // Remove pontos de milhares e converte vírgula para ponto
    const cleanValue = value.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleanValue) || 0;
  }, []);

  // Buscar pedido para edição
  const fetchPedido = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/representante/pedidos/${pedidoId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar pedido");
      }

      const data = await response.json();
      const pedido = data.pedido;

      setForm({
        id: pedido.id,
        numero: pedido.numero,
        status: pedido.status,
        tipoEntrega: pedido.tipoEntrega,
        formaPagamento: pedido.formaPagamento,
        condicaoPagamento: pedido.condicaoPagamento || "",
        observacoes: pedido.observacoes || "",
        userId: pedido.userId,
        enderecoEntrega: pedido.enderecoEntrega || "",
        numeroEntrega: pedido.numeroEntrega || "",
        complementoEntrega: pedido.complementoEntrega || "",
        bairroEntrega: pedido.bairroEntrega || "",
        cidadeEntrega: pedido.cidadeEntrega || "",
        estadoEntrega: pedido.estadoEntrega || "",
        cepEntrega: pedido.cepEntrega || "",
        itens: pedido.itens || [],
      });

      // Definir frete inicial (converter de Decimal para número)
      const freteInicial =
        typeof pedido.frete === "number"
          ? pedido.frete
          : Number(pedido.frete) || 0;
      setFreteCustomizado(freteInicial);
      setFreteInputValue(
        freteInicial > 0
          ? formatCurrencyInput((freteInicial * 100).toString())
          : ""
      );

      // Definir desconto inicial
      if (pedido.descontoTipo && pedido.descontoValor) {
        setDescontoTipo(pedido.descontoTipo as "PORCENTAGEM" | "VALOR");
        const descontoValorInicial =
          typeof pedido.descontoValor === "number"
            ? pedido.descontoValor
            : Number(pedido.descontoValor) || 0;
        setDescontoValor(descontoValorInicial);

        if (pedido.descontoTipo === "PORCENTAGEM") {
          setDescontoInputValue(descontoValorInicial.toString());
        } else {
          setDescontoInputValue(
            formatCurrencyInput((descontoValorInicial * 100).toString())
          );
        }
      }

      // Buscar condições de pagamento do cliente
      await fetchCondicoesCliente(pedido.userId);
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      router.push("/representante/pedidos");
    } finally {
      setLoading(false);
    }
  }, [pedidoId, router]);

  // Buscar condições de pagamento do cliente
  const fetchCondicoesCliente = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `/api/representante/clientes/${userId}/condicoes-pagamento`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.condicoes && data.condicoes.length > 0) {
          setCondicoesDisponiveis(data.condicoes);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar condições do cliente:", error);
    }
  }, []);

  // Buscar produtos disponíveis
  const fetchProdutos = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchProduto) params.set("search", searchProduto);
      params.set("limit", "20");

      const response = await fetch(
        `/api/representante/produtos?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setProdutosDisponiveis(data.produtos || []);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }, [searchProduto]);

  useEffect(() => {
    if (pedidoId) {
      fetchPedido();
    }
  }, [pedidoId, fetchPedido]);

  useEffect(() => {
    if (showAddProduct) {
      fetchProdutos();
    }
  }, [showAddProduct, searchProduto, fetchProdutos]);

  // Buscar endereço por CEP
  const buscarCep = useCallback(
    async (cep: string) => {
      const cepLimpo = cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) return;

      setLoadingCep(true);

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();

        if (!data.erro && form) {
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  enderecoEntrega: data.logradouro || "",
                  bairroEntrega: data.bairro || "",
                  cidadeEntrega: data.localidade || "",
                  estadoEntrega: data.uf || "",
                }
              : null
          );
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCep(false);
      }
    },
    [form]
  );

  // Atualizar quantidade de item
  const updateItemQuantity = useCallback(
    (itemId: string, quantidade: number) => {
      setForm((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          itens: prev.itens.map((item) => {
            if (item.id === itemId) {
              const novaQuantidade = Math.max(
                1,
                Math.min(quantidade, item.produto.quantidadeEstoque)
              );
              // Sempre usar o preço atual do produto
              const precoAtual = item.produto.preco;
              return {
                ...item,
                quantidade: novaQuantidade,
                precoUnitario: precoAtual,
                subtotal: novaQuantidade * precoAtual,
              };
            }
            return item;
          }),
        };
      });
    },
    []
  );

  // Remover item do pedido
  const removeItem = useCallback((itemId: string) => {
    setForm((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        itens: prev.itens.filter((item) => item.id !== itemId),
      };
    });
  }, []);

  // Adicionar produto ao pedido
  const addProduct = useCallback((produto: ProdutoDisponivel) => {
    setForm((prev) => {
      if (!prev) return null;

      // Verificar se produto já existe
      const itemExistente = prev.itens.find(
        (item) => item.produtoId === produto.id
      );

      if (itemExistente) {
        // Atualizar quantidade
        return {
          ...prev,
          itens: prev.itens.map((item) => {
            if (item.produtoId === produto.id) {
              const novaQuantidade = item.quantidade + produto.compraMinima;
              return {
                ...item,
                quantidade: novaQuantidade,
                subtotal: novaQuantidade * item.precoUnitario,
              };
            }
            return item;
          }),
        };
      } else {
        // Adicionar novo item com preço atual do sistema
        const novoItem: ItemPedido = {
          id: `new-${Date.now()}`,
          produtoId: produto.id,
          quantidade: produto.compraMinima,
          precoUnitario: produto.preco,
          subtotal: produto.compraMinima * produto.preco,
          produtoTitulo: produto.titulo,
          produtoSku: produto.sku,
          produto: {
            id: produto.id,
            titulo: produto.titulo,
            sku: produto.sku,
            imagemPrincipal: produto.imagemPrincipal,
            imagensUrls: produto.imagensUrls,
            categoria: produto.categoria,
            quantidadeEstoque: produto.quantidadeEstoque,
            preco: produto.preco,
          },
        };

        return {
          ...prev,
          itens: [...prev.itens, novoItem],
        };
      }
    });

    setShowAddProduct(false);
  }, []);

  // Calcular totais
  const calcularTotais = useCallback(() => {
    if (!form) return { subtotal: 0, frete: 0, desconto: 0, total: 0 };

    const subtotal = form.itens.reduce((sum, item) => {
      const itemSubtotal =
        typeof item.subtotal === "number"
          ? item.subtotal
          : Number(item.subtotal) || 0;
      return sum + itemSubtotal;
    }, 0);
    const frete = form.tipoEntrega === "ENTREGA" ? freteCustomizado : 0;

    // Calcular desconto
    let desconto = 0;
    if (descontoValor > 0) {
      if (descontoTipo === "PORCENTAGEM") {
        desconto = (subtotal * descontoValor) / 100;
      } else {
        desconto = descontoValor;
      }
    }

    const total = subtotal + frete - desconto;

    return { subtotal, frete, desconto, total: Math.max(0, total) };
  }, [form, freteCustomizado, descontoTipo, descontoValor]);

  // Salvar pedido
  const salvarPedido = useCallback(async () => {
    if (!form) return;

    setSaving(true);

    try {
      const { subtotal, frete, desconto, total } = calcularTotais();

      const response = await fetch(`/api/representante/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: form.status,
          tipoEntrega: form.tipoEntrega,
          formaPagamento: form.formaPagamento,
          condicaoPagamento: form.condicaoPagamento || null,
          observacoes: form.observacoes.trim() || null,
          enderecoEntrega:
            form.tipoEntrega === "ENTREGA"
              ? {
                  endereco: form.enderecoEntrega,
                  numero: form.numeroEntrega,
                  complemento: form.complementoEntrega,
                  bairro: form.bairroEntrega,
                  cidade: form.cidadeEntrega,
                  estado: form.estadoEntrega,
                  cep: form.cepEntrega,
                }
              : null,
          itens: form.itens.map((item) => ({
            id: item.id.startsWith("new-") ? undefined : item.id,
            produtoId: item.produtoId || item.produto?.id,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          })),
          subtotal,
          frete,
          descontoTipo: descontoValor > 0 ? descontoTipo : null,
          descontoValor: descontoValor > 0 ? descontoValor : null,
          desconto,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar pedido");
      }

      // Mostrar sucesso
      alert("✅ Pedido atualizado com sucesso!");
      router.push(`/representante/pedidos/${pedidoId}`);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      alert(
        `❌ Erro ao salvar pedido: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setSaving(false);
    }
  }, [form, pedidoId, router, calcularTotais, descontoTipo, descontoValor]);

  if (loading || !form) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, frete, desconto, total } = calcularTotais();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href={`/representante/pedidos/${pedidoId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar ao Pedido</span>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Pedido {form.numero}
            </h1>
            <p className="text-gray-600">
              Modifique produtos, quantidades e informações do pedido
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/representante/pedidos/${pedidoId}`)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={salvarPedido}
              disabled={saving || form.itens.length === 0}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Itens do pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Itens do Pedido
              </h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-primary text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Produto</span>
              </button>
            </div>

            <div className="space-y-4">
              {form.itens.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Imagem do produto */}
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        {item.produto?.imagemPrincipal ? (
                          <Image
                            src={item.produto.imagemPrincipal}
                            alt={
                              item.produtoTitulo ||
                              item.produto?.titulo ||
                              "Produto"
                            }
                            fill
                            className="object-contain p-1 sm:p-2"
                            sizes="96px"
                          />
                        ) : item.produto?.imagensUrls?.length > 0 ? (
                          <Image
                            src={item.produto.imagensUrls[0]}
                            alt={
                              item.produtoTitulo ||
                              item.produto?.titulo ||
                              "Produto"
                            }
                            fill
                            className="object-contain p-1 sm:p-2"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Informações do produto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                              {item.produtoTitulo ||
                                item.produto?.titulo ||
                                "Produto"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                              <span className="bg-gray-100 px-2 py-0.5 sm:py-1 rounded-full font-medium">
                                {item.produtoSku || item.produto?.sku || "N/A"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span className="hidden sm:inline">
                                  {item.produto?.categoria?.nome || "Categoria"}
                                </span>
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0"
                            title="Remover item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Controles de quantidade */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm text-gray-600 font-medium">
                              Qtd:
                            </span>
                            <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                              <button
                                onClick={() =>
                                  updateItemQuantity(
                                    item.id,
                                    item.quantidade - 1
                                  )
                                }
                                disabled={item.quantidade <= 1}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <span className="px-3 sm:px-4 py-1.5 sm:py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center font-medium border-l border-r border-gray-300 text-sm">
                                {item.quantidade}
                              </span>
                              <button
                                onClick={() =>
                                  updateItemQuantity(
                                    item.id,
                                    item.quantidade + 1
                                  )
                                }
                                disabled={
                                  item.quantidade >=
                                  (item.produto?.quantidadeEstoque || 0)
                                }
                                className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Preços */}
                          <div className="text-right">
                            <div className="text-xs sm:text-sm text-gray-500">
                              {formatPrice(
                                item.precoUnitario || item.produto?.preco || 0
                              )}{" "}
                              x {item.quantidade}
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-primary">
                              {formatPrice(item.subtotal || 0)}
                            </div>
                          </div>
                        </div>

                        {/* Informações adicionais */}
                        <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-4 text-xs text-gray-500">
                          <span>
                            Estoque: {item.produto?.quantidadeEstoque || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {form.itens.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum item no pedido
                  </h3>
                  <p className="text-gray-600">
                    Adicione produtos para continuar a edição.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Forma de pagamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Forma de Pagamento
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: "PIX", label: "PIX", icon: "💳" },
                { value: "DINHEIRO", label: "Dinheiro", icon: "💵" },
                {
                  value: "CARTAO_CREDITO",
                  label: "Cartão de Crédito",
                  icon: "💳",
                },
                {
                  value: "CARTAO_DEBITO",
                  label: "Cartão de Débito",
                  icon: "💳",
                },
                { value: "BOLETO", label: "Boleto", icon: "📋" },
                { value: "TRANSFERENCIA", label: "Transferência", icon: "🏦" },
              ].map((opcao) => (
                <label
                  key={opcao.value}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    form.formaPagamento === opcao.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="formaPagamento"
                    value={opcao.value}
                    checked={form.formaPagamento === opcao.value}
                    onChange={(e) =>
                      setForm((prev) =>
                        prev
                          ? { ...prev, formaPagamento: e.target.value }
                          : null
                      )
                    }
                    className="sr-only"
                  />
                  <span className="text-xl sm:text-2xl flex-shrink-0">
                    {opcao.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-xs sm:text-base truncate">
                      {opcao.label}
                    </div>
                  </div>
                  {form.formaPagamento === opcao.value && (
                    <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Condições de Pagamento */}
          {condicoesDisponiveis.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Condições de Pagamento
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {condicoesDisponiveis.map((condicao) => (
                  <label
                    key={condicao}
                    className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      form?.condicaoPagamento === condicao
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="condicaoPagamento"
                      value={condicao}
                      checked={form?.condicaoPagamento === condicao}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, condicaoPagamento: e.target.value }
                            : null
                        )
                      }
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {condicao}
                      </div>
                    </div>
                    {form?.condicaoPagamento === condicao && (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Entrega */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Entrega
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <label
                className={`flex items-center gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  form.tipoEntrega === "RETIRADA"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="RETIRADA"
                  checked={form.tipoEntrega === "RETIRADA"}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev
                        ? { ...prev, tipoEntrega: e.target.value as "RETIRADA" }
                        : null
                    )
                  }
                  className="sr-only"
                />
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm sm:text-base">
                    Retirada
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Cliente retira na loja
                  </div>
                </div>
                {form.tipoEntrega === "RETIRADA" && (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                )}
              </label>

              <label
                className={`flex items-center gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  form.tipoEntrega === "ENTREGA"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="ENTREGA"
                  checked={form.tipoEntrega === "ENTREGA"}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev
                        ? { ...prev, tipoEntrega: e.target.value as "ENTREGA" }
                        : null
                    )
                  }
                  className="sr-only"
                />
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm sm:text-base">
                    Entrega
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Entregar no endereço
                  </div>
                </div>
                {form.tipoEntrega === "ENTREGA" && (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                )}
              </label>
            </div>

            {/* Endereço de entrega */}
            {form.tipoEntrega === "ENTREGA" && (
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Endereço de Entrega
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      CEP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.cepEntrega}
                        onChange={(e) => {
                          const cepFormatado = e.target.value
                            .replace(/\D/g, "")
                            .replace(/(\d{5})(\d)/, "$1-$2")
                            .slice(0, 9);
                          setForm((prev) =>
                            prev ? { ...prev, cepEntrega: cepFormatado } : null
                          );
                          if (cepFormatado.length === 9) {
                            buscarCep(cepFormatado);
                          }
                        }}
                        placeholder="00000-000"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {loadingCep && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={form.enderecoEntrega}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, enderecoEntrega: e.target.value }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      value={form.numeroEntrega}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, numeroEntrega: e.target.value }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={form.complementoEntrega}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, complementoEntrega: e.target.value }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={form.bairroEntrega}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, bairroEntrega: e.target.value }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={form.cidadeEntrega}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, cidadeEntrega: e.target.value }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={form.estadoEntrega}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, estadoEntrega: e.target.value }
                            : null
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Observações
              </h2>
            </div>

            <textarea
              value={form.observacoes}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, observacoes: e.target.value } : null
                )
              }
              placeholder="Observações sobre o pedido..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Resumo financeiro */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              Resumo do Pedido
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Campo de frete editável */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600">Frete</span>
                  {form.tipoEntrega === "RETIRADA" && (
                    <span className="font-medium text-gray-900">Grátis</span>
                  )}
                </div>

                {form.tipoEntrega === "ENTREGA" && (
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Valor do Frete
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        R$
                      </span>
                      <input
                        type="text"
                        value={freteInputValue}
                        onChange={(e) => {
                          const formatted = formatCurrencyInput(e.target.value);
                          setFreteInputValue(formatted);
                          setFreteCustomizado(parseCurrencyInput(formatted));
                        }}
                        onFocus={(e) => {
                          if (freteCustomizado === 0) {
                            setFreteInputValue("");
                          }
                        }}
                        onBlur={(e) => {
                          if (!e.target.value.trim()) {
                            setFreteCustomizado(0);
                            setFreteInputValue("");
                          }
                        }}
                        placeholder="0,00"
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Deixe 0 para frete grátis
                    </div>
                  </div>
                )}
              </div>

              {/* Campo de desconto editável */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600 font-medium">Desconto</span>
                </div>

                <div className="space-y-3">
                  {/* Tipo de desconto */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDescontoTipo("PORCENTAGEM")}
                      className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        descontoTipo === "PORCENTAGEM"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      % Porcentagem
                    </button>
                    <button
                      onClick={() => setDescontoTipo("VALOR")}
                      className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        descontoTipo === "VALOR"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      R$ Valor Fixo
                    </button>
                  </div>

                  {/* Input de desconto */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      {descontoTipo === "PORCENTAGEM" ? "%" : "R$"}
                    </span>
                    <input
                      type="text"
                      value={descontoInputValue}
                      onChange={(e) => {
                        if (descontoTipo === "PORCENTAGEM") {
                          // Para porcentagem, aceitar apenas números
                          const value = e.target.value.replace(/\D/g, "");
                          const numValue = parseInt(value) || 0;
                          // Limitar a 100%
                          const limitedValue = Math.min(numValue, 100);
                          setDescontoInputValue(limitedValue.toString());
                          setDescontoValor(limitedValue);
                        } else {
                          // Para valor, usar formatação de moeda
                          const formatted = formatCurrencyInput(e.target.value);
                          setDescontoInputValue(formatted);
                          setDescontoValor(parseCurrencyInput(formatted));
                        }
                      }}
                      onFocus={(e) => {
                        if (descontoValor === 0) {
                          setDescontoInputValue("");
                        }
                      }}
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          setDescontoValor(0);
                          setDescontoInputValue("");
                        }
                      }}
                      placeholder={
                        descontoTipo === "PORCENTAGEM" ? "0" : "0,00"
                      }
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {desconto > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto aplicado</span>
                      <span className="font-medium">
                        - {formatPrice(desconto)}
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    {descontoTipo === "PORCENTAGEM"
                      ? "Digite a porcentagem de desconto (máx. 100%)"
                      : "Digite o valor fixo do desconto"}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between text-base sm:text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar produto */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Adicionar Produto
                </h3>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchProduto}
                    onChange={(e) => setSearchProduto(e.target.value)}
                    placeholder="Buscar produtos por nome ou SKU..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {produtosDisponiveis.map((produto) => (
                  <div
                    key={produto.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => addProduct(produto)}
                  >
                    <div className="relative w-full h-24 sm:h-32 bg-gray-50 rounded-lg overflow-hidden mb-3">
                      {produto.imagemPrincipal ? (
                        <Image
                          src={produto.imagemPrincipal}
                          alt={produto.titulo}
                          fill
                          className="object-contain p-2"
                          sizes="200px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <h4 className="font-medium text-gray-900 mb-1 text-xs sm:text-sm line-clamp-2">
                      {produto.titulo}
                    </h4>
                    <div className="text-xs text-gray-500 mb-2">
                      SKU: {produto.sku}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-primary">
                      {formatPrice(produto.preco)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Estoque: {produto.quantidadeEstoque}
                    </div>
                  </div>
                ))}
              </div>

              {produtosDisponiveis.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchProduto
                    ? "Nenhum produto encontrado"
                    : "Digite para buscar produtos"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
