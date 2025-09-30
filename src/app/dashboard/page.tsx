import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BarChart3, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { DashboardStatSkeleton } from "@/components/ui/Skeleton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const stats = [
    {
      name: "Total de Usuários",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
    },
    {
      name: "Vendas do Mês",
      value: "R$ 45,231",
      change: "+8%",
      changeType: "increase",
      icon: ShoppingCart,
    },
    {
      name: "Taxa de Conversão",
      value: "3.24%",
      change: "+2.1%",
      changeType: "increase",
      icon: TrendingUp,
    },
    {
      name: "Relatórios",
      value: "89",
      change: "-1.2%",
      changeType: "decrease",
      icon: BarChart3,
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-8 pt-16 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Aqui está um resumo do seu painel administrativo da CRC Faróis.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span
                    className={`font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-500 ml-2">vs mês anterior</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Atividade Recente
            </h3>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      Atividade exemplo #{item}
                    </p>
                    <p className="text-sm text-gray-500">
                      Há {item} hora{item > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
          </div>
          <div className="flex-1 p-6">
            <div className="grid grid-cols-2 gap-4 h-full">
              <button className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center">
                <div className="text-primary">
                  <Users className="h-10 w-10 mx-auto mb-3" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Gerenciar Usuários
                </span>
              </button>

              <button className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center">
                <div className="text-primary">
                  <BarChart3 className="h-10 w-10 mx-auto mb-3" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Ver Relatórios
                </span>
              </button>

              <button className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center">
                <div className="text-primary">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-3" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Vendas
                </span>
              </button>

              <button className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center">
                <div className="text-primary">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Analytics
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Card adicional para telas muito grandes */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 flex flex-col xl:col-span-1 2xl:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Resumo Geral</h3>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-primary mb-4">
                <BarChart3 className="h-16 w-16 mx-auto" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Sistema CRC Faróis
              </h4>
              <p className="text-gray-600 max-w-md">
                Painel administrativo funcionando perfeitamente. Gerencie
                clientes, visualize relatórios e acompanhe o crescimento do seu
                negócio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
