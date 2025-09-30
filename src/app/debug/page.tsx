"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">
          Debug - Informações da Sessão
        </h1>

        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>

          <div>
            <strong>Sessão:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Ir para Login
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Ir para Dashboard
            </button>

            <button
              onClick={() => router.push("/cliente")}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Ir para Cliente
            </button>

            <button
              onClick={() => (window.location.href = "/api/auth/signout")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
