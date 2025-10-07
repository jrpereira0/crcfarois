"use client";

import { useState, useEffect } from "react";
import { X, Building2, Users, Package, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function B2BModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se o modal já foi exibido nesta sessão
    const modalShown = sessionStorage.getItem("b2bModalShown");
    
    if (!modalShown) {
      // Aguarda 800ms para exibir o modal (melhor UX)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Marca que o modal foi exibido nesta sessão
    sessionStorage.setItem("b2bModalShown", "true");
  };

  const handleContinue = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full pointer-events-auto animate-scale-in overflow-hidden max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-white"
            aria-label="Fechar"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Header com Gradiente */}
          <div className="relative bg-gradient-to-br from-primary via-blue-600 to-primary p-6 pb-10 sm:p-8 sm:pb-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 border-2 border-white/30">
                <Building2 className="text-white" size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3 leading-tight">
                Vendas Exclusivas B2B
              </h2>
              <p className="text-white/90 text-base sm:text-lg font-medium">
                Atacado para empresas e distribuidores
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 -mt-4 sm:-mt-6">
            {/* Card com informações */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 shadow-lg">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 text-center">
                <span className="font-bold text-primary">CRC Faróis</span> trabalha exclusivamente com{" "}
                <span className="font-bold text-gray-900">vendas no atacado</span> para:
              </p>

              <div className="space-y-3 sm:space-y-4">
                {/* Empresas com CNPJ */}
                <div className="flex items-start gap-3 sm:gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Building2 className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-base sm:text-lg">
                      Empresas com CNPJ
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      Oficinas, autocenters e lojas de autopeças cadastradas
                    </p>
                  </div>
                </div>

                {/* Revendedores */}
                <div className="flex items-start gap-3 sm:gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Users className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-base sm:text-lg">
                      Revendedores Autorizados
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      Representantes comerciais e revendedores parceiros
                    </p>
                  </div>
                </div>

                {/* Distribuidores */}
                <div className="flex items-start gap-3 sm:gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Package className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-base sm:text-lg">
                      Distribuidores
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      Distribuidores regionais e nacionais de autopeças
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 border border-primary/10">
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <CheckCircle className="text-primary" size={18} />
                Benefícios de ser nosso parceiro:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Preços competitivos no atacado</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Condições especiais de pagamento</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Catálogo com +200 produtos</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Suporte técnico dedicado</span>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Link
                href="/cadastro"
                onClick={handleClose}
                className="flex-1 group relative bg-primary text-white py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base inline-flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:scale-105 transform shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Cadastrar Minha Empresa</span>
                <ArrowRight className="relative z-10 ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <button
                onClick={handleContinue}
                className="sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base text-gray-700 hover:text-gray-900 transition-all duration-300 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300"
              >
                Continuar Navegando
              </button>
            </div>

            {/* Nota */}
            <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4 leading-relaxed">
              💡 <strong>Importante:</strong> Não realizamos vendas para consumidores finais (pessoa física).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

