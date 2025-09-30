import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
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
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else if (token.role === "CLIENTE") {
        return NextResponse.redirect(new URL("/b2b", req.url));
      } else if (token.role === "REPRESENTANTE") {
        return NextResponse.redirect(new URL("/representante", req.url));
      }
    }

    // Verificar acesso ao dashboard - apenas admins
    if (token && pathname.startsWith("/dashboard")) {
      if (token.role !== "ADMIN") {
        if (token.role === "CLIENTE") {
          return NextResponse.redirect(new URL("/b2b", req.url));
        } else if (token.role === "REPRESENTANTE") {
          return NextResponse.redirect(new URL("/representante", req.url));
        }
      }
    }

    // Verificar acesso à área B2B - apenas clientes
    if (token && pathname.startsWith("/b2b")) {
      if (token.role !== "CLIENTE") {
        if (token.role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else if (token.role === "REPRESENTANTE") {
          return NextResponse.redirect(new URL("/representante", req.url));
        }
      }
    }

    // Verificar acesso à área de representante - apenas representantes
    if (token && pathname.startsWith("/representante")) {
      if (token.role !== "REPRESENTANTE") {
        if (token.role === "ADMIN") {
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

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/b2b/:path*",
    "/representante/:path*",
    "/login",
  ],
};
