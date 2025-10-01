"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Building2,
  Save,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lock,
  MessageCircle,
  Search,
  Eye,
  EyeOff,
  Send,
  Shield,
  UserPlus,
  Star,
  Clock,
} from "lucide-react";
import {
  formatCnpjCpf,
  formatCep,
  formatTelefone,
  formatWhatsapp,
  unformatValue,
} from "@/lib/formatters";

interface SolicitacaoForm {
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  tipoEmpresa: string;
  nomeResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel: string;
  whatsappResponsavel: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  senha: string;
  confirmarSenha: string;
}

export default function CadastroClientePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [form, setForm] = useState<SolicitacaoForm>({
    razaoSocial: "",
    cnpj: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    tipoEmpresa: "",
    nomeResponsavel: "",
    emailResponsavel: "",
    telefoneResponsavel: "",
    whatsappResponsavel: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    senha: "",
    confirmarSenha: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Resetar estado de sucesso quando usuário começar a digitar
    if (isSuccess) {
      setIsSuccess(false);
      setMessage(null);
    }

    // Verificar se senhas coincidem
    if (name === "senha" || name === "confirmarSenha") {
      const senha = name === "senha" ? value : form.senha;
      const confirmarSenha =
        name === "confirmarSenha" ? value : form.confirmarSenha;

      if (senha && confirmarSenha) {
        setPasswordMatch(senha === confirmarSenha);
      } else {
        setPasswordMatch(null);
      }
    }
  };

  const buscarCep = async (cep: string) => {
    const cepLimpo = unformatValue(cep);
    if (cepLimpo.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setCepLoading(false);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!form.razaoSocial.trim()) errors.push("Razão Social é obrigatória");
    if (!form.cnpj.trim()) errors.push("CNPJ é obrigatório");
    if (!form.nomeResponsavel.trim())
      errors.push("Nome do responsável é obrigatório");
    if (!form.emailResponsavel.trim()) errors.push("Email é obrigatório");
    if (!form.whatsappResponsavel.trim()) errors.push("WhatsApp é obrigatório");
    if (!form.cep.trim()) errors.push("CEP é obrigatório");
    if (!form.endereco.trim()) errors.push("Endereço é obrigatório");
    if (!form.numero.trim()) errors.push("Número é obrigatório");
    if (!form.bairro.trim()) errors.push("Bairro é obrigatório");
    if (!form.cidade.trim()) errors.push("Cidade é obrigatória");
    if (!form.estado.trim()) errors.push("Estado é obrigatório");
    if (!form.senha.trim()) errors.push("Senha é obrigatória");
    if (!form.confirmarSenha.trim())
      errors.push("Confirmação de senha é obrigatória");

    // Validar CNPJ
    const cnpjLimpo = unformatValue(form.cnpj);
    if (cnpjLimpo.length !== 14) {
      errors.push("CNPJ deve ter 14 dígitos");
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.emailResponsavel)) {
      errors.push("Email inválido");
    }

    // Validar senhas
    if (form.senha !== form.confirmarSenha) {
      errors.push("Senhas não coincidem");
    }

    if (form.senha.length < 6) {
      errors.push("Senha deve ter pelo menos 6 caracteres");
    }

    return errors;
  };

  // Funções para navegar entre as etapas
  // Função para validar CNPJ
  const validarCNPJ = (cnpj: string): boolean => {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, "");

    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) return false;

    // Validação do primeiro dígito verificador
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    // Validação do segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  };

  // Função para validar email
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para validar WhatsApp (11 dígitos)
  const validarWhatsApp = (whatsapp: string): boolean => {
    const numero = whatsapp.replace(/\D/g, "");
    return numero.length === 11;
  };

  const validateStep = (step: number, showErrors: boolean = false): boolean => {
    switch (step) {
      case 1: // Dados da Empresa
        if (!form.razaoSocial.trim()) {
          if (showErrors) setMessage({ type: "error", text: "Razão Social é obrigatória" });
          return false;
        }
        if (!form.cnpj.trim()) {
          if (showErrors) setMessage({ type: "error", text: "CNPJ é obrigatório" });
          return false;
        }
        if (!validarCNPJ(form.cnpj)) {
          if (showErrors) setMessage({ type: "error", text: "CNPJ inválido" });
          return false;
        }
        if (showErrors) setMessage(null);
        return true;

      case 2: // Endereço da Empresa
        const camposEndereco = [
          { nome: "CEP", valor: form.cep },
          { nome: "Endereço", valor: form.endereco },
          { nome: "Número", valor: form.numero },
          { nome: "Bairro", valor: form.bairro },
          { nome: "Cidade", valor: form.cidade },
          { nome: "Estado", valor: form.estado },
        ];

        for (const campo of camposEndereco) {
          if (!campo.valor.trim()) {
            if (showErrors) setMessage({ type: "error", text: `${campo.nome} é obrigatório` });
            return false;
          }
        }

        if (form.cep.replace(/\D/g, "").length !== 8) {
          if (showErrors) setMessage({ type: "error", text: "CEP deve ter 8 dígitos" });
          return false;
        }

        if (showErrors) setMessage(null);
        return true;

      case 3: // Dados do Responsável
        if (!form.nomeResponsavel.trim()) {
          if (showErrors) setMessage({ type: "error", text: "Nome do responsável é obrigatório" });
          return false;
        }
        if (!form.whatsappResponsavel.trim()) {
          if (showErrors) setMessage({ type: "error", text: "WhatsApp é obrigatório" });
          return false;
        }
        if (!validarWhatsApp(form.whatsappResponsavel)) {
          if (showErrors) setMessage({
            type: "error",
            text: "WhatsApp inválido. Use o formato (11) 99999-9999",
          });
          return false;
        }
        if (showErrors) setMessage(null);
        return true;

      case 4: // Dados de Acesso
        if (!form.emailResponsavel.trim()) {
          if (showErrors) setMessage({ type: "error", text: "Email é obrigatório" });
          return false;
        }
        if (!validarEmail(form.emailResponsavel)) {
          if (showErrors) setMessage({ type: "error", text: "Email inválido" });
          return false;
        }
        if (!form.senha.trim()) {
          if (showErrors) setMessage({ type: "error", text: "Senha é obrigatória" });
          return false;
        }
        if (form.senha.length < 6) {
          if (showErrors) setMessage({ type: "error", text: "Senha deve ter pelo menos 6 caracteres" });
          return false;
        }
        if (!form.confirmarSenha.trim()) {
          if (showErrors) setMessage({ type: "error", text: "Confirmação de senha é obrigatória" });
          return false;
        }
        if (form.senha !== form.confirmarSenha) {
          if (showErrors) setMessage({ type: "error", text: "As senhas não coincidem" });
          return false;
        }
        if (showErrors) setMessage(null);
        return true;

      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep, true) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setMessage({
        type: "error",
        text: errors.join(", "),
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/solicitacoes-cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razaoSocial: form.razaoSocial.trim(),
          cnpj: unformatValue(form.cnpj),
          inscricaoEstadual: form.inscricaoEstadual.trim() || null,
          inscricaoMunicipal: form.inscricaoMunicipal.trim() || null,
          tipoEmpresa: form.tipoEmpresa || null,
          nomeResponsavel: form.nomeResponsavel.trim(),
          emailResponsavel: form.emailResponsavel.trim(),
          telefoneResponsavel: form.telefoneResponsavel
            ? unformatValue(form.telefoneResponsavel)
            : null,
          whatsappResponsavel: unformatValue(form.whatsappResponsavel),
          cep: unformatValue(form.cep),
          endereco: form.endereco.trim(),
          numero: form.numero.trim(),
          complemento: form.complemento.trim() || null,
          bairro: form.bairro.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim(),
          senha: form.senha,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setMessage({
          type: "success",
          text: "Solicitação enviada com sucesso! Redirecionando...",
        });

        // Redirecionar para página de agradecimento após 2 segundos
        setTimeout(() => {
          router.push("/cadastro/obrigado");
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "Erro ao enviar solicitação",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      setMessage({
        type: "error",
        text: "Erro de conexão. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tiposEmpresa = [
    "MEI",
    "Simples Nacional",
    "Lucro Presumido",
    "Lucro Real",
  ];

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

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

      <div className="relative z-10 min-h-screen flex items-center">
        {/* Lado esquerdo - Informações sobre o cadastro */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-center px-12 text-white">
          <div className="max-w-md mx-auto">
            <div
              className="space-y-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div>
                <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
                  Cadastre agora
                  <span className="block text-yellow-300">
                    na plataforma B2B
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Cadastre sua empresa e tenha acesso exclusivo ao nosso
                  catálogo completo com preços especiais para revendedores.
                </p>
              </div>

              {/* Benefícios */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center">
                    <Star className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Preços Exclusivos</h3>
                    <p className="text-white/80 text-sm">
                      Condições especiais para revendedores
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center">
                    <Shield className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Suporte Técnico</h3>
                    <p className="text-white/80 text-sm">
                      Equipe especializada para orientação
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-yellow-300/20 rounded-xl flex items-center justify-center">
                    <Clock className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Aprovação Rápida</h3>
                    <p className="text-white/80 text-sm">
                      Análise em até 24 horas úteis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="w-full lg:w-3/5 flex items-center justify-center px-4 py-12 overflow-y-auto">
          <div className="w-full max-w-2xl">
            {/* Logo e Header mobile */}
            <div className="lg:hidden text-center mb-8 animate-fade-in-up">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 inline-block mb-6">
                <Image
                  src="/logobranca.svg"
                  alt="CRC Faróis"
                  width={200}
                  height={73}
                  className="h-12 w-auto"
                  priority
                />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-black text-white mb-2">
                  Solicitar Cadastro
                </h2>
                <p className="text-white/90">
                  Preencha os dados da sua empresa para ter acesso ao nosso
                  sistema
                </p>
              </div>
            </div>

            {/* Formulário */}
            <div
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {/* Mensagem de feedback */}
              {message && (
                <div
                  className={`p-6 border-b-2 ${
                    message.type === "success"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {message.type === "success" ? (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p
                        className={`font-semibold ${
                          message.type === "success"
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {message.type === "success"
                          ? "Solicitação Enviada!"
                          : "Erro no Cadastro"}
                      </p>
                      <p
                        className={`text-sm ${
                          message.type === "success"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador de Etapas */}
              <div className="px-8 pt-8">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                          currentStep >= step
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 transition-all duration-300 ${
                            currentStep > step ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {currentStep === 1 && "Dados da Empresa"}
                    {currentStep === 2 && "Endereço da Empresa"}
                    {currentStep === 3 && "Dados do Responsável"}
                    {currentStep === 4 && "Dados de Acesso"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    {currentStep === 1 && "Informações básicas da sua empresa"}
                    {currentStep === 2 &&
                      "Endereço para entrega e correspondência"}
                    {currentStep === 3 && "Informações da pessoa responsável"}
                    {currentStep === 4 &&
                      "Email e senha para acessar o sistema"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Etapa 1: Dados da Empresa */}
                {currentStep === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                          Dados da Empresa
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600">
                          Informações básicas da sua empresa
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Razão Social *
                        </label>
                        <input
                          type="text"
                          name="razaoSocial"
                          value={form.razaoSocial}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Nome completo da empresa"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CNPJ *
                        </label>
                        <input
                          type="text"
                          name="cnpj"
                          value={formatCnpjCpf(form.cnpj)}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="00.000.000/0000-00"
                          maxLength={18}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de Empresa
                        </label>
                        <select
                          name="tipoEmpresa"
                          value={form.tipoEmpresa}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                        >
                          <option value="">Selecione o tipo</option>
                          {tiposEmpresa.map((tipo) => (
                            <option key={tipo} value={tipo}>
                              {tipo}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Inscrição Estadual
                        </label>
                        <input
                          type="text"
                          name="inscricaoEstadual"
                          value={form.inscricaoEstadual}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Número da inscrição estadual"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Inscrição Municipal
                        </label>
                        <input
                          type="text"
                          name="inscricaoMunicipal"
                          value={form.inscricaoMunicipal}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Número da inscrição municipal"
                        />
                      </div>
                    </div>

                    {/* Botões de Navegação - Etapa 1 */}
                    <div className="flex justify-end pt-8">
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep(1)}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Próximo
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Etapa 2: Endereço da Empresa */}
                {currentStep === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                          Endereço da Empresa
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600">
                          Endereço para entrega e correspondência
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                      {/* CEP */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CEP *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cep"
                            value={formatCep(form.cep)}
                            onChange={handleInputChange}
                            onBlur={(e) => buscarCep(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50 pr-12"
                            placeholder="00000-000"
                            maxLength={9}
                            required
                          />
                          {cepLoading && (
                            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
                          )}
                        </div>
                      </div>

                      {/* Endereço */}
                      <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Endereço *
                        </label>
                        <input
                          type="text"
                          name="endereco"
                          value={form.endereco}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Rua, Avenida, etc."
                          required
                        />
                      </div>

                      {/* Número */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Número *
                        </label>
                        <input
                          type="text"
                          name="numero"
                          value={form.numero}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="123"
                          required
                        />
                      </div>

                      {/* Complemento */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Complemento
                        </label>
                        <input
                          type="text"
                          name="complemento"
                          value={form.complemento}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Apto, Casa, etc."
                        />
                      </div>

                      {/* Bairro */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Bairro *
                        </label>
                        <input
                          type="text"
                          name="bairro"
                          value={form.bairro}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Nome do bairro"
                          required
                        />
                      </div>

                      {/* Cidade */}
                      <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          name="cidade"
                          value={form.cidade}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Nome da cidade"
                          required
                        />
                      </div>

                      {/* Estado */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Estado *
                        </label>
                        <select
                          name="estado"
                          value={form.estado}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          required
                        >
                          <option value="">Selecione o estado</option>
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Botões de Navegação - Etapa 2 */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep(2)}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 order-1 sm:order-2"
                      >
                        Próximo
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Etapa 3: Dados do Responsável */}
                {currentStep === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                          Dados do Responsável
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600">
                          Informações da pessoa responsável pela conta
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          name="nomeResponsavel"
                          value={form.nomeResponsavel}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="Nome completo do responsável"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="text"
                          name="telefoneResponsavel"
                          value={formatTelefone(form.telefoneResponsavel)}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="(11) 9999-9999"
                          maxLength={15}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          WhatsApp *
                        </label>
                        <input
                          type="text"
                          name="whatsappResponsavel"
                          value={formatWhatsapp(form.whatsappResponsavel)}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                          required
                        />
                      </div>
                    </div>

                    {/* Botões de Navegação - Etapa 3 */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 order-2 sm:order-1"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep(3)}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 order-1 sm:order-2"
                      >
                        Próximo
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Etapa 4: Dados de Acesso */}
                {currentStep === 4 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                          Dados de Acesso
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600">
                          Email e senha para acessar o sistema
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="emailResponsavel"
                          value={form.emailResponsavel}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50"
                          placeholder="email@empresa.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Senha *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="senha"
                            value={form.senha}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 bg-white/80 hover:bg-white hover:border-primary/50 pr-12"
                            placeholder="Mínimo 6 caracteres"
                            minLength={6}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirmar Senha *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmarSenha"
                            value={form.confirmarSenha}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 focus:border-primary transition-all duration-300 pr-12 ${
                              passwordMatch === false
                                ? "border-red-300 bg-red-50"
                                : passwordMatch === true
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200 bg-white/80 hover:bg-white hover:border-primary/50"
                            }`}
                            placeholder="Confirme sua senha"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {passwordMatch === false && (
                          <p className="text-red-600 text-sm mt-2 font-medium">
                            Senhas não coincidem
                          </p>
                        )}
                        {passwordMatch === true && (
                          <p className="text-green-600 text-sm mt-2 font-medium">
                            Senhas coincidem ✓
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botões de Navegação - Etapa 4 */}
                    <div className="space-y-4 pt-8 border-t-2 border-gray-200">
                      {/* Botão Principal de Envio */}
                      <button
                        type="submit"
                        disabled={isLoading || isSuccess || !validateStep(4)}
                        className={`w-full flex items-center justify-center gap-3 px-6 sm:px-8 py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                          isSuccess
                            ? "bg-green-600 text-white shadow-xl"
                            : isLoading
                            ? "bg-primary/80 text-white cursor-not-allowed"
                            : !validateStep(4)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="hidden sm:inline">Enviando Solicitação...</span>
                            <span className="sm:hidden">Enviando...</span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            <span className="hidden sm:inline">Solicitação Enviada!</span>
                            <span className="sm:hidden">Enviada!</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-5 w-5" />
                            Enviar Solicitação
                          </>
                        )}
                      </button>

                      {/* Botões Secundários */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-sm sm:text-base"
                        >
                          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                          Anterior
                        </button>
                        <Link
                          href="/login"
                          className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-sm sm:text-base"
                        >
                          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="hidden sm:inline">Voltar ao Login</span>
                          <span className="sm:hidden">Login</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div
              className="text-center mt-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-sm text-white/80">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-yellow-300 hover:text-yellow-200 font-semibold underline"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
