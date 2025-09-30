"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Package, Save, AlertCircle, Loader2 } from "lucide-react";
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
}

interface Produto {
  id: string;
  titulo: string;
  sku: string;
  categoriaId: string;
  origem?: string;
  aplicacao?: string;
  preco: number;
  descricao?: string;
  quantidadeEstoque: number;
  compraMinima: number;
  compraMaxima?: number;
  imagemPrincipal?: string;
  imagensUrls: string[];
  cloudinaryIds: string[];
  ativo: boolean;
  categoria: {
    id: string;
    nome: string;
    slug: string;
  };
}

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const produtoId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProduto, setLoadingProduto] = useState(true);
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
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Buscar produto para edição
  const fetchProduto = async () => {
    try {
      setLoadingProduto(true);
      const response = await fetch(`/api/produtos/${produtoId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar produto");
      }

      const produto: Produto = await response.json();

      // Preencher formulário
      setFormData({
        titulo: produto.titulo,
        sku: produto.sku,
        categoriaId: produto.categoriaId,
        origem: produto.origem || "",
        aplicacao: produto.aplicacao || "",
        preco: produto.preco.toString(),
        descricao: produto.descricao || "",
        quantidadeEstoque: produto.quantidadeEstoque.toString(),
        compraMinima: produto.compraMinima.toString(),
        compraMaxima: produto.compraMaxima?.toString() || "",
      });

      // Converter imagens existentes
      if (produto.imagensUrls.length > 0) {
        const imagensExistentes: ImageFile[] = produto.imagensUrls.map(
          (url, index) => ({
            id: `existing-${index}`,
            file: new File([], `imagem-${index}.jpg`), // File dummy
            preview: url,
            url: url,
            publicId: produto.cloudinaryIds[index] || "",
            isPrincipal: url === produto.imagemPrincipal,
            uploaded: true,
            uploading: false,
          })
        );
        setImages(imagensExistentes);
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      setToast({
        type: "error",
        text: "Erro ao carregar produto",
      });
      router.push("/dashboard/produtos");
    } finally {
      setLoadingProduto(false);
    }
  };

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
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && produtoId) {
      fetchProduto();
      fetchCategorias();
    }
  }, [mounted, produtoId]);

  // Handlers para campos
  const handleTituloChange = (value: string) => {
    setFormData((prev) => ({ ...prev, titulo: value }));
    if (errors.titulo) {
      setErrors((prev) => ({ ...prev, titulo: undefined }));
    }
  };

  const handlePrecoChange = (value: string) => {
    const numericValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
    setFormData((prev) => ({ ...prev, preco: numericValue }));
    if (errors.preco) {
      setErrors((prev) => ({ ...prev, preco: undefined }));
    }
  };

  const handleEstoqueChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, quantidadeEstoque: numericValue }));
    if (errors.quantidadeEstoque) {
      setErrors((prev) => ({ ...prev, quantidadeEstoque: undefined }));
    }
  };

  const handleCompraMinimaChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, compraMinima: numericValue }));
    if (errors.compraMinima) {
      setErrors((prev) => ({ ...prev, compraMinima: undefined }));
    }
  };

  const handleCompraMaximaChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, compraMaxima: numericValue }));
    if (errors.compraMaxima) {
      setErrors((prev) => ({ ...prev, compraMaxima: undefined }));
    }
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

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
        // Usar URLs do Cloudinary para imagens enviadas com sucesso
        imagens: images
          .filter((img) => img.uploaded && img.url)
          .map((img, index) => ({
            url: img.url!,
            publicId: img.publicId!,
            altText: formData.titulo,
            isPrincipal: img.isPrincipal,
            ordem: index + 1,
          })),
      };

      const response = await fetch(`/api/produtos/${produtoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar produto");
      }

      setToast({
        type: "success",
        text: "Produto atualizado com sucesso!",
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
            : "Erro ao atualizar produto. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const renderCategoriaOption = (categoria: Categoria) => {
    // Calcular nível baseado no parentId
    let level = 0;
    let currentParentId = categoria.parentId;

    while (currentParentId && level < 10) {
      // Evitar loop infinito
      const parent = categorias.find((c) => c.id === currentParentId);
      if (parent) {
        level++;
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }

    const indent = "—".repeat(level);
    const displayName =
      level > 0 ? `${indent} ${categoria.nome}` : categoria.nome;

    return (
      <option key={categoria.id} value={categoria.id}>
        {displayName}
      </option>
    );
  };

  if (!mounted || loadingProduto) {
    return (
      <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Produto</h1>
            <p className="text-gray-600">Atualize as informações do produto</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Seção de Imagens */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Imagens do Produto
            </h2>

            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
              category="produto"
              productId={produtoId}
            />
          </div>

          {/* Seção de Informações */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Informações do Produto
            </h2>

            <div className="space-y-6">
              {/* Linha 1: Título e SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Produto *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => handleTituloChange(e.target.value)}
                    placeholder="Ex: Filtro de Ar Gol 1.0"
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
                    SKU (Código) *
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
                      setFormData((prev) => ({
                        ...prev,
                        origem: e.target.value,
                      }))
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
                <p className="mt-1 text-xs text-gray-500">
                  Informações detalhadas sobre o produto
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Atualizar Produto
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.text}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
