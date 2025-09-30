import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  listImagesByCategory,
  cleanupOrphanImages,
} from "@/lib/cloudinary-utils";

// GET - Listar imagens por categoria/filtros
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as any;
    const limit = parseInt(searchParams.get("limit") || "50");
    const action = searchParams.get("action");

    // Ação especial para limpeza
    if (action === "cleanup") {
      const orphanImages = await cleanupOrphanImages();
      return NextResponse.json({
        success: true,
        message: `Encontradas ${orphanImages.length} imagens para análise`,
        images: orphanImages.slice(0, 10), // Primeiras 10 para preview
      });
    }

    // Listar por categoria
    if (category) {
      const images = await listImagesByCategory(category, limit);
      return NextResponse.json({
        success: true,
        category,
        total: images.length,
        images: images.map((img: any) => ({
          publicId: img.public_id,
          url: img.secure_url,
          tags: img.tags,
          context: img.context,
          createdAt: img.created_at,
          format: img.format,
          bytes: img.bytes,
          width: img.width,
          height: img.height,
        })),
      });
    }

    return NextResponse.json(
      { error: "Categoria é obrigatória" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
