# CRC Faróis - Site Institucional e Sistema de Gestão

Site institucional completo e sistema de gestão administrativo para a CRC Faróis, desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## 🌐 Site Institucional

O site institucional apresenta a empresa de forma profissional e moderna, incluindo:

### Páginas Principais

- **Página Inicial**: Apresentação da empresa com hero section, diferenciais e call-to-actions
- **Quem Somos**: História da empresa, missão, visão, valores e números
- **Produtos**: Catálogo completo de produtos com categorias e especificações
- **Serviços**: Descrição dos serviços oferecidos e processo de atendimento
- **Contato**: Formulário de contato, informações e FAQ

### Características

- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **SEO Otimizado**: Meta tags, Open Graph e estrutura semântica
- **Performance**: Carregamento rápido e otimizado
- **Acessibilidade**: Seguindo boas práticas de acessibilidade web
- **Navegação Intuitiva**: Menu responsivo e estrutura clara

## 🔧 Sistema de Gestão

Sistema completo para gerenciamento interno da empresa:

### Funcionalidades Administrativas

- **Dashboard Administrativo**: Visão geral de vendas, pedidos e clientes
- **Gestão de Produtos**: CRUD completo com upload de imagens
- **Gestão de Clientes**: Cadastro e gerenciamento de clientes
- **Sistema de Pedidos**: Criação e acompanhamento de pedidos
- **Gestão de Representantes**: Controle de representantes comerciais
- **Relatórios**: Faturamento e análises de vendas

### Portal B2B

- **Autenticação Segura**: Sistema de login com NextAuth.js
- **Catálogo de Produtos**: Visualização de produtos com preços personalizados
- **Carrinho de Compras**: Funcionalidade completa de e-commerce B2B
- **Histórico de Pedidos**: Acompanhamento de pedidos realizados
- **Área do Cliente**: Portal personalizado para cada cliente

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework CSS utilitário para design moderno
- **Prisma** - ORM para banco de dados PostgreSQL
- **NextAuth.js** - Autenticação segura e flexível
- **Cloudinary** - Upload e gerenciamento de imagens
- **Lucide React** - Biblioteca de ícones moderna

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (institucional)/      # Páginas do site institucional
│   │   ├── quem-somos/
│   │   ├── produtos/
│   │   ├── servicos/
│   │   ├── contato/
│   │   ├── politica-privacidade/
│   │   └── termos-uso/
│   ├── api/                  # API Routes
│   ├── dashboard/            # Painel administrativo
│   ├── b2b/                 # Portal B2B para clientes
│   ├── representante/       # Portal para representantes
│   └── login/               # Autenticação
├── components/
│   ├── ui/                  # Componentes de interface
│   ├── dashboard/           # Componentes do dashboard
│   └── providers/           # Providers React
├── contexts/                # Contextos React (Carrinho, Toast, etc.)
├── lib/                    # Utilitários e configurações
└── types/                  # Definições de tipos TypeScript
```

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no Cloudinary (para upload de imagens)

### Instalação

1. **Clone o repositório**

   ```bash
   git clone [url-do-repositorio]
   cd crcfarois
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env.local
   ```

   Edite o arquivo `.env.local` com suas configurações:

   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/crcfarois"
   NEXTAUTH_SECRET="seu_secret_aqui"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="seu_cloud_name"
   CLOUDINARY_API_KEY="sua_api_key"
   CLOUDINARY_API_SECRET="seu_api_secret"
   ```

4. **Configure o banco de dados**

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   - Site institucional: `http://localhost:3000`
   - Login: `http://localhost:3000/login`

## 📊 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linting do código
- `npx prisma studio` - Interface visual do banco de dados
- `npx prisma migrate dev` - Executa migrações do banco

## 🔐 Usuários Padrão

Após executar o seed do banco de dados:

- **Admin**: admin@crcfarois.ind.br / admin123
- **Cliente**: cliente@exemplo.com / cliente123
- **Representante**: rep@exemplo.com / rep123

## 🌟 Funcionalidades Destacadas

### Site Institucional

- ✅ Design moderno e responsivo
- ✅ SEO otimizado para mecanismos de busca
- ✅ Formulário de contato funcional
- ✅ Páginas legais (Política de Privacidade, Termos de Uso)
- ✅ Integração com sistema de gestão

### Sistema de Gestão

- ✅ Autenticação multi-nível (Admin, Cliente, Representante)
- ✅ Upload de imagens com Cloudinary
- ✅ Carrinho de compras persistente
- ✅ Sistema de pedidos completo
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão de condições de pagamento por cliente

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🔍 SEO e Performance

- Meta tags otimizadas
- Open Graph para redes sociais
- Sitemap automático
- Imagens otimizadas
- Carregamento lazy de componentes
- Core Web Vitals otimizados

## 🚀 Deploy na Vercel

### 1. Preparar o repositório

```bash
git init
git add .
git commit -m "Initial commit: CRC Faróis Site Institucional"
git branch -M main
git remote add origin https://github.com/seuusuario/crcfarois.git
git push -u origin main
```

### 2. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project" e conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`: Sua URL do banco PostgreSQL
   - `NEXTAUTH_SECRET`: Chave secura (gere com `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: https://seu-projeto.vercel.app
   - `CLOUDINARY_CLOUD_NAME`: Nome do seu cloud Cloudinary
   - `CLOUDINARY_API_KEY`: Sua API key do Cloudinary
   - `CLOUDINARY_API_SECRET`: Seu API secret do Cloudinary

### 3. Configurar banco em produção

Após o deploy, execute as migrations:

```bash
# No terminal local, com DATABASE_URL de produção
npx prisma db push
npx prisma db seed
```

## ⚠️ IMPORTANTE - Segurança

- ✅ Todas as credenciais estão em variáveis de ambiente
- ✅ Arquivo `.env.local` está no `.gitignore`
- ✅ Middleware de autenticação implementado
- ✅ Validação de variáveis obrigatórias
- ✅ Senhas criptografadas com bcrypt
- ✅ Proteção CSRF e XSS

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **E-mail**: suporte@crcfarois.ind.br
- **Telefone**: (11) 4702-6822

## 📄 Licença

Este projeto é propriedade da CRC Faróis. Todos os direitos reservados.
