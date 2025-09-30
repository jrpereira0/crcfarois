import { v2 as cloudinary } from "cloudinary";

// Tipos para organização
export type ImageCategory =
  | "produto"
  | "categoria"
  | "cliente"
  | "banner"
  | "logo";

export interface CloudinaryUploadOptions {
  category: ImageCategory;
  productId?: string;
  categoryId?: string;
  clientId?: string;
  customFolder?: string;
  tags?: string[];
}

// Gerar estrutura de pastas organizada
export const generateFolderStructure = (
  options: CloudinaryUploadOptions
): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  let basePath = "crc-farois";

  switch (options.category) {
    case "produto":
      if (options.productId) {
        // Se temos ID do produto, organizar por produto
        basePath += `/produtos/por-produto/${options.productId}`;
      } else {
        // Senão, organizar por data
        basePath += `/produtos/por-data/${year}/${month}/${day}`;
      }
      break;

    case "categoria":
      if (options.categoryId) {
        basePath += `/categorias/${options.categoryId}`;
      } else {
        basePath += `/categorias/geral`;
      }
      break;

    case "cliente":
      if (options.clientId) {
        basePath += `/clientes/${options.clientId}`;
      } else {
        basePath += `/clientes/geral`;
      }
      break;

    case "banner":
      basePath += `/banners/${year}/${month}`;
      break;

    case "logo":
      basePath += `/logos`;
      break;

    default:
      basePath += `/outros/${year}/${month}/${day}`;
  }

  // Adicionar pasta customizada se fornecida
  if (options.customFolder) {
    basePath += `/${options.customFolder}`;
  }

  return basePath;
};

// Gerar nome de arquivo inteligente
export const generateFileName = (
  options: CloudinaryUploadOptions,
  originalName?: string
): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  // ID único
  const randomId = Math.random().toString(36).substr(2, 9);

  // Prefixo baseado na categoria
  let prefix = options.category;

  // Adicionar ID específico se disponível
  if (options.productId) {
    prefix += `_${options.productId}`;
  } else if (options.categoryId) {
    prefix += `_${options.categoryId}`;
  } else if (options.clientId) {
    prefix += `_${options.clientId}`;
  }

  // Nome limpo do arquivo original (sem extensão)
  let cleanName = "";
  if (originalName) {
    cleanName = originalName
      .replace(/\.[^/.]+$/, "") // Remove extensão
      .replace(/[^a-zA-Z0-9]/g, "_") // Substitui caracteres especiais
      .toLowerCase()
      .substring(0, 20); // Limita tamanho

    if (cleanName) {
      cleanName = `_${cleanName}`;
    }
  }

  return `${prefix}_${year}${month}${day}_${hour}${minute}${second}_${randomId}${cleanName}`;
};

// Gerar tags inteligentes
export const generateTags = (options: CloudinaryUploadOptions): string[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const baseTags = [
    "crc-farois",
    options.category,
    `ano-${year}`,
    `mes-${month}`,
    `upload-${now.toISOString().split("T")[0]}`, // YYYY-MM-DD
  ];

  // Adicionar tags específicas
  if (options.productId) baseTags.push(`produto-${options.productId}`);
  if (options.categoryId) baseTags.push(`categoria-${options.categoryId}`);
  if (options.clientId) baseTags.push(`cliente-${options.clientId}`);

  // Adicionar tags customizadas
  if (options.tags) {
    baseTags.push(...options.tags);
  }

  return baseTags;
};

// Gerar contexto/metadados
export const generateContext = (options: CloudinaryUploadOptions) => {
  const now = new Date();

  return {
    upload_date: now.toISOString(),
    category: options.category,
    project: "crc-farois",
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString(),
    day: now.getDate().toString(),
    ...(options.productId && { product_id: options.productId }),
    ...(options.categoryId && { category_id: options.categoryId }),
    ...(options.clientId && { client_id: options.clientId }),
  };
};

// Função principal para upload organizado
export const uploadToCloudinary = async (
  file: Buffer,
  options: CloudinaryUploadOptions,
  originalFileName?: string
) => {
  const folderPath = generateFolderStructure(options);
  const fileName = generateFileName(options, originalFileName);
  const tags = generateTags(options);
  const context = generateContext(options);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: folderPath,
          public_id: fileName,
          transformation: [
            {
              width: 1000,
              height: 1000,
              crop: "fill",
              quality: "auto:good",
              format: "jpg",
            },
          ],
          tags,
          context,
          // Configurações adicionais
          use_filename: false, // Usar nosso nome personalizado
          unique_filename: false, // Não adicionar sufixo automático
          overwrite: false, // Não sobrescrever arquivos existentes
        },
        (error, result) => {
          if (error) {
            console.error("Erro no upload Cloudinary:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(file);
  });
};

// Função para listar imagens por categoria/filtros
export const listImagesByCategory = async (
  category: ImageCategory,
  limit = 50
) => {
  try {
    const result = await cloudinary.search
      .expression(`tags:${category} AND tags:crc-farois`)
      .sort_by([["created_at", "desc"]])
      .max_results(limit)
      .execute();

    return result.resources;
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    throw error;
  }
};

// Função para limpar imagens órfãs (sem produto associado)
export const cleanupOrphanImages = async () => {
  try {
    // Buscar todas as imagens de produtos
    const allProductImages = await cloudinary.search
      .expression("tags:produto AND tags:crc-farois")
      .max_results(500)
      .execute();

    console.log(
      `Encontradas ${allProductImages.resources.length} imagens de produtos`
    );

    // Aqui você pode implementar lógica para verificar se o produto ainda existe
    // e deletar imagens órfãs

    return allProductImages.resources;
  } catch (error) {
    console.error("Erro na limpeza de imagens órfãs:", error);
    throw error;
  }
};
