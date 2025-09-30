"use client";

import { useSession } from "next-auth/react";

export default function B2BHomePage() {
  const { data: session } = useSession();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Seja bem-vindo, {session?.user?.name?.split(" ")[0] || "Cliente"}!
          </h1>
          <p className="text-xl text-gray-600">
            Bem-vindo à plataforma CRC B2B
          </p>
          <div className="mt-8 w-16 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
