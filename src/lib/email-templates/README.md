# 📧 Templates de Email - CRC Faróis

Esta pasta contém todos os templates de email usados no sistema.

## 📂 Arquivos

### 1. **solicitacao-cadastro.ts**

**Email enviado quando:** O cliente finaliza o cadastro inicial no site

**Para:** Cliente (usuário que se cadastrou)

**Assunto:** Solicitação de Cadastro Recebida

**Conteúdo:**

- Confirmação de recebimento da solicitação
- Informação sobre prazo de análise (48h)
- Próximos passos
- Informações de contato da empresa

---

### 2. **aprovacao-cadastro.ts**

**Email enviado quando:** Admin aprova a solicitação de cadastro

**Para:** Cliente aprovado

**Assunto:** 🎉 Cadastro Aprovado - Bem-vindo à CRC Faróis!

**Conteúdo:**

- Mensagem de boas-vindas e parabéns
- Instruções de acesso à plataforma B2B
- Email e senha para login
- Dados do representante designado (nome, email, WhatsApp)
- Botão de acesso à plataforma

---

### 3. **rejeicao-cadastro.ts**

**Email enviado quando:** Admin rejeita a solicitação de cadastro

**Para:** Cliente (solicitação negada)

**Assunto:** Atualização sobre sua Solicitação - CRC Faróis

**Conteúdo:**

- Informação sobre rejeição
- Motivo da rejeição
- Informações de contato para esclarecimentos

---

### 4. **novo-cliente-representante.ts**

**Email enviado quando:** Admin aprova cadastro e vincula representante

**Para:** Representante designado

**Assunto:** 🎯 Novo Cliente Atribuído - CRC Faróis

**Conteúdo:**

- Notificação de novo cliente atribuído
- Dados completos do cliente:
  - Empresa (Razão Social)
  - Responsável
  - Email
  - WhatsApp
  - Telefone
  - Localização
- Próximos passos sugeridos
- Botão para ver lista de clientes

---

### 5. **cliente-criado-admin.ts**

**Email enviado quando:** Admin cadastra cliente direto no painel

**Para:** Cliente cadastrado

**Assunto:** 🎉 Bem-vindo à CRC Faróis!

**Conteúdo:**

- Mensagem de boas-vindas
- Confirmação de cadastro realizado
- Instruções de acesso à plataforma B2B
- Email para login
- Dados do representante designado (nome, email, WhatsApp)
- Recursos disponíveis na plataforma
- Botão de acesso

---

### 6. **representante-criado-admin.ts**

**Email enviado quando:** Admin cadastra representante direto no painel

**Para:** Representante cadastrado

**Assunto:** 🎉 Bem-vindo à Equipe CRC Faróis!

**Conteúdo:**

- Mensagem de boas-vindas à equipe
- Confirmação de cadastro como representante
- Instruções de acesso ao painel
- Email para login
- Responsabilidades do representante
- Dicas para o sucesso
- Recursos disponíveis
- Botão de acesso ao painel

---

## 🎨 Padrão Visual

Todos os templates seguem a identidade visual da CRC Faróis:

- **Cores principais:**

  - Azul primário: `#1e40af` → `#3b82f6` (gradiente)
  - Verde (sucesso): `#059669` → `#10b981` (gradiente)
  - Vermelho (rejeição): `#dc2626` → `#ef4444` (gradiente)

- **Fonte:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif

- **Layout:** Responsivo, centralizado, largura máxima 600px

---

## 🔧 Como Editar

1. **Localizar o arquivo correto** conforme a tabela acima
2. **Editar o conteúdo HTML** dentro da função
3. **Manter a estrutura** de tabelas HTML para compatibilidade com clientes de email
4. **Testar** enviando um email após as alterações

---

## 📝 Notas Técnicas

- Todos os templates usam **HTML inline CSS** para compatibilidade com clientes de email
- Estrutura baseada em **tabelas HTML** (padrão para emails)
- Templates são **funções TypeScript** que retornam strings HTML
- Cada template recebe uma **interface de dados** específica

---

**Última atualização:** Setembro 2025
