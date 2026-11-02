import type { Nicho } from "../../variantes";

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

/** As mesmas telas para consultório de psicologia e psiquiatria (LP /psicologos/). Nada clínico no que o lob anota. */
export const CONVERSATIONS_PSI: Conversation[] = [
  {
    id: "camila",
    name: "Camila",
    initials: "CA",
    color: "#FDBA74",
    time: "09:12",
    topic: "Primeira sessão",
    phone: "2041",
    since: "outubro",
    unread: 0,
    stages: [{ at: 0, label: "Novo contato" }, { at: 6, label: "Agendado" }],
    knows: [{ at: 4, text: "Prefere sessão online" }, { at: 6, text: "Primeira sessão com a Dra. Marina" }],
    steps: [
      { kind: "in", text: "Oi! Queria começar terapia. A Dra. Marina tem horário pra uma primeira sessão?" },
      { kind: "out", text: "Oi, Camila! Que bom que você escreveu 😊 Sou o assistente da Dra. Marina. Deixa eu olhar a agenda dela." },
      {
        kind: "tool",
        tool: { app: "Google Agenda", icon: "calendar", title: "3 horários livres encontrados", chips: ["Qua · 18h", "Qui · 9h", "Sex · 19h"] },
      },
      { kind: "out", text: "Tenho quarta às 18h, quinta às 9h ou sexta às 19h. A sessão é de 50 min, online ou no consultório. Qual prefere?" },
      { kind: "in", text: "Quarta 18h, online" },
      {
        kind: "tool",
        tool: { app: "Google Meet", icon: "video", title: "Sessão marcada", lines: ["Primeira sessão · Dra. Marina", "Qua, 15/10 · 18:00 · link enviado"] },
      },
      { kind: "out", text: "Prontinho! Sua sessão está marcada pra quarta, 15/10, às 18h, pelo Meet ✅ Te mando o link e um lembrete na véspera." },
      { kind: "in", text: "Obrigada 🙏" },
    ],
  },
  {
    id: "bruno",
    name: "Bruno",
    initials: "BR",
    color: "#C4B5FD",
    time: "23:41",
    topic: "Remarcação",
    phone: "7318",
    since: "agosto",
    unread: 1,
    stages: [{ at: 0, label: "Em acompanhamento" }],
    knows: [{ at: 1, text: "Costuma escrever à noite" }, { at: 4, text: "Prefere horário depois das 18h" }],
    steps: [
      { kind: "in", text: "Oi, sei que já é tarde 😅 não vou conseguir ir na sessão de quinta, dá pra remarcar?" },
      { kind: "out", text: "Oi, Bruno! Sem problema, eu respondo a qualquer hora. Pra qual dia fica melhor pra você?" },
      { kind: "in", text: "Sexta depois das 18h, pode ser?" },
      { kind: "tool", tool: { app: "Google Agenda", icon: "calendar", title: "Sessão remarcada", lines: ["Qui, 19:00 → Sex, 18:30"] } },
      { kind: "out", text: "Feito! Sua sessão agora é sexta às 18h30, no mesmo link de sempre. Te lembro na véspera 👍" },
      { kind: "system", text: "Quinta, 18:00 · Lembrete automático" },
      { kind: "out", text: "Oi, Bruno! Passando pra lembrar da sua sessão amanhã às 18h30. Confirma?", time: "18:00" },
      { kind: "in", text: "Confirmo!", time: "18:07" },
    ],
  },
  {
    id: "helena",
    name: "Helena",
    initials: "HE",
    color: "#86EFAC",
    time: "11:20",
    topic: "Pagamento",
    phone: "5590",
    since: "julho",
    unread: 2,
    stages: [{ at: 0, label: "Em acompanhamento" }],
    knows: [{ at: 1, text: "Paga as sessões no mês" }, { at: 6, text: "Pede recibo para reembolso" }],
    steps: [
      { kind: "in", text: "Oi! Pode me mandar o Pix das sessões deste mês?" },
      { kind: "out", text: "Claro, Helena! São 4 sessões em outubro. Gerei o Pix aqui 👇" },
      {
        kind: "tool",
        tool: { app: "Pix", icon: "pix", title: "Cobrança gerada", lines: ["R$ 880,00 · 4 sessões · vence dia 10"], code: "00020126580014br.gov.bcb.pix0136…" },
      },
      { kind: "in", text: "Paguei! Consegue um recibo pro reembolso do plano?" },
      { kind: "tool", tool: { app: "Banco", icon: "bank", title: "Pagamento confirmado", lines: ["R$ 880,00 recebido às 11:26"] } },
      { kind: "out", text: "Recebido, obrigado! Aqui está o recibo com os dados da Dra. Marina para o reembolso 👇" },
      {
        kind: "tool",
        tool: { app: "Recibo", icon: "file", title: "Recibo enviado", file: { name: "Recibo_Helena_Outubro.pdf", meta: "4 sessões · R$ 880,00" } },
      },
    ],
  },
  {
    id: "paulo",
    name: "Paulo",
    initials: "PA",
    color: "#93C5FD",
    time: "14:05",
    topic: "Psiquiatria",
    phone: "1126",
    since: "outubro",
    unread: 0,
    stages: [{ at: 0, label: "Novo contato" }, { at: 6, label: "Agendado" }],
    knows: [{ at: 2, text: "Atendimento particular" }, { at: 6, text: "Primeira consulta com o Dr. Ricardo" }],
    steps: [
      { kind: "in", text: "Boa tarde. Queria marcar com o psiquiatra. Ele atende convênio?" },
      {
        kind: "out",
        text: "Boa tarde, Paulo! O Dr. Ricardo atende particular, e eu envio o recibo para você pedir reembolso ao seu plano. A primeira consulta é de 1h.",
      },
      { kind: "in", text: "Ok. E já dá pra falar sobre o remédio que eu tomo?" },
      { kind: "out", text: "Isso o Dr. Ricardo vê com você na consulta, com todo o cuidado. Eu cuido só da agenda 🙂 Prefere manhã ou tarde?" },
      { kind: "in", text: "Manhã" },
      {
        kind: "tool",
        tool: { app: "Google Agenda", icon: "calendar", title: "Consulta marcada", lines: ["Primeira consulta · Dr. Ricardo", "Ter, 21/10 · 09:00 · Consultório"] },
      },
      { kind: "out", text: "Marcado: terça, 21/10, às 9h no consultório ✅ Te mando o endereço e um lembrete na véspera." },
    ],
  },
  {
    id: "lia",
    name: "Lia",
    initials: "LI",
    color: "#F9A8D4",
    time: "16:48",
    topic: "Retorno",
    phone: "8847",
    since: "setembro",
    unread: 0,
    stages: [{ at: 0, label: "Novo contato" }, { at: 5, label: "Agendado" }],
    knows: [{ at: 3, text: "Quer horário no sábado" }],
    steps: [
      { kind: "in", text: "Oi, queria saber o valor da sessão" },
      { kind: "out", text: "Oi, Lia! A sessão de 50 min é R$ 220, online ou no consultório. Quer que eu veja um horário pra você?" },
      { kind: "system", text: "2 dias sem resposta · o lob retomou a conversa" },
      { kind: "out", text: "Oi, Lia! Passando só pra saber se ainda quer ver um horário. Sem pressa, fico por aqui 💙", time: "10:00" },
      { kind: "in", text: "Quero sim! Tem sábado de manhã?", time: "10:32" },
      { kind: "tool", tool: { app: "Google Agenda", icon: "calendar", title: "Sessão marcada", lines: ["Sáb, 25/10 · 10:00 · Online"] } },
      { kind: "out", text: "Tenho sim! Marquei sábado, 25/10, às 10h, online ✅ Te mando o link na véspera.", time: "10:33" },
    ],
  },
];

/** As mesmas telas para studio de beleza (LP /beleza/): unha, make, cílios, sobrancelha e estética. */
export const CONVERSATIONS_BELEZA: Conversation[] = [
  {
    id: "juliana",
    name: "Juliana",
    initials: "JU",
    color: "#F9A8D4",
    time: "09:12",
    topic: "Unha em gel",
    phone: "2041",
    since: "outubro",
    unread: 0,
    stages: [{ at: 0, label: "Pediu valor" }, { at: 6, label: "Sinal pago" }],
    knows: [{ at: 1, text: "Veio pelo Instagram" }, { at: 6, text: "Alongamento em gel com a Bia" }],
    steps: [
      { kind: "in", text: "Oi! Vi o post de vocês no Insta 😍 quanto tá o alongamento em gel?" },
      { kind: "out", text: "Oi, Juliana! Que bom que gostou 💅 Sou a assistente do Studio Bia. O alongamento em gel é R$ 180 e leva umas 2h. Quer que eu veja um horário?" },
      {
        kind: "tool",
        tool: { app: "Google Agenda", icon: "calendar", title: "3 horários livres encontrados", chips: ["Qui · 14h", "Sex · 10h", "Sáb · 9h"] },
      },
      { kind: "out", text: "Tenho quinta às 14h, sexta às 10h ou sábado às 9h. Qual fica melhor?" },
      { kind: "in", text: "Sábado 9h!!" },
      {
        kind: "tool",
        tool: { app: "Pix", icon: "pix", title: "Sinal gerado", lines: ["R$ 40,00 · garante o horário de sábado"], code: "00020126580014br.gov.bcb.pix0136…" },
      },
      { kind: "out", text: "Reservado! Pra garantir o horário é só o sinal de R$ 40 no Pix 👆 o resto você paga no dia. Te lembro na sexta ✨" },
      { kind: "in", text: "Paguei! 🥰" },
    ],
  },
  {
    id: "fernanda",
    name: "Fernanda",
    initials: "FE",
    color: "#C4B5FD",
    time: "22:47",
    topic: "Make de noiva",
    phone: "7318",
    since: "setembro",
    unread: 1,
    stages: [{ at: 0, label: "Pediu valor" }, { at: 6, label: "Prova marcada" }],
    knows: [{ at: 1, text: "Casamento em 14/03" }, { at: 4, text: "Quer make leve, pele natural" }],
    steps: [
      { kind: "in", text: "Boa noite! Vou casar dia 14 de março e queria saber da make de noiva 👰" },
      { kind: "out", text: "Que notícia linda, Fernanda! Parabéns 💜 A make de noiva da Bia inclui prova antes do grande dia. Ela atende no studio ou vai até você no dia." },
      { kind: "tool", tool: { app: "Google Agenda", icon: "calendar", title: "14/03 está livre", lines: ["Sáb, 14/03 · reservar a manhã"] } },
      { kind: "out", text: "O dia 14/03 ainda está livre na agenda dela! Você tem alguma referência do estilo que gosta?" },
      { kind: "in", text: "Bem natural, pele iluminada. Mando foto amanhã!" },
      { kind: "tool", tool: { app: "Google Agenda", icon: "calendar", title: "Prova marcada", lines: ["Prova de make · Bia", "Sáb, 17/01 · 10:00 · Studio"] } },
      { kind: "out", text: "Perfeito! Já deixei a sua prova marcada pra 17/01 às 10h, e passei sua ideia pra Bia. Ela te chama pra fechar o valor certinho 🙂" },
    ],
  },
  {
    id: "paula",
    name: "Paula",
    initials: "PA",
    color: "#FDBA74",
    time: "10:00",
    topic: "Manutenção",
    phone: "5590",
    since: "julho",
    unread: 2,
    stages: [{ at: 0, label: "Cliente fiel" }],
    knows: [{ at: 0, text: "Faz cílios fio a fio a cada 20 dias" }, { at: 4, text: "Prefere fim da tarde" }],
    steps: [
      { kind: "system", text: "20 dias desde a última aplicação · o lob chamou a cliente" },
      { kind: "out", text: "Oi, Paula! Já faz 20 dias dos seus cílios ✨ Quer garantir a manutenção essa semana?", time: "10:00" },
      { kind: "in", text: "Quero sim! Tem quarta no fim da tarde?", time: "10:21" },
      { kind: "tool", tool: { app: "Google Agenda", icon: "calendar", title: "Manutenção marcada", lines: ["Cílios fio a fio · manutenção", "Qua, 22/10 · 17:30"] } },
      { kind: "out", text: "Tenho às 17h30! Já marquei pra você ✅ Te lembro na véspera.", time: "10:22" },
      { kind: "in", text: "Amo vocês 😍", time: "10:23" },
    ],
  },
  {
    id: "carol",
    name: "Carol",
    initials: "CA",
    color: "#86EFAC",
    time: "07:58",
    topic: "Remarcação",
    phone: "1126",
    since: "agosto",
    unread: 0,
    stages: [{ at: 0, label: "Sinal pago" }],
    knows: [{ at: 1, text: "Sinal de R$ 30 já pago" }, { at: 5, text: "Horário de hoje liberado para outra" }],
    steps: [
      { kind: "in", text: "Bom dia! Meu filho acordou doente, não vou conseguir ir hoje às 10h 😞" },
      { kind: "out", text: "Bom dia, Carol! Melhoras pra ele 💛 Como você avisou com antecedência, seu sinal continua valendo. Quer remarcar?" },
      { kind: "in", text: "Quero! Pode ser sexta?" },
      { kind: "tool", tool: { app: "Google Agenda", icon: "calendar", title: "Horário remarcado", lines: ["Design + henna · Hoje 10:00 → Sex 15:00"] } },
      { kind: "out", text: "Prontinho: sexta às 15h, com o mesmo sinal ✅ E já ofereci o horário de hoje pra quem estava esperando." },
      { kind: "system", text: "08:06 · Horário das 10h ocupado por outra cliente da lista de espera" },
    ],
  },
  {
    id: "duda",
    name: "Duda",
    initials: "DU",
    color: "#93C5FD",
    time: "16:48",
    topic: "Retorno",
    phone: "8847",
    since: "setembro",
    unread: 0,
    stages: [{ at: 0, label: "Pediu valor" }, { at: 6, label: "Sinal pago" }],
    knows: [{ at: 3, text: "Quer pé e mão no sábado" }],
    steps: [
      { kind: "in", text: "Oi, quanto fica pé e mão?" },
      { kind: "out", text: "Oi, Duda! Pé e mão com esmaltação comum fica R$ 70, e com gel R$ 130. Quer que eu veja um horário?" },
      { kind: "system", text: "2 dias sem resposta · o lob retomou a conversa" },
      { kind: "out", text: "Oi, Duda! Passando só pra ver se ainda quer o pé e mão 💅 Abriu um horário sábado de manhã, quer que eu segure pra você?", time: "10:00" },
      { kind: "in", text: "Quero! Sábado 10h dá?", time: "10:32" },
      { kind: "tool", tool: { app: "Banco", icon: "bank", title: "Sinal confirmado", lines: ["R$ 20,00 recebido às 10:35"] } },
      { kind: "out", text: "Dá sim! Sinal recebido e horário garantido: sábado, 10h ✅ Te lembro na sexta.", time: "10:36" },
    ],
  },
];

/** As conversas que a LP mostra para cada nicho. */
export function conversasDo(nicho: Nicho = "geral") {
  return nicho === "psi" ? CONVERSATIONS_PSI : nicho === "beleza" ? CONVERSATIONS_BELEZA : CONVERSATIONS;
}

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

