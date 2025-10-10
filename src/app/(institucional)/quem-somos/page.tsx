"use client";

import {
  Award,
  Users,
  Target,
  Heart,
  Clock,
  MapPin,
  Building2,
  Lightbulb,
  CheckCircle,
  Star,
  Calendar,
  TrendingUp,
  UserCheck,
} from "lucide-react";

export default function QuemSomos() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-12 sm:py-16 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Building2 size={18} className="text-yellow-300 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Sobre a CRC Faróis
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 sm:mb-6 px-2">
              Conheça Nossa História
            </h1>
            <p className="text-base sm:text-lg lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto px-4">
              Há mais de 3 anos no mercado, somos especialistas em faróis
              automotivos e lanternas traseiras, oferecendo produtos de alta
              qualidade e excelência no atendimento.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-primary/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
                <Calendar size={14} className="text-primary mr-2" />
                <span className="text-xs sm:text-sm font-medium text-primary">
                  Nossa Trajetória
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
                Nossa História
              </h2>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  A CRC Faróis nasceu com a missão de revolucionar o mercado de
                  <strong className="text-primary">
                    {" "}
                    faróis automotivos
                  </strong>{" "}
                  no Brasil. Desde o início, nossa empresa se destacou pela
                  busca constante da excelência e pela dedicação em oferecer
                  produtos de alta qualidade.
                </p>
                <p>
                  Nossa trajetória é marcada por{" "}
                  <strong className="text-primary">
                    crescimento constante
                  </strong>{" "}
                  e inovação. Construímos uma reputação sólida baseada na
                  confiança de nossos clientes, na qualidade de nossos produtos
                  e na excelência do nosso atendimento.
                </p>
                <p>
                  Hoje, somos reconhecidos como uma das principais empresas do
                  setor, atendendo clientes em todo o território nacional com
                  produtos que atendem aos mais rigorosos padrões de{" "}
                  <strong className="text-primary">
                    qualidade e segurança
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 text-center">
                  {/* Imagem da empresa */}
                  <div className="relative w-full h-40 sm:h-48 mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden">
                    <picture>
                      <source
                        media="(min-width: 1024px)"
                        srcSet="https://res.cloudinary.com/dn7nvyvss/image/upload/v1759207248/lenny-kuhne-jHZ70nRk7Ns-unsplash_ie54ip.jpg?w=800&h=400&fit=crop&crop=center"
                      />
                      <source
                        media="(min-width: 768px)"
                        srcSet="https://res.cloudinary.com/dn7nvyvss/image/upload/v1759207248/lenny-kuhne-jHZ70nRk7Ns-unsplash_ie54ip.jpg?w=600&h=300&fit=crop&crop=center"
                      />
                      <img
                        src="https://res.cloudinary.com/dn7nvyvss/image/upload/v1759207248/lenny-kuhne-jHZ70nRk7Ns-unsplash_ie54ip.jpg?w=400&h=200&fit=crop&crop=center"
                        alt="Fábrica CRC Faróis - Produção de faróis automotivos"
                        className="w-full h-full object-cover"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    CRC Faróis
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Especialistas em faróis automotivos e lanternas traseiras
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div className="bg-primary/5 rounded-xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-black text-primary">
                        3+
                      </div>
                      <div className="text-xs text-gray-600">Anos</div>
                    </div>
                    <div className="bg-yellow-300/20 rounded-xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-black text-yellow-600">
                        100%
                      </div>
                      <div className="text-xs text-gray-600">Qualidade</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
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
              <Target size={14} className="text-yellow-300 mr-2" />
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Nossos Pilares
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">
              Missão, Visão e Valores
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Os princípios que guiam nossa empresa e definem nossa identidade
              no mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Missão */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-colors duration-300">
                <Target
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Missão
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Fornecer soluções completas em{" "}
                <strong className="text-yellow-300">
                  iluminação automotiva
                </strong>{" "}
                com produtos de alta qualidade, sempre focando na segurança e
                satisfação de nossos clientes.
              </p>
            </div>

            {/* Visão */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-yellow-300/30 transition-colors duration-300">
                <Award
                  className="text-yellow-300 group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Visão
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Ser reconhecida como a{" "}
                <strong className="text-yellow-300">
                  principal referência
                </strong>{" "}
                em faróis automotivos no Brasil, expandindo nossa presença e
                liderança no mercado nacional.
              </p>
            </div>

            {/* Valores */}
            <div
              className="group bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-colors duration-300">
                <Heart
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  size={24}
                />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                Valores
              </h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                <strong className="text-yellow-300">Qualidade</strong>,
                integridade, inovação, compromisso com o cliente e
                responsabilidade social são os valores que norteiam todas as
                nossas ações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Números da Empresa */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <TrendingUp size={14} className="text-primary mr-2" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Nossos Números
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              CRC Faróis em Números
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Dados que demonstram nossa trajetória de sucesso e crescimento
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-4 sm:p-6 lg:p-8 bg-primary/5 rounded-2xl sm:rounded-3xl hover:bg-primary/10 transition-colors duration-300 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="text-primary" size={20} />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-1 sm:mb-2">
                3+
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                Anos de Experiência
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 lg:p-8 bg-yellow-300/10 rounded-2xl sm:rounded-3xl hover:bg-yellow-300/20 transition-colors duration-300 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="text-yellow-600" size={20} />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-yellow-600 mb-1 sm:mb-2">
                200+
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                Produtos Diferentes
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 lg:p-8 bg-primary/5 rounded-2xl sm:rounded-3xl hover:bg-primary/10 transition-colors duration-300 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-primary" size={20} />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary mb-1 sm:mb-2">
                1000+
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                Clientes Atendidos
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 lg:p-8 bg-yellow-300/10 rounded-2xl sm:rounded-3xl hover:bg-yellow-300/20 transition-colors duration-300 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="text-yellow-600" size={20} />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-yellow-600 mb-1 sm:mb-2">
                100%
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                Brasil Atendido
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-primary overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/3 left-1/3 w-48 h-48 bg-white rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Users size={16} className="text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white/90">
                Nossa Equipe
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Profissionais Especializados
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Equipe qualificada e comprometida com a excelência no atendimento
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Equipe Técnica Especializada
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      Profissionais com amplo conhecimento em produtos
                      automotivos, prontos para orientar e atender suas
                      necessidades com excelência.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Atendimento Ágil
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      Processos otimizados para garantir rapidez no atendimento
                      e agilidade na entrega dos produtos para todo o Brasil.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <UserCheck className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Compromisso com o Cliente
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      Relacionamento próximo e duradouro, sempre priorizando a
                      satisfação e o sucesso de nossos parceiros comerciais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 lg:p-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  {/* Imagem da equipe */}
                  <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
                    <picture>
                      <source
                        media="(min-width: 1024px)"
                        srcSet="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&crop=center"
                      />
                      <source
                        media="(min-width: 768px)"
                        srcSet="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=300&fit=crop&crop=center"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop&crop=center"
                        alt="Equipe profissional CRC Faróis - Especialistas em atendimento automotivo"
                        className="w-full h-full object-cover"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Excelência Garantida
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Equipe dedicada e especializada em atendimento automotivo
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        Atendimento Especializado
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        Suporte Técnico
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">
                        Entrega Rápida
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <MapPin size={14} className="text-primary mr-2" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Nossa Localização
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-4">
              Localização Estratégica
            </h2>
            <p className="text-base sm:text-lg lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Estrategicamente localizada em São André - SP, no coração do ABC
              Paulista
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">
                ABC Paulista - Região Estratégica
              </h3>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Nossa sede está localizada em{" "}
                  <strong className="text-primary">São André - SP</strong>, uma
                  das principais cidades do ABC Paulista, região conhecida como
                  o berço da indústria automotiva brasileira.
                </p>
                <p>
                  Esta localização estratégica nos permite estar próximos aos
                  principais centros de distribuição e facilita o{" "}
                  <strong className="text-primary">
                    acesso a todo o território nacional
                  </strong>{" "}
                  para entrega de nossos produtos.
                </p>
                <p>
                  A proximidade com as principais montadoras e fornecedores do
                  setor automotivo nos mantém sempre atualizados com as{" "}
                  <strong className="text-primary">
                    últimas tendências e tecnologias
                  </strong>{" "}
                  do mercado.
                </p>
              </div>

              <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl font-black text-primary">
                    ABC
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Paulista
                  </div>
                </div>
                <div className="bg-yellow-300/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl font-black text-yellow-600">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Brasil</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 text-center">
                  {/* Imagem da região ABC */}
                  <div className="relative w-full h-40 sm:h-48 mb-4 sm:mb-6 rounded-lg sm:rounded-xl overflow-hidden">
                    <picture>
                      <source
                        media="(min-width: 1024px)"
                        srcSet="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=400&fit=crop&crop=center"
                      />
                      <source
                        media="(min-width: 768px)"
                        srcSet="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=600&h=300&fit=crop&crop=center"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=400&h=200&fit=crop&crop=center"
                        alt="São André - ABC Paulista, região industrial e estratégica"
                        className="w-full h-full object-cover"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    São André - SP
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    ABC Paulista - Região Industrial
                  </p>
                  <div className="bg-primary/5 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      Horário de Funcionamento
                    </p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">
                      Seg - Qui: 8h às 17h <br />
                      Sex: 8h às 16h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
