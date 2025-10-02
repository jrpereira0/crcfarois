"use client";

import { useState, useEffect, useCallback } from "react";
import { useRepresentanteCart } from "@/contexts/RepresentanteCartContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Package,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Building,
} from "lucide-react";

interface EnderecoEntrega {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default function RepresentanteCheckoutPage() {
  const { items, selectedClient, clearCart, getTotal, getItemCount } =
    useRepresentanteCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Estados do formulário
  const [tipoEntrega, setTipoEntrega] = useState<"RETIRADA" | "ENTREGA">(
    "RETIRADA"
  );
  const [formaPagamento, setFormaPagamento] = useState<string>("");
  const [condicaoPagamento, setCondicaoPagamento] = useState<string>("");
  const [condicoesDisponiveis, setCondicoesDisponiveis] = useState<string[]>(
    []
  );
  const [loadingCondicoes, setLoadingCondicoes] = useState(true);
  const [enderecoEntrega, setEnderecoEntrega] = useState<EnderecoEntrega>({
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [observacoes, setObservacoes] = useState("");
  const [frete, setFrete] = useState<number>(0);

  // Estados de loading
  const [loadingCep, setLoadingCep] = useState(false);
  const [finalizandoPedido, setFinalizandoPedido] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Redirecionar se carrinho vazio ou sem cliente selecionado
  useEffect(() => {
    if (items.length === 0) {
      router.push("/representante/carrinho");
      return;
    }

    if (!selectedClient) {
      router.push("/representante/carrinho");
      return;
    }

    // Buscar condições de pagamento do cliente selecionado
    const fetchCondicoesPagamento = async () => {
      try {
        setLoadingCondicoes(true);
        const response = await fetch(
          `/api/representante/clientes/${selectedClient.id}/condicoes-pagamento`
        );
        if (response.ok) {
          const data = await response.json();
          setCondicoesDisponiveis(data.condicoes || []);
          // Se só tem uma condição, seleciona automaticamente
          if (data.condicoes && data.condicoes.length === 1) {
            setCondicaoPagamento(data.condicoes[0]);
          } else if (data.condicoes && data.condicoes.length === 0) {
            setCondicaoPagamento("");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar condições de pagamento:", error);
      } finally {
        setLoadingCondicoes(false);
      }
    };

    fetchCondicoesPagamento();
  }, [items.length, selectedClient, router]);

  // Formatação de preço
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }, []);

  // Buscar endereço por CEP
  const buscarCep = useCallback(
    async (cep: string) => {
      const cepLimpo = cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) {
        showToast("CEP deve ter 8 dígitos", "error");
        return;
      }

      setLoadingCep(true);

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();

        if (data.erro) {
          showToast("CEP não encontrado", "error");
          return;
        }

        setEnderecoEntrega((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));

        showToast("Endereço encontrado!", "success");
      } catch (error) {
        showToast("Erro ao buscar CEP", "error");
      } finally {
        setLoadingCep(false);
      }
    },
    [showToast]
  );

  // Handler para mudança de CEP
  const handleCepChange = useCallback(
    (value: string) => {
      const cepFormatado = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);

      setEnderecoEntrega((prev) => ({ ...prev, cep: cepFormatado }));
      setShowValidationErrors(false);

      // Buscar automaticamente quando CEP estiver completo
      if (cepFormatado.length === 9) {
        buscarCep(cepFormatado);
      }
    },
    [buscarCep]
  );

  // Handler para mudança de campos de endereço
  const handleEnderecoChange = useCallback(
    (field: keyof EnderecoEntrega, value: string) => {
      setEnderecoEntrega((prev) => ({ ...prev, [field]: value }));
      setShowValidationErrors(false);
    },
    []
  );

  // Estado para input de frete (string para permitir digitação livre)
  const [freteInput, setFreteInput] = useState<string>("");

  // Handler para mudança de frete
  const handleFreteChange = (value: string) => {
    // Permitir apenas números, vírgula e ponto
    const cleanValue = value.replace(/[^\d.,]/g, "");
    
    // Atualizar o input visual
    setFreteInput(cleanValue);

    // Converter para número para cálculos
    if (cleanValue === "" || cleanValue === "0" || cleanValue === "0," || cleanValue === "0.") {
      setFrete(0);
    } else {
      // Substituir vírgula por ponto e converter
      const numericValue = parseFloat(cleanValue.replace(",", "."));
      if (!isNaN(numericValue) && numericValue >= 0) {
        setFrete(numericValue);
      }
    }
  };

  // Validar formulário e retornar erros
  const validarFormulario = useCallback(() => {
    const erros: string[] = [];

    // Validar cliente selecionado
    if (!selectedClient) {
      erros.push("Selecione um cliente para o pedido");
    }

    // Validar forma de pagamento
    if (!formaPagamento) {
      erros.push("Selecione uma forma de pagamento");
    }

    // Validar condição de pagamento (sempre obrigatória)
    if (
      condicoesDisponiveis.length > 0 &&
      (!condicaoPagamento || condicaoPagamento.trim() === "")
    ) {
      erros.push("Selecione uma condição de pagamento");
    }

    // Validar endereço se entrega
    if (tipoEntrega === "ENTREGA") {
      const { cep, endereco, numero, bairro, cidade, estado } = enderecoEntrega;
      const camposFaltando = [];

      if (!cep) camposFaltando.push("CEP");
      if (!endereco) camposFaltando.push("Endereço");
      if (!numero) camposFaltando.push("Número");
      if (!bairro) camposFaltando.push("Bairro");
      if (!cidade) camposFaltando.push("Cidade");
      if (!estado) camposFaltando.push("Estado");

      if (camposFaltando.length > 0) {
        erros.push(`Preencha os campos: ${camposFaltando.join(", ")}`);
      }
    }

    return erros;
  }, [
    selectedClient,
    formaPagamento,
    condicaoPagamento,
    condicoesDisponiveis.length,
    tipoEntrega,
    enderecoEntrega,
  ]);

  // Verificar se pode finalizar
  const podeFinalizarPedido = useCallback(() => {
    const erros = validarFormulario();
    return erros.length === 0;
  }, [validarFormulario]);

  // Finalizar pedido
  const finalizarPedido = useCallback(async () => {
    // Verificar se ainda está carregando condições
    if (loadingCondicoes) {
      showToast(
        "Aguarde o carregamento das condições de pagamento...",
        "error",
        3000
      );
      return;
    }

    const erros = validarFormulario();

    if (erros.length > 0) {
      setShowValidationErrors(true);
      erros.forEach((erro) => {
        showToast(erro, "error", 4000);
      });
      return;
    }

    setShowValidationErrors(false);
    setFinalizandoPedido(true);

    try {
      const pedidoData = {
        clienteId: selectedClient?.id,
        tipoEntrega,
        formaPagamento,
        condicaoPagamento: condicaoPagamento || condicoesDisponiveis[0] || null,
        enderecoEntrega: tipoEntrega === "ENTREGA" ? enderecoEntrega : null,
        frete: tipoEntrega === "ENTREGA" ? frete : 0,
        observacoes: observacoes.trim() || null,
        itens: items.map((item) => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
          precoUnitario: item.produto.preco,
        })),
      };

      const response = await fetch("/api/representante/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pedidoData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erro da API:", errorData);
        throw new Error(`Erro ao criar pedido: ${response.status}`);
      }

      const data = await response.json();

      // Limpar carrinho
      clearCart();

      // Mostrar sucesso
      showToast(
        `Pedido ${data.pedido.numero} criado com sucesso!`,
        "success",
        5000
      );

      // Redirecionar para detalhes do pedido
      router.push(`/representante/pedidos/${data.pedido.id}`);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      showToast("Erro ao finalizar pedido. Tente novamente.", "error", 5000);
    } finally {
      setFinalizandoPedido(false);
    }
  }, [
    loadingCondicoes,
    validarFormulario,
    selectedClient,
    tipoEntrega,
    formaPagamento,
    condicaoPagamento,
    condicoesDisponiveis,
    enderecoEntrega,
    frete,
    observacoes,
    items,
    clearCart,
    showToast,
    router,
  ]);

  // Calcular totais
  const subtotal = getTotal();
  const total = subtotal + frete;

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

  if (items.length === 0 || !selectedClient) {
    return null; // Componente será redirecionado pelo useEffect
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/representante/carrinho"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar ao Carrinho</span>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Finalizar Pedido
            </h1>
            <p className="text-gray-600">
              Escolha a forma de pagamento e entrega para{" "}
              {selectedClient.razaoSocial}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {getItemCount()} {getItemCount() === 1 ? "item" : "itens"} •{" "}
            {formatPrice(getTotal())}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de checkout */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Cliente do Pedido
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {selectedClient.razaoSocial}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCnpjCpfDisplay(selectedClient.cnpjCpf)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    <div>
                      <strong>Contato:</strong> {selectedClient.user.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedClient.user.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Forma de Pagamento
              </h2>
            </div>

            {!formaPagamento && showValidationErrors && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Selecione uma forma de pagamento
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    formaPagamento === opcao.value
                      ? "border-primary bg-primary/5"
                      : !formaPagamento && showValidationErrors
                      ? "border-red-200 bg-red-50/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="formaPagamento"
                    value={opcao.value}
                    checked={formaPagamento === opcao.value}
                    onChange={(e) => {
                      setFormaPagamento(e.target.value);
                      setShowValidationErrors(false);
                    }}
                    className="sr-only"
                  />
                  <span className="text-2xl">{opcao.icon}</span>
                  <span className="font-medium text-gray-900">
                    {opcao.label}
                  </span>
                  {formaPagamento === opcao.value && (
                    <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Condições de Pagamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Condições de Pagamento
              </h2>
            </div>

            <div className="condicoes-pagamento-container">
              {loadingCondicoes ? (
                /* Loading skeleton */
                <div className="condicoes-loading space-y-3">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                      <div className="h-12 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ) : condicoesDisponiveis.length === 0 ? (
                /* Sem condições disponíveis */
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span className="text-amber-800 font-medium">
                      Nenhuma condição de pagamento configurada para este
                      cliente
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {condicoesDisponiveis.length === 1 ? (
                    /* Uma única condição - seleção automática */
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">
                          Condição selecionada: {condicoesDisponiveis[0]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Múltiplas condições - seleção manual */
                    <div className="space-y-3">
                      {condicoesDisponiveis.map((condicao) => (
                        <label
                          key={condicao}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/30 ${
                            condicaoPagamento === condicao
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="condicaoPagamento"
                            value={condicao}
                            checked={condicaoPagamento === condicao}
                            onChange={(e) => {
                              setCondicaoPagamento(e.target.value);
                              setShowValidationErrors(false);
                            }}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  condicaoPagamento === condicao
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {condicaoPagamento === condicao && (
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
                  )}
                </>
              )}
            </div>
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
                  tipoEntrega === "RETIRADA"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="RETIRADA"
                  checked={tipoEntrega === "RETIRADA"}
                  onChange={(e) => setTipoEntrega(e.target.value as "RETIRADA")}
                  className="sr-only"
                />
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium text-gray-900">Retirada</div>
                  <div className="text-sm text-gray-500">Retirar na loja</div>
                </div>
                {tipoEntrega === "RETIRADA" && (
                  <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                )}
              </label>

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  tipoEntrega === "ENTREGA"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="tipoEntrega"
                  value="ENTREGA"
                  checked={tipoEntrega === "ENTREGA"}
                  onChange={(e) => setTipoEntrega(e.target.value as "ENTREGA")}
                  className="sr-only"
                />
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium text-gray-900">Entrega</div>
                  <div className="text-sm text-gray-500">
                    Entregar no endereço
                  </div>
                </div>
                {tipoEntrega === "ENTREGA" && (
                  <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                )}
              </label>
            </div>

            {/* Endereço de Entrega */}
            {tipoEntrega === "ENTREGA" && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Endereço de Entrega
                  </h3>
                </div>

                {/* Alerta de campos obrigatórios */}
                {showValidationErrors && tipoEntrega === "ENTREGA" && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">
                        Preencha todos os campos obrigatórios do endereço
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CEP */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={enderecoEntrega.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        placeholder="00000-000"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          showValidationErrors && !enderecoEntrega.cep
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        required
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
                      value={enderecoEntrega.endereco}
                      onChange={(e) =>
                        handleEnderecoChange("endereco", e.target.value)
                      }
                      placeholder="Rua, Avenida, etc."
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        showValidationErrors && !enderecoEntrega.endereco
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      required
                    />
                  </div>

                  {/* Número */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={enderecoEntrega.numero}
                      onChange={(e) =>
                        handleEnderecoChange("numero", e.target.value)
                      }
                      placeholder="123"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        showValidationErrors && !enderecoEntrega.numero
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      required
                    />
                  </div>

                  {/* Complemento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={enderecoEntrega.complemento}
                      onChange={(e) =>
                        handleEnderecoChange("complemento", e.target.value)
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
                      value={enderecoEntrega.bairro}
                      onChange={(e) =>
                        handleEnderecoChange("bairro", e.target.value)
                      }
                      placeholder="Nome do bairro"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        showValidationErrors && !enderecoEntrega.bairro
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      required
                    />
                  </div>

                  {/* Cidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={enderecoEntrega.cidade}
                      onChange={(e) =>
                        handleEnderecoChange("cidade", e.target.value)
                      }
                      placeholder="Nome da cidade"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        showValidationErrors && !enderecoEntrega.cidade
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      required
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={enderecoEntrega.estado}
                      onChange={(e) =>
                        handleEnderecoChange("estado", e.target.value)
                      }
                      placeholder="UF"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        showValidationErrors && !enderecoEntrega.estado
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      maxLength={2}
                      required
                    />
                  </div>

                  {/* Valor do Frete */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Frete
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        R$
                      </span>
                      <input
                        type="text"
                        value={freteInput}
                        onChange={(e) => handleFreteChange(e.target.value)}
                        placeholder="0,00"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe vazio se o frete for gratuito ou a consultar
                      {frete > 0 && (
                        <span className="font-medium text-primary ml-2">
                          = {formatPrice(frete)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Observações (opcional)
            </h3>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Alguma observação sobre o pedido..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Resumo do Pedido
            </h2>

            {/* Checklist de validação */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Status do Pedido
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {formaPagamento ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      formaPagamento ? "text-green-700" : "text-red-600"
                    }
                  >
                    Forma de pagamento
                  </span>
                  {formaPagamento && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {formaPagamento.replace("_", " ")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-700">Tipo de entrega</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {tipoEntrega === "ENTREGA" ? "Entrega" : "Retirada"}
                  </span>
                </div>

                {tipoEntrega === "ENTREGA" && (
                  <div className="flex items-center gap-2">
                    {enderecoEntrega.cep &&
                    enderecoEntrega.endereco &&
                    enderecoEntrega.numero &&
                    enderecoEntrega.bairro &&
                    enderecoEntrega.cidade &&
                    enderecoEntrega.estado ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        enderecoEntrega.cep &&
                        enderecoEntrega.endereco &&
                        enderecoEntrega.numero &&
                        enderecoEntrega.bairro &&
                        enderecoEntrega.cidade &&
                        enderecoEntrega.estado
                          ? "text-green-700"
                          : "text-red-600"
                      }
                    >
                      Endereço de entrega
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {condicoesDisponiveis.length > 0 && condicaoPagamento ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : condicoesDisponiveis.length === 0 ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      condicoesDisponiveis.length > 0 && condicaoPagamento
                        ? "text-green-700"
                        : condicoesDisponiveis.length === 0
                        ? "text-yellow-700"
                        : "text-red-600"
                    }
                  >
                    Condição de pagamento
                  </span>
                  {condicaoPagamento && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {condicaoPagamento}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de itens */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.produto.id} className="flex gap-3">
                  <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.produto.imagemPrincipal ? (
                      <Image
                        src={item.produto.imagemPrincipal}
                        alt={item.produto.titulo}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.produto.titulo}
                    </h4>
                    <div className="text-xs text-gray-500">
                      {item.quantidade}x {formatPrice(item.produto.preco)}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.produto.preco * item.quantidade)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium text-gray-900">
                  {tipoEntrega === "ENTREGA" && frete > 0
                    ? formatPrice(frete)
                    : "A consultar"}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">
                  {formatPrice(total)}
                  {tipoEntrega === "ENTREGA" && frete === 0 && (
                    <span className="text-sm text-gray-500 font-normal">
                      {" "}
                      + frete
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Botão finalizar */}
            <button
              onClick={finalizarPedido}
              disabled={finalizandoPedido || !podeFinalizarPedido()}
              className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                finalizandoPedido || !podeFinalizarPedido()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
              }`}
            >
              {finalizandoPedido ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Finalizando pedido...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Finalizar Pedido
                </>
              )}
            </button>

            {!podeFinalizarPedido() && !finalizandoPedido && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Preencha todos os campos obrigatórios
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
