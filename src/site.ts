// Contatos e domínio do site.
export const SITE_URL = "https://lobsbot.com.br";
export const APP_URL = "https://app.lobsbot.com.br";
export const TERMS_URL = "https://app.lobsbot.com.br/termos";
export const PRIVACY_URL = "https://app.lobsbot.com.br/privacidade";
// O WhatsApp da lobsbot (o lob de vendas do próprio lobs), com a primeira mensagem pronta:
// os botões "Conversar com os lobs" abrem a conversa com ela.
export const LOBSBOT_WHATSAPP = "5522996132623";
export const DEMO_WHATSAPP_URL = `https://wa.me/${LOBSBOT_WHATSAPP}?text=${encodeURIComponent(
  "Oi! Vim pelo site do lobs e quero ver como funciona.",
)}`;
// Sem link real, os botões que abrem o WhatsApp de teste ficam escondidos.
export const DEMO_PRONTO = DEMO_WHATSAPP_URL.startsWith("https://");
// Contato e empresa, exibidos no rodapé (exigência de aprovação do cadastro).
export const CONTACT_EMAIL = "contato@lobsbot.com.br";
// WhatsApp de contato: número com DDI e DDD, só dígitos (ex.: "5531999999999"). Vazio esconde o link.
// É o da lobsbot: ela atende e passa para a equipe quando precisa.
export const CONTACT_WHATSAPP = LOBSBOT_WHATSAPP;
export const CONTACT_WHATSAPP_LABEL = "(22) 99613-2623";
export const COMPANY_NAME = "SOUREINO LTDA";
export const COMPANY_CNPJ = "63.289.746/0001-87";
