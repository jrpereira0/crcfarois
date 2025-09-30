"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Search,
  UserPlus,
  UserMinus,
  UserCheck,
  Save,
  Mail,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";
import { formatCnpjCpfDisplay } from "@/lib/formatters";
import { Toast } from "@/components/ui/Toast";

interface Cliente {
  id: string;
  razaoSocial: string;
  cnpjCpf: string;
  cidade: string;
  estado: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  representantes: {
    id: string;
    representante: {
      id: string;
      user: {
        name: string;
        email: string;
      };
    };
  }[];
}

interface RepresentanteClientes {
  id: string;
  user: {
    name: string;
  };
  clientes: {
    id: string;
    cliente: Cliente;
  }[];
}

export default function GerenciarClientesPage() {
  const params = useParams();
  const router = useRouter();
  const [representante, setRepresentante] =
    useState<RepresentanteClientes | null>(null);
  const [todosClientes, setTodosClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const representanteId = params.id as string;

  // Buscar representante e clientes
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Buscar representante com clientes atuais
      const [repResponse, clientesResponse] = await Promise.all([
        fetch(`/api/admin/representantes/${representanteId}`),
        fetch("/api/admin/clientes"),
      ]);

      if (!repResponse.ok) {
        throw new Error("Erro ao buscar representante");
      }

      const repData = await repResponse.json();
      setRepresentante(repData.representante);

      if (clientesResponse.ok) {
        const clientesData = await clientesResponse.json();
        setTodosClientes(clientesData.clientes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      router.push("/dashboard/representantes");
    } finally {
      setLoading(false);
    }
  }, [representanteId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtrar clientes disponíveis - APENAS os que não têm representante no banco
  const clientesFiltrados = todosClientes.filter((cliente) => {
    // APENAS clientes que não têm representante no banco de dados
    const semRepresentante =
      !cliente.representantes || cliente.representantes.length === 0;

    if (!semRepresentante) return false;

    // Segundo filtro: busca por texto
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.razaoSocial.toLowerCase().includes(searchLower) ||
      cliente.user.name.toLowerCase().includes(searchLower) ||
      cliente.user.email.toLowerCase().includes(searchLower) ||
      cliente.cnpjCpf.includes(searchTerm)
    );
  });

  // Toggle seleção de cliente
  const toggleCliente = (clienteId: string) => {
    const clienteEstaAtribuido = representante?.clientes?.some(
      (rel: any) => rel.cliente.id === clienteId
    );

    if (clienteEstaAtribuido) {
      // Se está removendo, atualizar estado local imediatamente
      setRepresentante((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          clientes: prev.clientes.filter(
            (rel: any) => rel.cliente.id !== clienteId
          ),
        };
      });
    } else {
      // Se está adicionando, atualizar estado local imediatamente
      setRepresentante((prev) => {
        if (!prev) return prev;

        // Verificar se o cliente já está na lista
        const clienteJaExiste = prev.clientes.some(
          (rel: any) => rel.cliente.id === clienteId
        );

        if (clienteJaExiste) return prev;

        // Buscar o cliente nos dados disponíveis
        const clienteToAdd = todosClientes.find((c) => c.id === clienteId);
        if (!clienteToAdd) return prev;

        // Criar um objeto de relacionamento simulado para o estado local
        const newRel = {
          id: `temp-${clienteId}`, // ID temporário
          cliente: clienteToAdd,
        };

        return {
          ...prev,
          clientes: [...prev.clientes, newRel],
        };
      });
    }
  };

  // Salvar atribuições
  const salvarAtribuicoes = useCallback(async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/representantes/${representanteId}/clientes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientesIds:
              representante?.clientes?.map((rel: any) => rel.cliente.id) || [],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.clientesIndisponiveis) {
          setToast({
            type: "error",
            text: `Alguns clientes já possuem representantes. Remova-os da seleção.`,
          });
          setSaving(false);
          return;
        }
        throw new Error(errorData.error || "Erro ao salvar atribuições");
      }

      const data = await response.json();

      // Mostrar mensagem de sucesso
      const mensagem =
        data.novosClientesCount > 0
          ? `Clientes atribuídos com sucesso! ${data.novosClientesCount} email(s) de notificação enviado(s) ao representante.`
          : "Clientes atribuídos com sucesso!";

      setToast({
        type: "success",
        text: mensagem,
      });

      // Redirecionar após 1.5 segundos para o usuário ver o toast
      setTimeout(() => {
        router.push(`/dashboard/representantes/${representanteId}`);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar atribuições:", error);
      setToast({
        type: "error",
        text: "Erro ao salvar atribuições. Tente novamente.",
      });
      setSaving(false);
    }
  }, [representanteId, representante, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
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
            href={`/dashboard/representantes/${representanteId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar ao Representante</span>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Clientes - {representante.user.name}
            </h1>
            <p className="text-gray-600">
              Selecione os clientes que serão atribuídos a este representante
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              {representante?.clientes?.length || 0} cliente
              {(representante?.clientes?.length || 0) !== 1 ? "s" : ""}{" "}
              atribuído
              {(representante?.clientes?.length || 0) !== 1 ? "s" : ""}
            </span>
            <span className="text-gray-500">
              {clientesFiltrados.length} disponível
              {clientesFiltrados.length !== 1 ? "is" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar clientes por nome, email ou CNPJ/CPF..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Clientes Atribuídos */}
      {representante?.clientes && representante.clientes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Clientes Atribuídos ({representante?.clientes?.length || 0})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {representante?.clientes?.map((rel: any) => (
              <div
                key={rel.cliente.id}
                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {rel.cliente.razaoSocial || rel.cliente.user.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {rel.cliente.user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rel.cliente.cidade}/{rel.cliente.estado}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCliente(rel.cliente.id)}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <UserMinus className="h-4 w-4" />
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clientes Disponíveis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Clientes Disponíveis
          </h2>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <UserCheck className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Clientes Disponíveis
              </p>
              <p className="text-sm text-blue-700">
                Apenas clientes sem representante são exibidos nesta lista.
                Todos os clientes mostrados podem ser atribuídos a este
                representante.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {clientesFiltrados
            .filter(
              (cliente) =>
                !representante?.clientes?.some(
                  (rel: any) => rel.cliente.id === cliente.id
                )
            )
            .map((cliente) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {cliente.razaoSocial || cliente.user.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {cliente.user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3" />
                        {formatCnpjCpfDisplay(cliente.cnpjCpf)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {cliente.cidade}/{cliente.estado}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleCliente(cliente.id)}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  Atribuir
                </button>
              </div>
            ))}

          {clientesFiltrados.filter(
            (cliente) =>
              !representante?.clientes?.some(
                (rel: any) => rel.cliente.id === cliente.id
              )
          ).length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Todos os clientes já foram atribuídos
              </h3>
              <p className="text-gray-600">
                Não há clientes disponíveis para atribuir a este representante.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botão de salvar */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          onClick={salvarAtribuicoes}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 shadow-lg"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Atribuições
            </>
          )}
        </button>
      </div>

      {/* Toast de notificação */}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast(null)}
          autoClose={true}
          duration={3000}
        />
      )}
    </div>
  );
}
