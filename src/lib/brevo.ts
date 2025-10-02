import * as brevo from "@getbrevo/brevo";

// Verificar se a API Key está configurada
if (!process.env.BREVO_API_KEY) {
  console.error("⚠️ BREVO_API_KEY não está configurada!");
} else {
  console.log("✅ BREVO_API_KEY encontrada");
}

// Configurar API do Brevo
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

export { apiInstance };
