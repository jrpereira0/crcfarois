"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  CreditCard,
  MapPin,
  Phone,
  Building,
  Save,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import {
  formatCnpjCpf,
  formatCep,
  formatTelefone,
  unformatValue,
} from "@/lib/formatters";

interface RepresentanteForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  alterarSenha: boolean;
  cpf: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  whatsapp: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  chavePix: string;
  ativo: boolean;
}

export default function EditarRepresentantePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const representanteId = params.id as string;

  const [form, setForm] = useState<RepresentanteForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    alterarSenha: false,
    cpf: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    whatsapp: "",
    banco: "",
    agencia: "",
    conta: "",
    tipoConta: "CORRENTE",
    chavePix: "",
    ativo: true,
  });

  // Buscar representante
  const fetchRepresentante = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/representantes/${representanteId}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar representante");
      }

      const data = await response.json();
      const rep = data.representante;

      setForm({
        name: rep.user.name || "",
        email: rep.user.email || "",
        password: "",
        confirmPassword: "",
        alterarSenha: false,
        cpf: formatCnpjCpf(rep.cpf || ""),
        endereco: rep.endereco || "",
        numero: rep.numero || "",
        complemento: rep.complemento || "",
        bairro: rep.bairro || "",
        cidade: rep.cidade || "",
        estado: rep.estado || "",
        cep: formatCep(rep.cep || ""),
        whatsapp: formatTelefone(rep.whatsapp || ""),
        banco: rep.banco || "",
        agencia: rep.agencia || "",
        conta: rep.conta || "",
        tipoConta: rep.tipoConta || "CORRENTE",
        chavePix: rep.chavePix || "",
        ativo: rep.ativo,
      });
    } catch (error) {
      console.error("Erro ao buscar representante:", error);
      router.push("/dashboard/representantes");
    } finally {
      setLoading(false);
    }
  }, [representanteId, router]);

  useEffect(() => {
    fetchRepresentante();
  }, [fetchRepresentante]);

  // Buscar CEP
  const buscarCep = useCallback(async (cep: string) => {
    if (cep.length === 9) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cep.replace("-", "")}/json/`
        );
        if (response.ok) {
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
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  }, []);

  // Validar formulário
  const validarFormulario = useCallback(() => {
    const novosErros: string[] = [];

    if (!form.name.trim()) novosErros.push("Nome é obrigatório");
    if (!form.email.trim()) novosErros.push("Email é obrigatório");
    if (form.alterarSenha) {
      if (!form.password) novosErros.push("Nova senha é obrigatória");
      if (form.password !== form.confirmPassword) {
        novosErros.push("Senhas não coincidem");
      }
    }
    if (!form.cpf) novosErros.push("CPF é obrigatório");
    if (!form.endereco.trim()) novosErros.push("Endereço é obrigatório");
    if (!form.numero.trim()) novosErros.push("Número é obrigatório");
    if (!form.bairro.trim()) novosErros.push("Bairro é obrigatório");
    if (!form.cidade.trim()) novosErros.push("Cidade é obrigatória");
    if (!form.estado.trim()) novosErros.push("Estado é obrigatório");
    if (!form.cep) novosErros.push("CEP é obrigatório");

    setErrors(novosErros);
    return novosErros.length === 0;
  }, [form]);

  // Salvar representante
  const salvarRepresentante = useCallback(async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setSaving(true);

      const representanteData = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.alterarSenha ? form.password : "",
        cpf: unformatValue(form.cpf),
        endereco: form.endereco.trim(),
        numero: form.numero.trim(),
        complemento: form.complemento.trim() || null,
        bairro: form.bairro.trim(),
        cidade: form.cidade.trim(),
        estado: form.estado.trim(),
        cep: unformatValue(form.cep),
        whatsapp: form.whatsapp ? unformatValue(form.whatsapp) : null,
        banco: form.banco.trim() || null,
        agencia: form.agencia.trim() || null,
        conta: form.conta.trim() || null,
        tipoConta: form.tipoConta || null,
        chavePix: form.chavePix.trim() || null,
        ativo: form.ativo,
      };

      const response = await fetch(
        `/api/admin/representantes/${representanteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(representanteData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar representante");
      }

      router.push("/dashboard/representantes");
    } catch (error) {
      console.error("Erro ao salvar representante:", error);
      setErrors([error instanceof Error ? error.message : "Erro desconhecido"]);
    } finally {
      setSaving(false);
    }
  }, [form, validarFormulario, representanteId, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/dashboard/representantes"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar aos Representantes</span>
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar Representante
          </h1>
          <p className="text-gray-600">
            Altere os dados do representante comercial
          </p>
        </div>
      </div>

      {/* Erros */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Corrija os seguintes erros:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Dados Pessoais
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nome e sobrenome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={form.cpf}
                  onChange={(e) =>
                    setForm({ ...form, cpf: formatCnpjCpf(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="representante@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      whatsapp: formatTelefone(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="alterarSenha"
                    checked={form.alterarSenha}
                    onChange={(e) =>
                      setForm({ ...form, alterarSenha: e.target.checked })
                    }
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label
                    htmlFor="alterarSenha"
                    className="text-sm font-medium text-gray-700"
                  >
                    Alterar senha de acesso
                  </label>
                </div>

                {form.alterarSenha && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Nova senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Confirme a nova senha"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  value={form.cep}
                  onChange={(e) => {
                    const newCep = formatCep(e.target.value);
                    setForm({ ...form, cep: newCep });
                    buscarCep(newCep);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço *
                </label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={(e) =>
                    setForm({ ...form, endereco: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Rua, avenida..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  value={form.numero}
                  onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  value={form.complemento}
                  onChange={(e) =>
                    setForm({ ...form, complemento: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Apto, sala..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={form.bairro}
                  onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="São Paulo"
                />
              </div>
            </div>
          </div>

          {/* Dados Bancários */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Dados Bancários
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco
                </label>
                <input
                  type="text"
                  value={form.banco}
                  onChange={(e) => setForm({ ...form, banco: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Banco do Brasil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agência
                </label>
                <input
                  type="text"
                  value={form.agencia}
                  onChange={(e) =>
                    setForm({ ...form, agencia: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="1234-5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conta
                </label>
                <input
                  type="text"
                  value={form.conta}
                  onChange={(e) => setForm({ ...form, conta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="12345-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <select
                  value={form.tipoConta}
                  onChange={(e) =>
                    setForm({ ...form, tipoConta: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="CORRENTE">Conta Corrente</option>
                  <option value="POUPANCA">Conta Poupança</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chave PIX
                </label>
                <input
                  type="text"
                  value={form.chavePix}
                  onChange={(e) =>
                    setForm({ ...form, chavePix: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="CPF, email, telefone ou chave aleatória"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Status</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="ativo"
                  checked={form.ativo}
                  onChange={() => setForm({ ...form, ativo: true })}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">Ativo</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="ativo"
                  checked={!form.ativo}
                  onChange={() => setForm({ ...form, ativo: false })}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Inativo
                </span>
              </label>
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <button
              onClick={salvarRepresentante}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
