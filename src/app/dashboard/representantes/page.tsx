"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  Percent,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react";

interface Representante {
  id: string;
  cpf: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  whatsapp?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoConta?: string;
  chavePix?: string;
  comissaoPercentual: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  clientes: {
    id: string;
    cliente: {
      id: string;
      razaoSocial: string;
      cnpjCpf: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  }[];
  _count: {
    clientes: number;
  };
}

export default function RepresentantesPage() {
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Buscar representantes
  const fetchRepresentantes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/representantes");

      if (!response.ok) {
        throw new Error("Erro ao buscar representantes");
      }

      const data = await response.json();
      setRepresentantes(data.representantes || []);
    } catch (error) {
      console.error("Erro ao buscar representantes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepresentantes();
  }, [fetchRepresentantes]);

  // Filtrar representantes
  const representantesFiltrados = representantes.filter((representante) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      representante.user.name.toLowerCase().includes(searchLower) ||
      representante.user.email.toLowerCase().includes(searchLower) ||
      representante.cpf.includes(searchTerm) ||
      representante.cidade.toLowerCase().includes(searchLower)
    );
  });

  // Excluir representante
  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const response = await fetch(`/api/admin/representantes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir representante");
      }

      await fetchRepresentantes();
      setConfirmDelete(null);
    } catch (error) {
      console.error("Erro ao excluir representante:", error);
      alert("Erro ao excluir representante");
    } finally {
      setDeleting(null);
    }
  };

  // Formatação de CPF
  const formatCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Formatação de endereço
  const formatEndereco = (representante: Representante) => {
    return `${representante.endereco}, ${representante.numero} - ${representante.bairro}, ${representante.cidade}/${representante.estado}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Representantes</h1>
            <p className="text-gray-600">
              Gerencie os representantes comerciais
            </p>
          </div>
          <Link
            href="/dashboard/representantes/novo"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            Novo Representante
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Representantes
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, email, CPF ou cidade..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {representantes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {representantes.filter((r) => r.ativo).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Com Clientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {representantes.filter((r) => r._count.clientes > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de representantes */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : representantesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            {representantes.length === 0 ? (
              <>
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum representante cadastrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Cadastre o primeiro representante para começar.
                </p>
                <Link
                  href="/dashboard/representantes/novo"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Cadastrar Representante
                </Link>
              </>
            ) : (
              <>
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum representante encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros de busca
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {representantesFiltrados.map((representante) => (
              <div
                key={representante.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header do representante */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {representante.user.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            representante.ativo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {representante.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {representante.user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          CPF: {formatCpf(representante.cpf)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {formatEndereco(representante)}
                        </div>
                        {representante.whatsapp && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {representante.whatsapp}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-lg font-bold text-primary mb-1">
                        <Percent className="h-5 w-5" />
                        {representante.comissaoPercentual}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {representante._count.clientes}{" "}
                        {representante._count.clientes === 1
                          ? "cliente"
                          : "clientes"}
                      </div>
                    </div>
                  </div>

                  {/* Clientes atribuídos */}
                  {representante.clientes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Clientes Atribuídos:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {representante.clientes.slice(0, 3).map((rel) => (
                          <span
                            key={rel.id}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {rel.cliente.razaoSocial || rel.cliente.user.name}
                          </span>
                        ))}
                        {representante.clientes.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            +{representante.clientes.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/representantes/${representante.id}`}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Link>
                    <Link
                      href={`/dashboard/representantes/${representante.id}/clientes`}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <UserCheck className="h-4 w-4" />
                      Clientes
                    </Link>
                    <Link
                      href={`/dashboard/representantes/${representante.id}/editar`}
                      className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(representante.id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este representante? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmDelete && handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting === confirmDelete ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
