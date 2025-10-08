import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

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

    // Agrupar produtos por origem
    const produtosPorOrigem: { [key: string]: typeof produtos } = {};
    produtos.forEach((produto) => {
      const origem = produto.origem || "Outros";
      if (!produtosPorOrigem[origem]) {
        produtosPorOrigem[origem] = [];
      }
      produtosPorOrigem[origem].push(produto);
    });

    // Ordenar origens por prioridade
    const prioridade = ["EXCLUSIVO", "IMPORTADO", "NACIONAL"];
    const origensOrdenadas = Object.keys(produtosPorOrigem).sort((a, b) => {
      const aIndex = prioridade.findIndex((p) => a.toUpperCase().includes(p));
      const bIndex = prioridade.findIndex((p) => b.toUpperCase().includes(p));
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    // Criar PDF
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      autoFirstPage: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      console.log(`[PDF] PDF gerado com sucesso`);
    });

    // Cabeçalho
    doc
      .fontSize(24)
      .fillColor("#2b308c")
      .text("CRC FAROIS", { align: "center" });

    doc
      .fontSize(16)
      .fillColor("#2b308c")
      .text("CATALOGO 2025", { align: "center" });

    doc
      .moveDown(0.5)
      .fontSize(10)
      .fillColor("#666666")
      .text("Farois e Lanternas Automotivos - Qualidade e Confianca", {
        align: "center",
      });

    doc.moveDown(1);
    doc
      .strokeColor("#2b308c")
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();

    doc.moveDown(1.5);

    // Percorrer cada origem
    origensOrdenadas.forEach((origem, indexOrigem) => {
      const prods = produtosPorOrigem[origem];

      // Se não couber na página, adicionar nova página
      if (doc.y > 700) {
        doc.addPage();
      }

      // Header da seção
      doc
        .rect(50, doc.y, 495, 30)
        .fillAndStroke("#2b308c", "#2b308c");

      doc
        .fontSize(14)
        .fillColor("#ffffff")
        .text(
          `${origem.toUpperCase()} (${prods.length} ${
            prods.length === 1 ? "produto" : "produtos"
          })`,
          55,
          doc.y - 22,
          { width: 485 }
        );

      doc.moveDown(0.5);

      // Listar produtos
      prods.forEach((produto, index) => {
        // Verificar se precisa de nova página
        if (doc.y > 700) {
          doc.addPage();
        }

        const startY = doc.y;

        // Box do produto
        doc
          .rect(50, startY, 495, 60)
          .fillAndStroke("#f9f9f9", "#e0e0e0");

        // Nome do produto
        doc
          .fontSize(11)
          .fillColor("#333333")
          .text(produto.titulo, 60, startY + 10, {
            width: 400,
            height: 15,
            ellipsis: true,
          });

        // SKU
        doc
          .fontSize(9)
          .fillColor("#666666")
          .text(`SKU: ${produto.sku}`, 60, startY + 28);

        // Status
        const statusColor = produto.ativo ? "#10b981" : "#6b7280";
        const statusText = produto.ativo ? "Disponivel" : "Indisponivel";

        doc
          .rect(60, startY + 42, 80, 12)
          .fillAndStroke(statusColor, statusColor);

        doc
          .fontSize(8)
          .fillColor("#ffffff")
          .text(statusText, 63, startY + 44, { width: 75 });

        doc.y = startY + 65;
      });

      doc.moveDown(1);
    });

    // Rodapé em todas as páginas
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      doc
        .fontSize(8)
        .fillColor("#666666")
        .text(
          "www.crcfarois.ind.br | contato@crcfarois.ind.br | (11) 99226-8645",
          50,
          doc.page.height - 30,
          { align: "center" }
        );

      doc.text(
        `Página ${i + 1} de ${range.count}`,
        50,
        doc.page.height - 30,
        { align: "right" }
      );
    }

    // Finalizar PDF
    doc.end();

    // Aguardar conclusão e retornar
    await new Promise((resolve) => doc.on("end", resolve));
    const buffer = Buffer.concat(chunks);

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
