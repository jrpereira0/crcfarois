# CRC Faróis - Sistema Web

Sistema web completo para a CRC Faróis com site institucional e área administrativa.

## Tecnologias

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js

## Como rodar

1. Instalar dependências:
```bash
npm install
```

2. Configurar `.env.local`:
```env
DATABASE_URL="sua_url_do_banco"
NEXTAUTH_SECRET="sua_chave_secreta"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
BREVO_API_KEY="sua_chave_brevo"
```

3. Configurar banco:
```bash
npx prisma db push
npx prisma db seed
```

4. Rodar projeto:
```bash
npm run dev
```

## Estrutura

- `/` - Site institucional
- `/login` - Login do sistema
- `/dashboard` - Painel administrativo
- `/b2b` - Portal do cliente
- `/representante` - Portal do representante

## Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npx prisma studio` - Interface do banco