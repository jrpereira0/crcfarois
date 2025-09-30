"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  Star,
  StarOff,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isPrincipal: boolean;
  url?: string; // URL do Cloudinary após upload
  publicId?: string; // Public ID do Cloudinary
  uploaded?: boolean; // Se já foi enviado para Cloudinary
  uploading?: boolean; // Se está sendo enviado
  error?: string; // Erro no upload
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  // Metadados para organização
  category?: "produto" | "categoria" | "cliente" | "banner" | "logo";
  productId?: string;
  categoryId?: string;
  customTags?: string[];
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  category = "produto",
  productId,
  categoryId,
  customTags,
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Definir tamanho do canvas para 1000x1000
        canvas.width = 1000;
        canvas.height = 1000;

        if (!ctx) {
          reject(new Error("Erro ao processar imagem"));
          return;
        }

        // Calcular dimensões para crop centralizado
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        // Desenhar imagem redimensionada e cortada
        ctx.drawImage(img, x, y, size, size, 0, 0, 1000, 1000);

        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Erro ao redimensionar imagem"));
            }
          },
          "image/jpeg",
          0.9
        );
      };

      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      img.src = URL.createObjectURL(file);
    });
  };

  // Função para fazer upload para Cloudinary
  const uploadToCloudinary = async (
    file: File
  ): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    // Adicionar metadados opcionais
    if (productId) formData.append("productId", productId);
    if (categoryId) formData.append("categoryId", categoryId);
    if (customTags && customTags.length > 0) {
      formData.append("tags", customTags.join(","));
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro no upload");
    }

    const data = await response.json();
    return { url: data.url, publicId: data.publicId };
  };

  const handleFiles = async (files: FileList) => {
    setError(null);

    if (images.length + files.length > maxImages) {
      setError(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    const newImages: ImageFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setError("Apenas arquivos de imagem são permitidos");
        continue;
      }

      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Imagem muito grande. Máximo 10MB por arquivo");
        continue;
      }

      try {
        const resizedFile = await resizeImage(file);
        const preview = URL.createObjectURL(resizedFile);

        const imageId = `${Date.now()}-${i}`;

        // Adicionar imagem com estado inicial
        const newImage: ImageFile = {
          id: imageId,
          file: resizedFile,
          preview,
          isPrincipal: images.length === 0 && i === 0,
          uploaded: false,
          uploading: true,
        };

        newImages.push(newImage);
      } catch (error) {
        console.error("Erro ao redimensionar imagem:", error);
        setError("Erro ao processar imagem");
      }
    }

    // Adicionar imagens ao estado (com status uploading)
    const updatedImages = [...images, ...newImages];
    onImagesChange(updatedImages);

    // Fazer upload de cada imagem para Cloudinary
    for (const image of newImages) {
      try {
        const { url, publicId } = await uploadToCloudinary(image.file);

        // Atualizar imagem com dados do Cloudinary
        onImagesChange((prevImages) =>
          prevImages.map((img) =>
            img.id === image.id
              ? { ...img, url, publicId, uploaded: true, uploading: false }
              : img
          )
        );
      } catch (error) {
        console.error("Erro no upload para Cloudinary:", error);

        // Marcar imagem com erro
        onImagesChange((prevImages) =>
          prevImages.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  uploading: false,
                  error:
                    error instanceof Error ? error.message : "Erro no upload",
                }
              : img
          )
        );
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId);

    // Se a imagem foi enviada para Cloudinary, deletar de lá também
    if (imageToRemove?.uploaded && imageToRemove.publicId) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId: imageToRemove.publicId }),
        });
      } catch (error) {
        console.error("Erro ao deletar imagem do Cloudinary:", error);
      }
    }

    const updatedImages = images.filter((img) => img.id !== imageId);

    // Se removeu a imagem principal, definir a primeira como principal
    if (
      updatedImages.length > 0 &&
      !updatedImages.some((img) => img.isPrincipal)
    ) {
      updatedImages[0].isPrincipal = true;
    }

    onImagesChange(updatedImages);
  };

  const setPrincipal = (imageId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrincipal: img.id === imageId,
    }));

    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Adicionar Imagens do Produto
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Arraste e solte ou clique para selecionar imagens
            </p>
            <p className="text-xs text-gray-500">
              Formato: JPG, PNG • Tamanho: até 10MB • Resolução: 1000x1000px
              (automático)
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Selecionar Imagens
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Imagens do Produto ({images.length}/{maxImages})
            </h4>
            <p className="text-xs text-gray-500">⭐ = Imagem Principal</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative group bg-white rounded-lg border-2 overflow-hidden transition-all ${
                  image.isPrincipal
                    ? "border-yellow-400 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={image.url || image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Upload Status Overlay */}
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      </div>
                    </div>
                  )}

                  {image.error && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-red-100 rounded-full p-2">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  )}

                  {/* Principal Badge */}
                  {image.isPrincipal && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Principal
                    </div>
                  )}

                  {/* Upload Success Badge */}
                  {image.uploaded && !image.uploading && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      {!image.isPrincipal && !image.uploading && (
                        <button
                          type="button"
                          onClick={() => setPrincipal(image.id)}
                          className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title="Definir como principal"
                        >
                          <StarOff className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Remover imagem"
                        disabled={image.uploading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-600 truncate">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(image.file.size / 1024 / 1024).toFixed(1)} MB •
                    1000x1000px
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
