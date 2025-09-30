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
    categoria?: {
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
  frete: number;
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
  // Cliente
  user: {
    id: string;
    name: string;
    email: string;
    cliente?: {
      razaoSocial: string;
      cnpjCpf: string;
    };
  };
}

export default function RepresentanteEditarPedidoPage() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);

  const pedidoId = params.id as string;

  // Formatação de preço
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }, []);

  // Formatação de CNPJ/CPF
  const formatCnpjCpfDisplay = (cnpjCpf: string) => {
    const numbers = cnpjCpf.replace(/\D/g, "");
    if (numbers.length === 14) {
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    } else if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cnpjCpf;
  };

  // Buscar pedido
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
        frete: Number(pedido.frete) || 0,
        enderecoEntrega: pedido.enderecoEntrega || "",
        numeroEntrega: pedido.numeroEntrega || "",
        complementoEntrega: pedido.complementoEntrega || "",
        bairroEntrega: pedido.bairroEntrega || "",
        cidadeEntrega: pedido.cidadeEntrega || "",
        estadoEntrega: pedido.estadoEntrega || "",
        cepEntrega: pedido.cepEntrega || "",
        itens: pedido.itens.map((item: any) => ({
          ...item,
          quantidade: Number(item.quantidade),
          precoUnitario: Number(item.precoUnitario),
          subtotal: Number(item.precoUnitario) * Number(item.quantidade),
        })),
        user: pedido.user,
      });

      // Buscar condições de pagamento do cliente
      if (pedido.user?.cliente) {
        try {
          // Buscar o cliente na tabela de relacionamentos do representante
          const clientesResponse = await fetch("/api/representante/clientes");
          if (clientesResponse.ok) {
            const clientesData = await clientesResponse.json();
            const cliente = clientesData.clientes?.find(
              (c: any) => c.user.id === pedido.user.id
            );

            if (cliente) {
              const condicoesResponse = await fetch(
                `/api/representante/clientes/${cliente.id}/condicoes-pagamento`
              );
              if (condicoesResponse.ok) {
                const condicoesData = await condicoesResponse.json();
                setCondicoesDisponiveis(condicoesData.condicoes || []);
              }
            }
          }
        } catch (error) {
          console.error("Erro ao buscar condições de pagamento:", error);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  // Buscar produtos disponíveis
  const fetchProdutos = useCallback(async () => {
    try {
      const response = await fetch("/api/representante/produtos?limit=100");
      if (response.ok) {
        const data = await response.json();
        setProdutosDisponiveis(data.produtos || []);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }, []);

  // Buscar CEP
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
          setForm({
            ...form,
            enderecoEntrega: data.logradouro || "",
            bairroEntrega: data.bairro || "",
            cidadeEntrega: data.localidade || "",
            estadoEntrega: data.uf || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCep(false);
      }
    },
    [form]
  );

  // Handler para mudança de CEP
  const handleCepChange = useCallback(
    (value: string) => {
      if (!form) return;

      const cepFormatado = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);

      setForm({ ...form, cepEntrega: cepFormatado });

      if (cepFormatado.length === 9) {
        buscarCep(cepFormatado);
      }
    },
    [form, buscarCep]
  );

  // Estado para controlar o valor do input de frete
  const [freteInput, setFreteInput] = useState("");
  const [freteInitialized, setFreteInitialized] = useState(false);

  // Inicializar freteInput apenas uma vez quando o form carregar
  useEffect(() => {
    if (form && !freteInitialized) {
      if (form.frete > 0) {
        setFreteInput(form.frete.toString().replace(".", ","));
      } else {
        setFreteInput("");
      }
      setFreteInitialized(true);
    }
  }, [form, freteInitialized]);

  // Handler para mudança de frete
  const handleFreteChange = (value: string) => {
    if (!form) return;

    // Permitir apenas números, vírgula e ponto, mas manter a formatação
    let cleanValue = value.replace(/[^\d.,]/g, "");

    // Garantir que só tenha uma vírgula ou ponto
    const commaCount = (cleanValue.match(/,/g) || []).length;
    const dotCount = (cleanValue.match(/\./g) || []).length;

    if (commaCount > 1) {
      // Se tem mais de uma vírgula, manter só a primeira
      const firstCommaIndex = cleanValue.indexOf(",");
      cleanValue =
        cleanValue.substring(0, firstCommaIndex + 1) +
        cleanValue.substring(firstCommaIndex + 1).replace(/,/g, "");
    }

    if (dotCount > 1) {
      // Se tem mais de um ponto, manter só o primeiro
      const firstDotIndex = cleanValue.indexOf(".");
      cleanValue =
        cleanValue.substring(0, firstDotIndex + 1) +
        cleanValue.substring(firstDotIndex + 1).replace(/\./g, "");
    }

    // Atualizar o estado do input (mostra exatamente o que o usuário digitou)
    setFreteInput(cleanValue);

    // Se estiver vazio, definir frete como 0
    if (
      cleanValue === "" ||
      cleanValue === "0" ||
      cleanValue === "0,00" ||
      cleanValue === "0.00"
    ) {
      setForm({ ...form, frete: 0 });
      return;
    }

    // Converter vírgula para ponto para parseFloat
    const numericValue = parseFloat(cleanValue.replace(",", "."));

    if (!isNaN(numericValue) && numericValue >= 0) {
      setForm({ ...form, frete: numericValue });
    }
  };

  // Adicionar produto ao pedido
  const adicionarProduto = (produto: ProdutoDisponivel) => {
    if (!form) return;

    const itemExistente = form.itens.find(
      (item) => item.produtoId === produto.id
    );

    if (itemExistente) {
      // Aumentar quantidade - usar preço do sistema
      const novosItens = form.itens.map((item) =>
        item.produtoId === produto.id
          ? {
              ...item,
              quantidade: item.quantidade + 1,
              precoUnitario: Number(produto.preco), // Garantir que seja número
              subtotal: Number(produto.preco) * (item.quantidade + 1),
            }
          : item
      );
      setForm({ ...form, itens: novosItens });
    } else {
      // Adicionar novo item
      const novoItem: ItemPedido = {
        id: `temp-${Date.now()}`,
        produtoId: produto.id,
        quantidade: 1,
        precoUnitario: Number(produto.preco),
        subtotal: Number(produto.preco),
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

      setForm({ ...form, itens: [...form.itens, novoItem] });
    }

    setShowAddProduct(false);
    setSearchTerm("");
  };

  // Atualizar quantidade do item
  const atualizarQuantidade = (itemId: string, novaQuantidade: number) => {
    if (!form || novaQuantidade < 1) return;

    const novosItens = form.itens.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantidade: novaQuantidade,
            precoUnitario: Number(item.produto.preco), // Garantir que seja número
            subtotal: Number(item.produto.preco) * novaQuantidade,
          }
        : item
    );

    setForm({ ...form, itens: novosItens });
  };

  // Remover item do pedido
  const removerItem = (itemId: string) => {
    if (!form) return;

    const novosItens = form.itens.filter((item) => item.id !== itemId);
    setForm({ ...form, itens: novosItens });
  };

  // Calcular totais
  const calcularTotais = useCallback(() => {
    if (!form) return { subtotal: 0, total: 0 };

    const subtotal = form.itens.reduce((sum, item) => {
      // Garantir que os valores sejam números
      const itemSubtotal =
        typeof item.subtotal === "number"
          ? item.subtotal
          : parseFloat(item.subtotal) || 0;
      return sum + itemSubtotal;
    }, 0);

    const freteValue =
      typeof form.frete === "number" ? form.frete : parseFloat(form.frete) || 0;
    const total = subtotal + freteValue;

    return { subtotal, total };
  }, [form]);

  // Salvar pedido
  const salvarPedido = async () => {
    if (!form) return;

    try {
      setSaving(true);

      const { subtotal, total } = calcularTotais();

      const dadosAtualizacao = {
        tipoEntrega: form.tipoEntrega,
        formaPagamento: form.formaPagamento,
        condicaoPagamento: form.condicaoPagamento || null,
        frete: Number(form.frete) || 0,
        observacoes: form.observacoes || null,
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
        itens: form.itens
          .map((item) => ({
            produtoId: item.produtoId || item.produto?.id,
            quantidade: Number(item.quantidade) || 1,
          }))
          .filter((item) => item.produtoId),
      };

      const response = await fetch(`/api/representante/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosAtualizacao),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar pedido");
      }

      router.push(`/representante/pedidos/${pedidoId}`);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
    } finally {
      setSaving(false);
    }
  };

  // Filtrar produtos para busca
  const produtosFiltrados = produtosDisponiveis.filter(
    (produto) =>
      produto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPedido();
    fetchProdutos();
  }, [fetchPedido, fetchProdutos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Pedido não encontrado
        </h3>
        <Link
          href="/representante/pedidos"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Pedidos
        </Link>
      </div>
    );
  }

  const { subtotal, total } = calcularTotais();

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
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
              Editar Pedido #{form.numero}
            </h1>
            <p className="text-gray-600">
              Cliente: {form.user.cliente?.razaoSocial || form.user.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={salvarPedido}
              disabled={saving || form.itens.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                saving || form.itens.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-full">
        {/* Formulário principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Informações do Cliente
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {form.user.cliente?.razaoSocial || form.user.name}
                  </div>
                  {form.user.cliente?.cnpjCpf && (
                    <div className="text-sm text-gray-600">
                      {formatCnpjCpfDisplay(form.user.cliente.cnpjCpf)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    <div>
                      <strong>Contato:</strong> {form.user.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {form.user.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Itens do Pedido
                </h2>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Adicionar Produto
              </button>
            </div>

            {form.itens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum item no pedido</p>
              </div>
            ) : (
              <div className="space-y-4">
                {form.itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      {item.produto.imagemPrincipal ? (
                        <Image
                          src={item.produto.imagemPrincipal}
                          alt={item.produto.titulo}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.produto.titulo}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            SKU: {item.produto.sku}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.produto.categoria?.nome || "Sem categoria"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.precoUnitario)}
                          </div>
                          <div className="text-xs text-gray-500">
                            por unidade
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          atualizarQuantidade(item.id, item.quantidade - 1)
                        }
                        disabled={item.quantidade <= 1}
                        className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() =>
                          atualizarQuantidade(item.id, item.quantidade + 1)
                        }
                        className="p-1 rounded-lg hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </div>
                    </div>

                    <button
                      onClick={() => removerItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Forma de Pagamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Forma de Pagamento
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
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
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                      setForm({ ...form, formaPagamento: e.target.value })
                    }
                    className="sr-only"
                  />
                  <span className="text-2xl">{opcao.icon}</span>
                  <span className="font-medium text-gray-900">
                    {opcao.label}
                  </span>
                  {form.formaPagamento === opcao.value && (
                    <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                  )}
                </label>
              ))}
            </div>

            {/* Condições de Pagamento */}
            {condicoesDisponiveis.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Condições de Pagamento
                </h3>
                <div className="space-y-2">
                  {condicoesDisponiveis.map((condicao) => (
                    <label
                      key={condicao}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        form.condicaoPagamento === condicao
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="condicaoPagamento"
                        value={condicao}
                        checked={form.condicaoPagamento === condicao}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            condicaoPagamento: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              form.condicaoPagamento === condicao
                                ? "border-primary bg-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {form.condicaoPagamento === condicao && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {condicao}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tipo de Entrega */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Tipo de Entrega
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                    setForm({
                      ...form,
                      tipoEntrega: e.target.value as "RETIRADA",
                    })
                  }
                  className="sr-only"
                />
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium text-gray-900">Retirada</div>
                  <div className="text-sm text-gray-500">Retirar na loja</div>
                </div>
                {form.tipoEntrega === "RETIRADA" && (
                  <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                )}
              </label>

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                    setForm({
                      ...form,
                      tipoEntrega: e.target.value as "ENTREGA",
                    })
                  }
                  className="sr-only"
                />
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium text-gray-900">Entrega</div>
                  <div className="text-sm text-gray-500">
                    Entregar no endereço
                  </div>
                </div>
                {form.tipoEntrega === "ENTREGA" && (
                  <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                )}
              </label>
            </div>

            {/* Endereço de Entrega */}
            {form.tipoEntrega === "ENTREGA" && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Endereço de Entrega
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CEP */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.cepEntrega}
                        onChange={(e) => handleCepChange(e.target.value)}
                        placeholder="00000-000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {loadingCep && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço *
                    </label>
                    <input
                      type="text"
                      value={form.enderecoEntrega}
                      onChange={(e) =>
                        setForm({ ...form, enderecoEntrega: e.target.value })
                      }
                      placeholder="Rua, Avenida, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Número */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={form.numeroEntrega}
                      onChange={(e) =>
                        setForm({ ...form, numeroEntrega: e.target.value })
                      }
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Complemento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={form.complementoEntrega}
                      onChange={(e) =>
                        setForm({ ...form, complementoEntrega: e.target.value })
                      }
                      placeholder="Apto, Casa, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Bairro */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={form.bairroEntrega}
                      onChange={(e) =>
                        setForm({ ...form, bairroEntrega: e.target.value })
                      }
                      placeholder="Nome do bairro"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={form.cidadeEntrega}
                      onChange={(e) =>
                        setForm({ ...form, cidadeEntrega: e.target.value })
                      }
                      placeholder="Nome da cidade"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={form.estadoEntrega}
                      onChange={(e) =>
                        setForm({ ...form, estadoEntrega: e.target.value })
                      }
                      placeholder="UF"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={2}
                    />
                  </div>

                  {/* Valor do Frete */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Frete
                    </label>
                    <input
                      type="text"
                      value={freteInput}
                      onChange={(e) => handleFreteChange(e.target.value)}
                      placeholder="0,00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe vazio se o frete for gratuito ou a consultar
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Observações
              </h2>
            </div>
            <textarea
              value={form.observacoes}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
              placeholder="Observações sobre o pedido..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Sidebar com resumo */}
        <div className="space-y-6">
          {/* Resumo do Pedido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Resumo do Pedido
            </h2>

            {/* Totais */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium text-gray-900">
                  {form.tipoEntrega === "ENTREGA" && form.frete > 0
                    ? formatPrice(form.frete)
                    : "A consultar"}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-200 pt-3">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Status do pedido */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Itens no Pedido
              </h3>
              <div className="text-2xl font-bold text-primary">
                {form.itens.length}
              </div>
              <div className="text-sm text-gray-500">
                {form.itens.length === 1 ? "produto" : "produtos"}
              </div>
            </div>

            {/* Botão salvar */}
            <button
              onClick={salvarPedido}
              disabled={saving || form.itens.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                saving || form.itens.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>

            {form.itens.length === 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Adicione pelo menos um item ao pedido
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para adicionar produto */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Adicionar Produto
              </h3>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setSearchTerm("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Busca */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos por nome ou SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Lista de produtos */}
              <div className="max-h-96 overflow-y-auto">
                {produtosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhum produto encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {produtosFiltrados.map((produto) => (
                      <div
                        key={produto.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                        onClick={() => adicionarProduto(produto)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            {produto.imagemPrincipal ? (
                              <Image
                                src={produto.imagemPrincipal}
                                alt={produto.titulo}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-300" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {produto.titulo}
                            </h4>
                            <p className="text-sm text-gray-500">
                              SKU: {produto.sku}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-semibold text-primary">
                                {formatPrice(produto.preco)}
                              </span>
                              <span className="text-xs text-gray-500">
                                Estoque: {produto.quantidadeEstoque}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
