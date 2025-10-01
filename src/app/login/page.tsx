"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Shield,
  ChevronRight,
  AlertCircle,
  UserPlus,
  Car,
  Lightbulb,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Verificar se já está logado
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        // Redirecionar baseado no role
        if (session.user.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/b2b");
        }
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas. Verifique seu email e senha.");
      } else {
        // Buscar a sessão atualizada e redirecionar manualmente
        setTimeout(async () => {
          const session = await getSession();
          if (session?.user?.role === "ADMIN") {
            router.push("/dashboard");
          } else if (session?.user?.role === "CLIENTE") {
            router.push("/b2b");
          } else {
            router.push("/dashboard"); // fallback para admin
          }
        }, 100);
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-blue-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

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
        {/* Lado esquerdo - Informações da empresa */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-top pt-12 px-12 text-white">
          <div className="max-w-md mx-auto">
            <div
              className="space-y-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div>
                <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                  Bem-vindo à
                  <span className="block text-yellow-300">CRC Faróis B2B</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  A plataforma de vendas mais completa do mercado. O melhor
                  valor para você ter uma boa margem de lucro na suas vendas.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Catálogo Completo</h3>
                    <p className="text-white/80 text-sm">
                      Mais de 200 produtos disponíveis
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center">
                    <Car className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Compatibilidade Garantida</h3>
                    <p className="text-white/80 text-sm">
                      Produtos para todos os modelos
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center">
                    <Star className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Qualidade Premium</h3>
                    <p className="text-white/80 text-sm">
                      Produtos certificados e testados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário de login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Logo mobile */}
            <div className="lg:hidden text-center mb-8 animate-fade-in-up">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 inline-block">
                <Image
                  src="/logobranca.svg"
                  alt="CRC Faróis"
                  width={200}
                  height={73}
                  className="h-12 w-auto"
                  priority
                />
              </div>
            </div>

            {/* Card de Login */}
            <div
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2">
                  Faça seu Login
                </h2>
                <p className="text-gray-600">
                  Acesse sua conta e explore nosso catálogo
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-4 pr-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white hover:border-primary/50"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 block"
                  >
                    Senha
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="block w-full pl-4 pr-12 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white hover:border-primary/50"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Esqueceu a senha */}
                <div className="flex justify-end">
                  <Link
                    href="/esqueci-senha"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                {/* Mensagem de Erro */}
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

                {/* Botão de Login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Acessar Plataforma
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              {/* Informações de Segurança */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4 text-green-500" />
                  Conexão segura SSL 256-bit
                </div>
              </div>
            </div>

            {/* Cadastro */}
            <div
              className="text-center mt-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Primeira vez aqui?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Solicite o cadastro da sua empresa e tenha acesso ao nosso
                    catálogo completo
                  </p>
                </div>
                <Link
                  href="/cadastro"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-primary px-6 py-3 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
                >
                  <UserPlus className="h-5 w-5" />
                  Solicitar Cadastro
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div
              className="text-center mt-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-sm text-white/80">
                © 2025 CRC Faróis - Ilumine o seu caminho.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
