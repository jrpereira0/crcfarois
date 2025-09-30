# 🚀 Guia de Deploy na Vercel - CRC Faróis

Este guia contém instruções passo a passo para fazer o deploy do projeto CRC Faróis na Vercel.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [ ] Conta no [GitHub](https://github.com) (já criada ✅)
- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Banco de dados PostgreSQL em produção (recomendado: [Neon](https://neon.tech), [Supabase](https://supabase.com) ou [Railway](https://railway.app))
- [ ] Conta no [Cloudinary](https://cloudinary.com) para upload de imagens
- [ ] Conta no [Brevo](https://brevo.com) para envio de emails (opcional)

## 📊 Passo 1: Configurar Banco de Dados PostgreSQL

### Opção A: Neon (Recomendado - Gratuito)

1. Acesse [neon.tech](https://neon.tech)
2. Clique em "Sign Up" e crie sua conta
3. Crie um novo projeto
4. Copie a **Connection String** (formato: `postgresql://user:password@host/database`)

### Opção B: Supabase (Gratuito)

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Settings** → **Database**
4. Copie a **Connection String** (modo "Session")

### Opção C: Railway (Gratuito)

1. Acesse [railway.app](https://railway.app)
2. Crie um novo projeto
3. Adicione PostgreSQL
4. Copie a **DATABASE_URL**

## 🔑 Passo 2: Gerar NEXTAUTH_SECRET

No seu terminal local, execute:

```bash
openssl rand -base64 32
```

**Copie o resultado** - você precisará dele nas variáveis de ambiente.

## ☁️ Passo 3: Configurar Cloudinary

1. Acesse [cloudinary.com](https://cloudinary.com)
2. Faça login ou crie uma conta gratuita
3. No Dashboard, você encontrará:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. **Copie essas 3 informações** - você precisará delas

## 📧 Passo 4: Configurar Brevo (Opcional - para emails)

1. Acesse [brevo.com](https://brevo.com)
2. Crie uma conta ou faça login
3. Vá em **SMTP & API** → **API Keys**
4. Crie uma nova API Key
5. **Copie a API Key**

## 🌐 Passo 5: Deploy na Vercel

### 5.1 Importar Projeto

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório **crcfarois**
5. Clique em **"Import"**

### 5.2 Configurar Variáveis de Ambiente

Antes de fazer o deploy, clique em **"Environment Variables"** e adicione:

#### Variáveis Obrigatórias:

```env
DATABASE_URL
```

Cole a Connection String do seu banco PostgreSQL (Neon/Supabase/Railway)

```env
NEXTAUTH_SECRET
```

Cole o secret gerado com openssl (Passo 2)

```env
NEXTAUTH_URL
```

Deixe em branco por enquanto (vamos preencher depois do primeiro deploy)

```env
CLOUDINARY_CLOUD_NAME
```

Cole o Cloud Name do Cloudinary

```env
CLOUDINARY_API_KEY
```

Cole a API Key do Cloudinary

```env
CLOUDINARY_API_SECRET
```

Cole o API Secret do Cloudinary

#### Variáveis Opcionais:

```env
BREVO_API_KEY
```

Cole a API Key do Brevo (se configurou o email)

```env
ADMIN_EMAIL
```

Email do administrador (ex: admin@crcfarois.ind.br)

```env
NODE_ENV
```

Valor: `production`

### 5.3 Fazer Deploy

1. Após configurar as variáveis, clique em **"Deploy"**
2. Aguarde o build e deploy (pode levar 2-5 minutos)
3. Quando finalizar, você verá: "🎉 Congratulations!"

### 5.4 Atualizar NEXTAUTH_URL

1. Copie a URL do seu projeto (ex: `https://crcfarois.vercel.app`)
2. Na Vercel, vá em **Settings** → **Environment Variables**
3. Encontre a variável `NEXTAUTH_URL`
4. Edite e cole a URL do projeto (ex: `https://crcfarois.vercel.app`)
5. Clique em **Save**
6. Vá em **Deployments** e clique em **"Redeploy"** no último deployment

## 🗄️ Passo 6: Configurar Banco de Dados em Produção

Agora precisamos criar as tabelas no banco de dados:

### 6.1 Aplicar Migrations

No terminal local, execute:

```bash
# Defina a DATABASE_URL de produção temporariamente
$env:DATABASE_URL="sua_connection_string_de_producao"

# Execute as migrations
npx prisma db push

# Popule o banco com dados iniciais
npx prisma db seed
```

### 6.2 Verificar Dados

Para verificar se funcionou:

1. Acesse seu banco de dados (Neon/Supabase/Railway)
2. Verifique se as tabelas foram criadas:
   - Usuario
   - Cliente
   - Produto
   - Categoria
   - Pedido
   - etc.

## ✅ Passo 7: Testar a Aplicação

1. Acesse a URL do projeto na Vercel
2. Teste as páginas principais:

   - Página inicial
   - Quem somos
   - Produtos
   - Contato

3. Teste o login:

   - Acesse `/login`
   - Use as credenciais padrão:
     - **Admin**: `admin@crcfarois.ind.br` / `admin123`
     - **Cliente**: `cliente@exemplo.com` / `cliente123`
     - **Representante**: `rep@exemplo.com` / `rep123`

4. Teste o upload de imagens no dashboard admin

## 🔧 Passo 8: Configurações Adicionais (Opcional)

### Domínio Personalizado

1. Na Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções da Vercel

### Análises e Monitoramento

1. Ative o **Vercel Analytics** em Settings
2. Configure **Vercel Speed Insights** para métricas de performance

## 🐛 Solução de Problemas

### Erro: "Prisma Client could not be generated"

**Solução**: O script `postinstall` já foi adicionado ao `package.json`, mas se o erro persistir:

```bash
# Localmente, force um novo deploy
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Erro: "Database connection failed"

**Solução**: Verifique se a `DATABASE_URL` está correta e se o banco está acessível.

### Erro: "NextAuth configuration error"

**Solução**:

1. Verifique se `NEXTAUTH_URL` está configurado com a URL completa
2. Verifique se `NEXTAUTH_SECRET` tem pelo menos 32 caracteres

### Erro: "Cloudinary upload failed"

**Solução**: Verifique se as 3 variáveis do Cloudinary estão corretas.

### Páginas em branco ou erro 500

**Solução**:

1. Vá em **Deployments** → Clique no último deployment
2. Vá em **Functions** → Veja os logs de erro
3. Corrija o problema e faça redeploy

## 📱 Passo 9: Próximos Passos

Após o deploy bem-sucedido:

- [ ] Altere as senhas padrão dos usuários
- [ ] Configure backup automático do banco de dados
- [ ] Adicione Google Analytics (opcional)
- [ ] Configure SEO (meta tags, sitemap)
- [ ] Teste todas as funcionalidades
- [ ] Configure domínio personalizado
- [ ] Configure SSL/HTTPS (automático na Vercel)

## 🎉 Conclusão

Parabéns! Seu projeto está no ar! 🚀

- **Site**: https://seu-projeto.vercel.app
- **Dashboard Admin**: https://seu-projeto.vercel.app/dashboard
- **Portal B2B**: https://seu-projeto.vercel.app/b2b
- **Portal Representante**: https://seu-projeto.vercel.app/representante

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs na Vercel (**Deployments** → **Functions**)
2. Consulte a [documentação da Vercel](https://vercel.com/docs)
3. Consulte a [documentação do Prisma](https://www.prisma.io/docs)

---

**Desenvolvido para CRC Faróis** 🚗💡
