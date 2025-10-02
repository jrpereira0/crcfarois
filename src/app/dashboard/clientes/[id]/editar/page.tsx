"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Building2,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  MessageCircle,
  Search,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  formatCnpjCpf,
  formatCep,
  formatTelefone,
  formatWhatsapp,
  unformatValue,
  formatCnpjCpfDisplay,
  formatTelefoneDisplay,
} from "@/lib/formatters";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";

interface ClienteForm {
  razaoSocial: string;
  responsavel: string;
  cnpjCpf: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  tipoEmpresa: string;
  condicoesPagamento: string[];
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  email: string;
  telefone: string;
  whatsapp: string;
  ativo: boolean;
  representanteId: string;
  // Campos de senha
  novaSenha: string;
  confirmarNovaSenha: string;
  alterarSenha: boolean;
}

export default function EditarClientePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [representantes, setRepresentantes] = useState<any[]>([]);
  const [representantesLoading, setRepresentantesLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [form, setForm] = useState<ClienteForm>({
    razaoSocial: "",
    responsavel: "",
    cnpjCpf: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    tipoEmpresa: "",
    condicoesPagamento: [],
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    email: "",
    telefone: "",
    whatsapp: "",
    ativo: true,
    representanteId: "",
    // Campos de senha
    novaSenha: "",
    confirmarNovaSenha: "",
    alterarSenha: false,
  });

  const tiposEmpresa = [
    "MEI",
    "Simples Nacional",
    "Lucro Presumido",
    "Lucro Real",
  ];

  const condicoesPagamento = [
    "10 DDL",
    "14 DDL",
    "21 DDL",
    "21/28/35 DDL",
    "21/28/35/42/49 DDL",
    "28 DDL",
    "28/35 DDL",
    "28/35/42 DDL",
    "28/35/42/49 DDL",
    "28/35/42/49/56 DDL",
    "30 DDL",
    "30/40 DDL",
    "30/40/50 DDL",
    "30/40/50/60 DDL",
    "30/40/50/60/70 DDL",
    "30/45 DDL",
    "30/45/60 DDL",
    "30/50 DDL",
    "35 DDL",
    "40 DDL",
    "45 DDL",
    "60 DDL",
    "Á VISTA",
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

  useEffect(() => {
    if (params.id) {
      fetchCliente(params.id as string);
    }
  }, [params.id]);

  // Buscar representantes ao carregar a página
  useEffect(() => {
    const fetchRepresentantes = async () => {
      try {
        const response = await fetch("/api/admin/representantes");
        if (response.ok) {
          const data = await response.json();
          setRepresentantes(data.representantes || []);
        }
      } catch (error) {
        console.error("Erro ao buscar representantes:", error);
      } finally {
        setRepresentantesLoading(false);
      }
    };
    fetchRepresentantes();
  }, []);

  const fetchCliente = async (id: string) => {
    try {
      const response = await fetch(`/api/clientes/${id}`);
      const data = await response.json();

      if (response.ok) {
        // Pegar o primeiro representante do cliente (assumindo que há pelo menos um)
        const representanteAtual = data.representantes?.[0]?.representanteId || "";
        
        setForm({
          razaoSocial: data.razaoSocial || "",
          responsavel: data.responsavel || "",
          cnpjCpf: formatCnpjCpfDisplay(data.cnpjCpf || ""),
          inscricaoEstadual: data.inscricaoEstadual || "",
          inscricaoMunicipal: data.inscricaoMunicipal || "",
          tipoEmpresa: data.tipoEmpresa || "",
          condicoesPagamento: data.condicoesPagamento || [],
          cep: data.cep || "",
          endereco: data.endereco || "",
          numero: data.numero || "",
          complemento: data.complemento || "",
          bairro: data.bairro || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          email: data.email || "",
          telefone: formatTelefoneDisplay(data.telefone || ""),
          whatsapp: formatTelefoneDisplay(data.whatsapp || ""),
          ativo: data.ativo,
          representanteId: representanteAtual,
          // Campos de senha
          novaSenha: "",
          confirmarNovaSenha: "",
          alterarSenha: false,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Cliente não encontrado",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao carregar cliente",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handlers para os campos
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (isSuccess) {
      setIsSuccess(false);
      setMessage(null);
    }
  };

  const handleCondicaoPagamentoChange = (condicao: string) => {
    setForm((prev) => ({
      ...prev,
      condicoesPagamento: prev.condicoesPagamento.includes(condicao)
        ? prev.condicoesPagamento.filter((c) => c !== condicao)
        : [...prev.condicoesPagamento, condicao],
    }));
  };

  const handleSelecionarTodasCondicoes = () => {
    setForm((prev) => ({
      ...prev,
      condicoesPagamento: [...condicoesPagamento],
    }));
  };

  const handleLimparTodasCondicoes = () => {
    setForm((prev) => ({ ...prev, condicoesPagamento: [] }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Verificar se as senhas coincidem em tempo real
    if (name === "novaSenha") {
      setPasswordMatch(
        form.confirmarNovaSenha ? value === form.confirmarNovaSenha : null
      );
    } else if (name === "confirmarNovaSenha") {
      setPasswordMatch(form.novaSenha ? value === form.novaSenha : null);
    }

    if (isSuccess) {
      setIsSuccess(false);
      setMessage(null);
    }
  };

  const handleCnpjCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCnpjCpf(e.target.value);
    setForm((prev) => ({ ...prev, cnpjCpf: formattedValue }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatTelefone(e.target.value);
    setForm((prev) => ({ ...prev, telefone: formattedValue }));
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWhatsapp(e.target.value);
    setForm((prev) => ({ ...prev, whatsapp: formattedValue }));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formattedValue = formatCep(rawValue);
    setForm((prev) => ({ ...prev, cep: formattedValue }));

    if (rawValue.length === 8) {
      buscarCep(rawValue);
    }
  };

  const buscarCep = async (cep: string) => {
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Validações de senha
    if (form.alterarSenha) {
      if (!form.novaSenha || form.novaSenha.length < 6) {
        setMessage({
          type: "error",
          text: "A nova senha deve ter pelo menos 6 caracteres",
        });
        setIsSubmitting(false);
        return;
      }

      if (form.novaSenha !== form.confirmarNovaSenha) {
        setMessage({
          type: "error",
          text: "As senhas não coincidem",
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const clienteData: any = {
        razaoSocial: form.razaoSocial,
        responsavel: form.responsavel,
        cnpjCpf: unformatValue(form.cnpjCpf),
        inscricaoEstadual: form.inscricaoEstadual || null,
        inscricaoMunicipal: form.inscricaoMunicipal || null,
        tipoEmpresa: form.tipoEmpresa,
        condicoesPagamento: form.condicoesPagamento,
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        cep: unformatValue(form.cep),
        email: form.email,
        telefone: unformatValue(form.telefone),
        whatsapp: unformatValue(form.whatsapp),
        ativo: form.ativo,
        representanteId: form.representanteId,
      };

      // Incluir senha apenas se for para alterar
      if (form.alterarSenha && form.novaSenha) {
        clienteData.novaSenha = form.novaSenha;
      }

      const response = await fetch(`/api/clientes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage({
          type: "success",
          text: "Cliente atualizado com sucesso!",
        });

        setTimeout(() => {
          router.push(`/dashboard/clientes/${params.id}`);
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erro ao atualizar cliente",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro de conexão. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 pt-16 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
            <p className="text-gray-600">Modifique as informações do cliente</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span
              className={`text-sm font-medium ${
                form.ativo ? "text-green-600" : "text-red-600"
              }`}
            >
              {form.ativo ? "Ativo" : "Inativo"}
            </span>
          </label>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Editar Informações
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Informações do Cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informações do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="razaoSocial"
                    className="text-sm font-medium text-gray-700"
                  >
                    Razão Social *
                  </label>
                  <input
                    type="text"
                    id="razaoSocial"
                    name="razaoSocial"
                    required
                    value={form.razaoSocial}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Razão social da empresa"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="responsavel"
                    className="text-sm font-medium text-gray-700"
                  >
                    Responsável *
                  </label>
                  <input
                    type="text"
                    id="responsavel"
                    name="responsavel"
                    required
                    value={form.responsavel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Nome do responsável"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cnpjCpf"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    CNPJ/CPF *
                  </label>
                  <input
                    type="text"
                    id="cnpjCpf"
                    name="cnpjCpf"
                    required
                    value={form.cnpjCpf}
                    onChange={handleCnpjCpfChange}
                    maxLength={18}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="00.000.000/0000-00 ou 000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="tipoEmpresa"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tipo de Empresa
                  </label>
                  <select
                    id="tipoEmpresa"
                    name="tipoEmpresa"
                    value={form.tipoEmpresa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposEmpresa.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inscricaoEstadual"
                    className="text-sm font-medium text-gray-700"
                  >
                    Inscrição Estadual
                  </label>
                  <input
                    type="text"
                    id="inscricaoEstadual"
                    name="inscricaoEstadual"
                    value={form.inscricaoEstadual}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="000.000.000.000"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="inscricaoMunicipal"
                    className="text-sm font-medium text-gray-700"
                  >
                    Inscrição Municipal
                  </label>
                  <input
                    type="text"
                    id="inscricaoMunicipal"
                    name="inscricaoMunicipal"
                    value={form.inscricaoMunicipal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="000.000.000"
                  />
                </div>
              </div>
            </div>

            {/* Representante */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Representante
              </h3>
              <div className="space-y-2">
                <label
                  htmlFor="representanteId"
                  className="text-sm font-medium text-gray-700"
                >
                  Selecione o Representante *
                </label>
                {representantesLoading ? (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-gray-600">
                      Carregando representantes...
                    </span>
                  </div>
                ) : (
                  <select
                    id="representanteId"
                    name="representanteId"
                    required
                    value={form.representanteId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Selecione um representante</option>
                    {representantes.map((rep) => (
                      <option key={rep.id} value={rep.id}>
                        {rep.user.name} - {rep.user.email}
                      </option>
                    ))}
                  </select>
                )}
                {!representantesLoading && representantes.length === 0 && (
                  <p className="text-sm text-red-600">
                    Nenhum representante cadastrado.
                  </p>
                )}
              </div>
            </div>

            {/* Condições de Pagamento */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Condições de Pagamento
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelecionarTodasCondicoes}
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-lg transition-colors"
                  >
                    Selecionar Todas
                  </button>
                  <button
                    type="button"
                    onClick={handleLimparTodasCondicoes}
                    className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
                  >
                    Limpar Todas
                  </button>
                </div>
              </div>

              <div className="mb-3 text-sm text-gray-600">
                {form.condicoesPagamento.length} de {condicoesPagamento.length}{" "}
                condições selecionadas
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {condicoesPagamento.map((condicao) => (
                  <label
                    key={condicao}
                    className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.condicoesPagamento.includes(condicao)}
                      onChange={() => handleCondicaoPagamentoChange(condicao)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{condicao}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Endereço */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="cep"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cep"
                      name="cep"
                      required
                      value={form.cep}
                      onChange={handleCepChange}
                      maxLength={9}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="00000-000"
                    />
                    {cepLoading && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label
                    htmlFor="endereco"
                    className="text-sm font-medium text-gray-700"
                  >
                    Endereço *
                  </label>
                  {cepLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <input
                      type="text"
                      id="endereco"
                      name="endereco"
                      required
                      value={form.endereco}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Rua, Avenida..."
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="numero"
                    className="text-sm font-medium text-gray-700"
                  >
                    Número *
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    required
                    value={form.numero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="123"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="complemento"
                    className="text-sm font-medium text-gray-700"
                  >
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complemento"
                    name="complemento"
                    value={form.complemento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Apto, Sala..."
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bairro"
                    className="text-sm font-medium text-gray-700"
                  >
                    Bairro
                  </label>
                  {cepLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <input
                      type="text"
                      id="bairro"
                      name="bairro"
                      value={form.bairro}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Bairro"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cidade"
                    className="text-sm font-medium text-gray-700"
                  >
                    Cidade
                  </label>
                  {cepLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <input
                      type="text"
                      id="cidade"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Cidade"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="estado"
                    className="text-sm font-medium text-gray-700"
                  >
                    Estado
                  </label>
                  {cepLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <select
                      id="estado"
                      name="estado"
                      value={form.estado}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">UF</option>
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="contato@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="telefone"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleTelefoneChange}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="(11) 3000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="whatsapp"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    value={form.whatsapp}
                    onChange={handleWhatsappChange}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Alterar Senha */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Alterar Senha de Acesso
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="alterarSenha"
                    checked={form.alterarSenha}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">
                    Marque para alterar a senha
                  </span>
                </label>
              </div>

              {form.alterarSenha && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="novaSenha"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nova Senha *
                    </label>
                    <div className="relative">
                      <input
                        type={showNovaSenha ? "text" : "password"}
                        id="novaSenha"
                        name="novaSenha"
                        required={form.alterarSenha}
                        minLength={6}
                        value={form.novaSenha}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNovaSenha ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmarNovaSenha"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      Confirmar Nova Senha *
                      {passwordMatch === true && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {passwordMatch === false && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmarSenha ? "text" : "password"}
                        id="confirmarNovaSenha"
                        name="confirmarNovaSenha"
                        required={form.alterarSenha}
                        minLength={6}
                        value={form.confirmarNovaSenha}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          passwordMatch === false
                            ? "border-red-300 bg-red-50"
                            : passwordMatch === true
                            ? "border-green-300 bg-green-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirme a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmarSenha(!showConfirmarSenha)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmarSenha ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordMatch === false && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        As senhas não coincidem
                      </p>
                    )}
                    {passwordMatch === true && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Senhas coincidem
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!form.alterarSenha && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    A senha atual será mantida. Marque a opção acima para
                    alterar a senha de acesso do cliente.
                  </p>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`flex-1 sm:flex-initial font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed ${
                  isSuccess
                    ? "bg-green-600 text-white animate-pulse"
                    : isSubmitting
                    ? "bg-primary/70 text-white"
                    : "bg-primary hover:bg-primary/90 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Salvando alterações...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Cliente atualizado com sucesso!
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Salvar Alterações
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <Toast
          message={message}
          onClose={() => setMessage(null)}
          autoClose={message.type === "error"}
          duration={message.type === "error" ? 7000 : 3000}
        />
      )}
    </div>
  );
}
