import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

// Troque para false quando quiser reativar o site
const MAINTENANCE_MODE = true;

const MAINTENANCE_BYPASS = ["/manutencao", "/_next", "/api/auth", "/favicon.ico"];

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Redirecionar usuários não autenticados para login
    if (
      !token &&
      (pathname.startsWith("/dashboard") ||
        pathname.startsWith("/representante"))
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirecionar usuários autenticados da página de login baseado no role
    if (token && pathname === "/login") {
      if (token.role === "ADMIN" || token.role === "FUNCIONARIO") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else if (token.role === "CLIENTE") {
        return NextResponse.redirect(new URL("/b2b", req.url));
      } else if (token.role === "REPRESENTANTE") {
        return NextResponse.redirect(new URL("/representante", req.url));
      }
    }

    // Verificar acesso ao dashboard - admins e funcionários
    if (token && pathname.startsWith("/dashboard")) {
      if (token.role !== "ADMIN" && token.role !== "FUNCIONARIO") {
        if (token.role === "CLIENTE") {
          return NextResponse.redirect(new URL("/b2b", req.url));
        } else if (token.role === "REPRESENTANTE") {
          return NextResponse.redirect(new URL("/representante", req.url));
        }
      }

      // Bloquear acesso de FUNCIONARIO à página de usuários
      if (token.role === "FUNCIONARIO" && pathname.startsWith("/dashboard/usuarios")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Verificar acesso à área B2B - apenas clientes
    if (token && pathname.startsWith("/b2b")) {
      if (token.role !== "CLIENTE") {
        if (token.role === "ADMIN" || token.role === "FUNCIONARIO") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else if (token.role === "REPRESENTANTE") {
          return NextResponse.redirect(new URL("/representante", req.url));
        }
      }
    }

    // Verificar acesso à área de representante - apenas representantes
    if (token && pathname.startsWith("/representante")) {
      if (token.role !== "REPRESENTANTE") {
        if (token.role === "ADMIN" || token.role === "FUNCIONARIO") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else if (token.role === "CLIENTE") {
          return NextResponse.redirect(new URL("/b2b", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir acesso às rotas públicas
        if (pathname === "/login" || pathname.startsWith("/api/auth")) {
          return true;
        }

        // Exigir autenticação para rotas protegidas
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/b2b") ||
          pathname.startsWith("/representante")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  if (MAINTENANCE_MODE) {
    const isBypassed = MAINTENANCE_BYPASS.some((path) =>
      pathname.startsWith(path)
    );
    if (!isBypassed) {
      return NextResponse.redirect(new URL("/manutencao", req.url));
    }
    return NextResponse.next();
  }

  return (authMiddleware as (req: NextRequest, event: NextFetchEvent) => ReturnType<typeof NextResponse.next>)(req, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
