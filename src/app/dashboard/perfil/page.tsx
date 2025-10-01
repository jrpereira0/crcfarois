"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";

interface PerfilData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function PerfilAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [showSenhaModal, setShowSenhaModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [senhaParaEmail, setSenhaParaEmail] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [showSenhaEmail, setShowSenhaEmail] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dados editáveis
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      carregarPerfil();
    }
  }, [status, router]);

  const carregarPerfil = async () => {
    try {
      const response = await fetch("/api/perfil");
      const data = await response.json();

      if (response.ok) {
        setPerfil(data);
        setNome(data.name || "");
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setError("Erro ao carregar dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarPerfil = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Perfil atualizado com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
        await carregarPerfil();
      } else {
        setError(data.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      setError("Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  };

  const handleAlterarSenha = async () => {
    setError("");
    setSuccess("");

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/perfil/alterar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Senha alterada com sucesso!");
        setShowSenhaModal(false);
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Erro ao alterar senha");
      }
    } catch (error) {
      setError("Erro ao alterar senha");
    } finally {
      setSaving(false);
    }
  };

  const handleAlterarEmail = async () => {
    setError("");
    setSuccess("");

    if (!novoEmail) {
      setError("Digite o novo email");
      return;
    }

    if (!senhaParaEmail) {
      setError("Digite sua senha para confirmar");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/perfil/alterar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novoEmail, senhaAtual: senhaParaEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setShowEmailModal(false);
        setNovoEmail("");
        setSenhaParaEmail("");
        // Fazer logout após 3 segundos
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setError(data.error || "Erro ao alterar email");
      }
    } catch (error) {
      setError("Erro ao alterar email");
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
        <p className="text-gray-600">
          Gerencie suas informações pessoais e de segurança
        </p>
      </div>

      {/* Mensagens */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Informações */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {perfil?.name}
              </h3>
              <p className="text-sm text-gray-500">{perfil?.email}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Tipo de Conta
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Administrador
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-4 rounded-lg transition-colors font-medium"
              >
                <Mail className="h-4 w-4" />
                Alterar Email
              </button>
              <button
                onClick={() => setShowSenhaModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors font-medium"
              >
                <Lock className="h-4 w-4" />
                Alterar Senha
              </button>
            </div>
          </div>
        </div>

        {/* Formulário de Dados */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações Pessoais
            </h2>

            <div className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Acesso
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={perfil?.email || ""}
                    disabled
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                  >
                    Alterar Email
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Email usado para login no sistema
                </p>
              </div>

              {/* Botão Salvar */}
              <div className="pt-6">
                <button
                  onClick={handleSalvarPerfil}
                  disabled={saving}
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Alterar Senha */}
      {showSenhaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Alterar Senha
            </h3>

            <div className="space-y-4">
              {/* Senha Atual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showSenhaAtual ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSenhaAtual ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Nova Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showNovaSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNovaSenha(!showNovaSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNovaSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmarSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSenhaModal(false);
                  setError("");
                  setSenhaAtual("");
                  setNovaSenha("");
                  setConfirmarSenha("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleAlterarSenha}
                disabled={saving}
                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Alterar Senha"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alterar Email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Alterar Email
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Você precisará fazer login novamente após alterar o email
            </p>

            <div className="space-y-4">
              {/* Email Atual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Atual
                </label>
                <input
                  type="email"
                  value={perfil?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Novo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Novo Email
                </label>
                <input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="seu@novoemail.com"
                />
              </div>

              {/* Senha para Confirmar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual (para confirmar)
                </label>
                <div className="relative">
                  <input
                    type={showSenhaEmail ? "text" : "password"}
                    value={senhaParaEmail}
                    onChange={(e) => setSenhaParaEmail(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhaEmail(!showSenhaEmail)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSenhaEmail ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Aviso de Segurança */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Atenção:</strong> Ao alterar o email, você será
                  desconectado e precisará fazer login novamente com o novo
                  email.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setError("");
                  setNovoEmail("");
                  setSenhaParaEmail("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleAlterarEmail}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  "Alterar Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
