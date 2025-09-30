# Configuração do Brevo (Email Service)

Este documento contém as instruções para configurar o serviço de envio de emails usando o Brevo.

## 📋 Pré-requisitos

1. Conta no Brevo (https://www.brevo.com/)
2. API Key do Brevo

## 🔑 Obtendo a API Key

1. Acesse https://app.brevo.com/
2. Faça login na sua conta
3. Vá em **Settings** (Configurações)
4. Clique em **SMTP & API**
5. Na seção **API Keys**, clique em **Create a new API key**
6. Dê um nome para a chave (ex: "CRC Faróis - Produção")
7. Copie a chave gerada

## ⚙️ Configuração no Projeto

Adicione as seguintes variáveis de ambiente no seu arquivo `.env.local`:

```env
# Brevo (Email Service)
BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
BREVO_SENDER_EMAIL="contato@crc.ind.br"

# URL do App (para links nos emails)
NEXT_PUBLIC_APP_URL="https://seudominio.com.br"
```

### Variáveis Explicadas:

- **BREVO_API_KEY**: Sua chave de API do Brevo
- **BREVO_SENDER_EMAIL**: Email remetente (deve estar verificado no Brevo)
- **NEXT_PUBLIC_APP_URL**: URL base da aplicação (usada nos links dos emails)

## 📧 Verificação do Email Remetente

⚠️ **IMPORTANTE**: O email remetente (`BREVO_SENDER_EMAIL`) deve estar verificado no Brevo.

### Como verificar um email:

1. No painel do Brevo, vá em **Senders**
2. Clique em **Add a new sender**
3. Preencha as informações:
   - **From name**: CRC Faróis
   - **From email**: contato@crc.ind.br
4. Confirme o email através do link enviado

## 🎨 Emails Configurados

O sistema envia 3 tipos de emails:

### 1. Email de Confirmação de Cadastro

- **Quando**: Logo após o cliente solicitar cadastro
- **Para**: Email do responsável cadastrado
- **Conteúdo**:
  - Confirmação de recebimento
  - Informação sobre prazo de análise (48h)
  - Próximos passos
  - Dados de contato

### 2. Email de Aprovação de Cadastro

- **Quando**: Quando o admin aprova a solicitação
- **Para**: Email do responsável + CC para o representante
- **Conteúdo**:
  - Confirmação de aprovação
  - Link para acessar a plataforma
  - Dados do representante designado
  - Credenciais de acesso

### 3. Email de Rejeição de Cadastro

- **Quando**: Quando o admin rejeita a solicitação
- **Para**: Email do responsável
- **Conteúdo**:
  - Informação sobre rejeição
  - Motivo da rejeição
  - Dados de contato para esclarecimentos

## 🧪 Testando os Emails

### Teste 1: Email de Confirmação

1. Acesse a página de cadastro: `http://localhost:3000/cadastro`
2. Preencha o formulário completo
3. Envie a solicitação
4. Verifique se o email chegou na caixa de entrada

### Teste 2: Email de Aprovação

1. Acesse o dashboard admin: `http://localhost:3000/dashboard/solicitacoes`
2. Selecione uma solicitação pendente
3. Escolha um representante e aprove
4. Verifique se o email chegou para o cliente E para o representante (CC)

### Teste 3: Email de Rejeição

1. Acesse o dashboard admin: `http://localhost:3000/dashboard/solicitacoes`
2. Selecione uma solicitação pendente
3. Rejeite com um motivo personalizado
4. Verifique se o email chegou com o motivo correto

## 📊 Monitoramento

Você pode monitorar os emails enviados no painel do Brevo:

1. Acesse https://app.brevo.com/
2. Vá em **Statistics** > **Email**
3. Visualize:
   - Emails enviados
   - Taxa de entrega
   - Emails abertos
   - Cliques em links
   - Bounces e reclamações

## 🚨 Troubleshooting

### Email não está sendo enviado

1. **Verifique as variáveis de ambiente**:

   ```bash
   echo $BREVO_API_KEY
   ```

2. **Verifique os logs do servidor**:

   - Procure por erros relacionados a "Brevo" ou "email"
   - Verifique se a API Key está correta

3. **Verifique o email remetente**:

   - Certifique-se de que o email está verificado no Brevo
   - Vá em **Senders** no painel do Brevo

4. **Limite de envios**:
   - Plano gratuito: 300 emails/dia
   - Verifique se não atingiu o limite

### Email vai para spam

1. **Configure SPF e DKIM**:

   - No painel do Brevo, vá em **Settings** > **Senders**
   - Configure os registros DNS conforme orientado

2. **Warming up**:
   - Comece enviando poucos emails por dia
   - Aumente gradualmente o volume

## 📝 Limites do Plano Gratuito

- ✅ 300 emails/dia
- ✅ Emails transacionais ilimitados
- ✅ Templates de email
- ✅ Estatísticas básicas
- ⚠️ Logo do Brevo nos emails (pode ser removido em planos pagos)

## 🔗 Links Úteis

- [Documentação Brevo API](https://developers.brevo.com/)
- [SDk Node.js Brevo](https://github.com/getbrevo/brevo-node)
- [Painel Brevo](https://app.brevo.com/)
- [Status Brevo](https://status.brevo.com/)

## ✅ Checklist de Configuração

- [ ] Conta Brevo criada
- [ ] API Key gerada
- [ ] Email remetente verificado
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de envio realizado
- [ ] SPF/DKIM configurados (opcional, mas recomendado)
- [ ] Monitoramento configurado

---

**Suporte**: Em caso de dúvidas, consulte a documentação oficial do Brevo ou entre em contato com o suporte.
