# 🚀 Deploy Simples na Vercel - CRC Faróis

## Você JÁ TEM tudo configurado! Só precisa fazer 3 passos:

### ✅ Passo 1: Acessar a Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório **"crcfarois"**
5. Clique em **"Import"**

---

### ✅ Passo 2: Copiar suas Variáveis de Ambiente

Antes de clicar em "Deploy", adicione estas variáveis em **"Environment Variables"**:

**Cole EXATAMENTE isso:**

```
DATABASE_URL
```

```
postgresql://neondb_owner:npg_RGd9oaZuMH0K@ep-long-block-actmeqx6-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```
NEXTAUTH_SECRET
```

```
bK3QUV7Qr+wQCfGbOWVMziPWQA3N+vLSsuQf/BZ7fAg=
```

```
NEXTAUTH_URL
```

```
https://crcfarois.vercel.app
```

**⚠️ IMPORTANTE**: Esta URL vai mudar. Após o deploy, você vai atualizar ela.

```
CLOUDINARY_CLOUD_NAME
```

```
dn7nvyvss
```

```
CLOUDINARY_API_KEY
```

```
754777921963855
```

```
CLOUDINARY_API_SECRET
```

```
vcABbSimmHeFwVMmrQYo5NYf_UE
```

```
BREVO_API_KEY
```

```
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
```

```
BREVO_SENDER_EMAIL
```

```
nao-responda@crcfarois.ind.br
```

```
NEXT_PUBLIC_APP_URL
```

```
https://crcfarois.vercel.app
```

**⚠️ IMPORTANTE**: Esta URL também vai mudar após o deploy.

```
NODE_ENV
```

```
production
```

---

### ✅ Passo 3: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-5 minutos
3. Quando terminar, você verá "🎉 Congratulations!"
4. **COPIE a URL do projeto** (será algo como `https://crcfarois-xyz123.vercel.app`)

---

### ✅ Passo 4: Atualizar as URLs

Agora que você tem a URL real:

1. Na Vercel, vá em **Settings** → **Environment Variables**
2. Encontre `NEXTAUTH_URL` e clique em **Edit**
3. Substitua por sua URL real (ex: `https://crcfarois-xyz123.vercel.app`)
4. Clique em **Save**
5. Encontre `NEXT_PUBLIC_APP_URL` e faça o mesmo
6. Clique em **Save**
7. Vá em **Deployments**
8. No último deployment, clique nos 3 pontinhos (**...**) → **"Redeploy"**

---

### ✅ Passo 5: Testar

Acesse seu site:

- **Site**: `https://sua-url.vercel.app`
- **Login**: `https://sua-url.vercel.app/login`

**Credenciais padrão:**

- Admin: `admin@crcfarois.ind.br` / `admin123`
- Cliente: `cliente@exemplo.com` / `cliente123`
- Representante: `rep@exemplo.com` / `rep123`

---

## ⚠️ O banco de dados JÁ está configurado?

Você já rodou isso localmente?

```bash
npx prisma db push
npx prisma db seed
```

Se **SIM** → Tudo vai funcionar! ✅  
Se **NÃO** → Rode esses comandos agora antes do deploy

---

## 🎉 Pronto!

Seu site já estará no ar em poucos minutos!

Se der algum erro:

1. Vá em **Deployments** na Vercel
2. Clique no último deployment
3. Vá em **Functions** para ver os logs
4. Me mostre o erro que vou ajudar! 😊
