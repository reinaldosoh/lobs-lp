// LP de psicólogos e psiquiatras (/psicologos/ e /psicologos/b/). Só texto: o layout, os lobs e os planos são os da LP geral.
// Regras de comunicação do nicho (CFP/CFM): sem promessa de resultado, sem depoimento de paciente, sem preço-isca,
// e o lob só cuida do administrativo (agenda, cobrança, primeiro contato), nunca da clínica.
import type { Copy, Item, Pergunta, Variante } from "../variantes";

const FAQ_PSI: Pergunta[] = [
  { p: "O lob faz atendimento clínico?", r: "Não. Os lobs cuidam só do administrativo: respondem o primeiro contato, informam valor e formato, marcam e confirmam a sessão, cobram e retomam quem sumiu. Não fazem triagem clínica, não dão orientação de saúde e não substituem o profissional." },
  { p: "E se o paciente escrever em crise?", r: "O lob acolhe, não tenta conduzir a conversa e passa para você na hora, marcada como urgente no painel e com aviso no seu WhatsApp. Nesses casos ele também indica o CVV (188), nunca sem esse apoio. Você assume quando puder." },
  { p: "Isso quebra o sigilo?", r: "O lob não guarda prontuário nem conteúdo de sessão: só o que a agenda e a cobrança precisam. As conversas são criptografadas em trânsito e em repouso, seguimos a LGPD (dados de saúde são sensíveis) e nada é usado para treinar modelos de terceiros." },
  { p: "O paciente percebe que é uma IA?", r: "O lob se apresenta como o assistente do seu consultório, nunca diz ser humano nem ser você. Ele fala só o que você definiu: valores, formato, horários, política de faltas e convênios." },
  { p: "Funciona para quem atende por convênio e particular?", r: "Sim. Você conta no manual quais convênios aceita, o valor do particular, se atende online ou presencial e as regras de remarcação. O lob responde dentro disso e chama você no que fugir." },
  { p: "Serve para psiquiatria (retorno, receita)?", r: "Serve para a parte administrativa: marcar consulta e retorno, lembrar o horário, informar valor e cobrar. Receita, laudo e qualquer conduta continuam só com você." },
  { p: "Posso usar o número do consultório?", r: "Sim. Você conecta o número que já usa, e seus pacientes continuam falando com o mesmo contato. Você vê tudo no painel e assume qualquer conversa quando quiser." },
];

const NICHO = {
  slug: "psi",
  meta: {
    title: "lobs para psicólogos e psiquiatras · WhatsApp do consultório com agenda e cobrança",
    description: "Agentes de IA para o WhatsApp do consultório: respondem o primeiro contato, marcam e confirmam a sessão, cobram por Pix e retomam quem sumiu. Só administrativo, com sigilo e LGPD.",
    ogTitle: "lobs para psicólogos e psiquiatras",
    ogDescription: "O WhatsApp do consultório agenda, confirma e cobra. Você fica com a sessão.",
    canonical: "/psicologos/",
  },
  conversa: [
    { de: "cliente", t: "Oi, queria saber o valor da sessão. Vocês atendem online?" },
    { de: "lob", t: "Oi! Sou o assistente da Dra. Marina. A sessão online de 50 min é R$ 220, pelo Meet. Tenho quarta às 18h ou quinta às 9h para a primeira conversa. Qual prefere?" },
    { de: "cliente", t: "Quinta às 9h" },
    { de: "lob", t: "Reservado! Te mando o link e um lembrete na quarta à noite 🙂" },
  ],
  paraQuem: {
    texto: "Os lobs não são terapeutas e não entram na sessão: são uma equipe de agentes de IA que cuida do WhatsApp do consultório, seja ele de uma clínica com vários profissionais ou de quem atende sozinho.",
    fecho: "Se o WhatsApp do seu consultório fica sem resposta enquanto você está em sessão, os lobs são para você.",
    cartoes: [
      { cor: "blue", nome: "Psicólogos autônomos", texto: "Responde o primeiro contato, marca a sessão e lembra o horário, sem você olhar o celular entre um paciente e outro." },
      { cor: "green", nome: "Psiquiatras", texto: "Marca consulta e retorno, informa valor e formato, lembra o horário e cobra, com a agenda e a cor de cada tipo de consulta." },
      { cor: "orange", nome: "Clínicas de psicologia", texto: "Distribui o primeiro contato entre os profissionais, respeita a agenda de cada um e mantém tudo à vista num só painel." },
      { cor: "purple", nome: "Neuropsicologia e avaliação", texto: "Organiza as sessões de um processo de avaliação, avisa o que levar e lembra cada etapa." },
      { cor: "pink", nome: "Terapia de casal e família", texto: "Encontra horário para mais de uma pessoa, confirma com cada uma e remarca sem vai e vem de mensagens." },
      { cor: "blue", nome: "Psicanalistas", texto: "Cuida de horários fixos, remarcações e do recibo no fim do mês, no jeito discreto do seu consultório." },
      { cor: "orange", nome: "Equipes multiprofissionais", texto: "Psicólogo, psiquiatra e nutri no mesmo número: cada pedido vai para quem faz sentido, com um resumo." },
    ],
  },
  painelCartoes: [
    { titulo: "Todo o atendimento à vista", texto: "Veja o que o lob respondeu a cada paciente, o que já foi resolvido e assuma com um clique." },
    { titulo: "Um funil que se atualiza sozinho", texto: "Primeiro contato, agendado, em acompanhamento, pausou: o lob move cada pessoa de etapa, sem planilha e sem prontuário." },
    { titulo: "Campanhas para a sua base", texto: "Avise sua base de pacientes de um horário novo ou das férias do consultório. Quem responde é atendido na hora." },
    { titulo: "Eles te avisam quando importa", texto: "Paciente precisando de você, pedido de urgência, resumo do dia: tudo direto no seu WhatsApp." },
  ],
  conectados: {
    titulo: "Cada lob cuida de uma parte do consultório",
    texto: "Um número no WhatsApp, cinco lobs trabalhando juntos: marcam no Google Agenda, criam a sessão online no Google Meet, mandam o Pix, registram no Sheets e avisam sua equipe.",
  },
  calculadora: {
    titulo: "Quanto o WhatsApp sem resposta custa ao consultório?",
    subtitulo: "Preencha com os números do seu consultório. A conta é uma estimativa.",
    contatos: "Pedidos de horário novos por semana",
    valor: "Valor médio de uma sessão",
    perda: "Quantos desses ficam sem retorno ou desistem pela demora",
  },
  confianca: {
    titulo: "Feito para um consultório: sigilo e limites claros",
    subtitulo: "O lob cuida do que é administrativo. O que é clínico fica com você.",
    itens: [
      { titulo: "Nada de clínica.", texto: "O lob não faz terapia, diagnóstico nem orientação de saúde. Marca, confirma, cobra e retoma." },
      { titulo: "Sigilo e LGPD.", texto: "Sem prontuário no lob. Conversas criptografadas e dados nunca usados para treinar modelos de terceiros." },
      { titulo: "Crise vai para você.", texto: "Se o paciente escreve em sofrimento, o lob acolhe, passa a conversa com urgência e indica o CVV (188)." },
      { titulo: "Tudo às claras.", texto: "O lob se apresenta como assistente do consultório, nunca finge ser você, e você confere cada conversa no painel." },
    ] satisfies Item[],
  },
  ctaTexto: "Uma equipe que nunca deixa o paciente sem resposta e cuida da agenda para você ficar com a sessão.",
} satisfies NonNullable<Copy["nicho"]>;

const PASSOS_SUB = "Sem instalar nada e sem montar fluxo. Você testa de graça e os lobs começam a atender o consultório.";

export const COPY_PSI: Record<Variante, Copy> = {
  a: {
    hero: {
      etiqueta: "Agentes de IA para o WhatsApp do consultório",
      titulo: "Seu WhatsApp agenda, confirma e cobra as sessões. Você fica com o paciente.",
      subtitulo: "Os lobs respondem o primeiro contato no número que você já usa, informam valor e formato, marcam o horário, lembram a sessão e mandam o Pix. Só o administrativo: a clínica é sua.",
      botao: "Testar grátis",
      secundario: { texto: "Ver um lob atendendo agora →", href: "demo" },
      micro: ["Sem cartão de crédito", "Mesmo número do consultório", "Sigilo e LGPD"],
    },
    beneficios: {
      titulo: "Você atende. Os lobs cuidam do resto do WhatsApp.",
      itens: [
        { titulo: "Ninguém fica sem resposta.", texto: "Quem escreve às 22h ou no domingo recebe retorno em segundos, e você não precisa olhar o celular entre as sessões." },
        { titulo: "A agenda se organiza sozinha.", texto: "O lob oferece só os horários livres, marca no Google Agenda, lembra a sessão e reduz as faltas." },
        { titulo: "A cobrança sem constrangimento.", texto: "Manda o link do Pix, confirma o pagamento e avisa você, sem você falar de dinheiro com o paciente." },
        { titulo: "Quem some recebe um retorno gentil.", texto: "Se a pessoa para de responder, o lob retoma a conversa no tempo que você escolher." },
      ],
      cta: "Testar grátis",
    },
    demo: {
      titulo: "Mande uma mensagem para o nosso lob agora",
      texto: "Teste como se fosse um paciente novo: pergunte o valor, se atende online, peça um horário. Veja como ele responde.",
    },
    passos: {
      titulo: "No ar em menos de 10 minutos",
      subtitulo: PASSOS_SUB,
      itens: [
        { titulo: "Crie sua conta", texto: "Conte sobre o consultório: valores, formato, horários e política de faltas." },
        { titulo: "Conecte seu WhatsApp", texto: "Leia o QR code. Seus pacientes continuam falando com o mesmo número." },
        { titulo: "Os lobs começam a atender", texto: "Você acompanha no painel e assume a conversa quando quiser." },
      ],
    },
    paraQuem: { titulo: "Feito para quem atende em consultório e responde pelo WhatsApp" },
    painel: {
      titulo: "Tudo o que os lobs falam fica à vista",
      texto: "Help desk e funil num só lugar. Cada primeiro contato vira um registro na etapa certa, sem planilha, e quando alguém precisa de você o lob avisa direto no seu WhatsApp.",
    },
    planos: { titulo: "Comece de graça. Assine quando fizer sentido.", subtitulo: "Teste os lobs no seu consultório e escolha o plano que cabe no seu momento." },
    faq: { inicio: FAQ_PSI },
    cta: { titulo: "Seu próximo paciente vai mandar mensagem hoje. Quem responde enquanto você está em sessão?" },
    nicho: NICHO,
  },
  b: {
    hero: {
      etiqueta: "Para consultórios que atendem pelo WhatsApp",
      titulo: "Paciente que não recebe resposta marca com outro profissional.",
      subtitulo: "Quem pede um horário espera retorno rápido, e nem sempre espera. Os lobs respondem na hora, marcam a sessão, lembram o horário e retomam quem sumiu, sem entrar na clínica.",
      botao: "Parar de perder pacientes",
      secundario: { texto: "Quanto estou perdendo? ↓", href: "#calculadora" },
      micro: ["Sem cartão de crédito", "Usa o número do consultório", "Cancele quando quiser"],
    },
    problema: {
      titulo: "Onde os pacientes estão escapando",
      itens: [
        { titulo: "Primeiro contato fora do horário.", texto: "Chega à noite, você responde de manhã. A pessoa já marcou com outro." },
        { titulo: "Você em sessão.", texto: "Quem está na sua frente vem primeiro, e quem escreveu espera horas." },
        { titulo: "“Vou pensar”.", texto: "Ninguém volta a chamar, e a primeira sessão nunca acontece." },
        { titulo: "Falta e cancelamento em cima da hora.", texto: "Sem lembrete, o horário fica vazio e ninguém ocupa." },
      ],
    },
    beneficios: {
      titulo: "Os lobs não deixam ninguém sem resposta",
      itens: [
        { titulo: "Respondem em segundos,", texto: "inclusive à noite e no fim de semana." },
        { titulo: "Retomam quem sumiu,", texto: "com uma mensagem gentil, no contexto da conversa." },
        { titulo: "Confirmam e lembram a sessão,", texto: "para reduzir as faltas." },
        { titulo: "Passam para você quando importa,", texto: "direto no seu WhatsApp, e com urgência se houver sofrimento." },
      ],
    },
    demo: {
      titulo: "Faça o teste: mande “vou pensar” para o nosso lob",
      texto: "Veja como ele responde com cuidado e quando volta a chamar.",
    },
    passos: {
      titulo: "Comece a recuperar pacientes hoje",
      subtitulo: PASSOS_SUB,
      itens: [
        { titulo: "Crie sua conta", texto: "Conte sobre o consultório." },
        { titulo: "Conecte seu WhatsApp", texto: "Leia o QR code. O número continua o mesmo." },
        { titulo: "Os lobs assumem", texto: "o administrativo e o retorno. Você acompanha e entra quando quiser." },
      ],
    },
    paraQuem: { titulo: "Se uma mensagem sem resposta te custa um paciente, os lobs são para você" },
    painel: {
      titulo: "Você vê cada paciente que os lobs trouxeram de volta",
      texto: "Toda conversa fica registrada, cada pessoa aparece no funil e você recebe um resumo do dia no seu WhatsApp.",
    },
    planos: {
      titulo: "Custa menos que uma sessão perdida por mês",
      subtitulo: "Teste os lobs no seu consultório e escolha o plano que cabe no seu momento.",
      notaComIa: "Se os lobs recuperarem uma sessão por mês, já se pagaram.",
    },
    faq: {
      inicio: [
        { p: "E se eu já respondo rápido?", r: "Ótimo. Os lobs cobrem o que escapa: fora do horário, durante a sessão e o retorno para quem sumiu." },
        ...FAQ_PSI,
      ],
    },
    cta: { titulo: "Quantos pacientes escreveram hoje e ainda estão esperando?" },
    nicho: NICHO,
  },
};
