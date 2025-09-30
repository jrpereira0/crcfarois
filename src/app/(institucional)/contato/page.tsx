"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageCircle,
  Headphones,
  Users,
} from "lucide-react";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    assunto: "",
    mensagem: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset após 5 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        empresa: "",
        assunto: "",
        mensagem: "",
      });
    }, 5000);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <MessageCircle size={20} className="text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white/90">
                Fale Conosco
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-6">
              Entre em <span className="text-yellow-300">Contato</span>
            </h1>
            <p className="text-xl lg:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
              Estamos prontos para atendê-lo e oferecer as melhores soluções em
              faróis automotivos com atendimento especializado
            </p>
          </div>
        </div>
      </section>

      {/* Canais de Atendimento Modernos */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Headphones size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-primary">
                Atendimento Especializado
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fale Conosco Agora
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha a melhor forma de entrar em contato. Nossa equipe está
              pronta para atender você
            </p>
          </div>

          {/* Cards de Contato Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Telefone - Card Principal */}
            <div className="group relative bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-8 text-white overflow-hidden hover:scale-105 transition-all duration-500 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/20 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ligue Agora</h3>
                <p className="text-white/90 mb-6">
                  Fale diretamente com nossa equipe especializada
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full mr-3"></div>
                    <span className="text-xl font-semibold">
                      (11) 99226-8645
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-white/80 mr-3" />
                    <span className="text-white/80">
                      Segunda a Quinta: 8h às 17h
                      <br />
                      Sexta: 8h às 16h

                    </span>
                  </div>
                </div>
                <a
                  href="tel:(11)99226-8645"
                  className="inline-flex items-center mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 group-hover:translate-x-1"
                >
                  <Phone size={16} className="mr-2" />
                  Ligar Agora
                </a>
              </div>
            </div>

            {/* E-mail - Card Principal */}
            <div className="group relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 text-primary overflow-hidden hover:scale-105 transition-all duration-500 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/20 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Envie um E-mail</h3>
                <p className="text-primary/80 mb-6">
                  Receba uma resposta detalhada em até 24 horas
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="font-semibold">
                      contato@crc.ind.br
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-primary/70 mr-3" />
                    <span className="text-primary/70">
                      Resposta em até 24 horas
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:contato@crc.ind.br"
                  className="inline-flex items-center mt-6 bg-white/30 backdrop-blur-sm hover:bg-white/40 text-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 group-hover:translate-x-1"
                >
                  <Mail size={16} className="mr-2" />
                  Enviar E-mail
                </a>
              </div>
            </div>
          </div>

          {/* Informações Complementares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="text-primary" size={20} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Localização</h4>
              <p className="text-gray-600 text-sm">
                São André - SP
                <br />
                ABC Paulista
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-yellow-600" size={20} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Equipe Especializada
              </h4>
              <p className="text-gray-600 text-sm">
                Profissionais qualificados
                <br />
                em faróis automotivos
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="text-primary" size={20} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Suporte Completo
              </h4>
              <p className="text-gray-600 text-sm">
                Atendimento técnico
                <br />e comercial
              </p>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Prefere um formulário?
                </h3>
                <p className="text-gray-600 mb-6">
                  Preencha os dados abaixo e entraremos em contato com você o
                  mais breve possível.
                </p>
              </div>

              {/* Vantagens do Contato */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Orçamento Personalizado
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Receba um orçamento detalhado para suas necessidades
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Consultoria Técnica
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Orientação especializada para escolha dos produtos
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Condições Especiais
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Preços diferenciados para revendedores
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-4">
                  <Send size={16} className="text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    Formulário de Contato
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Envie sua Mensagem
                </h3>
                <p className="text-gray-600">
                  Preencha o formulário e entraremos em contato
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle
                    className="text-green-500 mx-auto mb-4"
                    size={64}
                  />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Mensagem Enviada!
                  </h4>
                  <p className="text-gray-600">
                    Obrigado pelo contato. Retornaremos em breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="nome"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Nome *
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="telefone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="empresa"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Empresa
                      </label>
                      <input
                        type="text"
                        id="empresa"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="assunto"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Assunto *
                    </label>
                    <select
                      id="assunto"
                      name="assunto"
                      required
                      value={formData.assunto}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="orcamento">
                        Solicitação de Orçamento
                      </option>
                      <option value="produtos">
                        Informações sobre Produtos
                      </option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="parceria">Parceria Comercial</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="mensagem"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mensagem *
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      required
                      rows={5}
                      value={formData.mensagem}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-300"
                      placeholder="Descreva sua necessidade ou dúvida..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4 px-6 rounded-xl hover:bg-primary/90 hover:scale-105 transition-all duration-300 font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={20} />
                        Enviar Mensagem
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    * Campos obrigatórios
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 lg:py-24 bg-primary overflow-hidden">
        {/* Background animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-white rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Users size={16} className="text-yellow-300 mr-2" />
              <span className="text-sm font-medium text-white/90">
                Dúvidas Frequentes
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Respostas para as dúvidas mais comuns dos nossos clientes sobre
              produtos e atendimento
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-2">
                Quem pode comprar os produtos da CRC Faróis?
              </h3>
              <p className="text-white/80 leading-relaxed">
                Qualquer pessoa pode comprar os produtos, desde que tenham cnpj
                para compras comerciais.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-2">
                Vocês oferecem garantia nos produtos?
              </h3>
              <p className="text-white/80 leading-relaxed">
                Sim, todos os nossos produtos possuem garantia de qualidade. O
                período de garantia varia conforme o tipo de produto, mas
                geralmente é de 3 meses contra defeitos de fabricação.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-2">
                Como posso saber se o produto é compatível com o veículo?
              </h3>
              <p className="text-white/80 leading-relaxed">
                Nossa equipe técnica especializada pode ajudá-lo a identificar o
                produto correto. Basta informar a marca, modelo e ano do veículo
                que faremos a verificação completa de compatibilidade.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:bg-white/20 hover:shadow-2xl transition-all duration-500">
              <h3 className="text-lg font-semibold text-white mb-2">
                Vocês atendem todo o Brasil?
              </h3>
              <p className="text-white/80 leading-relaxed">
                Sim, atendemos todo o território nacional através da nossa rede
                de distribuição estratégica. Temos parceiros em todas as regiões
                para garantir a entrega rápida e segura dos produtos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
            <MessageCircle size={16} className="text-primary mr-2" />
            <span className="text-sm font-medium text-primary">
              Atendimento Direto
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nossa equipe especializada está pronta para esclarecer todas as suas
            dúvidas e ajudar com suas necessidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="tel:(11)99226-8645"
              className="bg-yellow-300 text-primary px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-400 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center shadow-xl"
            >
              <Phone className="mr-2" size={20} />
              Ligar Agora
            </a>
            <a
              href="mailto:contato@crc.ind.br"
              className="border-2 border-primary bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Mail className="mr-2" size={20} />
              Enviar E-mail
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
