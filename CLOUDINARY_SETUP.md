# 🌟 Configuração Cloudinary - CRC Faróis

## 📋 Pré-requisitos

1. **Criar conta no Cloudinary**:

   - Acesse: https://cloudinary.com/
   - Clique em "Sign Up for Free"
   - Faça cadastro gratuito (até 25GB/mês grátis)

2. **Obter credenciais**:
   - Após login, vá para Dashboard
   - Copie as informações: `Cloud Name`, `API Key`, `API Secret`

## 🔧 Configuração das Variáveis

### 1. Criar arquivo `.env.local` na raiz do projeto:

```bash
# Suas variáveis existentes
DATABASE_URL="sua_url_neon"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu_secret"

# Adicionar variáveis do Cloudinary
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

### 2. Exemplo das credenciais:

```bash
# Exemplo (substitua pelos seus valores reais)
CLOUDINARY_CLOUD_NAME="crc-farois"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz123456"
```

## 🚀 Como Testar

1. **Reiniciar servidor**:

   ```bash
   npm run dev
   ```

2. **Testar upload**:

   - Vá para "Novo Produto"
   - Adicione imagens (arrastar ou clicar)
   - Observe os indicadores de upload:
     - 🔄 Spinner = Enviando
     - ✅ Check verde = Sucesso
     - ❌ X vermelho = Erro

3. **Verificar no Cloudinary**:
   - Acesse seu dashboard
   - Vá em "Media Library"
   - Veja as imagens na pasta `crc-farois/produtos/`

## 📸 Funcionalidades Implementadas

### ✅ Upload Automático

- Imagens redimensionadas para 1000x1000px
- Crop centralizado automático
- Qualidade otimizada (JPEG 90%)
- Organização em pastas

### ✅ Indicadores Visuais

- Status de upload em tempo real
- Badges de sucesso/erro
- Preview das imagens
- Seleção de imagem principal

### ✅ Gerenciamento

- Deletar imagens do Cloudinary
- URLs permanentes no banco
- CDN global automático
- Otimização automática

## 🛠️ Estrutura Criada

```
src/
├── lib/
│   └── cloudinary.ts          # Configuração
├── app/api/
│   └── upload/
│       └── route.ts           # API de upload/delete
└── components/ui/
    └── ImageUpload.tsx        # Componente atualizado
```

## 🔍 URLs Geradas

As imagens ficam com URLs como:

```
https://res.cloudinary.com/crc-farois/image/upload/v1234567890/crc-farois/produtos/produto-1234567890-abc123.jpg
```

## 💡 Benefícios

- **CDN Global**: Imagens carregam rápido mundialmente
- **Otimização**: Compressão automática
- **Transformações**: Redimensionamento dinâmico
- **Backup**: Imagens seguras na nuvem
- **Escalabilidade**: Suporta milhões de imagens

## 🚨 Importante

- **Gratuito até 25GB/mês**
- **URLs permanentes** (não quebram)
- **Backup automático**
- **Ideal para produção**

Após configurar, teste o sistema e me informe se funciona! 🎯
