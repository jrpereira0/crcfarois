import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  CheckCircle,
  Star,
  Award,
  Package,
  FileText,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getProdutosDestaque() {
  // Buscar 6 produtos ativos aleatórios para exibir
  const produtos = await prisma.produto.findMany({
    where: {
      ativo: true,
    },
    select: {
      id: true,
      titulo: true,
      sku: true,
      imagemPrincipal: true,
      origem: true,
    },
    take: 6,
    orderBy: {
      createdAt: "desc",
    },
  });

  return produtos;
}

async function getEstatisticasCatalogo() {
  const total = await prisma.produto.count();
  const disponiveis = await prisma.produto.count({
    where: { ativo: true },
  });
  const origens = await prisma.produto.findMany({
    select: { origem: true },
    distinct: ["origem"],
  });

  return {
    total,
    disponiveis,
    quantidadeOrigens: origens.length,
  };
}

export default async function CatalogoPage() {
  const produtos = await getProdutosDestaque();
  const stats = await getEstatisticasCatalogo();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-primary via-blue-600 to-primary overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-white/20 animate-fade-in-up">
              <FileText className="w-4 h-4 mr-2" />
              Catálogo Completo 2025
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight animate-fade-in-up animation-delay-200">
              Conheça Nosso{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">
                  Catálogo Completo
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full"></span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-12 max-w-4xl mx-auto animate-fade-in-up animation-delay-400">
              Mais de <span className="font-bold text-yellow-300">{stats.total} produtos</span> em{" "}
              <span className="font-bold text-yellow-300">faróis</span>,{" "}
              <span className="font-bold text-yellow-300">lanternas</span> e{" "}
              <span className="font-bold text-yellow-300">acessórios automotivos</span> com a
              qualidade e tradição que você confia.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-white mb-2">
                  {stats.total}+
                </div>
                <div className="text-white/90 font-medium">Produtos no Catálogo</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-white mb-2">
                  {stats.disponiveis}
                </div>
                <div className="text-white/90 font-medium">Disponíveis</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-white mb-2">
                  {stats.quantidadeOrigens}
                </div>
                <div className="text-white/90 font-medium">Linhas de Produtos</div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="/api/catalogo/pdf"
              download
              className="inline-flex items-center bg-white text-primary px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:scale-105 transform group"
            >
              <Download className="mr-3 w-6 h-6 group-hover:animate-bounce" />
              <span>Baixar Catálogo Completo (PDF)</span>
            </a>

            <p className="text-white/70 text-sm mt-6">
              📄 PDF com todos os produtos organizados por categoria
            </p>
          </div>
        </section>

        {/* Qualidade e Diferenciais */}
        <section className="py-20 lg:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Por que escolher a <span className="text-primary">CRC Faróis?</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Nossa missão é fornecer produtos de alta qualidade com preços competitivos
                e atendimento diferenciado para nossos parceiros.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Qualidade */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Award className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Qualidade Premium
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Produtos rigorosamente testados e certificados para garantir
                  máxima durabilidade e desempenho.
                </p>
              </div>

              {/* Variedade */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Package className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Grande Variedade
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Catálogo completo com produtos exclusivos, importados e
                  nacionais para todos os modelos.
                </p>
              </div>

              {/* Atualização */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Zap className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Sempre Atualizado
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Catálogo digital sempre atualizado com novos lançamentos e
                  disponibilidade em tempo real.
                </p>
              </div>

              {/* Confiança */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Star className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Tradição e Confiança
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Mais de 3 anos atendendo o mercado brasileiro com excelência
                  e compromisso com nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Produtos em Destaque */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Alguns de Nossos <span className="text-primary">Produtos</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Confira uma pequena amostra do que temos disponível. Baixe o
                catálogo completo para ver todos os {stats.total} produtos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="group bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Imagem do Produto */}
                  <div className="relative h-64 bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
                    {produto.imagemPrincipal ? (
                      <Image
                        src={produto.imagemPrincipal}
                        alt={produto.titulo}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="text-white/50" size={80} />
                      </div>
                    )}
                  </div>

                  {/* Info do Produto */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {produto.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      SKU: {produto.sku}
                    </p>
                    {produto.origem && (
                      <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        {produto.origem}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Final */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  Veja todos os nossos produtos
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Baixe o catálogo completo em PDF com todos os produtos organizados
                  por categoria, incluindo especificações, SKUs e disponibilidade.
                </p>
                <a
                  href="/api/catalogo/pdf"
                  download
                  className="inline-flex items-center bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group"
                >
                  <Download className="mr-3 w-5 h-5 group-hover:animate-bounce" />
                  <span>Baixar Catálogo Completo</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios do Catálogo */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="font-semibold">Download Gratuito</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="font-semibold">Sempre Atualizado</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="font-semibold">Todas as Especificações</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="font-semibold">Imagens de Alta Qualidade</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

