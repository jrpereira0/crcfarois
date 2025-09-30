# 🌿 Estratégia de Branches Profissional - CRC Faróis

## 📋 Estrutura de Branches

### Branches Principais (Permanentes)

```
main (produção)
  ↓
develop (desenvolvimento)
  ↓
feature/* (funcionalidades)
hotfix/* (correções urgentes)
```

### 1. **`main`** - Produção 🚀
- Código que está **EM PRODUÇÃO**
- **SEMPRE ESTÁVEL**
- Só recebe merges de `develop` ou `hotfix/*`
- Conectado à Vercel para deploy automático em produção
- **NUNCA fazer commit direto nesta branch**

### 2. **`develop`** - Desenvolvimento 🔧
- Código em desenvolvimento
- Integração de features
- Testes completos antes de ir para `main`
- Pode ter um ambiente de staging/homologação

### 3. **`feature/*`** - Funcionalidades ✨
- Criar para cada nova funcionalidade
- Exemplos:
  - `feature/carrinho-compras`
  - `feature/relatorio-vendas`
  - `feature/chat-atendimento`
- Fazer merge em `develop` quando pronta

### 4. **`hotfix/*`** - Correções Urgentes 🚨
- Para bugs críticos em produção
- Criar a partir de `main`
- Fazer merge em `main` E `develop`
- Exemplos:
  - `hotfix/erro-pagamento`
  - `hotfix/crash-checkout`

---

## 🚀 Workflow Completo

### Passo 1: Configurar Branches Principais

```bash
# Você já tem a main
# Criar a branch develop a partir da main
git checkout main
git pull
git checkout -b develop
git push -u origin develop
```

### Passo 2: Trabalhar em Nova Funcionalidade

```bash
# 1. Atualizar develop
git checkout develop
git pull

# 2. Criar branch da feature
git checkout -b feature/nome-da-funcionalidade

# 3. Fazer commits
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 4. Enviar para o GitHub
git push -u origin feature/nome-da-funcionalidade

# 5. Abrir Pull Request no GitHub
# develop ← feature/nome-da-funcionalidade
```

### Passo 3: Testar e Aprovar

```bash
# Após aprovação do Pull Request:
# 1. Fazer merge no GitHub (ou via linha de comando)
git checkout develop
git merge feature/nome-da-funcionalidade

# 2. Deletar branch da feature
git branch -d feature/nome-da-funcionalidade
git push origin --delete feature/nome-da-funcionalidade
```

### Passo 4: Deploy para Produção

```bash
# Quando develop estiver estável e testado:

# 1. Atualizar main
git checkout main
git pull

# 2. Fazer merge de develop
git merge develop

# 3. Criar tag de versão
git tag -a v1.0.0 -m "Release 1.0.0 - Descrição"

# 4. Enviar para produção
git push
git push --tags
```

### Passo 5: Hotfix Urgente (Bug em Produção)

```bash
# 1. Criar hotfix a partir de main
git checkout main
git checkout -b hotfix/nome-do-bug

# 2. Corrigir o bug
git add .
git commit -m "fix: corrigir bug crítico"

# 3. Merge em main (produção)
git checkout main
git merge hotfix/nome-do-bug
git push

# 4. Merge em develop também
git checkout develop
git merge hotfix/nome-do-bug
git push

# 5. Deletar branch do hotfix
git branch -d hotfix/nome-do-bug
git push origin --delete hotfix/nome-do-bug
```

---

## 🏗️ Configuração na Vercel

### Ambiente de Produção
- **Branch**: `main`
- **URL**: `https://crcfarois.vercel.app`
- **Deploy automático**: ✅ Sim

### Ambiente de Staging/Homologação
1. Na Vercel, vá em **Settings** → **Git**
2. Adicione `develop` como branch de preview
3. **URL**: `https://crcfarois-git-develop-seu-user.vercel.app`
4. **Deploy automático**: ✅ Sim

### Ambiente de Testes (Features)
- Cada Pull Request gera um preview automático
- **URL**: `https://crcfarois-git-feature-xxx.vercel.app`

---

## 📝 Convenção de Commits (Semantic Commits)

Use prefixos para commits mais organizados:

```bash
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação (não afeta código)
refactor: # Refatoração
test:     # Testes
chore:    # Tarefas/config (build, etc)
perf:     # Performance
```

**Exemplos:**
```bash
git commit -m "feat: adicionar filtro de busca avançada"
git commit -m "fix: corrigir cálculo de frete"
git commit -m "docs: atualizar README com instruções"
git commit -m "refactor: reorganizar componentes do dashboard"
```

---

## 🔄 Fluxo Visual

```
┌─────────────────────────────────────────────────┐
│  NOVA FUNCIONALIDADE                            │
└─────────────────────────────────────────────────┘

main    ─────●─────────────────●──────────────→ (produção)
              │                 │
develop ──────●────●────●───────●──────────────→ (staging)
                   │    │       
feature/xxx ───────●────●                         (testes)

1. Criar feature a partir de develop
2. Desenvolver e testar
3. Merge em develop
4. Testar em staging
5. Merge em main (produção)
```

```
┌─────────────────────────────────────────────────┐
│  HOTFIX (Correção Urgente)                      │
└─────────────────────────────────────────────────┘

main    ──────●────────●──────────────────────→ (produção)
              │        │
              │        ├──────────────────────→ develop
              │        │
hotfix  ──────●────────●

1. Criar hotfix a partir de main
2. Corrigir bug
3. Merge em main (produção imediata)
4. Merge em develop (manter sincronizado)
```

---

## 📋 Checklist antes de Produção

Antes de fazer merge de `develop` → `main`:

- [ ] Todos os testes passando
- [ ] Build sem erros
- [ ] Testado em ambiente de staging
- [ ] Aprovação da equipe/cliente
- [ ] Documentação atualizada
- [ ] Variáveis de ambiente configuradas
- [ ] Backup do banco de dados
- [ ] Tag de versão criada

---

## 🛠️ Comandos Úteis

### Ver branches
```bash
git branch              # Locais
git branch -r           # Remotas
git branch -a           # Todas
```

### Atualizar branch com develop
```bash
git checkout feature/minha-feature
git merge develop       # Ou rebase: git rebase develop
```

### Desfazer último commit (local)
```bash
git reset --soft HEAD~1  # Mantém alterações
git reset --hard HEAD~1  # Remove alterações
```

### Ver diferenças entre branches
```bash
git diff develop..main
```

### Limpar branches já deletadas
```bash
git fetch --prune
```

---

## 🎯 Recomendação para CRC Faróis

### Estrutura Inicial (Agora)

1. **Criar branch `develop`**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

2. **Proteger branches no GitHub**
   - Vá em **Settings** → **Branches** → **Add rule**
   - Proteger `main`: Require pull request, require reviews
   - Proteger `develop`: Require pull request

3. **Configurar Vercel**
   - `main` → Produção
   - `develop` → Staging

### Workflow Diário

```bash
# Manhã - Começar nova feature
git checkout develop
git pull
git checkout -b feature/nova-funcionalidade

# Durante o dia - Commits
git add .
git commit -m "feat: adicionar XYZ"

# Fim do dia - Push
git push -u origin feature/nova-funcionalidade

# Abrir Pull Request no GitHub
# develop ← feature/nova-funcionalidade

# Após revisão e aprovação
# Fazer merge via GitHub
# Deploy automático para staging

# Quando estável
# Criar PR: main ← develop
# Deploy automático para produção
```

---

## 📚 Materiais de Referência

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Desenvolvido para CRC Faróis** 🚗💡
