const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

console.log('🔧 Configurando ambiente seguro para CRC Faróis...\n')

// Gerar NEXTAUTH_SECRET seguro
const nextAuthSecret = crypto.randomBytes(32).toString('base64')

// Template do arquivo .env.local
const envTemplate = `# CRC Faróis - Configurações de Ambiente
# ATENÇÃO: Nunca commite este arquivo!

# Database - Substitua pela sua URL do Neon
DATABASE_URL="postgresql://neondb_owner:npg_RGd9oaZuMH0K@ep-long-block-actmeqx6-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth - Chave gerada automaticamente
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${nextAuthSecret}"

# Para produção, altere NEXTAUTH_URL para:
# NEXTAUTH_URL="https://seu-dominio.vercel.app"
`

// Criar arquivo .env.local se não existir
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate)
  console.log('✅ Arquivo .env.local criado com credenciais seguras')
} else {
  console.log('ℹ️  Arquivo .env.local já existe')
}

console.log('\n📋 Próximos passos:')
console.log('1. Instale as dependências: npm install')
console.log('2. Configure o banco: npx prisma db push')
console.log('3. Crie usuário inicial: npm run seed')
console.log('4. Execute o projeto: npm run dev')

console.log('\n🔐 Credenciais geradas:')
console.log('- NEXTAUTH_SECRET: [GERADO AUTOMATICAMENTE]')
console.log('- Usuário padrão será criado pelo seed')

console.log('\n⚠️  IMPORTANTE:')
console.log('- Nunca commite o arquivo .env.local')
console.log('- Use variáveis de ambiente na Vercel para produção')
console.log('- Altere a senha padrão após primeiro login')
