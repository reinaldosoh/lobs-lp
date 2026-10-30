// Textos das duas variantes do teste A/B da LP (A: "ganho", B: "perda").
// O nginx sorteia a variante por visitante (cookie lobs_v) e serve "/" ou "/b/".

export type Variante = "a" | "b";
export type Item = { titulo: string; texto: string };
export type Pergunta = { p: string; r: string };

export type Copy = {
  hero: {
    etiqueta: string;
    titulo: string;
    subtitulo: string;
    botao: string;
    secundario: { texto: string; href: "demo" | "#calculadora" };
    micro: string[];
  };
  beneficios: { titulo: string; itens: Item[]; cta?: string };
  problema?: { titulo: string; itens: Item[] };
  demo: { titulo: string; texto: string };
  passos: { titulo: string; subtitulo: string; itens: Item[] };
  paraQuem: { titulo: string };
  painel: { titulo: string; texto: string };
  depoimentos: { titulo: string };
  planos: { titulo: string; subtitulo: string; notaComIa?: string };
  faq: { inicio: Pergunta[] };
  cta: { titulo: string };
};

// Perguntas novas do documento do teste, nas duas variantes.
const FAQ_NOVAS: Pergunta[] = [
  { p: "Meu número pode ser bloqueado pelo WhatsApp?", r: "Não. Os lobs atendem quem inicia a conversa com a sua empresa, e as campanhas vão só para a sua base de clientes já cadastrados, que já conversam com o seu WhatsApp. Nada de disparo em massa para listas compradas ou contatos desconhecidos." },
  { p: "O cliente percebe que é uma IA?", r: "O lob se apresenta como o assistente da sua marca. Nada é prometido fora das regras que você definir." },
  { p: "Preciso saber configurar alguma coisa?", r: "Não. Você conta sobre sua empresa em texto simples e os lobs aprendem." },
];

export const COPY: Record<Variante, Copy> = {
  a: {
    hero: {
      etiqueta: "Agentes de IA para o WhatsApp do seu negócio",
      titulo: "Seu WhatsApp atende, agenda e cobra sozinho. 24h por dia.",
      subtitulo: "Os lobs respondem seus clientes no número que você já usa, marcam horário, mandam o Pix e fazem follow-up. Você acompanha tudo num painel e assume a conversa quando quiser.",
      botao: "Testar grátis",
      secundario: { texto: "Ver um lob atendendo agora →", href: "demo" },
      micro: ["Sem cartão de crédito", "Conecta em 2 minutos pelo QR code", "Mesmo número de sempre"],
    },
    beneficios: {
      titulo: "Você para de responder WhatsApp. Os lobs continuam vendendo.",
      itens: [
        { titulo: "Ninguém fica esperando.", texto: "Resposta em segundos, inclusive às 23h e no domingo." },
        { titulo: "A agenda se enche sozinha.", texto: "O lob encontra o horário, marca no Google Agenda e confirma um dia antes." },
        { titulo: "O dinheiro entra.", texto: "Manda o link do Pix, confirma o pagamento e avisa você." },
        { titulo: "Ninguém some.", texto: "Quem parou de responder recebe um follow-up no tempo que você escolher." },
      ],
      cta: "Testar grátis",
    },
    demo: {
      titulo: "Mande uma mensagem para o nosso lob agora",
      texto: "Teste como se fosse seu cliente: pergunte preço, peça um horário, diga que vai pensar. Veja como ele responde.",
    },
    passos: {
      titulo: "No ar em menos de 10 minutos",
      subtitulo: "Sem instalar nada e sem montar fluxo. Você testa de graça e os lobs começam a atender.",
      itens: [
        { titulo: "Crie sua conta", texto: "Conte sobre sua empresa: serviços, preços, horários." },
        { titulo: "Conecte seu WhatsApp", texto: "Leia o QR code. Seus clientes continuam falando com o mesmo número." },
        { titulo: "Os lobs começam a atender", texto: "Você acompanha no painel e assume quando quiser." },
      ],
    },
    paraQuem: { titulo: "Feito para quem vende, atende ou agenda pelo WhatsApp" },
    painel: {
      titulo: "Tudo o que os lobs falam fica à vista",
      texto: "Help desk, CRM e campanhas num só lugar. Cada conversa vira um lead no funil, sem ninguém preencher planilha. Quando um lead esquenta, o lob te avisa direto no seu WhatsApp.",
    },
    depoimentos: { titulo: "Quem já tem os lobs do seu lado" },
    planos: { titulo: "Comece de graça. Assine quando fizer sentido.", subtitulo: "Teste os lobs na sua empresa e escolha o plano que cabe no seu momento." },
    faq: { inicio: FAQ_NOVAS },
    cta: { titulo: "Seu próximo cliente vai mandar mensagem hoje. Alguém vai responder?" },
  },
  b: {
    hero: {
      etiqueta: "Para negócios que atendem pelo WhatsApp",
      titulo: "Cliente que espera resposta compra do concorrente.",
      subtitulo: "Os lobs respondem no seu WhatsApp em segundos, a qualquer hora, e não deixam nenhum contato esfriar. Agendam, cobram e fazem follow-up até o cliente fechar.",
      botao: "Parar de perder clientes",
      secundario: { texto: "Quanto estou perdendo? ↓", href: "#calculadora" },
      micro: ["Sem cartão de crédito", "Usa o número que você já tem", "Cancele quando quiser"],
    },
    problema: {
      titulo: "Onde seus clientes estão escapando",
      itens: [
        { titulo: "Mensagem fora do horário.", texto: "Chega às 21h, você responde às 9h. Ele já fechou com outro." },
        { titulo: "Você ocupado atendendo.", texto: "Quem está na sua frente vem primeiro, e quem está no WhatsApp espera." },
        { titulo: "“Vou pensar”.", texto: "Ninguém volta a chamar, e a venda morre ali." },
        { titulo: "Falta no horário marcado.", texto: "Sem lembrete, o cliente esquece e a agenda fica com um buraco." },
      ],
    },
    beneficios: {
      titulo: "Os lobs não deixam ninguém sem resposta",
      itens: [
        { titulo: "Respondem em segundos,", texto: "24h, inclusive no fim de semana." },
        { titulo: "Retomam quem sumiu,", texto: "por mensagem ou ligação, no contexto da conversa." },
        { titulo: "Confirmam e lembram o horário,", texto: "para reduzir as faltas." },
        { titulo: "Te avisam quando um lead esquenta,", texto: "direto no seu WhatsApp." },
      ],
    },
    demo: {
      titulo: "Faça o teste: mande “vou pensar” para o nosso lob",
      texto: "Veja como ele responde e quando volta a chamar.",
    },
    passos: {
      titulo: "Comece a recuperar clientes hoje",
      subtitulo: "Sem instalar nada e sem montar fluxo. Você testa de graça e os lobs começam a atender.",
      itens: [
        { titulo: "Crie sua conta", texto: "Conte sobre sua empresa." },
        { titulo: "Conecte seu WhatsApp", texto: "Leia o QR code. O número continua o mesmo." },
        { titulo: "Os lobs assumem", texto: "o atendimento e o follow-up. Você acompanha e entra quando quiser." },
      ],
    },
    paraQuem: { titulo: "Se uma mensagem sem resposta te custa um cliente, os lobs são para você" },
    painel: {
      titulo: "Você vê cada cliente que os lobs salvaram",
      texto: "Toda conversa fica registrada, cada lead aparece no funil e você recebe um resumo do dia no seu WhatsApp.",
    },
    depoimentos: { titulo: "Quem parou de perder clientes" },
    planos: {
      titulo: "Custa menos que um cliente perdido por mês",
      subtitulo: "Teste os lobs na sua empresa e escolha o plano que cabe no seu momento.",
      notaComIa: "Se os lobs recuperarem um cliente por mês, já se pagaram.",
    },
    faq: {
      inicio: [
        { p: "E se eu já respondo rápido?", r: "Ótimo. Os lobs cobrem o que escapa: fora do horário, quando você está ocupado e o follow-up que ninguém faz." },
        ...FAQ_NOVAS,
      ],
    },
    cta: { titulo: "Quantos clientes mandaram mensagem hoje e ainda estão esperando?" },
  },
};

// RASCUNHO: frases escritas a partir do perfil de cada cliente. Confirmar o texto com cada um antes de publicar.
// Fotos: coloque em public/depoimentos/<arquivo> e preencha `foto`.
export const DEPOIMENTOS: { nome: string; papel: string; frase: string; foto?: string; site?: string; cor: "pink" | "orange" | "purple" }[] = [
  {
    nome: "Raquel Campos",
    papel: "Nail designer",
    frase: "Eu atendia com a mão ocupada e o WhatsApp lotado. Agora o lob marca e confirma os horários, e eu só olho a agenda cheia no fim do dia.",
    cor: "pink",
  },
  {
    nome: "Daniel Otero",
    papel: "Empresário no ramo de alimentos",
    frase: "Pedido chegando fora do horário deixou de ser problema. O lob responde na hora, passa o cardápio e manda o Pix.",
    cor: "orange",
  },
  {
    nome: "Douglas Couto",
    papel: "Especialista tributário · RX3",
    frase: "O lob faz a primeira conversa, entende o caso e marca a reunião. Chego no cliente já sabendo do que se trata.",
    site: "https://www.rx3.com.br",
    cor: "purple",
  },
];
