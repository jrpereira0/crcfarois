"use client";

import {
  Download,
  CheckCircle,
  Award,
  Package,
  FileText,
  Sparkles,
} from "lucide-react";

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-12 sm:py-16 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <FileText size={18} className="text-yellow-300 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Catálogo Completo 2025
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-2">
              Nosso Catálogo de Produtos
            </h1>
            <p className="text-base sm:text-lg lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              Conheça toda a nossa linha de faróis, lanternas e acessórios
              automotivos. Produtos de alta qualidade para o seu negócio.
            </p>

            {/* CTA Principal */}
            <a
              href="https://res.cloudinary.com/dn7nvyvss/image/upload/v1760089662/catalogo-crc-farois-2025_sozrsx.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-primary px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group"
            >
              <Download className="mr-2 sm:mr-3 w-5 h-5 group-hover:animate-bounce" />
              <span>Baixar Catálogo em PDF</span>
            </a>
            <p className="text-white/70 text-xs sm:text-sm mt-3 sm:mt-4 px-4">
              Download gratuito • Atualizado em 08/10/2025
            </p>
          </div>
        </div>
      </section>

      {/* Sobre o Catálogo */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-primary/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Sparkles size={14} className="text-primary mr-2" />
                <span className="text-xs sm:text-sm font-medium text-primary">
                  Catálogo Digital
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Tudo o que você precisa em um só lugar
              </h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Nosso catálogo digital foi desenvolvido para facilitar a
                  consulta e escolha dos produtos ideais para o seu negócio. Com
                  ele, você tem acesso a{" "}
                  <strong className="text-primary">
                    toda nossa linha de produtos
                  </strong>{" "}
                  de forma organizada e prática.
                </p>
                <p>
                  Organize seus pedidos com mais facilidade consultando códigos
                  SKU, especificações técnicas e disponibilidade de estoque.
                  Tudo isso em um{" "}
                  <strong className="text-primary">
                    PDF completo e gratuito
                  </strong>
                  .
                </p>
                <p>
                  Ideal para lojistas, distribuidores e revendedores que buscam
                  praticidade e agilidade no dia a dia.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                  {/* Mockup do Catálogo */}
                  <div className="relative w-full h-48 sm:h-64 lg:h-80 mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <FileText className="text-white/20" size={80} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white">
                      <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                        CATÁLOGO CRC FARÓIS
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm">
                        Edição 2025 - Completa
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
                    Catálogo PDF Completo
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Acesso instantâneo a todos os produtos, categorias e
                    especificações técnicas
                  </p>

                  <a
                    href="https://res.cloudinary.com/dn7nvyvss/image/upload/v1760089662/catalogo-crc-farois-2025_sozrsx.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-primary/90 transition-colors duration-300 group"
                  >
                    <Download className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" />
                    <span>Fazer Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que você encontra no catálogo */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-primary overflow-hidden">
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
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 border border-white/20">
              <Package size={14} className="text-yellow-300 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Conteúdo do Catálogo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
              O que você encontra
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Todas as informações necessárias para facilitar seus pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Categorias Organizadas */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-colors duration-300">
                <Package
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Categorias Organizadas
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Produtos separados por{" "}
                <strong className="text-yellow-300">categoria</strong>: faróis,
                lentes, aros, lâmpadas e muito mais.
              </p>
            </div>

            {/* Códigos SKU */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-yellow-300/30 transition-colors duration-300">
                <FileText
                  className="text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Códigos SKU
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Todos os produtos com{" "}
                <strong className="text-yellow-300">código SKU</strong> para
                facilitar seus pedidos e consultas.
              </p>
            </div>

            {/* Imagens dos Produtos */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-colors duration-300">
                <Sparkles
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Imagens de Alta Qualidade
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Fotos{" "}
                <strong className="text-yellow-300">
                  nítidas e detalhadas
                </strong>{" "}
                para você identificar cada produto facilmente.
              </p>
            </div>

            {/* Produtos Exclusivos */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-yellow-300/30 transition-colors duration-300">
                <Award
                  className="text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Linha Exclusiva
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Produtos <strong className="text-yellow-300">exclusivos</strong>
                , importados e nacionais para todos os modelos.
              </p>
            </div>

            {/* Disponibilidade */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-colors duration-300">
                <CheckCircle
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Status de Disponibilidade
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Informação clara sobre{" "}
                <strong className="text-yellow-300">disponibilidade</strong> de
                cada item em estoque.
              </p>
            </div>

            {/* Atualizado */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "1s" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-yellow-300/30 transition-colors duration-300">
                <Download
                  className="text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Sempre Atualizado
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Catálogo <strong className="text-yellow-300">atualizado</strong>{" "}
                com os lançamentos mais recentes do mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center border border-primary/10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <Download className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Baixe agora o catálogo completo
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Tenha acesso instantâneo a toda nossa linha de produtos. Download
              gratuito e sem cadastro.
            </p>
            <a
              href="https://res.cloudinary.com/dn7nvyvss/image/upload/v1760089662/catalogo-crc-farois-2025_sozrsx.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group"
            >
              <Download className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
              <span>Baixar Catálogo PDF</span>
            </a>
            <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
              Arquivo PDF • Atualizado em 14/10/2025
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
