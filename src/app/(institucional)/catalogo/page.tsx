"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Download,
  CheckCircle,
  Star,
  Award,
  Package,
  FileText,
  Zap,
  TrendingUp,
} from "lucide-react";

interface Produto {
  id: string;
  titulo: string;
  sku: string;
  imagemPrincipal: string | null;
  origem: string | null;
}

interface Stats {
  total: number;
  disponiveis: number;
  quantidadeOrigens: number;
}

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    disponiveis: 0,
    quantidadeOrigens: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar produtos em destaque
        const resProdutos = await fetch("/api/produtos?limit=6");
        const dataProdutos = await resProdutos.json();
        setProdutos(dataProdutos.produtos || []);

        // Buscar estatísticas
        const resStats = await fetch("/api/produtos");
        const dataStats = await resStats.json();
        setStats({
          total: dataStats.total || 0,
          disponiveis: dataStats.produtos?.filter((p: any) => p.ativo).length || 0,
          quantidadeOrigens: [...new Set(dataStats.produtos?.map((p: any) => p.origem))].length || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <FileText size={20} className="text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white/90">
                Catálogo Completo 2025
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-6">
              Conheça Nosso Catálogo Completo
            </h1>
            <p className="text-xl lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
              Mais de <strong>{stats.total} produtos</strong> em faróis,
              lanternas e acessórios automotivos com a qualidade e tradição que
              você confia.
            </p>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <TrendingUp size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-primary">
                Nosso Catálogo
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Catálogo em Números
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Variedade e qualidade em produtos automotivos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-primary/5 rounded-3xl hover:bg-primary/10 transition-colors duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Package className="text-primary" size={24} />
              </div>
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">
                {stats.total}+
              </div>
              <p className="text-gray-600 font-medium">Produtos no Catálogo</p>
            </div>

            <div className="text-center p-8 bg-yellow-300/10 rounded-3xl hover:bg-yellow-300/20 transition-colors duration-300 group">
              <div className="w-16 h-16 bg-yellow-300/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="text-yellow-600" size={24} />
              </div>
              <div className="text-4xl lg:text-5xl font-black text-yellow-600 mb-2">
                {stats.disponiveis}
              </div>
              <p className="text-gray-600 font-medium">Disponíveis</p>
            </div>

            <div className="text-center p-8 bg-primary/5 rounded-3xl hover:bg-primary/10 transition-colors duration-300 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-primary" size={24} />
              </div>
              <div className="text-4xl lg:text-5xl font-black text-primary mb-2">
                {stats.quantidadeOrigens}
              </div>
              <p className="text-gray-600 font-medium">Linhas de Produtos</p>
            </div>
          </div>

          {/* CTA para Download */}
          <div className="text-center">
            <a
              href="https://res.cloudinary.com/dn7nvyvss/image/upload/v1760089662/catalogo-crc-farois-2025_sozrsx.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group"
            >
              <Download className="mr-3 w-5 h-5 group-hover:animate-bounce" />
              <span>Baixar Catálogo Completo (PDF)</span>
            </a>
            <p className="text-gray-600 text-sm mt-4">
              PDF com todos os produtos organizados por categoria
            </p>
          </div>
        </div>
      </section>

      {/* Por que escolher nosso catálogo */}
      <section className="relative py-16 lg:py-20 bg-primary overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-2xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Award size={16} className="text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white/90">
                Diferenciais
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Por que nosso catálogo?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Qualidade, variedade e facilidade na palma da sua mão
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Qualidade */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors duration-300">
                <Award
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  size={32}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Qualidade Premium
              </h3>
              <p className="text-white/80 leading-relaxed">
                Produtos{" "}
                <strong className="text-yellow-300">
                  rigorosamente testados
                </strong>{" "}
                e certificados para garantir máxima durabilidade.
              </p>
            </div>

            {/* Variedade */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-yellow-300/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-300/30 transition-colors duration-300">
                <Package
                  className="text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                  size={32}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Grande Variedade
              </h3>
              <p className="text-white/80 leading-relaxed">
                Catálogo completo com produtos{" "}
                <strong className="text-yellow-300">
                  exclusivos, importados e nacionais
                </strong>{" "}
                para todos os modelos.
              </p>
            </div>

            {/* Atualizado */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors duration-300">
                <Zap
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  size={32}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sempre Atualizado
              </h3>
              <p className="text-white/80 leading-relaxed">
                <strong className="text-yellow-300">
                  Catálogo digital
                </strong>{" "}
                sempre atualizado com novos lançamentos e disponibilidade em
                tempo real.
              </p>
            </div>

            {/* Download Fácil */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-16 h-16 bg-yellow-300/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-300/30 transition-colors duration-300">
                <Download
                  className="text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                  size={32}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Download Gratuito
              </h3>
              <p className="text-white/80 leading-relaxed">
                PDF completo com{" "}
                <strong className="text-yellow-300">
                  imagens de alta qualidade
                </strong>{" "}
                e todas as especificações técnicas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Package size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-primary">
                Produtos em Destaque
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Alguns de Nossos Produtos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Confira uma pequena amostra do que temos disponível
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              <div className="col-span-full text-center text-gray-600">
                Carregando produtos...
              </div>
            ) : produtos.length > 0 ? (
              produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="group bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Imagem do Produto */}
                  <div className="relative h-64 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                    {produto.imagemPrincipal ? (
                      <Image
                        src={produto.imagemPrincipal}
                        alt={produto.titulo}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="text-primary/30" size={80} />
                      </div>
                    )}
                  </div>

                  {/* Info do Produto */}
                  <div className="p-6 bg-white">
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
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600">
                Nenhum produto encontrado
              </div>
            )}
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-12 border border-primary/10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Veja todos os nossos produtos
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Baixe o catálogo completo em PDF com todos os produtos
                organizados por categoria, incluindo especificações, SKUs e
                disponibilidade.
              </p>
              <a
                href="https://res.cloudinary.com/dn7nvyvss/image/upload/v1760089662/catalogo-crc-farois-2025_sozrsx.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group"
              >
                <Download className="mr-3 w-5 h-5 group-hover:animate-bounce" />
                <span>Baixar Catálogo Completo</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
