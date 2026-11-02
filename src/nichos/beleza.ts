// LP de beleza (/beleza/ e /beleza/b/): nail designers, manicures, maquiadoras, lash, sobrancelha e estética.
// Só texto: o layout, os lobs e os planos são os da LP geral. O tom é o de quem vive de agenda (e sem frase que vire meme de duplo sentido).
// Regras de comunicação: sem promessa de resultado estético, os valores e as regras de sinal são da profissional.
import type { Copy, Item, Pergunta, Variante } from "../variantes";

const FAQ_BELEZA: Pergunta[] = [
  { p: "O lob cobra o sinal para garantir o horário?", r: "Sim, se você quiser. Você define o valor do sinal e a sua política de falta e remarcação. O lob manda o Pix, confirma o pagamento e só então segura o horário na agenda." },
  { p: "E quando a cliente manda foto de referência?", r: "O lob recebe a foto, guarda junto com a conversa e te mostra no painel. Se o valor depender do trabalho (alongamento, nail art, make de noiva), ele te chama para confirmar antes de fechar." },
  { p: "Minhas clientes chegam pelo Instagram. Funciona?", r: "Funciona. Quem vê seu post e clica no seu WhatsApp é atendida na hora, com a sua tabela, seus horários e o seu jeito de falar." },
  { p: "Trabalho com outras profissionais. Dá para usar a mesma agenda?", r: "Dá. Cada profissional tem a sua agenda e os seus serviços. O lob marca com quem a cliente escolher, ou com quem estiver livre." },
  { p: "O lob lembra a cliente da manutenção?", r: "Lembra. Você diz de quanto em quanto tempo cada serviço pede manutenção (unha, cílios, sobrancelha) e o lob chama a cliente no dia certo, já com horários livres." },
  { p: "Posso usar o mesmo número de sempre?", r: "Sim. Você conecta o número que já usa, e suas clientes continuam falando com o mesmo contato. Você vê tudo no painel e assume qualquer conversa quando quiser." },
  { p: "A cliente percebe que é uma IA?", r: "O lob se apresenta como o assistente do seu studio e fala só o que você definiu: serviços, valores, horários e regras. Nada é prometido fora disso." },
];

const NICHO = {
  slug: "beleza",
  meta: {
    title: "lobs para beleza · WhatsApp do seu studio que agenda, cobra o sinal e lembra a manutenção",
    description: "Agentes de IA para o WhatsApp de nail designers, manicures, maquiadoras, lash e estética: respondem na hora, mandam a tabela, marcam, cobram o sinal no Pix e lembram a manutenção.",
    ogTitle: "lobs para beleza",
    ogDescription: "Sua agenda enche sozinha enquanto você está atendendo.",
    canonical: "/beleza/",
  },
  conversa: [
    { de: "cliente", t: "Oi! Quanto tá a manutenção do gel? Tem horário sábado?" },
    { de: "lob", t: "Oi! Sou a assistente do Studio Bia ✨ A manutenção do gel é R$ 120. Sábado tenho 9h ou 14h. Qual fica melhor?" },
    { de: "cliente", t: "14h!" },
    { de: "lob", t: "Reservado! Pra garantir, é só o sinal de R$ 30 no Pix 👇 Te lembro na sexta 💅" },
  ],
  paraQuem: {
    texto: "Os lobs não fazem unha nem maquiagem: são uma equipe de agentes de IA que cuida do WhatsApp do seu studio, seja um salão com várias profissionais ou quem atende sozinha em casa.",
    fecho: "Se o seu WhatsApp fica sem resposta enquanto você está atendendo, os lobs são para você.",
    cartoes: [
      { cor: "pink", nome: "Nail designers e manicures", texto: "Manda a tabela, marca o horário, cobra o sinal e chama a cliente na hora da manutenção, sem você largar a lixa." },
      { cor: "purple", nome: "Maquiadoras", texto: "Responde orçamento de make social e de noiva, marca a prova e organiza o dia do evento com horário de chegada." },
      { cor: "orange", nome: "Lash designers", texto: "Lembra a manutenção dos cílios no prazo certo e oferece os horários livres antes que a cliente procure outra." },
      { cor: "blue", nome: "Design de sobrancelhas", texto: "Responde valor de design, henna e brow lamination e marca no encaixe que você tiver." },
      { cor: "green", nome: "Clínicas de estética", texto: "Atende quem pergunta de limpeza de pele e procedimentos, agenda a avaliação e cobra os pacotes no Pix." },
      { cor: "pink", nome: "Salões com equipe", texto: "Cada profissional com a sua agenda: o lob marca com quem a cliente escolher ou com quem estiver livre." },
      { cor: "orange", nome: "Maquiagem de noiva", texto: "Organiza prova, contrato e sinal, e lembra a noiva de cada etapa até o grande dia." },
    ],
  },
  painelCartoes: [
    { titulo: "Todas as clientes à vista", texto: "Veja o que o lob respondeu a cada cliente, quem já pagou o sinal e assuma a conversa com um clique." },
    { titulo: "Do “quanto é?” à cliente fiel", texto: "Pediu valor, sinal pago, atendida, sumiu: o lob move cada cliente de etapa sozinho, sem caderninho." },
    { titulo: "Campanhas para a sua base", texto: "Avise suas clientes da agenda de dezembro ou de um horário que abriu. Quem responde é atendida na hora." },
    { titulo: "Eles te avisam quando importa", texto: "Sinal pago, cliente pedindo para falar com você, resumo do dia: tudo direto no seu WhatsApp." },
  ],
  conectados: {
    titulo: "Cada lob cuida de uma parte do seu studio",
    texto: "Um número no WhatsApp, cinco lobs trabalhando juntos: marcam no Google Agenda, cobram o sinal no Pix, lembram a manutenção, registram no Sheets e avisam você.",
  },
  calculadora: {
    titulo: "Quanto o WhatsApp sem resposta custa ao seu studio?",
    subtitulo: "Preencha com os seus números. A conta é uma estimativa.",
    contatos: "Clientes pedindo horário por semana",
    valor: "Valor médio de um atendimento",
    perda: "Quantas dessas desistem pela demora ou faltam",
  },
  confianca: {
    titulo: "Do seu jeito, com as suas regras",
    subtitulo: "O lob fala só o que você definiu. O atendimento na cadeira continua sendo seu.",
    itens: [
      { titulo: "Sua tabela, seus valores.", texto: "O lob passa os preços e as regras que você cadastrou. Se o valor depende do trabalho, ele te chama antes." },
      { titulo: "Sinal e falta do seu jeito.", texto: "Você define o sinal, o prazo para remarcar e o que acontece na falta. O lob explica com educação e cumpre." },
      { titulo: "Nada de promessa.", texto: "O lob não promete resultado nem duração. Fala do serviço como você descreveu." },
      { titulo: "Tudo às claras.", texto: "O lob se apresenta como assistente do studio, nunca finge ser você, e você confere cada conversa no painel." },
    ] satisfies Item[],
  },
  ctaTexto: "Uma equipe que responde suas clientes na hora, cobra o sinal e lembra a manutenção, enquanto você atende.",
} satisfies NonNullable<Copy["nicho"]>;

const PASSOS_SUB = "Sem instalar nada e sem montar fluxo. Você testa de graça e os lobs começam a atender as suas clientes.";

export const COPY_BELEZA: Record<Variante, Copy> = {
  a: {
    hero: {
      etiqueta: "Agentes de IA para o WhatsApp do seu studio",
      titulo: "Sua agenda enche sozinha enquanto você atende suas clientes.",
      subtitulo: "Os lobs respondem suas clientes no número que você já usa, mandam a tabela, marcam o horário, cobram o sinal no Pix e lembram a manutenção. Você só confere a agenda.",
      botao: "Testar grátis",
      secundario: { texto: "Ver um lob atendendo agora →", href: "demo" },
      micro: ["Sem cartão de crédito", "Conecta em 2 minutos pelo QR code", "Mesmo número de sempre"],
    },
    beneficios: {
      titulo: "Você atende. Os lobs cuidam do celular.",
      itens: [
        { titulo: "Nenhuma cliente esperando.", texto: "Quem pergunta o valor às 23h ou no domingo recebe resposta em segundos, com a sua tabela." },
        { titulo: "Sinal pago antes do horário.", texto: "O lob manda o Pix do sinal e só segura o horário quando o pagamento cai. Menos falta, menos buraco na agenda." },
        { titulo: "Manutenção no dia certo.", texto: "Unha, cílios, sobrancelha: o lob chama a cliente quando chega a hora e já oferece os horários livres." },
        { titulo: "Quem sumiu volta a marcar.", texto: "Pediu valor e não respondeu? O lob retoma a conversa no tempo que você escolher, sem parecer chato." },
      ],
      cta: "Testar grátis",
    },
    demo: {
      titulo: "Mande uma mensagem para o nosso lob agora",
      texto: "Teste como se fosse sua cliente: pergunte o valor, peça um horário, diga que vai ver e depois avisa. Veja como ele responde.",
    },
    passos: {
      titulo: "No ar em menos de 10 minutos",
      subtitulo: PASSOS_SUB,
      itens: [
        { titulo: "Crie sua conta", texto: "Conte sobre o seu studio: serviços, valores, horários e regra do sinal." },
        { titulo: "Conecte seu WhatsApp", texto: "Leia o QR code. Suas clientes continuam falando com o mesmo número." },
        { titulo: "Os lobs começam a atender", texto: "Você acompanha no painel e assume a conversa quando quiser." },
      ],
    },
    paraQuem: { titulo: "Feito para quem vive de agenda e atende pelo WhatsApp" },
    painel: {
      titulo: "Tudo o que os lobs falam fica à vista",
      texto: "Conversas, funil e campanhas num só lugar. Cada cliente aparece na etapa certa, sem caderninho, e quando alguém precisa de você o lob avisa direto no seu WhatsApp.",
    },
    depoimentos: { titulo: "Quem já tem os lobs no studio" },
    planos: { titulo: "Comece de graça. Assine quando fizer sentido.", subtitulo: "Teste os lobs no seu studio e escolha o plano que cabe no seu momento." },
    faq: { inicio: FAQ_BELEZA },
    cta: { titulo: "Sua próxima cliente vai mandar mensagem hoje. Quem responde enquanto você está atendendo?" },
    nicho: NICHO,
  },
  b: {
    hero: {
      etiqueta: "Para quem atende beleza pelo WhatsApp",
      titulo: "Enquanto você faz as unhas de uma, a outra marca com a concorrente.",
      subtitulo: "Cliente de beleza quer resposta na hora. Os lobs respondem em segundos, cobram o sinal, confirmam na véspera e não deixam a manutenção passar.",
      botao: "Parar de perder clientes",
      secundario: { texto: "Quanto estou perdendo? ↓", href: "#calculadora" },
      micro: ["Sem cartão de crédito", "Usa o número que você já tem", "Cancele quando quiser"],
    },
    problema: {
      titulo: "Onde suas clientes estão escapando",
      itens: [
        { titulo: "Você atendendo, celular apitando.", texto: "Você está no meio de uma aplicação e não dá para responder. Ela pergunta para a próxima da lista." },
        { titulo: "“Quanto é?” às 23h.", texto: "A mensagem chega à noite, você responde de manhã. Ela já marcou com outra." },
        { titulo: "Falta sem aviso.", texto: "Sem sinal e sem lembrete, o horário fica vazio e ninguém ocupa." },
        { titulo: "Manutenção que ninguém lembrou.", texto: "Passou do prazo, a cliente não chamou e foi fazer em outro lugar." },
      ],
    },
    beneficios: {
      titulo: "Os lobs não deixam nenhuma cliente sem resposta",
      itens: [
        { titulo: "Respondem em segundos,", texto: "com a sua tabela, inclusive à noite e no fim de semana." },
        { titulo: "Cobram o sinal,", texto: "e só seguram o horário com o Pix pago." },
        { titulo: "Confirmam na véspera,", texto: "e oferecem o horário vago para outra se ela desmarcar." },
        { titulo: "Chamam para a manutenção,", texto: "no prazo certo de cada serviço." },
      ],
    },
    demo: {
      titulo: "Faça o teste: diga “vou ver e te aviso” para o nosso lob",
      texto: "Veja como ele responde e quando volta a chamar.",
    },
    passos: {
      titulo: "Comece a encher a agenda hoje",
      subtitulo: PASSOS_SUB,
      itens: [
        { titulo: "Crie sua conta", texto: "Conte sobre o seu studio." },
        { titulo: "Conecte seu WhatsApp", texto: "Leia o QR code. O número continua o mesmo." },
        { titulo: "Os lobs assumem", texto: "o atendimento, o sinal e a manutenção. Você acompanha e entra quando quiser." },
      ],
    },
    paraQuem: { titulo: "Se uma mensagem sem resposta te custa uma cliente, os lobs são para você" },
    painel: {
      titulo: "Você vê cada cliente que os lobs seguraram",
      texto: "Toda conversa fica registrada, cada cliente aparece no funil e você recebe um resumo do dia no seu WhatsApp.",
    },
    depoimentos: { titulo: "Quem parou de perder clientes" },
    planos: {
      titulo: "Custa menos que um horário vago por mês",
      subtitulo: "Teste os lobs no seu studio e escolha o plano que cabe no seu momento.",
      notaComIa: "Se os lobs salvarem um horário por mês, já se pagaram.",
    },
    faq: {
      inicio: [
        { p: "E se eu já respondo rápido?", r: "Ótimo. Os lobs cobrem o que escapa: enquanto você atende, à noite, o sinal e a manutenção que ninguém lembra." },
        ...FAQ_BELEZA,
      ],
    },
    cta: { titulo: "Quantas clientes mandaram mensagem hoje e ainda estão esperando?" },
    nicho: NICHO,
  },
};
