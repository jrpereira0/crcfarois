import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para validar variáveis de ambiente obrigatórias
export function validateEnvVars() {
  const required = ['DATABASE_URL', 'NEXTAUTH_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}`)
  }
}

// Função para gerar NEXTAUTH_SECRET seguro
export function generateSecretKey() {
  if (typeof window !== 'undefined') {
    console.log('Para gerar uma chave NEXTAUTH_SECRET segura, execute:')
    console.log('openssl rand -base64 32')
    return
  }
  
  const crypto = require('crypto')
  return crypto.randomBytes(32).toString('base64')
}
