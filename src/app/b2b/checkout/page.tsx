"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
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
  Upload,
  X,
  File,
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

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Estados do formulário
  const [tipoEntrega, setTipoEntrega] = useState<"RETIRADA" | "ENTREGA" | "DROPSHIPPING">(
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
  
  // Estados para Dropshipping
  const [etiquetaFile, setEtiquetaFile] = useState<File | null>(null);
  const [etiquetaPreview, setEtiquetaPreview] = useState<string | null>(null);
  const [uploadingEtiqueta, setUploadingEtiqueta] = useState(false);
  const [etiquetaData, setEtiquetaData] = useState<{
    url: string;
    publicId: string;
    originalName: string;
  } | null>(null);

  // Estados de loading
  const [loadingCep, setLoadingCep] = useState(false);
  const [finalizandoPedido, setFinalizandoPedido] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Redirecionar se carrinho vazio e buscar condições
  useEffect(() => {
    if (state.items.length === 0) {
      router.push("/b2b/carrinho");
      return;
    }

    // Buscar condições de pagamento do cliente
    const fetchCondicoesPagamento = async () => {
      try {
        setLoadingCondicoes(true);
        const response = await fetch("/api/b2b/cliente/condicoes-pagamento");
        if (response.ok) {
          const data = await response.json();
          setCondicoesDisponiveis(data.condicoes || []);
          
          // Priorizar "À Vista" como padrão
          if (data.condicoes && data.condicoes.length > 0) {
            const aVista = data.condicoes.find((c: string) => c === "À Vista");
            if (aVista) {
              setCondicaoPagamento(aVista);
            } else {
              // Se não tem "À Vista", seleciona a primeira
              setCondicaoPagamento(data.condicoes[0]);
            }
          } else {
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
  }, [state.items.length, router]);

  // Taxa de dropshipping (soma do preço de dropshipping de cada produto * quantidade)
  const taxaDropshipping =
    tipoEntrega === "DROPSHIPPING"
      ? state.items.reduce(
          (sum, item) => sum + (item.precoDropshipping || 0) * item.quantidade,
          0
        )
      : 0;

  const totalComDropshipping = state.total + taxaDropshipping;

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
      setShowValidationErrors(false); // Reset validation quando user digita

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
      setShowValidationErrors(false); // Reset validation quando user digita
    },
    []
  );

  // Handler para seleção de arquivo de etiqueta
  const handleEtiquetaFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validar tipo de arquivo
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      
      if (!allowedTypes.includes(file.type)) {
        showToast(
          "Tipo de arquivo não permitido. Use PDF ou imagens (JPG, PNG, WEBP)",
          "error"
        );
        return;
      }

      // Validar tamanho (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast("Arquivo muito grande. Tamanho máximo: 10MB", "error");
        return;
      }

      setEtiquetaFile(file);
      setShowValidationErrors(false);

      // Criar preview se for imagem
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEtiquetaPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setEtiquetaPreview(null);
      }

      // Fazer upload automaticamente
      await uploadEtiqueta(file);
    },
    [showToast]
  );

  // Função para fazer upload da etiqueta
  const uploadEtiqueta = useCallback(
    async (file: File) => {
      setUploadingEtiqueta(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/etiqueta", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erro ao fazer upload");
        }

        const data = await response.json();

        setEtiquetaData({
          url: data.url,
          publicId: data.publicId,
          originalName: data.originalName,
        });

        showToast("Etiqueta enviada com sucesso!", "success");
      } catch (error: any) {
        console.error("Erro ao fazer upload da etiqueta:", error);
        showToast(error.message || "Erro ao fazer upload da etiqueta", "error");
        setEtiquetaFile(null);
        setEtiquetaPreview(null);
      } finally {
        setUploadingEtiqueta(false);
      }
    },
    [showToast]
  );

  // Função para remover etiqueta
  const removeEtiqueta = useCallback(async () => {
    if (etiquetaData?.publicId) {
      try {
        await fetch(`/api/upload/etiqueta?publicId=${etiquetaData.publicId}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Erro ao deletar etiqueta:", error);
      }
    }

    setEtiquetaFile(null);
    setEtiquetaPreview(null);
    setEtiquetaData(null);
  }, [etiquetaData]);

  // Validar formulário e retornar erros
  const validarFormulario = useCallback(() => {
    const erros: string[] = [];

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

    // Validar etiqueta se dropshipping
    if (tipoEntrega === "DROPSHIPPING") {
      if (!etiquetaData || !etiquetaData.url) {
        erros.push("Anexe a etiqueta de entrega para dropshipping");
      }
    }

    return erros;
  }, [
    formaPagamento,
    condicaoPagamento,
    condicoesDisponiveis.length,
    tipoEntrega,
    enderecoEntrega,
    etiquetaData,
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
        tipoEntrega,
        formaPagamento,
        condicaoPagamento: condicaoPagamento || condicoesDisponiveis[0] || null,
        enderecoEntrega: tipoEntrega === "ENTREGA" ? enderecoEntrega : null,
        etiquetaDropshipping: tipoEntrega === "DROPSHIPPING" && etiquetaData ? {
          url: etiquetaData.url,
          publicId: etiquetaData.publicId,
          originalName: etiquetaData.originalName,
        } : null,
        observacoes: observacoes.trim() || null,
        itens: state.items.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
        })),
      };

      const response = await fetch("/api/pedidos", {
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
      await clearCart();

      showToast("Pedido realizado com sucesso!", "success");

      // Redirecionar para página de pedidos
      router.push(`/b2b/pedidos/${data.pedido.id}`);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      showToast("Erro ao finalizar pedido. Tente novamente.", "error");
    } finally {
      setFinalizandoPedido(false);
    }
  }, [
    loadingCondicoes,
    validarFormulario,
    tipoEntrega,
    formaPagamento,
    condicaoPagamento,
    condicoesDisponiveis,
    enderecoEntrega,
    observacoes,
    state.items,
    clearCart,
    showToast,
    router,
  ]);

  if (state.items.length === 0) {
    return null; // Componente será redirecionado pelo useEffect
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/b2b/carrinho"
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
              Escolha a forma de pagamento e entrega
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {state.totalItems} {state.totalItems === 1 ? "item" : "itens"} •{" "}
            {formatPrice(totalComDropshipping)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Formulário de checkout */}
        <div className="lg:col-span-2 space-y-6">
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
                      setShowValidationErrors(false); // Reset validation quando user seleciona
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

            {loadingCondicoes ? (
              /* Loading skeleton */
              <div className="space-y-3">
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
                    Nenhuma condição de pagamento configurada para sua conta
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

          {/* Tipo de Entrega */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Tipo de Entrega
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
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
                    onChange={(e) => {
                      e.preventDefault();
                      setTipoEntrega("RETIRADA");
                    }}
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
                    onChange={(e) => {
                      e.preventDefault();
                      setTipoEntrega("ENTREGA");
                    }}
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

              <label
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  tipoEntrega === "DROPSHIPPING"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="DROPSHIPPING"
                    checked={tipoEntrega === "DROPSHIPPING"}
                    onChange={(e) => {
                      e.preventDefault();
                      setTipoEntrega("DROPSHIPPING");
                    }}
                    className="sr-only"
                  />
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-medium text-gray-900">Dropshipping</div>
                  <div className="text-sm text-gray-500">
                    Envio direto
                  </div>
                </div>
                {tipoEntrega === "DROPSHIPPING" && (
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
                </div>
              </div>
            )}

            {/* Upload de Etiqueta Dropshipping */}
            {tipoEntrega === "DROPSHIPPING" && (
              <div className="border-t border-gray-200 pt-6">
                {taxaDropshipping > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800 text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>
                        Será cobrada uma taxa adicional de{" "}
                        <span className="font-semibold">
                          {formatPrice(taxaDropshipping)}
                        </span>{" "}
                        para embalagem e despacho dos produtos selecionados.
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <Upload className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Etiqueta de Entrega *
                  </h3>
                </div>

                {/* Alerta de campo obrigatório */}
                {showValidationErrors && tipoEntrega === "DROPSHIPPING" && !etiquetaData && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">
                        Anexe a etiqueta de entrega para prosseguir
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Área de upload */}
                  {!etiquetaFile && !etiquetaData && (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border-gray-300 hover:border-primary">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-700">
                          <span className="font-semibold">Clique para anexar</span> ou arraste
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, PNG ou WEBP (máx. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={handleEtiquetaFileChange}
                      />
                    </label>
                  )}

                  {/* Loading */}
                  {uploadingEtiqueta && (
                    <div className="flex items-center justify-center gap-3 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-blue-800 font-medium">
                        Enviando etiqueta...
                      </span>
                    </div>
                  )}

                  {/* Arquivo anexado */}
                  {etiquetaData && etiquetaFile && !uploadingEtiqueta && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-green-800 font-medium mb-1">
                            Etiqueta anexada com sucesso!
                          </p>
                          <div className="flex items-center gap-2 text-sm text-green-700">
                            <File className="h-4 w-4" />
                            <span className="truncate">{etiquetaFile.name}</span>
                            <span className="text-xs text-green-600">
                              ({(etiquetaFile.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          
                          {/* Preview se for imagem */}
                          {etiquetaPreview && (
                            <div className="mt-3">
                              <Image
                                src={etiquetaPreview}
                                alt="Preview da etiqueta"
                                width={200}
                                height={200}
                                className="rounded-lg border border-green-200"
                              />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={removeEtiqueta}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                          title="Remover etiqueta"
                        >
                          <X className="h-5 w-5 text-green-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2 text-sm text-blue-800">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>
                      Para pedidos de dropshipping, anexe a etiqueta de envio com o endereço de entrega do seu cliente.
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-6">
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
              </div>
            </div>

            {/* Lista de itens */}
            <div className="space-y-3 mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imagemPrincipal ? (
                      <Image
                        src={item.imagemPrincipal}
                        alt={item.titulo}
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
                      {item.titulo}
                    </h4>
                    <div className="text-xs text-gray-500">
                      {item.quantidade}x {formatPrice(item.preco)}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(state.total)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium text-gray-900">A consultar</span>
              </div>
              {tipoEntrega === "DROPSHIPPING" && taxaDropshipping > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Taxa Dropshipping</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(taxaDropshipping)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">
                  {formatPrice(totalComDropshipping)}
                </span>
              </div>
            </div>

            {/* Alertas de validação */}
            {!podeFinalizarPedido() && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-2">
                      Para finalizar o pedido, você precisa:
                    </p>
                    <ul className="space-y-1 text-xs">
                      {!formaPagamento && (
                        <li>• Selecionar uma forma de pagamento</li>
                      )}
                      {condicoesDisponiveis.length > 0 &&
                        (!condicaoPagamento ||
                          condicaoPagamento.trim() === "") && (
                          <li>• Selecionar uma condição de pagamento</li>
                        )}
                      {!tipoEntrega && (
                        <li>• Selecionar um método de entrega</li>
                      )}
                      {tipoEntrega === "ENTREGA" && (
                        <>
                          {!enderecoEntrega.cep && <li>• Informar o CEP</li>}
                          {!enderecoEntrega.endereco && (
                            <li>• Informar o endereço</li>
                          )}
                          {!enderecoEntrega.numero && (
                            <li>• Informar o número</li>
                          )}
                          {!enderecoEntrega.bairro && (
                            <li>• Informar o bairro</li>
                          )}
                          {!enderecoEntrega.cidade && (
                            <li>• Informar a cidade</li>
                          )}
                          {!enderecoEntrega.estado && (
                            <li>• Informar o estado</li>
                          )}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Botão finalizar */}
            <button
              onClick={finalizarPedido}
              disabled={finalizandoPedido || !podeFinalizarPedido()}
              className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium shadow-lg disabled:cursor-not-allowed ${
                podeFinalizarPedido()
                  ? "bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {finalizandoPedido ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Finalizando...
                </>
              ) : podeFinalizarPedido() ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Finalizar Pedido
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  Complete as informações
                </>
              )}
            </button>

            {/* Informações importantes */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Importante:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Pedido sujeito à confirmação</li>
                    <li>• Prazo de entrega e frete serão informados</li>
                    <li>• Você receberá atualizações por e-mail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
