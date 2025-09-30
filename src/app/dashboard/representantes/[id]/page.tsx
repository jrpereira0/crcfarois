"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building,
  Percent,
  Users,
  Edit3,
  UserPlus,
  Eye,
  Calendar,
  Package,
} from "lucide-react";
import {
  formatCnpjCpfDisplay,
  formatTelefoneDisplay,
  formatCepDisplay,
} from "@/lib/formatters";

interface RepresentanteDetalhes {
  id: string;
  cpf: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
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
      telefone?: string;
      whatsapp: string;
      cidade: string;
      estado: string;
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

export default function RepresentanteDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [representante, setRepresentante] =
    useState<RepresentanteDetalhes | null>(null);
  const [loading, setLoading] = useState(true);

  const representanteId = params.id as string;

  // Buscar representante
  const fetchRepresentante = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/representantes/${representanteId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard/representantes");
          return;
        }
        throw new Error("Erro ao buscar representante");
      }

      const data = await response.json();
      setRepresentante(data.representante);
    } catch (error) {
      console.error("Erro ao buscar representante:", error);
      router.push("/dashboard/representantes");
    } finally {
      setLoading(false);
    }
  }, [representanteId, router]);

  useEffect(() => {
    if (representanteId) {
      fetchRepresentante();
    }
  }, [representanteId, fetchRepresentante]);

  // Formatação de data
  const formatDate = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  }, []);

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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!representante) {
    return null;
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {representante.user.name}
              </h1>
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
            <p className="text-gray-600">
              Cadastrado em {formatDate(representante.createdAt)}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/dashboard/representantes/${representante.id}/editar`}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Edit3 className="h-4 w-4" />
              Editar
            </Link>
            <Link
              href={`/dashboard/representantes/${representante.id}/clientes`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <UserPlus className="h-4 w-4" />
              Gerenciar Clientes
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                Dados Pessoais
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <p className="text-gray-900">{representante.user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <p className="text-gray-900">
                  {formatCnpjCpfDisplay(representante.cpf)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900">{representante.user.email}</p>
                </div>
              </div>

              {representante.telefone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">
                      {formatTelefoneDisplay(representante.telefone)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="space-y-2">
              <p className="text-gray-900">
                {representante.endereco}, {representante.numero}
                {representante.complemento && `, ${representante.complemento}`}
              </p>
              <p className="text-gray-900">
                {representante.bairro} - {representante.cidade}/
                {representante.estado}
              </p>
              <p className="text-gray-600">
                CEP: {formatCepDisplay(representante.cep)}
              </p>
            </div>
          </div>

          {/* Dados Bancários */}
          {(representante.banco || representante.chavePix) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Building className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Dados Bancários
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {representante.banco && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banco
                      </label>
                      <p className="text-gray-900">{representante.banco}</p>
                    </div>

                    {representante.agencia && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agência
                        </label>
                        <p className="text-gray-900">{representante.agencia}</p>
                      </div>
                    )}

                    {representante.conta && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conta
                        </label>
                        <p className="text-gray-900">
                          {representante.conta} ({representante.tipoConta})
                        </p>
                      </div>
                    )}
                  </>
                )}

                {representante.chavePix && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chave PIX
                    </label>
                    <p className="text-gray-900">{representante.chavePix}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clientes Atribuídos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Clientes Atribuídos
                </h2>
              </div>
              <Link
                href={`/dashboard/representantes/${representante.id}/clientes`}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <UserPlus className="h-4 w-4" />
                Gerenciar
              </Link>
            </div>

            {(representante?.clientes?.length || 0) === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum cliente atribuído
                </h3>
                <p className="text-gray-600 mb-4">
                  Atribua clientes para este representante começar a trabalhar.
                </p>
                <Link
                  href={`/dashboard/representantes/${representante.id}/clientes`}
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  Atribuir Clientes
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {(representante?.clientes || []).map((rel) => (
                  <div
                    key={rel.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {rel.cliente.razaoSocial || rel.cliente.user.name}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {rel.cliente.user.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3" />
                            {formatCnpjCpfDisplay(rel.cliente.cnpjCpf)}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {rel.cliente.cidade}/{rel.cliente.estado}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/clientes/${rel.cliente.id}`}
                      className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Cliente
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Resumo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Comissão</span>
                <div className="flex items-center gap-1 text-lg font-bold text-primary">
                  <Percent className="h-4 w-4" />
                  {representante.comissaoPercentual}%
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Clientes</span>
                <span className="font-medium text-gray-900">
                  {representante?._count?.clientes || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    representante.ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {representante.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Cadastrado em {formatDate(representante.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-3">
              <Link
                href={`/dashboard/representantes/${representante.id}/editar`}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Edit3 className="h-4 w-4" />
                Editar Representante
              </Link>

              <Link
                href={`/dashboard/representantes/${representante.id}/clientes`}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <UserPlus className="h-4 w-4" />
                Gerenciar Clientes
              </Link>

              {(representante?.clientes?.length || 0) > 0 && (
                <Link
                  href={`/dashboard/representantes/${representante.id}/pedidos`}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Package className="h-4 w-4" />
                  Ver Pedidos
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
