"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  FolderTree,
  Save,
  Folder,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Toast } from "@/components/ui/Toast";

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  parentId?: string;
  ordem: number;
  ativo: boolean;
  parent?: {
    id: string;
    nome: string;
  };
  children?: Categoria[];
}

interface FormData {
  nome: string;
  slug: string;
  descricao: string;
  parentId: string;
  ativo: boolean;
  ordem: number;
}

export default function EditarCategoriaPage() {
  const router = useRouter();
  const params = useParams();
  const categoriaId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    slug: "",
    descricao: "",
    parentId: "",
    ativo: true,
    ordem: 1,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Buscar categoria específica
  const fetchCategoria = async () => {
    try {
      const response = await fetch(`/api/categorias/${categoriaId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setToast({
            type: "error",
            text: "Categoria não encontrada",
          });
          setTimeout(() => router.push("/dashboard/categorias"), 2000);
          return;
        }
        throw new Error("Erro ao buscar categoria");
      }

      const data = await response.json();
      setCategoria(data);

      // Preencher formulário
      setFormData({
        nome: data.nome,
        slug: data.slug,
        descricao: data.descricao || "",
        parentId: data.parentId || "",
        ativo: data.ativo,
        ordem: data.ordem,
      });
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      setToast({
        type: "error",
        text: "Erro ao carregar categoria",
      });
    }
  };

  // Buscar todas as categorias para o select
  const fetchCategorias = async () => {
    try {
      const response = await fetch("/api/categorias");

      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }

      const data = await response.json();

      // Converter estrutura hierárquica para lista plana para o select
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
      // Filtrar a categoria atual para não aparecer como opção pai
      const categoriasFiltradas = categoriasFlat.filter(
        (cat) => cat.id !== categoriaId
      );
      setCategorias(categoriasFiltradas);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && categoriaId) {
      Promise.all([fetchCategoria(), fetchCategorias()]).finally(() => {
        setLoading(false);
      });
    }
  }, [mounted, categoriaId]);

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleNomeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nome: value,
      slug: generateSlug(value),
    }));

    if (errors.nome) {
      setErrors((prev) => ({ ...prev, nome: undefined }));
    }
  };

  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, slug }));

    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug é obrigatório";
    } else if (formData.slug.length < 2) {
      newErrors.slug = "Slug deve ter pelo menos 2 caracteres";
    }

    if (formData.ordem < 1) {
      newErrors.ordem = "Ordem deve ser maior que 0" as any;
    }

    // Verificar se não está tentando se tornar pai de si mesmo
    if (formData.parentId === categoriaId) {
      newErrors.parentId = "Uma categoria não pode ser pai de si mesma";
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

    setSaving(true);

    try {
      const response = await fetch(`/api/categorias/${categoriaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar categoria");
      }

      setToast({
        type: "success",
        text: "Categoria atualizada com sucesso!",
      });

      setTimeout(() => {
        router.push("/dashboard/categorias");
      }, 1000);
    } catch (error) {
      setToast({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erro ao atualizar categoria. Tente novamente.",
      });
    } finally {
      setSaving(false);
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

  if (!mounted || loading) {
    return (
      <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-primary">Carregando categoria...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Categoria não encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              A categoria que você está tentando editar não foi encontrada.
            </p>
            <button
              onClick={() => router.push("/dashboard/categorias")}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Voltar para Categorias
            </button>
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Editar Categoria</h1>
          <p className="text-gray-600">
            Atualize as informações da categoria "{categoria.nome}"
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            {/* Informações Básicas */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                Informações da Categoria
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Categoria *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleNomeChange(e.target.value)}
                      placeholder="Ex: Filtros de Motor"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.nome ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.nome && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="filtros-motor"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm ${
                        errors.slug ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.slug && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.slug}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Usado na URL: /categoria/
                      {formData.slug || "slug-da-categoria"}
                    </p>
                  </div>
                </div>

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
                    placeholder="Descreva o que esta categoria inclui..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configurações
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria Pai
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          parentId: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.parentId ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Categoria Principal</option>
                      {categorias.map((categoria) =>
                        renderCategoriaOption(categoria)
                      )}
                    </select>
                    {errors.parentId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.parentId}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Deixe vazio para categoria principal
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordem de Exibição *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.ordem}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ordem: parseInt(e.target.value) || 1,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.ordem ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.ordem && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.ordem}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ativo: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="ativo"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    {formData.ativo ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    Categoria ativa
                  </label>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="p-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  saving
                    ? "bg-primary/70 text-white cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
                }`}
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
          </form>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Preview
            </h3>

            <div className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900">
                    {formData.nome || "Nome da categoria"}
                  </span>
                  {!formData.ativo && (
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Inativo
                    </span>
                  )}
                </div>
                {formData.descricao && (
                  <p className="text-sm text-gray-600">{formData.descricao}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  URL: /categoria/{formData.slug || "slug-da-categoria"}
                </div>
              </div>

              {formData.parentId && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Categoria pai:</span>{" "}
                  {categorias.find((c) => c.id === formData.parentId)?.nome}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <span className="font-medium">Ordem:</span> {formData.ordem}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dicas</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Alterar o slug pode afetar URLs existentes</li>
              <li>• Mudanças na hierarquia reorganizam subcategorias</li>
              <li>• Categorias inativas ficam ocultas no site</li>
              <li>• A ordem define a posição na listagem</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
