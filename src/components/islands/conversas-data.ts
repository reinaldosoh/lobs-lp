export type ToolIcon = "calendar" | "file" | "crm" | "handoff" | "pix" | "bank" | "sign" | "video" | "phone";
export type Tool = {
  app: string;
  icon: ToolIcon;
  title: string;
  lines?: string[];
  chips?: string[];
  file?: { name: string; meta: string };
  code?: string;
};
export type Step =
  | { kind: "in" | "out"; text: string; time?: string }
  | { kind: "system"; text: string }
  | { kind: "tool"; tool: Tool };
export type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  time: string;
  topic: string;
  /** Fictional last digits, shown as ···NNNN like the real panel. */
  phone: string;
  since: string;
  unread: number;
  /** Funnel stage in the ficha; `at` = step count at which it applies. */
  stages: { at: number; label: string }[];
  /** What the lob learned, noted as the conversation advances. */
  knows: { at: number; text: string }[];
  steps: Step[];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "rafa",
    name: "Rafa",
    initials: "RA",
    color: "#FDBA74",
    time: "09:12",
    topic: "Agendamento",
    phone: "2041",
    since: "outubro",
    unread: 0,
    stages: [{ at: 0, label: "Novo contato" }],
    knows: [{ at: 6, text: "Prefere sexta de manhã" }, { at: 7, text: "Faz limpeza com a Dra. Paula" }],
    steps: [
      { kind: "in", text: "Oi! Queria marcar uma limpeza, vocês têm horário essa semana?" },
      { kind: "out", text: "Oi, Rafa! Tenho sim 😊 Deixa eu olhar a agenda da Dra. Paula rapidinho." },
      {
        kind: "tool",
        tool: { app: "Google Agenda", icon: "calendar", title: "3 horários livres encontrados", chips: ["Qui · 14h", "Sex · 9h", "Sex · 16h"] },
      },
      { kind: "out", text: "Tenho quinta às 14h, sexta às 9h ou sexta às 16h. Qual fica melhor pra você?" },
      { kind: "in", text: "Sexta 9h é perfeito" },
      {
        kind: "tool",
        tool: { app: "Google Agenda", icon: "calendar", title: "Consulta marcada", lines: ["Limpeza · Dra. Paula", "Sex, 17/10 · 09:00"] },
      },
      { kind: "out", text: "Prontinho! Sua limpeza está marcada pra sexta, 17/10, às 9h ✅ Te mando um lembrete na véspera." },
      { kind: "in", text: "Obrigadaa 🙏" },
    ],
  },
  {
    id: "manu",
    name: "Manu",
    initials: "MA",
    color: "#C4B5FD",
    time: "10:40",
    topic: "Proposta",
    phone: "7318",
    since: "setembro",
    unread: 2,
    stages: [{ at: 0, label: "Novo contato" }, { at: 5, label: "Proposta" }],
    knows: [{ at: 3, text: "Quer uma loja com 5 páginas" }, { at: 5, text: "Quer vender direto pelo site" }],
    steps: [
      { kind: "in", text: "Oi, vi o anúncio de vocês. Quanto custa um site pra minha loja?" },
      {
        kind: "out",
        text: "Oi, Manu! Monto uma proposta agora mesmo. Duas perguntas rápidas: quantas páginas você imagina? E quer vender direto pelo site?",
      },
      { kind: "in", text: "Umas 5 páginas, e sim, quero vender pelo site" },
      { kind: "out", text: "Perfeito. Gerando sua proposta personalizada…" },
      {
        kind: "tool",
        tool: {
          app: "Gerador de propostas",
          icon: "file",
          title: "Proposta criada e enviada",
          file: { name: "Proposta_Manu_LojaVirtual.pdf", meta: "R$ 4.800 · válida por 7 dias" },
        },
      },
      {
        kind: "out",
        text: "Aqui está! 5 páginas, loja integrada com Pix e cartão, entrega em 21 dias. Quer que eu já reserve sua vaga na agenda de produção?",
      },
      { kind: "in", text: "Perfeito, vou fechar! 🎉" },
    ],
  },
  {
    id: "alfredo",
    name: "Alfredo",
    initials: "AL",
    color: "#86EFAC",
    time: "14:05",
    topic: "Follow-up",
    phone: "5590",
    since: "outubro",
    unread: 1,
    stages: [{ at: 0, label: "Novo contato" }, { at: 6, label: "Qualificado" }],
    knows: [{ at: 2, text: "Interessado no plano Pro" }, { at: 5, text: "Prefere ligação à tarde" }],
    steps: [
      { kind: "in", text: "Qual o valor do plano mensal?" },
      {
        kind: "out",
        text: "Oi, Alfredo! O plano Pro sai por R$ 297/mês, com suporte 24h e integração com sua agenda. E hoje o primeiro mês tem 20% off 😉",
      },
      { kind: "system", text: "10 minutos sem resposta · o lob ligou pro Alfredo" },
      {
        kind: "tool",
        tool: {
          app: "Ligação",
          icon: "phone",
          title: "Ligação concluída · 1min 12s",
          lines: ["Voz natural, em nome da sua empresa", "Alfredo quer falar com o time amanhã"],
        },
      },
      {
        kind: "out",
        text: "Como combinamos na ligação: amanhã tenho 10h ou 15h com o time comercial. Qual prefere?",
        time: "14:17",
      },
      { kind: "in", text: "10h", time: "14:21" },
      {
        kind: "tool",
        tool: { app: "Google Meet", icon: "video", title: "Call marcada", lines: ["Amanhã · 10:00 · Time comercial", "Convite enviado por e-mail"] },
      },
      { kind: "out", text: "Fechado! Te mandei o convite. Até amanhã 👋", time: "14:22" },
    ],
  },
  {
    id: "ana-clara",
    name: "Ana Clara",
    initials: "AC",
    color: "#F9A8D4",
    time: "15:22",
    topic: "Qualificação",
    phone: "1126",
    since: "agosto",
    unread: 0,
    stages: [{ at: 0, label: "Novo contato" }, { at: 6, label: "Qualificado" }],
    knows: [{ at: 3, text: "Empresa com 40 pessoas" }, { at: 5, text: "Dor: comercial demora a responder" }],
    steps: [
      { kind: "in", text: "Oi, queria entender como o software de vocês funciona pra minha empresa" },
      {
        kind: "out",
        text: "Oi, Ana Clara! Te explico sim. Pra indicar o melhor caminho: quantas pessoas trabalham aí e qual a maior dor hoje?",
      },
      { kind: "in", text: "Somos 40. A dor é o comercial demorar pra responder os leads" },
      { kind: "out", text: "Entendi! E vocês querem resolver isso ainda este mês?" },
      { kind: "in", text: "Sim, é urgente" },
      {
        kind: "tool",
        tool: {
          app: "RD Station CRM",
          icon: "crm",
          title: "Lead criado e qualificado",
          lines: ["40 pessoas · urgência alta"],
          chips: ["Score 87", "Lead quente"],
        },
      },
      {
        kind: "tool",
        tool: { app: "Slack", icon: "handoff", title: "Encaminhado para Lucas (Vendas)", lines: ["Resumo da conversa enviado em #vendas"] },
      },
      { kind: "out", text: "Perfeito! Já passei seu contato pro Lucas, nosso especialista. Ele te chama aqui em até 5 minutos 🚀" },
    ],
  },
  {
    id: "antonio-carlos",
    name: "Antônio Carlos",
    initials: "AC",
    color: "#93C5FD",
    time: "16:48",
    topic: "Cobrança",
    phone: "8847",
    since: "julho",
    unread: 3,
    stages: [{ at: 0, label: "Proposta" }, { at: 4, label: "Fechou" }],
    knows: [{ at: 1, text: "Aprovou a proposta" }, { at: 4, text: "Pagou via Pix" }],
    steps: [
      { kind: "in", text: "Li a proposta, tá aprovada. Como faço o pagamento?" },
      { kind: "out", text: "Que ótimo, Antônio Carlos! Gerei seu Pix aqui 👇" },
      {
        kind: "tool",
        tool: { app: "Pix", icon: "pix", title: "Cobrança gerada", lines: ["R$ 1.290,00 · vence hoje"], code: "00020126580014br.gov.bcb.pix0136…" },
      },
      { kind: "in", text: "Pago ✅" },
      { kind: "tool", tool: { app: "Banco", icon: "bank", title: "Pagamento confirmado", lines: ["R$ 1.290,00 recebido às 16:52"] } },
      { kind: "out", text: "Recebido, obrigado! Acabei de enviar o contrato pra assinatura digital no seu e-mail." },
      {
        kind: "tool",
        tool: {
          app: "Clicksign",
          icon: "sign",
          title: "Contrato enviado para assinatura",
          file: { name: "Contrato_AntonioCarlos.pdf", meta: "Aguardando assinatura" },
        },
      },
    ],
  },
  {
    id: "aurora",
    name: "Aurora",
    initials: "AU",
    color: "#FDE68A",
    time: "23:47",
    topic: "Fora do horário",
    phone: "3062",
    since: "outubro",
    unread: 0,
    stages: [{ at: 0, label: "Qualificado" }],
    knows: [{ at: 1, text: "Costuma escrever à noite" }, { at: 4, text: "Prefere consulta à tarde" }],
    steps: [
      { kind: "in", text: "Oi, sei que já é tarde 😅 preciso remarcar minha consulta de terça" },
      { kind: "out", text: "Oi, Aurora! Sem problema, eu atendo 24h 😊 Pra qual dia você prefere?" },
      { kind: "in", text: "Quarta à tarde, pode ser?" },
      { kind: "tool", tool: { app: "Google Agenda", icon: "calendar", title: "Consulta remarcada", lines: ["Ter, 10:00 → Qua, 15:00"] } },
      { kind: "out", text: "Feito! Sua consulta agora é quarta às 15h. Te lembro na véspera 👍" },
      { kind: "system", text: "Terça, 18:00 · Lembrete automático" },
      {
        kind: "out",
        text: "Oi, Aurora! Passando pra lembrar da sua consulta amanhã às 15h. Confirma presença?",
        time: "18:00",
      },
      { kind: "in", text: "Confirmo! 💙", time: "18:04" },
    ],
  },
];

/** Preview text for the sidebar: last message or tool title before `upTo`. */
export function preview(c: Conversation, upTo = c.steps.length) {
  for (let i = upTo - 1; i >= 0; i--) {
    const s = c.steps[i];
    if (s.kind === "in" || s.kind === "out") return s.text;
    if (s.kind === "tool") return s.tool.title;
  }
  return "";
}

/** How long the "typing"/"running" state lasts before a step lands. */
export function stepDuration(s: Step) {
  switch (s.kind) {
    case "in":
      return 650 + Math.min(8 * s.text.length, 700);
    case "out":
      return 800 + Math.min(10 * s.text.length, 1100);
    case "tool":
      return 1300;
    case "system":
      return 2000;
  }
}

