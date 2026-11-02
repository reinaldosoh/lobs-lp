import type { Nicho } from "../../variantes";

/* Os textos dos cards animados do painel (CRM, campanhas e avisos) para cada nicho da LP.
   A geral mantém os de antes; psi e beleza falam a língua do consultório e do studio. */

export type Coluna = { label: string; color: string; trophy?: boolean };
export type Seed = { name: string; previa: string; value: number | null; stage: number; days: number; parado?: number; tag?: string };
export type Funil = {
  aba: string;
  colunas: Coluna[];
  /** O aviso quando alguém cai na coluna do troféu. */
  fechou: string;
  inicial: Seed[];
  chegando: { name: string; previa: string; value: number }[];
};
export type DadosDoNicho = {
  funil: Funil;
  campanhas: { name: string; total: number }[];
  respostas: [string, string][];
  avisos: string[];
};

const AZUL = "#1f7df5";
const ROXO = "#9a4cf5";
const VERDE = "#16a34a";
const CINZA = "#8494a8";

const GERAL: DadosDoNicho = {
  funil: {
    aba: "Vendas",
    colunas: [
      { label: "Novo contato", color: AZUL },
      { label: "Proposta", color: ROXO },
      { label: "Fechou", color: VERDE, trophy: true },
      { label: "Não fechou", color: CINZA },
    ],
    fechou: "Venda fechada com",
    inicial: [
      { name: "Carla Mendes", previa: "Quanto custa o plano mensal?", value: 1200, stage: 0, days: 0, tag: "Instagram" },
      { name: "João Pedro", previa: "Vocês atendem aos sábados?", value: 850, stage: 0, days: 1 },
      { name: "Beatriz Lima", previa: "Quero conhecer a clínica", value: 2400, stage: 0, days: 2, parado: 3 },
      { name: "Rodrigo Alves", previa: "Pode me mandar a proposta?", value: 3100, stage: 1, days: 1 },
      { name: "Fernanda Costa", previa: "Vou ver com meu sócio", value: 690, stage: 1, days: 4, parado: 4 },
      { name: "Lucas Martins", previa: "Proposta enviada · válida 7 dias", value: 4500, stage: 1, days: 2 },
      { name: "Marcelo Dias", previa: "Pagamento confirmado", value: 2900, stage: 2, days: 1 },
      { name: "Juliana Rocha", previa: "Contrato assinado", value: 1750, stage: 2, days: 3 },
      { name: "Tatiane Souza", previa: "Fechei com outra empresa", value: 1100, stage: 3, days: 6 },
    ],
    chegando: [
      { name: "Patrícia Nunes", previa: "Oi! Vi o anúncio de vocês", value: 1300 },
      { name: "Gustavo Reis", previa: "Preciso de um orçamento", value: 2200 },
      { name: "Camila Torres", previa: "Tem horário essa semana?", value: 980 },
      { name: "André Lopes", previa: "Quero fechar ainda hoje", value: 3600 },
      { name: "Renata Freitas", previa: "Qual o prazo de entrega?", value: 1450 },
      { name: "Felipe Moura", previa: "Podemos marcar uma call?", value: 2750 },
      { name: "Larissa Pinto", previa: "Gostei, me manda o Pix", value: 760 },
      { name: "Thiago Barros", previa: "Quanto fica no cartão?", value: 1980 },
    ],
  },
  campanhas: [
    { name: "Reativação de clientes", total: 312 },
    { name: "Oferta de aniversário", total: 248 },
    { name: "Pesquisa de satisfação", total: 405 },
  ],
  respostas: [
    ["Carla", "Quero sim! 🙌"],
    ["João", "Ainda tem horário essa semana?"],
    ["Bia", "Me manda os valores"],
    ["Rodrigo", "Pode reservar pra mim"],
    ["Fernanda", "Adorei, obrigada!"],
    ["Lucas", "Qual o prazo?"],
    ["Paula", "Tenho interesse 😍"],
  ],
  avisos: [
    "🔥 Lead quente: Ana quer fechar hoje. Já mandei a proposta.",
    "🙋 Ricardo pediu pra falar com uma pessoa. Te passei a conversa.",
    "📊 Resumo do dia: 42 atendimentos, 38 resolvidos sem você.",
    "💰 Pagamento confirmado: R$ 1.290 de Antônio Carlos.",
    "📞 Liguei pro Marcos e remarquei a visita pra quinta às 10h.",
    "⏰ 3 leads sem resposta há 1 dia. Faço o follow-up amanhã às 9h.",
  ],
};

// Consultório: sem nada clínico nos cartões, só agenda, cobrança e retorno.
const PSI: DadosDoNicho = {
  funil: {
    aba: "Pacientes",
    colunas: [
      { label: "Primeiro contato", color: AZUL },
      { label: "Agendado", color: ROXO },
      { label: "Em acompanhamento", color: VERDE, trophy: true },
      { label: "Não seguiu", color: CINZA },
    ],
    fechou: "Primeira sessão feita com",
    inicial: [
      { name: "Camila Ramos", previa: "Atende online?", value: 220, stage: 0, days: 0, tag: "Instagram" },
      { name: "Bruno Teixeira", previa: "Qual o valor da sessão?", value: 220, stage: 0, days: 1 },
      { name: "Lia Moreira", previa: "Tem horário à noite?", value: 220, stage: 0, days: 2, parado: 2 },
      { name: "Paulo Henrique", previa: "Primeira consulta · ter 9h", value: 450, stage: 1, days: 1 },
      { name: "Renata Alves", previa: "Sessão marcada · qua 18h", value: 220, stage: 1, days: 2 },
      { name: "Helena Duarte", previa: "Pix do mês pago", value: 880, stage: 2, days: 1 },
      { name: "Marcos Lima", previa: "Remarcou para sexta", value: 880, stage: 2, days: 3 },
      { name: "Sofia Prado", previa: "Preferiu esperar", value: null, stage: 3, days: 6 },
    ],
    chegando: [
      { name: "Aline Costa", previa: "Oi, queria começar terapia", value: 220 },
      { name: "Diego Nunes", previa: "Aceita reembolso do plano?", value: 220 },
      { name: "Marina Faria", previa: "Tem sábado de manhã?", value: 220 },
      { name: "Igor Santos", previa: "Queria marcar com o psiquiatra", value: 450 },
      { name: "Clara Mendes", previa: "Terapia de casal, tem vaga?", value: 300 },
      { name: "Rafael Brito", previa: "Pode ser online?", value: 220 },
    ],
  },
  campanhas: [
    { name: "Horários novos à noite", total: 86 },
    { name: "Férias do consultório", total: 112 },
    { name: "Retomar acompanhamento", total: 64 },
  ],
  respostas: [
    ["Camila", "Quero o de quinta 🙏"],
    ["Bruno", "Obrigado pelo aviso!"],
    ["Lia", "Tem às 19h?"],
    ["Marcos", "Pode reservar pra mim"],
    ["Helena", "Volto em fevereiro então"],
    ["Diego", "Ainda tem vaga?"],
    ["Renata", "Perfeito, obrigada"],
  ],
  avisos: [
    "🙋 Ana pediu pra falar com você. Te passei a conversa.",
    "🚨 Mensagem urgente de Carlos. Passei pra você agora e indiquei o CVV.",
    "📊 Resumo do dia: 14 contatos, 5 sessões marcadas.",
    "💰 Pix confirmado: R$ 880 de Helena (4 sessões).",
    "📅 Bruno remarcou para sexta, 18h30. Agenda atualizada.",
    "⏰ 2 pessoas pediram valor e sumiram. Retomo amanhã às 10h.",
  ],
};

const BELEZA: DadosDoNicho = {
  funil: {
    aba: "Clientes",
    colunas: [
      { label: "Pediu valor", color: AZUL },
      { label: "Sinal pago", color: ROXO },
      { label: "Atendida", color: VERDE, trophy: true },
      { label: "Não voltou", color: CINZA },
    ],
    fechou: "Atendimento feito com",
    inicial: [
      { name: "Juliana Prado", previa: "Quanto tá o alongamento em gel?", value: 180, stage: 0, days: 0, tag: "Instagram" },
      { name: "Duda Ferreira", previa: "Quanto fica pé e mão?", value: 70, stage: 0, days: 1 },
      { name: "Fernanda Lopes", previa: "Make de noiva em março", value: 650, stage: 0, days: 2, parado: 2 },
      { name: "Paula Martins", previa: "Manutenção dos cílios · qua 17h30", value: 120, stage: 1, days: 1 },
      { name: "Carol Souza", previa: "Design + henna · sex 15h", value: 85, stage: 1, days: 2 },
      { name: "Bruna Lima", previa: "Sinal recebido · sáb 9h", value: 180, stage: 1, days: 1 },
      { name: "Marina Costa", previa: "Amei o resultado 😍", value: 150, stage: 2, days: 1 },
      { name: "Gabi Rocha", previa: "Já marquei a próxima", value: 120, stage: 2, days: 3 },
      { name: "Lara Dias", previa: "Vou ver e te aviso", value: null, stage: 3, days: 6 },
    ],
    chegando: [
      { name: "Bianca Nunes", previa: "Vi seu post, tem horário?", value: 180 },
      { name: "Letícia Reis", previa: "Quanto é o fio a fio?", value: 220 },
      { name: "Camila Torres", previa: "Faz unha de festa?", value: 90 },
      { name: "Amanda Lopes", previa: "Limpeza de pele, tem vaga?", value: 160 },
      { name: "Rafaela Moura", previa: "Brow lamination quanto é?", value: 140 },
      { name: "Isa Pinto", previa: "Me manda o Pix do sinal", value: 120 },
      { name: "Nathy Barros", previa: "Make pra formatura sábado", value: 250 },
    ],
  },
  campanhas: [
    { name: "Manutenção do mês", total: 186 },
    { name: "Agenda de dezembro aberta", total: 240 },
    { name: "Noivas 2027", total: 58 },
  ],
  respostas: [
    ["Ju", "Quero sábado! 💅"],
    ["Paula", "Marca minha manutenção"],
    ["Bia", "Ainda tem dia 20?"],
    ["Carol", "Pode reservar pra mim"],
    ["Duda", "Amei, obrigada! 😍"],
    ["Lara", "Qual o valor do gel?"],
    ["Gabi", "Quero o pacote de noiva"],
  ],
  avisos: [
    "💸 Sinal pago: R$ 40 de Juliana. Sábado 9h garantido.",
    "🙋 Fernanda mandou foto de referência da make. Te passei a conversa.",
    "📊 Resumo do dia: 23 conversas, 9 horários marcados sem você.",
    "📅 Carol desmarcou hoje às 10h. Já encaixei outra cliente no horário.",
    "💅 3 clientes passaram do prazo da manutenção. Chamo todas amanhã às 10h.",
    "⏰ 2 clientes pediram valor e sumiram. Retomo amanhã às 9h.",
  ],
};

const DADOS: Record<Nicho, DadosDoNicho> = { geral: GERAL, psi: PSI, beleza: BELEZA };
export const dadosDo = (nicho: Nicho = "geral") => DADOS[nicho];
