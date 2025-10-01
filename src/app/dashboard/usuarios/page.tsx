"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import {
  Plus,
  Search,
  UserCog,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff,
  Shield,
  User,
  Loader2,
} from "lucide-react";

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "FUNCIONARIO";
  createdAt: string;
  updatedAt: string;
}

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FUNCIONARIO" as "ADMIN" | "FUNCIONARIO",
  });

  const [submitting, setSubmitting] = useState(false);

  // Verificar permissão
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Buscar usuários
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/usuarios");

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const data = await response.json();
      setUsuarios(data.usuarios);
      setFilteredUsuarios(data.usuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      showToast("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (session?.user.role === "ADMIN") {
      fetchUsuarios();
    }
  }, [session, fetchUsuarios]);

  // Filtrar usuários
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter(
        (usuario) =>
          usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    }
  }, [searchTerm, usuarios]);

  // Abrir modal para criar
  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "FUNCIONARIO",
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (usuario: Usuario) => {
    setModalMode("edit");
    setSelectedUsuario(usuario);
    setFormData({
      name: usuario.name,
      email: usuario.email,
      password: "",
      role: usuario.role,
    });
    setShowModal(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUsuario(null);
    setShowPassword(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "FUNCIONARIO",
    });
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role) {
      showToast("Preencha todos os campos obrigatórios", "error");
      return;
    }

    if (modalMode === "create" && !formData.password) {
      showToast("A senha é obrigatória para criar um novo usuário", "error");
      return;
    }

    try {
      setSubmitting(true);

      const url =
        modalMode === "create"
          ? "/api/admin/usuarios"
          : `/api/admin/usuarios/${selectedUsuario?.id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const body: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar usuário");
      }

      showToast(
        modalMode === "create"
          ? "Usuário criado com sucesso"
          : "Usuário atualizado com sucesso",
        "success"
      );

      handleCloseModal();
      fetchUsuarios();
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      showToast(error.message || "Erro ao salvar usuário", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar exclusão
  const handleDeleteClick = (usuario: Usuario) => {
    setUserToDelete(usuario);
    setShowDeleteConfirm(true);
  };

  // Excluir usuário
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/admin/usuarios/${userToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir usuário");
      }

      showToast("Usuário excluído com sucesso", "success");
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      fetchUsuarios();
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      showToast(error.message || "Erro ao excluir usuário", "error");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      case "FUNCIONARIO":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "FUNCIONARIO":
        return "Funcionário";
      default:
        return role;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gerenciar Usuários
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Administradores e Funcionários do sistema
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl font-medium w-fit"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Novo Usuário</span>
        </button>
      </div>

      {/* Barra de busca */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredUsuarios.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchTerm
                ? "Nenhum usuário encontrado"
                : "Nenhum usuário cadastrado"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Data de Cadastro
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsuarios.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {usuario.role === "ADMIN" ? (
                            <Shield className="h-5 w-5 text-primary" />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {usuario.name}
                          </div>
                          {session.user.id === usuario.id && (
                            <div className="text-xs text-gray-500">(Você)</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {usuario.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          usuario.role
                        )}`}
                      >
                        {getRoleLabel(usuario.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(usuario.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(usuario)}
                          disabled={session.user.id === usuario.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            session.user.id === usuario.id
                              ? "Você não pode excluir sua própria conta"
                              : "Excluir"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Criar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === "create" ? "Novo Usuário" : "Editar Usuário"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="João Silva"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="joao@exemplo.com"
                  required
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha {modalMode === "create" && "*"}
                  {modalMode === "edit" && (
                    <span className="text-xs text-gray-500 font-normal ml-1">
                      (deixe em branco para manter a atual)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all pr-10"
                    placeholder="Mínimo 6 caracteres"
                    required={modalMode === "create"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Acesso *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-all">
                    <input
                      type="radio"
                      name="role"
                      value="FUNCIONARIO"
                      checked={formData.role === "FUNCIONARIO"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "ADMIN" | "FUNCIONARIO",
                        })
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Funcionário
                      </div>
                      <div className="text-xs text-gray-500">
                        Acesso total exceto gerenciar usuários
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-all">
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={formData.role === "ADMIN"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "ADMIN" | "FUNCIONARIO",
                        })
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Administrador
                      </div>
                      <div className="text-xs text-gray-500">
                        Acesso total incluindo gerenciar usuários
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : modalMode === "create" ? (
                    "Criar Usuário"
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-600">
                Tem certeza que deseja excluir o usuário{" "}
                <strong>{userToDelete.name}</strong>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                Esta ação não pode ser desfeita!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

