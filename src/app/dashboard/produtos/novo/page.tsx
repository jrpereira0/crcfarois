"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Save,
  Image as ImageIcon,
  Info,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Toast } from "@/components/ui/Toast";

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  parentId?: string;
  children?: Categoria[];
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isPrincipal: boolean;
  url?: string;
  publicId?: string;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
}

interface FormData {
  titulo: string;
  sku: string;
  categoriaId: string;
  origem: string;
  aplicacao: string;
  preco: string;
  descricao: string;
  quantidadeEstoque: string;
  compraMinima: string;
  compraMaxima: string;
  precoDropshipping: string;
  altura: string;
  largura: string;
  comprimento: string;
  peso: string;
}

interface FormErrors {
  titulo?: string;
  sku?: string;
  categoriaId?: string;
  origem?: string;
  aplicacao?: string;
  preco?: string;
  descricao?: string;
  quantidadeEstoque?: string;
  compraMinima?: string;
  compraMaxima?: string;
}

export default function NovoProdutoPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    sku: "",
    categoriaId: "",
    origem: "",
    aplicacao: "",
    preco: "",
    descricao: "",
    quantidadeEstoque: "",
    compraMinima: "1",
    compraMaxima: "",
    precoDropshipping: "",
    altura: "",
    largura: "",
    comprimento: "",
    peso: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Buscar categorias para o select
  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/categorias");

      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }

      const data = await response.json();

      // Converter estrutura hierárquica para lista plana
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

      const categoriasFlat = flattenCategorias(data.categorias || []);
      setCategorias(categoriasFlat);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCategorias();
  }, []);

  const generateSKU = (titulo: string) => {
    const base = titulo
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "")
      .substring(0, 6);

    const timestamp = Date.now().toString().slice(-4);
    return `${base}${timestamp}`;
  };

  const handleTituloChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      titulo: value,
      sku: generateSKU(value),
    }));

    if (errors.titulo) {
      setErrors((prev) => ({ ...prev, titulo: undefined }));
    }
  };

  const handlePrecoChange = (value: string) => {
    // Permitir apenas números e vírgula/ponto
    const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
    setFormData((prev) => ({ ...prev, preco: numericValue }));

    if (errors.preco) {
      setErrors((prev) => ({ ...prev, preco: undefined }));
    }
  };

  const handleEstoqueChange = (value: string) => {
    // Permitir apenas números
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, quantidadeEstoque: numericValue }));

    if (errors.quantidadeEstoque) {
      setErrors((prev) => ({ ...prev, quantidadeEstoque: undefined }));
    }
  };

  const handleCompraMinimaChange = (value: string) => {
    // Permitir apenas números
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, compraMinima: numericValue }));

    if (errors.compraMinima) {
      setErrors((prev) => ({ ...prev, compraMinima: undefined }));
    }
  };

  const handleCompraMaximaChange = (value: string) => {
    // Permitir apenas números
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, compraMaxima: numericValue }));

    if (errors.compraMaxima) {
      setErrors((prev) => ({ ...prev, compraMaxima: undefined }));
    }
  };

  const handlePrecoDropshippingChange = (value: string) => {
    const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
    setFormData((prev) => ({ ...prev, precoDropshipping: numericValue }));
  };

  const handleMedidaChange = (
    field: "altura" | "largura" | "comprimento" | "peso",
    value: string
  ) => {
    const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
    setFormData((prev) => ({ ...prev, [field]: numericValue }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "Título é obrigatório";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU é obrigatório";
    }

    if (!formData.categoriaId) {
      newErrors.categoriaId = "Categoria é obrigatória";
    }

    if (!formData.preco.trim()) {
      newErrors.preco = "Preço é obrigatório";
    } else {
      const precoNum = parseFloat(formData.preco);
      if (isNaN(precoNum) || precoNum <= 0) {
        newErrors.preco = "Preço deve ser um valor válido maior que zero";
      }
    }

    if (!formData.quantidadeEstoque.trim()) {
      newErrors.quantidadeEstoque = "Quantidade em estoque é obrigatória";
    } else {
      const estoque = parseInt(formData.quantidadeEstoque);
      if (isNaN(estoque) || estoque < 0) {
        newErrors.quantidadeEstoque = "Quantidade deve ser um número válido";
      }
    }

    if (!formData.compraMinima.trim()) {
      newErrors.compraMinima = "Compra mínima é obrigatória";
    } else {
      const compraMin = parseInt(formData.compraMinima);
      if (isNaN(compraMin) || compraMin < 1) {
        newErrors.compraMinima = "Compra mínima deve ser pelo menos 1";
      }
    }

    if (formData.compraMaxima.trim()) {
      const compraMax = parseInt(formData.compraMaxima);
      const compraMin = parseInt(formData.compraMinima);
      if (isNaN(compraMax) || compraMax < 1) {
        newErrors.compraMaxima = "Compra máxima deve ser um número válido";
      } else if (!isNaN(compraMin) && compraMax < compraMin) {
        newErrors.compraMaxima =
          "Compra máxima deve ser maior que a compra mínima";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({
        type: "error",
        text: "Por favor, corrija os erros no formulário",
      });
      return;
    }

    // Verificar se há imagens sendo enviadas
    const uploadingImages = images.filter((img) => img.uploading);
    if (uploadingImages.length > 0) {
      setToast({
        type: "error",
        text: "Aguarde o upload das imagens terminar",
      });
      return;
    }

    // Verificar se há imagens com erro
    const imagesWithError = images.filter((img) => img.error);
    if (imagesWithError.length > 0) {
      setToast({
        type: "error",
        text: "Algumas imagens falharam no upload. Remova-as ou tente novamente",
      });
      return;
    }

    setLoading(true);

    try {
      // Preparar dados do produto
      const produtoData = {
        titulo: formData.titulo.trim(),
        sku: formData.sku.trim().toUpperCase(),
        categoriaId: formData.categoriaId,
        origem: formData.origem || null,
        aplicacao: formData.aplicacao || null,
        preco: formData.preco,
        descricao: formData.descricao || null,
        quantidadeEstoque: formData.quantidadeEstoque,
        compraMinima: formData.compraMinima,
        compraMaxima: formData.compraMaxima || null,
        precoDropshipping: formData.precoDropshipping || null,
        altura: formData.altura || null,
        largura: formData.largura || null,
        comprimento: formData.comprimento || null,
        peso: formData.peso || null,
        // Usar URLs do Cloudinary para imagens enviadas com sucesso
        imagens: images
          .filter((img) => img.uploaded && img.url) // Apenas imagens enviadas
          .map((img, index) => ({
            url: img.url!, // URL do Cloudinary
            publicId: img.publicId!, // Public ID do Cloudinary
            altText: formData.titulo,
            isPrincipal: img.isPrincipal,
            ordem: index + 1,
          })),
      };

      console.log("Enviando dados do produto:", produtoData);

      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao cadastrar produto");
      }

      setToast({
        type: "success",
        text: "Produto cadastrado com sucesso!",
      });

      setTimeout(() => {
        router.push("/dashboard/produtos");
      }, 1000);
    } catch (error) {
      setToast({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erro ao cadastrar produto. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCategoriaOption = (categoria: Categoria) => {
    // Calcular o nível baseado no parentId
    let level = 0;
    let currentParentId = categoria.parentId;
    while (currentParentId) {
      level++;
      const parent = categorias.find((c) => c.id === currentParentId);
      currentParentId = parent?.parentId;
    }

    const prefix = "─".repeat(level * 2);
    return (
      <option key={categoria.id} value={categoria.id}>
        {prefix} {categoria.nome}
      </option>
    );
  };

  const formatPrice = (value: string) => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Produto</h1>
          <p className="text-gray-600">
            Cadastre uma nova auto peça no catálogo
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        {/* Seção de Imagens */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Imagens do Produto
          </h2>

          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
        </div>

        {/* Seção de Informações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Informações do Produto
          </h2>

          <div className="space-y-6">
            {/* Linha 1: Título e SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleTituloChange(e.target.value)}
                  placeholder="Ex: Filtro de Óleo W712/75"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.titulo ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.titulo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.titulo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sku: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="FILTRO1234"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono ${
                    errors.sku ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.sku}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Código único do produto (gerado automaticamente)
                </p>
              </div>
            </div>

            {/* Linha 2: Categoria e Origem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoriaId: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.categoriaId ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((categoria) =>
                    renderCategoriaOption(categoria)
                  )}
                </select>
                {errors.categoriaId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.categoriaId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origem
                </label>
                <select
                  value={formData.origem}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, origem: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione a origem</option>
                  <option value="Exclusivos">Exclusivos</option>
                  <option value="Importados">Importados</option>
                  <option value="Nacionais">Nacionais</option>
                  <option value="Produção CRC">Produção CRC</option>
                </select>
              </div>
            </div>

            {/* Linha 3: Aplicação e Preço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aplicação
                </label>
                <input
                  type="text"
                  value={formData.aplicacao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      aplicacao: e.target.value,
                    }))
                  }
                  placeholder="Ex: Gol, Palio, Corsa 1.0/1.4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Veículos compatíveis com a peça
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="text"
                    value={formData.preco}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    placeholder="0,00"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.preco ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.preco && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.preco}
                  </p>
                )}
                {formData.preco && !errors.preco && (
                  <p className="mt-1 text-xs text-green-600">
                    {formatPrice(formData.preco)}
                  </p>
                )}
              </div>
            </div>

            {/* Linha 4: Quantidade em Estoque e Limites de Compra */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade em Estoque *
                </label>
                <input
                  type="text"
                  value={formData.quantidadeEstoque}
                  onChange={(e) => handleEstoqueChange(e.target.value)}
                  placeholder="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.quantidadeEstoque
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {errors.quantidadeEstoque && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.quantidadeEstoque}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Quantidade disponível no estoque
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compra Mínima *
                </label>
                <input
                  type="text"
                  value={formData.compraMinima}
                  onChange={(e) => handleCompraMinimaChange(e.target.value)}
                  placeholder="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.compraMinima ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.compraMinima && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.compraMinima}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Quantidade mínima por pedido
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compra Máxima
                </label>
                <input
                  type="text"
                  value={formData.compraMaxima}
                  onChange={(e) => handleCompraMaximaChange(e.target.value)}
                  placeholder="Opcional"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.compraMaxima ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.compraMaxima && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.compraMaxima}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Quantidade máxima por pedido (opcional)
                </p>
              </div>
            </div>

            {/* Preço Dropshipping */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Dropshipping
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço Dropshipping (R$)
                  </label>
                  <input
                    type="text"
                    value={formData.precoDropshipping}
                    onChange={(e) =>
                      handlePrecoDropshippingChange(e.target.value)
                    }
                    placeholder="Opcional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500 flex items-start gap-1">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    Valor cobrado para embalar e despachar este produto quando
                    o cliente escolher a modalidade Dropshipping. Deixe vazio
                    se não se aplicar.
                  </p>
                </div>
              </div>
            </div>

            {/* Medidas */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Medidas
              </h3>
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Medidas em centímetros e peso em quilos.</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="text"
                    value={formData.altura}
                    onChange={(e) =>
                      handleMedidaChange("altura", e.target.value)
                    }
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largura (cm)
                  </label>
                  <input
                    type="text"
                    value={formData.largura}
                    onChange={(e) =>
                      handleMedidaChange("largura", e.target.value)
                    }
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprimento (cm)
                  </label>
                  <input
                    type="text"
                    value={formData.comprimento}
                    onChange={(e) =>
                      handleMedidaChange("comprimento", e.target.value)
                    }
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="text"
                    value={formData.peso}
                    onChange={(e) => handleMedidaChange("peso", e.target.value)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Descreva as características técnicas, compatibilidade e especificações do produto..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                loading
                  ? "bg-primary/70 text-white cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Cadastrar Produto
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
