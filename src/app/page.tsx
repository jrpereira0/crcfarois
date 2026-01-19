import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  Truck,
  Phone,
  Mail,
  MapPin,
  Star,
  Package,
  DollarSign,
  Zap,
  Eye,
  Clock,
  Headphones,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ImageSlider from "@/components/ui/ImageSlider";

// URLs das imagens dos produtos (substitua pelos seus links)
const imagemFarol =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759204810/farois_y6guly.png";
const imagemLanterna =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759205419/lanternas_kpb6fu.png";
const imagemGrade =
  "https://res.cloudinary.com/dn7nvyvss/image/upload/v1759205956/grade_ylainu.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section com Slider - Largura Total */}
        <section className="bg-white">
          <ImageSlider />
        </section>

        {/* Quem Somos - Resumo */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  Tradição, Inovação e Tecnologia
                </div>

                <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  Especialistas em
                  <span className="text-primary">
                    {" "}
                    Faróis Automotivos e Lanternas
                  </span>
                </h2>

                <div className="space-y-6 text-base text-gray-700 leading-relaxed">
                  <p>
                    Há mais de <strong className="text-primary">3 anos</strong>{" "}
                    CRC Faróis é uma empresa especializada na fabricação e
                    fornecimento de faróis e lanternas automotivos de alta
                    qualidade, atendendo lojas, oficinas e distribuidores em
                    todo o Brasil.
                  </p>
                  <p>
                    Combinamos <strong>tradição familiar</strong> com tecnologia
                    de ponta para desenvolver soluções que atendem aos mais
                    rigorosos padrões de qualidade e segurança do mercado.
                  </p>
                </div>

                <div className="mt-8">
                  <Link
                    href="/quem-somos"
                    className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl group"
                  >
                    <span>Conheça Nossa História</span>
                    <ArrowRight
                      className="ml-3 group-hover:translate-x-1 transition-transform"
                      size={20}
                    />
                  </Link>
                </div>
              </div>

              <div className="relative">
                {/* Cards de informações */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Nossos Números
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-primary/5 rounded-xl">
                      <div className="text-3xl font-black text-primary mb-2">
                        3+
                      </div>
                      <div className="text-gray-700 font-medium">
                        Anos de Tradição
                      </div>
                    </div>

                    <div className="text-center p-4 bg-primary/5 rounded-xl">
                      <div className="text-3xl font-black text-primary mb-2">
                        200+
                      </div>
                      <div className="text-gray-700 font-medium">
                        Produtos Diferentes
                      </div>
                    </div>

                    <div className="text-center p-4 bg-primary/5 rounded-xl">
                      <div className="text-3xl font-black text-primary mb-2">
                        5000+
                      </div>
                      <div className="text-gray-700 font-medium">
                        Clientes Atendidos
                      </div>
                    </div>

                    <div className="text-center p-4 bg-primary/5 rounded-xl">
                      <div className="text-3xl font-black text-primary mb-2">
                        100%
                      </div>
                      <div className="text-gray-700 font-medium">
                        Brasil Coberto
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-primary font-semibold text-sm">
                        Desde 2022 atendendo o Brasil
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção CTA B2B - Cadastro na Plataforma */}
        <section className="relative py-20 lg:py-28 bg-primary overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
            <div className="max-w-5xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-white/20 animate-fade-in-up">
                <Star className="w-4 h-4 mr-2" />
                Plataforma B2B Exclusiva
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-8 leading-tight animate-fade-in-up animation-delay-200">
                Acesse Nosso{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">
                    Catálogo Completo
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full transform scale-x-0 animate-scale-x animation-delay-1000"></span>
                </span>
              </h2>

              {/* Description */}
              <p className="text-xl lg:text-lg text-white/90 leading-relaxed mb-12 max-w-4xl mx-auto animate-fade-in-up animation-delay-400">
                Cadastre-se gratuitamente em nossa plataforma B2B e tenha acesso
                exclusivo ao nosso catálogo completo com{" "}
                <span className="font-bold text-yellow-300 relative">
                  mais de 200 produtos
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-300 rounded-full"></span>
                </span>
                , preços especiais para revendedores e condições diferenciadas
                de pagamento.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="group text-center animate-fade-in-up animation-delay-600">
                  <div className="relative bg-white/10 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-white/20">
                    <Package className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                    Catálogo Completo
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Acesso a todos os nossos produtos com especificações
                    técnicas detalhadas e imagens em alta resolução
                  </p>
                </div>

                <div className="group text-center animate-fade-in-up animation-delay-700">
                  <div className="relative bg-white/10 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-white/20">
                    <DollarSign className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                    Preços Especiais
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Valores exclusivos para revendedores e distribuidores com
                    margem competitiva para seu negócio
                  </p>
                </div>

                <div className="group text-center animate-fade-in-up animation-delay-800">
                  <div className="relative bg-white/10 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-white/20">
                    <Zap className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                    Pedidos Rápidos
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Sistema integrado para pedidos ágeis com gestão de estoque
                    em tempo real e acompanhamento completo
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in-up animation-delay-1000">
                <Link
                  href="/cadastro"
                  className="group relative bg-white text-primary px-12 py-5 rounded-2xl font-bold inline-flex items-center justify-center shadow-2xl hover:shadow-white/20 transition-all duration-500 text-lg overflow-hidden hover:scale-105 transform"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                    Cadastrar Agora
                  </span>
                  <ArrowRight className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>

                <Link
                  href="/b2b"
                  className="group relative border-2 border-white/30 backdrop-blur-sm text-white px-12 py-5 rounded-2xl font-bold inline-flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-500 text-lg overflow-hidden hover:scale-105 transform hover:border-white"
                >
                  <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                    Conhecer Plataforma
                  </span>
                  <Eye className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-white/20 animate-fade-in-up animation-delay-1200">
                <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-medium">Cadastro gratuito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Aprovação em até 48h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-yellow-400" />
                    <span className="font-medium">Suporte dedicado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Produtos em Destaque */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full blur-2xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
                Nossos <span className="text-primary">Produtos</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                Soluções completas em iluminação automotiva desenvolvidas com a
                mais alta tecnologia e qualidade
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Faróis */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 animate-fade-in-up animation-delay-600 flex flex-col h-full">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Imagem PNG com fundo transparente */}
                      <Image
                        src={imagemFarol}
                        alt="Faróis Automotivos"
                        width={300}
                        height={300}
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      Faróis Automotivos
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Os mais diversos modelos de faróis para todos os tipos de
                      veículos, desde compactos até sedans premium.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Faróis de milha</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Faróis principais</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Faróis completos </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/login"
                    className="group/btn relative w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold inline-flex items-center justify-center overflow-hidden transition-all duration-500 hover:bg-primary/90 hover:scale-105 transform mt-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Ver Catálogo</span>
                    <ExternalLink className="relative z-10 ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </div>
              </div>

              {/* Lanternas Traseiras */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 animate-fade-in-up animation-delay-700 flex flex-col h-full">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Imagem PNG com fundo transparente */}
                      <Image
                        src={imagemLanterna}
                        alt="Lanternas Traseiras"
                        width={230}
                        height={230}
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      Lanternas Traseiras
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      A maior variedade de lanternas do mercado, todas com
                      qualidade e durabilidade garantida.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Lanternas cristal</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Lanternas com mascára negra</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Lanternas de LED</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/login"
                    className="group/btn relative w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold inline-flex items-center justify-center overflow-hidden transition-all duration-500 hover:bg-primary/90 hover:scale-105 transform mt-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Ver Catálogo</span>
                    <ExternalLink className="relative z-10 ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </div>
              </div>

              {/* Grade Frontal */}
              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 animate-fade-in-up animation-delay-800 flex flex-col h-full">
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary to-blue-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Imagem PNG com fundo transparente */}
                      <Image
                        src={imagemGrade}
                        alt="Grade Frontal"
                        width={300}
                        height={300}
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      Grade Frontal
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Grades frontais, frisos e emblemas para todos os modelos
                      de veículos, tudo a pronta entrega.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Grade do radiador</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Grade inferior</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span>Grade dos milhas</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/login"
                    className="group/btn relative w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold inline-flex items-center justify-center overflow-hidden transition-all duration-500 hover:bg-primary/90 hover:scale-105 transform mt-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Ver Catálogo</span>
                    <ExternalLink className="relative z-10 ml-3 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contato Rápido */}
        <section className="relative py-20 lg:py-28 bg-primary overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float"></div>
            <div
              className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl animate-float"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-white/20 animate-fade-in-up">
                <Phone className="w-4 h-4 mr-2" />
                Fale Conosco
              </div>

              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight animate-fade-in-up animation-delay-200">
                Pronto para encontrar o{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">
                    os produtos ideais?
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full transform scale-x-0 animate-scale-x animation-delay-1000"></div>
                </span>
              </h2>

              <p className="text-xl lg:text-lg text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                Nossa equipe especializada está pronta para atender suas
                necessidades com{" "}
                <span className="font-bold text-yellow-300">
                  soluções personalizadas
                </span>{" "}
                e suporte técnico completo.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Telefone */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-500 animate-fade-in-up animation-delay-600">
                <div className="relative bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                  <Phone
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                    size={36}
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                  Telefone
                </h3>
                <p className="text-lg text-white/90 mb-4 font-semibold">
                  (11) 99226-8645
                </p>
                <div className="space-y-2">
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                    Seg - Qui: 8h às 17h
                  </div>
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                    Sex: 8h às 16h
                  </div>
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    <Clock className="w-3 h-3 mr-2 text-blue-400" />
                    Atendimento imediato
                  </div>
                </div>
              </div>

              {/* E-mail */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-500 animate-fade-in-up animation-delay-700">
                <div className="relative bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                  <Mail
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                    size={36}
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                  E-mail
                </h3>
                <p className="text-lg text-white/90 mb-4 font-semibold break-all">
                  contato@crcfarois.ind.br
                </p>
                <div className="space-y-2">
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                    Resposta em até 48h
                  </div>
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    <Headphones className="w-3 h-3 mr-2 text-yellow-400" />
                    Suporte técnico
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-500 animate-fade-in-up animation-delay-800">
                <div className="relative bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                  <MapPin
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                    size={36}
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                  Localização
                </h3>
                <p className="text-lg text-white/90 mb-4 font-semibold">
                  Santo André
                </p>
                <div className="space-y-2">
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    <MapPin className="w-3 h-3 mr-2 text-red-400" />
                    ABC Paulista - SP
                  </div>
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    <Truck className="w-3 h-3 mr-2 text-green-400" />
                    Entrega nacional
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-1000">
              <Link
                href="/contato"
                className="group relative bg-white text-primary px-12 py-5 rounded-2xl font-bold inline-flex items-center justify-center shadow-2xl hover:shadow-white/20 transition-all duration-500 text-lg overflow-hidden hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Phone className="relative z-10 mr-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  Solicitar Orçamento
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>

              <Link
                href="/login"
                className="group relative border-2 border-white/30 backdrop-blur-sm text-white px-12 py-5 rounded-2xl font-bold inline-flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-500 text-lg overflow-hidden hover:scale-105 transform hover:border-white"
              >
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  Área do Cliente
                </span>
                <ArrowRight className="relative z-10 ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Link>

              <div className="lg:ml-8 text-center">
                <div className="text-white/70 text-sm mb-2">Disponível das</div>
                <div className="text-white font-bold">
                  8h às 17h • Seg - Qui
                  <br />
                  8h às 16h • Sex
                </div>
                <div className="text-yellow-300 text-sm font-semibold mt-1">
                  ✨ Atendimento especializado
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-white/20 animate-fade-in-up animation-delay-1200">
              <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-medium">3+ anos de experiência</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Equipe especializada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">Produtos certificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Entrega em todo Brasil</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
