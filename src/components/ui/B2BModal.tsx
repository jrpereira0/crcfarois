"use client";

import { useState, useEffect } from "react";
import { X, Building2, Users, Package, ArrowRight } from "lucide-react";
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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-white/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-white shadow-md"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

          {/* Header Compacto com Gradiente */}
          <div className="relative bg-gradient-to-br from-primary to-blue-600 p-6 pb-8">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-3 border border-white/30">
                <Building2 className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-black text-white mb-1 leading-tight">
                Vendas Exclusivas B2B
              </h2>
              <p className="text-white/90 text-sm font-medium">
                Atacado para empresas
              </p>
            </div>
          </div>

          {/* Content Compacto */}
          <div className="p-5 -mt-4">
            {/* Card com informações */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
              <p className="text-gray-700 text-xs leading-relaxed mb-3 text-center">
                Vendemos <span className="font-bold text-primary">exclusivamente no atacado</span> para:
              </p>

              <div className="space-y-2.5">
                {/* Empresas com CNPJ */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="text-primary" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Empresas com CNPJ
                    </h3>
                  </div>
                </div>

                {/* Revendedores */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-primary" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Revendedores
                    </h3>
                  </div>
                </div>

                {/* Distribuidores */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="text-primary" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">
                      Distribuidores
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefícios Compactos */}
            <div className="bg-primary/5 rounded-xl p-3 mb-4 border border-primary/10">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                  <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Preços atacado</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                  <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                  <span>+200 produtos</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                  <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Pagamento facilitado</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
                  <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Suporte dedicado</span>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-2.5">
              <Link
                href="/cadastro"
                onClick={handleClose}
                className="w-full group relative bg-primary text-white py-3 px-5 rounded-xl font-bold text-sm inline-flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] transform shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Cadastrar Minha Empresa</span>
                <ArrowRight className="relative z-10 ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <button
                onClick={handleContinue}
                className="w-full px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              >
                Continuar Navegando
              </button>
            </div>

            {/* Nota Compacta */}
            <p className="text-center text-[10px] text-gray-500 mt-3 leading-tight">
              <strong>Importante:</strong> Não vendemos para pessoa física
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

