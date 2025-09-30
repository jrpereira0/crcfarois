import Link from "next/link";
import Image from "next/image";
import {
  Car,
  Lightbulb,
  Shield,
  Truck,
  ArrowRight,
  Package,
  Star,
  Award,
  Zap,
  Eye,
  Settings,
} from "lucide-react";

// URLs das imagens dos ícones dos cards (substitua pelos seus links)
const imagemFarois =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759204810/farois_y6guly.png";
const imagemLanternas =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759205419/lanternas_kpb6fu.png";
const imagemPiscas =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759205956/grade_ylainu.png";
const imagemGrades =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759205956/grade_ylainu.png";
const imagemLampadas =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759204810/farois_y6guly.png";
const imagemAcessorios =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759205956/grade_ylainu.png";

export default function Produtos() {
  const categorias = [
    {
      id: 1,
      nome: "Faróis Dianteiros",
      descricao: "Faróis completos para diversos modelos de veículos",
      icone: (
        <Image
          src={imagemFarois}
          alt="Faróis"
          width={32}
          height={32}
          className="object-contain"
        />
      ),
      cor: "primary",
      produtos: [
        "Faróis de milha",
        "Faróis principais",
        "Faróis auxiliares",
        "Faróis de neblina",
      ],
    },
    {
      id: 2,
      nome: "Lanternas Traseiras",
      descricao: "Lanternas e luzes traseiras de alta qualidade",
      icone: (
        <Image
          src={imagemLanternas}
          alt="Lanternas"
          width={32}
          height={32}
          className="object-contain"
        />
      ),
      cor: "yellow",
      produtos: [
        "Lanternas completas",
        "Luzes de freio",
        "Luzes de ré",
        "Pisca-piscas traseiros",
      ],
    },
    {
      id: 3,
      nome: "Pisca-Piscas",
      descricao: "Sinalizadores laterais e direcionais",
      icone: (
        <Image
          src={imagemPiscas}
          alt="Pisca-Piscas"
          width={32}
          height={32}
          className="object-contain"
        />
      ),
      cor: "primary",
      produtos: [
        "Pisca lateral",
        "Pisca dianteiro",
        "Pisca do retrovisor",
        "Pisca de para-lama",
      ],
    },
    {
      id: 4,
      nome: "Grade Frontal",
      descricao: "Grades e acessórios para parte frontal dos veículos",
      icone: (
        <Image
          src={imagemGrades}
          alt="Grades"
          width={32}
          height={32}
          className="object-contain"
        />
      ),
      cor: "yellow",
      produtos: [
        "Grades frontais",
        "Grades do para-choque",
        "Molduras cromadas",
        "Acessórios decorativos",
      ],
    },
    {
      id: 5,
      nome: "Lâmpadas Premium",
      descricao: "Lâmpadas automotivas de alta performance e durabilidade",
      icone: (
        <Image
          src={imagemLampadas}
          alt="Lâmpadas"
          width={32}
          height={32}
          className="object-contain"
        />
      ),
      cor: "primary",
      produtos: [
        "Lâmpadas halógenas",
        "Lâmpadas LED",
        "Lâmpadas xenon",
        "Lâmpadas convencionais",
      ],
    },
    {
      id: 6,
      nome: "Acessórios Técnicos",
      descricao: "Componentes e peças complementares para instalação",
      icone: (
        <Image
          src={imagemAcessorios}
          alt="Acessórios"
          width={32}
          height={32}
          className="object-contain"
        />
      ),
      cor: "yellow",
      produtos: ["Suportes", "Conectores", "Fusíveis", "Relés"],
    },
  ];

  const diferenciais = [
    {
      icone: <Shield className="text-white" size={32} />,
      titulo: "Qualidade Garantida",
      descricao:
        "Todos os produtos passam por rigorosos testes de qualidade e controle de fabricação",
    },
    {
      icone: <Award className="text-yellow-300" size={32} />,
      titulo: "Certificações",
      descricao:
        "Produtos certificados e aprovados pelos órgãos competentes do setor automotivo",
    },
    {
      icone: <Truck className="text-white" size={32} />,
      titulo: "Entrega Rápida",
      descricao: "Logística eficiente e segura para todo o território nacional",
    },
    {
      icone: <Car className="text-yellow-300" size={32} />,
      titulo: "Compatibilidade",
      descricao:
        "Ampla gama de produtos para diversos modelos e marcas de veículos",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Package size={20} className="text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white/90">
                Nossos Produtos
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-6">
              Iluminação Automotiva{" "}
              <span className="text-yellow-300">Premium</span>
            </h1>
            <p className="text-xl lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
              Soluções completas em faróis, lanternas e acessórios automotivos
              com qualidade certificada para todos os tipos de veículos
            </p>
          </div>
        </div>
      </section>

      {/* Categorias de Produtos */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
              <Package size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-primary">
                Nossa Linha de Produtos
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Categorias de Produtos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos uma linha completa de produtos para atender todas as
              necessidades de iluminação automotiva com qualidade certificada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.map((categoria, index) => (
              <div
                key={categoria.id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                      categoria.cor === "primary"
                        ? "bg-primary/10"
                        : "bg-yellow-300/20"
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    {categoria.icone}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {categoria.nome}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {categoria.descricao}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {categoria.produtos.map((produto, produtoIndex) => (
                    <div
                      key={produtoIndex}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{produto}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/login"
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-center inline-flex items-center justify-center transition-all duration-300 ${
                    categoria.cor === "primary"
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-yellow-300 text-primary hover:bg-yellow-400"
                  } group-hover:shadow-lg`}
                >
                  Ver Catálogo
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    size={16}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais dos Produtos */}
      <section className="relative py-16 lg:py-24 bg-primary overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Star size={16} className="text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white/90">
                Nossos Diferenciais
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Por que Escolher a CRC Faróis?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Qualidade, segurança e confiabilidade em cada produto que
              oferecemos para o mercado automotivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {diferenciais.map((diferencial, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {diferencial.icone}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {diferencial.titulo}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {diferencial.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aplicações */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
              <Car size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-primary">
                Segmentos Atendidos
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Aplicações dos Nossos Produtos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Atendemos diversos segmentos do mercado automotivo com soluções
              específicas para cada necessidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl hover:shadow-xl transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Car className="text-primary" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Veículos de Passeio
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Carros nacionais e importados de todas as marcas e modelos,
                desde compactos até sedans premium
              </p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-br from-yellow-300/10 to-yellow-300/20 rounded-3xl hover:shadow-xl transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-yellow-300/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Veículos Comerciais
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Caminhões, vans e veículos utilitários para trabalho pesado e
                transporte comercial
              </p>
            </div>

            <div className="group text-center p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl hover:shadow-xl transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-primary" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Motocicletas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Motos de todas as cilindradas e segmentos, desde urbanas até
                esportivas e touring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Processo de Qualidade */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
              <Settings size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-primary">
                Nosso Processo
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Controle de Qualidade Rigoroso
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seguimos processos rígidos de qualidade para garantir que cada
              produto atenda aos mais altos padrões
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-black text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Seleção de Materiais
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Utilizamos apenas materiais de primeira qualidade, testados
                    e aprovados para uso automotivo
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-yellow-300/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-black text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Controle de Produção
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitoramento rigoroso em todas as etapas do processo
                    produtivo para garantir consistência
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-black text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Testes de Qualidade
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cada produto passa por testes rigorosos de funcionamento e
                    durabilidade antes da distribuição
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-yellow-300/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-black text-lg">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Certificação Final
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Produtos certificados pelos órgãos competentes seguindo
                    normas técnicas brasileiras
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 lg:p-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  {/* Imagem de processo de qualidade */}
                  <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
                    <picture>
                      <source
                        media="(min-width: 1024px)"
                        srcSet="https://res.cloudinary.com/dn7nvyvss/image/upload/v1759207653/arno-senoner-bCgsKqFzUcg-unsplash_cebfvq.jpg?w=800&h=600&fit=crop&crop=center"
                      />
                      <source
                        media="(min-width: 768px)"
                        srcSet="https://res.cloudinary.com/dn7nvyvss/image/upload/v1759207653/arno-senoner-bCgsKqFzUcg-unsplash_cebfvq.jpg?w=600&h=450&fit=crop&crop=center"
                      />
                      <img
                        src="https://res.cloudinary.com/dn7nvyvss/image/upload/v1759207653/arno-senoner-bCgsKqFzUcg-unsplash_cebfvq.jpg?w=400&h=300&fit=crop&crop=center"
                        alt="Processo de controle de qualidade CRC Faróis - Testes e certificação"
                        className="w-full h-full object-cover"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Excelência Garantida
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Processo certificado de controle de qualidade
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary/5 rounded-xl p-4">
                      <div className="text-2xl font-black text-primary">
                        100%
                      </div>
                      <div className="text-xs text-gray-600">Testados</div>
                    </div>
                    <div className="bg-yellow-300/20 rounded-xl p-4">
                      <div className="text-2xl font-black text-yellow-600">
                        ISO
                      </div>
                      <div className="text-xs text-gray-600">Certificado</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 bg-primary text-white overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-white rounded-full blur-2xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
            <Package size={16} className="text-yellow-300 mr-2" />
            <span className="text-sm font-medium text-white/90">
              Solicite seu Orçamento
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Interessado em nossos{" "}
            <span className="text-yellow-300">produtos?</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Entre em contato conosco para conhecer nossa linha completa de
            produtos e solicitar um orçamento personalizado para seu negócio
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contato"
              className="bg-yellow-300 text-primary px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-400 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center shadow-xl"
            >
              Solicitar Orçamento
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
            >
              Área do Cliente
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
