import type { LobColor } from "./Lob";

/** What each lob does. The order is the order they are introduced on the page. */
export const ROLES: {
  color: LobColor;
  area: string;
  /** Verb phrase used in the story sentence ("o lob azul … atende"). */
  verb: string;
  text: string;
  tags: string[];
}[] = [
  {
    color: "blue",
    area: "Atendimento",
    verb: "atende",
    text: "O lob principal. Responde no WhatsApp na hora, entende o que a pessoa precisa e conduz a conversa do primeiro oi até o fechamento.",
    tags: ["WhatsApp 24h", "Áudio e texto", "Tom da sua marca"],
  },
  {
    color: "orange",
    area: "Agenda",
    verb: "agenda",
    text: "Cuida da sua agenda no Google Agenda: aplica as suas regras, acha o melhor horário, marca, remarca e confirma.",
    tags: ["Google Agenda", "Suas regras", "Confirmações"],
  },
  {
    color: "green",
    area: "Financeiro",
    verb: "cuida do financeiro",
    text: "Mais que registrar pagamentos: um consultor. Acompanha suas metas, mostra quanto falta e sugere promoções quando o mês aperta.",
    tags: ["Metas", "Pagamentos", "Promoções"],
  },
  {
    color: "pink",
    area: "Relacionamento",
    verb: "faz o follow-up",
    text: "Chama de volta quem sumiu, faz o pós-venda, reativa clientes antigos e qualifica cada lead antes de ele esfriar.",
    tags: ["Follow-up", "Pós-venda", "Reativação"],
  },
  {
    color: "purple",
    area: "Integrações",
    verb: "conecta suas ferramentas",
    text: "Liga os lobs ao que você já usa: Slack, Google Sheets, Google Meet, RD Station e o que mais vier.",
    tags: ["Slack", "Sheets", "RD Station"],
  },
];
