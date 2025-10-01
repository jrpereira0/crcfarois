"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  Loader2,
  Shield,
  Lock,
  Key,
  AlertCircle,
} from "lucide-react";

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar código");
      }

      // Redirecionar para página de redefinição com o token
      router.push(
        `/redefinir-senha?token=${data.token}&email=${encodeURIComponent(
          email
        )}`
      );
    } catch (error: any) {
      setError(error.message || "Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-800">
        {/* Elementos flutuantes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-32 right-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 right-10 w-16 h-16 bg-yellow-300/30 rounded-full blur-xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Padrão de grid sutil */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.3'%3e%3ccircle cx='30' cy='30' r='1.5'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Lado esquerdo - Informações */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-md mx-auto">
            <div
              className="space-y-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div>
                <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                  Recuperar
                  <span className="block text-yellow-300">Sua Senha</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Não se preocupe! Enviaremos um código de verificação para
                  redefinir sua senha de forma segura.
                </p>
              </div>

              {/* Processo */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-300/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-300 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Digite seu email</h3>
                    <p className="text-white/80 text-sm">
                      Informe o email cadastrado em sua conta
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-300/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-300 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Receba o código por email
                    </h3>
                    <p className="text-white/80 text-sm">
                      Um código de 6 dígitos será enviado para você
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-300/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-yellow-300 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Redefina sua senha</h3>
                    <p className="text-white/80 text-sm">
                      Use o código para criar uma nova senha segura
                    </p>
                  </div>
                </div>
              </div>

              {/* Recursos de Segurança */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center">
                    <Shield className="text-yellow-300" size={24} />
                  </div>
                  <h3 className="text-lg font-bold">100% Seguro</h3>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-yellow-300" />
                    Código válido por apenas 15 minutos
                  </li>
                  <li className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-yellow-300" />
                    Uso único do código de verificação
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-300" />
                    Criptografia SSL 256-bit
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo Mobile */}
            <div className="lg:hidden text-center mb-6 sm:mb-8 animate-fade-in-up">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 mb-4">
                <Image
                  src="/logobranca.svg"
                  alt="CRC Faróis"
                  width={200}
                  height={73}
                  className="h-10 sm:h-12 w-auto"
                  priority
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Recuperar Senha
              </h1>
              <p className="text-sm sm:text-base text-white/90">
                Digite seu email para receber um código de verificação
              </p>
            </div>

            {/* Card do Formulário */}
            <div
              className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-6 hidden lg:block">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Recuperar Senha
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Digite seu email para receber o código de verificação
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-gray-900 placeholder-gray-400"
                      placeholder="seu@email.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span className="hidden sm:inline">Enviando código...</span>
                      <span className="sm:hidden">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Enviar código de verificação</span>
                      <span className="sm:hidden">Enviar código</span>
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Informações de Segurança */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4 text-green-500" />
                  Código válido por 15 minutos
                </div>
              </div>
            </div>

            {/* Voltar para Login */}
            <div
              className="text-center mt-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
              >
                <ArrowLeft className="h-5 w-5" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
