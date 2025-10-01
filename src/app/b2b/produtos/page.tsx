"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  ShoppingCart,
  Eye,
  Plus,
  Minus,
  X,
  CheckCircle,
  AlertCircle,
  Tag,
  Truck,
  Calendar,
  ChevronDown,
  FileText,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/contexts/ToastContext";

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
  imagemPrincipal?: string;
  imagensUrls: string[];
  cloudinaryIds: string[];
  createdAt: string;
}

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  children?: Categoria[];
}

export default function ProdutosB2BPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());

  const PRODUCTS_PER_PAGE = 20;
  const { addItem } = useCart();
  const { showToast } = useToast();

  const origins = ["Exclusivos", "Importados", "Nacionais", "Produção CRC"];

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, []);

  const fetchProdutos = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory) params.set("categoria", selectedCategory);
      if (selectedOrigin) params.set("origem", selectedOrigin);
      params.set("page", page.toString());
      params.set("limit", PRODUCTS_PER_PAGE.toString());

      const response = await fetch(`/api/b2b/produtos?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        const newProdutos = data.produtos || [];

        if (append && page > 1) {
          setProdutos((prev) => [...prev, ...newProdutos]);
          setCurrentPage(page);
        } else {
          setProdutos(newProdutos);
          setCurrentPage(1);
        }

        // Verificar se há mais produtos usando a resposta da API
        setHasMore(data.pagination?.page < data.pagination?.pages || false);

        // Inicializar quantidades com compra mínima apenas para novos produtos
        const initialQuantities: { [key: string]: number } = {};
        newProdutos.forEach((produto: Produto) => {
          initialQuantities[produto.id] = produto.compraMinima;
        });

        if (append) {
          setQuantities((prev) => ({ ...prev, ...initialQuantities }));
        } else {
          setQuantities(initialQuantities);
        }
      } else {
        console.error(
          "Erro na resposta da API:",
          response.status,
          response.statusText
        );
        if (!append) setProdutos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      if (!append) setProdutos([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/b2b/categorias");
      if (response.ok) {
        const data = await response.json();
        setCategorias(data.categorias || []);
      } else {
        console.error(
          "Erro na resposta da API de categorias:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

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

  // Busca em tempo real com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProdutos();
    }, 500); // 500ms de delay para evitar muitas requisições

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedOrigin]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProdutos(1, false);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchProdutos(1, false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedOrigin("");
    setCurrentPage(1);
    setTimeout(() => fetchProdutos(1, false), 100);
  };

  const loadMoreProducts = () => {
    if (hasMore && !loadingMore) {
      fetchProdutos(currentPage + 1, true);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => {
      const produto = produtos.find((p) => p.id === productId);
      if (!produto) return prev;

      const currentQty = prev[productId] || produto.compraMinima;
      const newQty = Math.max(
        produto.compraMinima,
        Math.min(
          produto.compraMaxima || produto.quantidadeEstoque,
          currentQty + change
        )
      );

      return { ...prev, [productId]: newQty };
    });
  };

  const openModal = (produto: Produto) => {
    setSelectedProduct(produto);
    setSelectedImageIndex(0); // Sempre começar com a primeira imagem
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
    setSelectedImageIndex(0);
  };

  // Função para obter todas as imagens do produto
  const getAllImages = (produto: Produto): string[] => {
    const images: string[] = [];

    // Adicionar imagem principal se existir
    if (produto.imagemPrincipal && produto.imagemPrincipal.trim() !== "") {
      images.push(produto.imagemPrincipal);
    }

    // Adicionar imagens secundárias se existirem
    if (produto.imagensUrls && produto.imagensUrls.length > 0) {
      produto.imagensUrls.forEach((url) => {
        if (url && url.trim() !== "" && !images.includes(url)) {
          images.push(url);
        }
      });
    }

    return images;
  };

  const handleAddToCart = async (produto: Produto) => {
    const quantity = quantities[produto.id] || produto.compraMinima;

    setAddingToCart(produto.id);

    try {
      // Adicionar ao carrinho usando o contexto
      await addItem(produto, quantity);

      // Mostrar toast especial para carrinho
      showToast(
        `${produto.titulo} adicionado ao carrinho`,
        "cart",
        4000, // 4 segundos para dar tempo de interagir
        {
          title: produto.titulo,
          image: produto.imagemPrincipal || produto.imagensUrls[0],
          quantity,
        }
      );

      // Marcar como recentemente adicionado para animação
      setRecentlyAdded((prev) => new Set(prev).add(produto.id));
      setTimeout(() => {
        setRecentlyAdded((prev) => {
          const newSet = new Set(prev);
          newSet.delete(produto.id);
          return newSet;
        });
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      // Mostrar mensagem de erro específica ao usuário
      showToast(
        error.message || "Erro ao adicionar produto ao carrinho",
        "error"
      );
    } finally {
      setAddingToCart(null);
    }
  };

  const categoriasFlat = flattenCategorias(categorias);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-600">
              Encontre as melhores peças automotivas para seu negócio
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {produtos.length} produto{produtos.length !== 1 ? "s" : ""}{" "}
            encontrado{produtos.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Barra de Filtros Superior */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Produtos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome ou SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categoriasFlat.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Origem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origem
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => {
                  setSelectedOrigin(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Todas as origens</option>
                {origins.map((origin) => (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão de Limpar Filtros */}
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou termos de busca
            </p>
            <button
              onClick={clearFilters}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="produto-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  {/* Imagem do Produto */}
                  <div className="produto-card-image relative w-full bg-white border-b border-gray-100">
                    {produto.imagemPrincipal &&
                    produto.imagemPrincipal.trim() !== "" ? (
                      <Image
                        src={produto.imagemPrincipal}
                        alt={produto.titulo}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={false}
                      />
                    ) : produto.imagensUrls &&
                      produto.imagensUrls.length > 0 &&
                      produto.imagensUrls[0] &&
                      produto.imagensUrls[0].trim() !== "" ? (
                      <Image
                        src={produto.imagensUrls[0]}
                        alt={produto.titulo}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <Package className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                          <span className="text-sm text-gray-400">
                            Sem imagem
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Badge de Estoque */}
                    <div className="absolute top-2 right-2">
                      {produto.quantidadeEstoque > 0 ? (
                        <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <CheckCircle className="h-3 w-3" />
                          Disponível
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <AlertCircle className="h-3 w-3" />
                          Indisponível
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="produto-card-content">
                    {/* Header com SKU e Origem */}
                    <div className="produto-card-header flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {produto.sku}
                      </span>
                      {produto.origem ? (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {produto.origem}
                        </span>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    {/* Título e Categoria */}
                    <div className="produto-card-title-section">
                      <h3 className="produto-card-title text-lg font-semibold text-gray-900 line-clamp-2 leading-tight overflow-hidden flex items-start">
                        {produto.titulo}
                      </h3>
                      <p className="produto-card-category text-sm text-gray-600 flex items-center">
                        {produto.categoria.nome}
                      </p>
                    </div>

                    {/* Preço */}
                    <div className="produto-card-price flex items-center">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(produto.preco)}
                      </span>
                    </div>

                    {/* Ações - Sempre na parte inferior */}
                    <div className="produto-card-actions space-y-3">
                      {/* Ficha Técnica */}
                      <button
                        onClick={() => openModal(produto)}
                        className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Ficha Técnica
                      </button>

                      {/* Compra */}
                      {produto.quantidadeEstoque > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                            <button
                              onClick={() => updateQuantity(produto.id, -1)}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                              disabled={
                                quantities[produto.id] <= produto.compraMinima
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-2 min-w-[3rem] text-center font-medium border-l border-r border-gray-300">
                              {quantities[produto.id] || produto.compraMinima}
                            </span>
                            <button
                              onClick={() => updateQuantity(produto.id, 1)}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                              disabled={
                                quantities[produto.id] >=
                                (produto.compraMaxima ||
                                  produto.quantidadeEstoque)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(produto)}
                            disabled={addingToCart === produto.id}
                            className={`flex-1 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-sm disabled:cursor-not-allowed ${
                              recentlyAdded.has(produto.id)
                                ? "bg-green-500 text-white transform scale-105"
                                : addingToCart === produto.id
                                ? "bg-primary/80 text-white opacity-75"
                                : "bg-primary text-white hover:bg-primary/90"
                            }`}
                          >
                            {addingToCart === produto.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Adicionando...
                              </>
                            ) : recentlyAdded.has(produto.id) ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Adicionado!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4" />
                                Comprar
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-2.5 rounded-lg cursor-not-allowed font-medium"
                        >
                          Produto Indisponível
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Ver Mais */}
            {hasMore && produtos.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMoreProducts}
                  disabled={loadingMore}
                  className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Carregando...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-5 w-5" />
                      Ver Mais
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Ficha Técnica */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header do Modal */}
            <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ficha Técnica
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedProduct.categoria.nome}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Seção de Imagens */}
                  <div className="space-y-4">
                    {(() => {
                      const allImages = getAllImages(selectedProduct);
                      const currentImage = allImages[selectedImageIndex];

                      return (
                        <>
                          {/* Imagem Principal */}
                          <div className="relative w-full h-96 bg-white rounded-xl overflow-hidden border border-gray-200">
                            {currentImage ? (
                              <Image
                                src={currentImage}
                                alt={`${selectedProduct.titulo} - Imagem ${
                                  selectedImageIndex + 1
                                }`}
                                fill
                                className="object-contain p-6"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={false}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <div className="text-center">
                                  <Package className="h-32 w-32 text-gray-300 mx-auto mb-4" />
                                  <span className="text-lg text-gray-400">
                                    Sem imagem disponível
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Indicador de imagem atual */}
                            {allImages.length > 1 && (
                              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                {selectedImageIndex + 1} de {allImages.length}
                              </div>
                            )}
                          </div>

                          {/* Galeria de Miniaturas */}
                          {allImages.length > 1 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-3">
                                Todas as imagens ({allImages.length})
                              </h4>
                              <div className="grid grid-cols-4 gap-3">
                                {allImages.map((url, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative w-full h-20 bg-white rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                      selectedImageIndex === index
                                        ? "border-primary shadow-lg"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                  >
                                    <Image
                                      src={url}
                                      alt={`${
                                        selectedProduct.titulo
                                      } - Miniatura ${index + 1}`}
                                      fill
                                      className="object-contain p-2"
                                      sizes="100px"
                                    />
                                    {/* Overlay de seleção */}
                                    {selectedImageIndex === index && (
                                      <div className="absolute inset-0 bg-primary bg-opacity-10 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                          <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Seção de Informações */}
                  <div className="space-y-6">
                    {/* Cabeçalho do Produto */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        {selectedProduct.titulo}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                          SKU: {selectedProduct.sku}
                        </span>
                        {selectedProduct.origem && (
                          <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                            {selectedProduct.origem}
                          </span>
                        )}
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            selectedProduct.quantidadeEstoque > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedProduct.quantidadeEstoque > 0
                            ? "Em Estoque"
                            : "Sem Estoque"}
                        </span>
                      </div>

                      <div className="text-4xl font-bold text-primary">
                        {formatPrice(selectedProduct.preco)}
                      </div>
                    </div>

                    {/* Informações Técnicas */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Informações do Produto
                      </h4>

                      <div className="grid grid-cols-1 gap-4">
                        {selectedProduct.descricao && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <h5 className="font-semibold text-gray-900">
                                Descrição
                              </h5>
                            </div>
                            <div className="text-gray-700 ml-8 leading-relaxed whitespace-pre-line">
                              {selectedProduct.descricao}
                            </div>
                          </div>
                        )}

                        {selectedProduct.aplicacao && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <Tag className="h-5 w-5 text-primary" />
                              <h5 className="font-semibold text-gray-900">
                                Aplicação
                              </h5>
                            </div>
                            <div className="text-gray-700 ml-8 leading-relaxed whitespace-pre-line">
                              {selectedProduct.aplicacao}
                            </div>
                          </div>
                        )}

                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            <h5 className="font-semibold text-gray-900">
                              Política de Compra
                            </h5>
                          </div>
                          <div className="ml-8 space-y-1 text-gray-700">
                            <p>
                              Quantidade mínima: {selectedProduct.compraMinima}{" "}
                              unidades
                            </p>
                            {selectedProduct.compraMaxima && (
                              <p>
                                Quantidade máxima:{" "}
                                {selectedProduct.compraMaxima} unidades
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer do Modal com Ações */}
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 font-medium"
                >
                  Fechar
                </button>
                {selectedProduct.quantidadeEstoque > 0 && (
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      closeModal();
                    }}
                    disabled={addingToCart === selectedProduct.id}
                    className={`flex-1 py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg disabled:cursor-not-allowed ${
                      recentlyAdded.has(selectedProduct.id)
                        ? "bg-green-500 text-white transform scale-105"
                        : addingToCart === selectedProduct.id
                        ? "bg-primary/80 text-white opacity-75"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {addingToCart === selectedProduct.id ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Adicionando...
                      </>
                    ) : recentlyAdded.has(selectedProduct.id) ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Adicionado!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
