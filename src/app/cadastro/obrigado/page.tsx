"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Home,
  MessageCircle,
  Shield,
  Star,
  Package,
  Users,
  Award,
  Truck,
} from "lucide-react";

export default function ObrigadoPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-blue-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-primary via-blue-600 to-blue-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>

            {/* Main Title */}
            <h1
              className="text-5xl lg:text-6xl font-black text-white mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Cadastro Enviado!
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Sua solicitação foi recebida com sucesso. Em breve você terá
              acesso à nossa plataforma B2B.
            </p>

            {/* Logo */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block border border-white/20">
                <Image
                  src="/logobranca.svg"
                  alt="CRC Faróis"
                  width={200}
                  height={73}
                  className="h-14 w-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Process Timeline */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Como funciona o processo
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Acompanhe as etapas do seu cadastro até a liberação do acesso
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Clock className="text-white" size={32} />
                      </div>
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                        1
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Análise dos Dados
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Nossa equipe verificará as informações da sua empresa
                      </p>
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm font-semibold text-primary">
                          Prazo: até 48 horas
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Connector Line */}
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Mail className="text-white" size={32} />
                      </div>
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                        2
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Resposta por E-mail
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Você receberá o resultado da análise com instruções
                      </p>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-sm font-semibold text-green-700">
                          Verifique sua caixa de entrada
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Connector Line */}
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Star className="text-white" size={32} />
                      </div>
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                        3
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Acesso Liberado
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Comece a usar a plataforma B2B com todos os benefícios
                      </p>
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <p className="text-sm font-semibold text-yellow-700">
                          Aproveite os preços especiais
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Vantagens da Plataforma B2B
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubra todos os benefícios que preparamos para você
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  200+ Produtos
                </h3>
                <p className="text-gray-600 text-sm">
                  Catálogo completo com toda linha de faróis automotivos
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Preços Exclusivos
                </h3>
                <p className="text-gray-600 text-sm">
                  Condições especiais e descontos para revendedores
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Suporte Técnico
                </h3>
                <p className="text-gray-600 text-sm">
                  Equipe especializada para orientação e dúvidas
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Entrega Nacional
                </h3>
                <p className="text-gray-600 text-sm">
                  Cobertura completa para todo território brasileiro
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12 border border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Precisa de Ajuda?
                  </h3>
                  <p className="text-gray-600">
                    Nossa equipe está pronta para esclarecer suas dúvidas
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <a
                    href="tel:(11) 97900-2183"
                    className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Phone
                          className="text-primary group-hover:text-white"
                          size={20}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Ligue Agora
                        </h4>
                        <p className="text-primary font-semibold">
                          (11) 97900-2183
                        </p>
                        <p className="text-sm text-gray-600">
                          Segunda à Quinta: 8h às 17h <br />
                          Sexta: 8h às 16h
                        </p>
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:contato@crcfarois.ind.br"
                    className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Mail
                          className="text-primary group-hover:text-white"
                          size={20}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Envie um E-mail
                        </h4>
                        <p className="text-primary font-semibold">
                          contato@crcfarois.ind.br
                        </p>
                        <p className="text-sm text-gray-600">
                          Resposta em até 48 horas
                        </p>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/70 rounded-lg p-4 text-center">
                    <Award className="text-primary mx-auto mb-2" size={24} />
                    <p className="text-sm font-semibold text-gray-900">
                      3+ Anos
                    </p>
                    <p className="text-xs text-gray-600">de Experiência</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 text-center">
                    <Shield className="text-primary mx-auto mb-2" size={24} />
                    <p className="text-sm font-semibold text-gray-900">
                      Certificado
                    </p>
                    <p className="text-xs text-gray-600">Produtos Testados</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 text-center">
                    <Users className="text-primary mx-auto mb-2" size={24} />
                    <p className="text-sm font-semibold text-gray-900">1000+</p>
                    <p className="text-xs text-gray-600">Clientes Atendidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/"
                className="group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 inline-flex items-center"
              >
                <Home
                  size={20}
                  className="mr-3 group-hover:scale-110 transition-transform duration-300"
                />
                Voltar ao Site Principal
              </Link>

              <Link
                href="/contato"
                className="group border-2 border-primary bg-white text-primary px-10 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 inline-flex items-center"
              >
                <MessageCircle
                  size={20}
                  className="mr-3 group-hover:scale-110 transition-transform duration-300"
                />
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 CRC Faróis - Especialistas em iluminação automotiva há mais
            de 3 anos
          </p>
        </div>
      </div>
    </div>
  );
}
