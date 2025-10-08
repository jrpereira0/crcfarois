import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import React from "react";
import CatalogPDF from "@/lib/pdf-catalog";

export async function GET() {
  try {
    // Buscar todos os produtos ordenados por título
    const produtos = await prisma.produto.findMany({
      select: {
        id: true,
        titulo: true,
        sku: true,
        origem: true,
        imagemPrincipal: true,
        ativo: true,
      },
      orderBy: {
        titulo: "asc",
      },
    });

    console.log(`[PDF] Gerando catálogo com ${produtos.length} produtos`);

    // URL da logo (você pode ajustar conforme necessário)
    const logoUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/logobranca.svg`;

    // Gerar o PDF usando React.createElement
    const stream = await renderToStream(
      React.createElement(CatalogPDF, { products: produtos, logoUrl: logoUrl })
    );

    // Converter stream para buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log(`[PDF] PDF gerado com sucesso - ${buffer.length} bytes`);

    // Retornar o PDF
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="catalogo-crc-farois-${new Date().getFullYear()}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("[PDF] Erro ao gerar PDF:", error);
    return NextResponse.json(
      { error: "Erro ao gerar catálogo PDF" },
      { status: 500 }
    );
  }
}
