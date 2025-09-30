import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ClientePage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "CLIENTE") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <div className="text-white text-2xl font-bold">CRC</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Área do Cliente
          </h1>
          <p className="text-gray-600">Bem-vindo, {session.user.name}!</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Sua área do cliente está sendo desenvolvida.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Em breve você terá acesso a todas as funcionalidades.
            </p>
          </div>

          <button
            onClick={() => {
              // Implementar logout
              window.location.href = "/api/auth/signout";
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
