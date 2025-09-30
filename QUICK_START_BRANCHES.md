# 🚀 Guia Rápido - Começar Agora

## 📌 Configuração Inicial (Fazer UMA VEZ)

```bash
# 1. Criar branch develop
git checkout main
git pull
git checkout -b develop
git push -u origin develop

# 2. Voltar para main
git checkout main
```

✅ **Pronto! Agora você tem:**
- `main` → Produção (Vercel)
- `develop` → Testes/Staging

---

## 💼 Uso Diário - Fluxo Simples

### Cenário 1: Desenvolver Nova Funcionalidade

```bash
# 1. Criar branch da feature
git checkout develop
git pull
git checkout -b feature/nome-da-feature

# 2. Trabalhar normalmente
# ... fazer alterações ...
git add .
git commit -m "feat: descrição do que fez"

# 3. Enviar para GitHub
git push -u origin feature/nome-da-feature

# 4. No GitHub:
# - Abrir Pull Request
# - Base: develop ← Compare: feature/nome-da-feature
# - Revisar e fazer Merge

# 5. Voltar para develop e atualizar
git checkout develop
git pull

# 6. Deletar branch local da feature
git branch -d feature/nome-da-feature
```

### Cenário 2: Testar em Staging (develop)

```bash
# Após merge da feature em develop:
# - Vercel faz deploy automático de develop
# - Testar em: https://crcfarois-git-develop.vercel.app
# - Se tudo OK, seguir para produção
```

### Cenário 3: Mandar para Produção

```bash
# 1. Merge develop → main
git checkout main
git pull
git merge develop

# 2. Criar tag de versão (opcional mas recomendado)
git tag -a v1.0.0 -m "Release versão 1.0.0"

# 3. Enviar para produção
git push
git push --tags

# 4. Vercel faz deploy automático
# 5. Verificar: https://crcfarois.vercel.app
```

### Cenário 4: Correção Urgente (Bug em Produção)

```bash
# 1. Criar hotfix
git checkout main
git pull
git checkout -b hotfix/nome-do-bug

# 2. Corrigir
# ... fazer correção ...
git add .
git commit -m "fix: corrigir bug X"

# 3. Merge em main
git checkout main
git merge hotfix/nome-do-bug
git push

# 4. Merge em develop também
git checkout develop
git merge hotfix/nome-do-bug
git push

# 5. Deletar hotfix
git branch -d hotfix/nome-do-bug
```

---

## 🎯 Regras de Ouro

1. **NUNCA** commitar direto em `main`
2. **SEMPRE** criar feature branch a partir de `develop`
3. **SEMPRE** testar em `develop` antes de ir para `main`
4. **USAR** Pull Requests para revisão
5. **MANTER** `develop` e `main` sincronizadas

---

## 📊 Status Atual do Projeto

```bash
# Ver em qual branch está
git branch

# Ver todas as branches
git branch -a

# Atualizar branches
git fetch --all
```

---

## ⚡ Comandos Mais Usados

```bash
# Criar nova feature
git checkout develop && git pull && git checkout -b feature/minha-feature

# Commit rápido
git add . && git commit -m "feat: descrição"

# Push primeira vez
git push -u origin nome-da-branch

# Push normal
git push

# Atualizar branch atual
git pull

# Trocar de branch
git checkout nome-da-branch

# Ver status
git status

# Ver histórico
git log --oneline --graph --all
```

---

## 🔧 Configuração da Vercel (Recomendado)

### No painel da Vercel:

1. **Settings** → **Git**
   - Production Branch: `main` ✅
   - Preview Branches: `develop` ✅

2. **Deployments**
   - Cada push em `main` → Deploy em produção
   - Cada push em `develop` → Deploy em staging
   - Cada PR → Preview temporário

---

## 📱 Exemplo Prático Completo

### Você vai adicionar um novo relatório:

```bash
# Passo 1: Criar branch
git checkout develop
git pull
git checkout -b feature/relatorio-vendas

# Passo 2: Desenvolver
# ... criar arquivos, editar código ...

# Passo 3: Commits durante desenvolvimento
git add .
git commit -m "feat: criar estrutura do relatório"
# ... mais desenvolvimento ...
git add .
git commit -m "feat: adicionar filtros de data"
# ... mais desenvolvimento ...
git add .
git commit -m "feat: adicionar gráficos de vendas"

# Passo 4: Enviar para GitHub
git push -u origin feature/relatorio-vendas

# Passo 5: Abrir Pull Request no GitHub
# Base: develop ← Compare: feature/relatorio-vendas
# Título: "Adicionar relatório de vendas"
# Descrição: "- Filtros por data
#            - Gráficos interativos
#            - Export para Excel"

# Passo 6: Revisar e fazer Merge

# Passo 7: Limpar
git checkout develop
git pull
git branch -d feature/relatorio-vendas

# Passo 8: Testar em staging
# Acessar: https://crcfarois-git-develop.vercel.app

# Passo 9: Tudo OK? Mandar para produção
git checkout main
git pull
git merge develop
git tag -a v1.1.0 -m "Adicionar relatório de vendas"
git push
git push --tags

# PRONTO! ✅
```

---

## 🆘 Problemas Comuns

### "Conflito ao fazer merge"
```bash
# 1. Git vai marcar os conflitos no arquivo
# 2. Abrir o arquivo e resolver
# 3. Após resolver:
git add .
git commit -m "merge: resolver conflitos"
```

### "Commitei na branch errada"
```bash
# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Trocar para branch correta
git checkout branch-correta

# Commitar de novo
git add .
git commit -m "mensagem"
```

### "Quero atualizar minha feature com develop"
```bash
git checkout feature/minha-feature
git merge develop
# Resolver conflitos se houver
```

---

Comece com isso e vai se acostumando! 🚀
