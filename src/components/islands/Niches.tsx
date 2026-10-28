import { useEffect, useRef, useState } from "preact/hooks";
import Lob from "./Lob";
import { ChevronLeft, WhatsAppIcon, Zap } from "./icons";
import { Calculator, Dumbbell, House, Scale, Scissors, ShoppingBag, Stethoscope, UtensilsCrossed, type IconNode } from "lucide";
import FeatureIcon from "./FeatureIcon";
import type { LobColor } from "./Lob";
import { useInView } from "./shared";
import { DEMO_URL } from "../../site";

type Step = { from: "client" | "zappy" | "action"; text: string };

const NICHES: { id: string; label: string; business: string; lead: string; text: string; steps: Step[] }[] = [
  {
    id: "advocacia",
    label: "Advocacia",
    business: "Andrade Advocacia",
    lead: "Seu cliente sabe do processo sem ligar pro escritório.",
    text: "Consulta o andamento nos tribunais, explica em linguagem simples e marca reunião quando precisa.",
    steps: [
      { from: "client", text: "Oi! Teve alguma novidade no meu processo?" },
      { from: "action", text: "Consultou o processo no TJ-SP" },
      {
        from: "zappy",
        text: "Teve sim, Marcos! O juiz marcou a audiência para 12/11 às 14h. Quer que eu agende uma conversa com o Dr. Paulo antes?",
      },
      { from: "client", text: "Quero sim, por favor" },
    ],
  },
  {
    id: "clinicas",
    label: "Clínicas",
    business: "Clínica Sorriso",
    lead: "Nenhum horário vazio na agenda.",
    text: "Confirma as consultas do dia seguinte e encaixa a lista de espera quando alguém desmarca.",
    steps: [
      { from: "zappy", text: "Oi, Marina! Sua consulta é amanhã às 14h com a Dra. Paula. Posso confirmar?" },
      { from: "client", text: "Ai, não vou conseguir 😕" },
      { from: "zappy", text: "Sem problema! Remarquei pra quinta às 10h. Te mando um lembrete na véspera." },
      { from: "action", text: "Horário liberado e preenchido pela lista de espera" },
    ],
  },
  {
    id: "imobiliarias",
    label: "Imobiliárias",
    business: "Lar Imóveis",
    lead: "Lead atendido antes do concorrente.",
    text: "Filtra os imóveis no seu CRM, manda as fotos e marca a visita direto na agenda do corretor.",
    steps: [
      { from: "client", text: "Tem apê de 2 quartos até 500 mil em Pinheiros?" },
      { from: "action", text: "Buscou 3 imóveis no CRM" },
      { from: "zappy", text: "Tenho 3 opções! Te mandei as fotos. Quer visitar no sábado às 10h com o Rafael?" },
      { from: "client", text: "Sábado é perfeito" },
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    business: "Passo Certo",
    lead: "Carrinho abandonado vira venda.",
    text: "Chama o cliente na hora certa, tira a dúvida que travou a compra e oferece uma condição especial.",
    steps: [
      { from: "zappy", text: "Oi, Bia! Vi que o tênis ficou no carrinho. Liberei 10% de desconto com o cupom VOLTA10 😉" },
      { from: "client", text: "Opa! Tem no 37?" },
      { from: "zappy", text: "Tem sim! Te mandei o link já com o cupom aplicado." },
      { from: "action", text: "Carrinho recuperado · R$ 389" },
    ],
  },
  {
    id: "restaurantes",
    label: "Restaurantes",
    business: "Forno da Vila",
    lead: "Pedido no WhatsApp direto na cozinha.",
    text: "Monta o pedido, cobra no Pix e avisa o prazo de entrega, mesmo no horário de pico.",
    steps: [
      { from: "client", text: "Quero 2 pizzas grandes: uma calabresa e uma margherita" },
      { from: "zappy", text: "Fechado! Total de R$ 98 com entrega. Te mandei o Pix 👇" },
      { from: "action", text: "Pedido enviado à cozinha e Pix gerado" },
      { from: "zappy", text: "Pagamento recebido! Chega em uns 40 minutos 🍕" },
    ],
  },
  {
    id: "academias",
    label: "Academias",
    business: "Box Fit",
    lead: "Aluno sumido volta a treinar.",
    text: "Percebe quem parou de ir e convida com a aula certa, antes de virar cancelamento.",
    steps: [
      { from: "zappy", text: "Oi, Pedro! Sentimos sua falta por aqui 💪 Reservo sua vaga no funcional de amanhã às 7h?" },
      { from: "client", text: "Bora! Tava precisando" },
      { from: "zappy", text: "Reservado! Te espero amanhã às 7h." },
      { from: "action", text: "Aluno inativo reativado e aula reservada" },
    ],
  },
  {
    id: "contabilidade",
    label: "Contabilidade",
    business: "Exata Contábil",
    lead: "Cliente com a guia em mãos, sem você abrir o sistema.",
    text: "Gera guias, recebe notas fiscais e responde as dúvidas do mês com os números de cada cliente.",
    steps: [
      { from: "client", text: "Quanto deu meu DAS esse mês?" },
      { from: "action", text: "Guia do DAS gerada no sistema contábil" },
      { from: "zappy", text: "Deu R$ 487,32 e vence dia 20. Te mandei a guia em PDF 👇" },
      { from: "client", text: "Perfeito, obrigado!" },
    ],
  },
  {
    id: "estetica",
    label: "Salões e estética",
    business: "Studio Bella",
    lead: "Agenda cheia e sem furo.",
    text: "Encaixa o horário com a profissional certa e cobra o sinal antes do atendimento.",
    steps: [
      { from: "client", text: "Tem horário pra unha no sábado?" },
      { from: "zappy", text: "Tenho às 10h com a Jéssica! Pra garantir, é só pagar o sinal de R$ 20 no Pix." },
      { from: "client", text: "Paguei ✅" },
      { from: "action", text: "Horário reservado e sinal recebido via Pix" },
    ],
  },
];
const ICONS: Record<string, [IconNode, LobColor]> = {
  advocacia: [Scale, "blue"],
  clinicas: [Stethoscope, "green"],
  imobiliarias: [House, "orange"],
  ecommerce: [ShoppingBag, "pink"],
  restaurantes: [UtensilsCrossed, "orange"],
  academias: [Dumbbell, "purple"],
  contabilidade: [Calculator, "blue"],
  estetica: [Scissors, "pink"],
};
function NicheIcon({ id, where, class: cls }: { id: string; where: string; class: string }) {
  const [icon, color] = ICONS[id];
  return <FeatureIcon icon={icon} color={color} id={`niche-${where}-${id}`} class={cls} />;
}

function TypingDots() {
  return (
    <>
      <span class="typing-dot size-1.5 rounded-full bg-muted" />
      <span class="typing-dot size-1.5 rounded-full bg-muted" />
      <span class="typing-dot size-1.5 rounded-full bg-muted" />
    </>
  );
}

export default function Niches() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, 0.25);
  const niche = NICHES[active];

  useEffect(() => {
    if (!visible || step >= niche.steps.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 400 : 900);
    return () => clearTimeout(t);
  }, [visible, step, niche]);

  const next = niche.steps[step];
  const showTyping = next && next.from !== "action";

  return (
    <section ref={ref} id="nichos" class="overflow-hidden px-4 pt-20 md:px-6 md:pt-24">
      <div class="mx-auto grid max-w-[1100px] items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-16">
          <h2 class="h-display">Funciona para qualquer negócio</h2>
          <div class="mt-8 flex flex-wrap gap-2">
            {NICHES.map((n, i) => {
              const on = i === active;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setStep(0);
                  }}
                  aria-pressed={on}
                  class={`inline-flex h-10 items-center gap-1.5 rounded-full border text-[15px] transition-colors ${on ? "border-zappy/40 bg-surface-2 pr-4 pl-1.5 text-zappy-strong" : "border-line bg-surface px-4 text-ink/80 hover:border-zappy/30 hover:text-ink"}`}
                >
                  {on && (
                    <NicheIcon id={n.id} where="chip" class="size-7" />
                  )}
                  {n.label}
                </button>
              );
            })}
          </div>
          <p key={niche.id} class="animate-fade-up mt-10 max-w-[500px] text-[18px] leading-[30px] text-muted">
            <span class="font-medium text-ink">{niche.lead}</span> {niche.text}
          </p>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap h-[52px] px-7 text-[17px] bg-surface-2 text-ink transition-[background-color,transform] duration-200 hover:bg-[#dcebfb] active:scale-[0.98] mt-8"
          >
            Ver como funciona no seu negócio
          </a>
        </div>
        <div class="relative mx-auto h-[560px] w-full max-w-[380px] md:h-[600px]">
          <div class="absolute inset-x-0 top-0 h-[700px] rounded-[54px] border border-[#D5DEE8] bg-gradient-to-b from-[#F7F9FC] to-[#E6ECF3] p-[10px] shadow-[0_30px_80px_-30px_rgba(31,127,224,0.45)]">
            <div class="relative h-full overflow-hidden rounded-[44px] bg-[#F4F8FC]">
              <div class="absolute top-3 left-1/2 h-[30px] w-[108px] -translate-x-1/2 rounded-full bg-[#0B0F14]" />
              <div class="absolute inset-x-0 top-[54px] z-10 flex items-center gap-2 px-4">
                <span class="grid size-9 place-items-center rounded-full border border-line bg-white/90 text-muted backdrop-blur">
                  <ChevronLeft class="size-4" />
                </span>
                <span class="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-white/90 py-1 pr-3.5 pl-1 backdrop-blur">
                  <NicheIcon id={niche.id} where="phone" class="size-7" />
                  <span class="text-[14px] font-medium">{niche.business}</span>
                </span>
                <span class="grid size-9 place-items-center rounded-full border border-line bg-white/90 backdrop-blur">
                  <WhatsAppIcon class="size-4 text-[#25D366]" />
                </span>
              </div>
              <div key={niche.id} class="absolute inset-x-0 top-[112px] flex flex-col gap-2.5 px-4 text-[14px] leading-[20px]">
                <span class="mb-1 self-center rounded-full bg-white px-3 py-0.5 text-[11.5px] text-muted">Hoje</span>
                {niche.steps.slice(0, step).map((s, i) => {
                  if (s.from === "action")
                    return (
                      <span
                        key={i}
                        class="animate-fade-up inline-flex items-center gap-1.5 self-center rounded-full border border-zappy/25 bg-white py-1 pr-3 pl-1.5 text-[12px] text-zappy-strong shadow-[0_4px_14px_-8px_rgba(31,127,224,0.6)]"
                      >
                        <Zap class="size-3.5 fill-current" />
                        {s.text}
                      </span>
                    );
                  const zappy = s.from === "zappy";
                  return (
                    <div key={i} class={`animate-fade-up flex items-end gap-1.5 ${zappy ? "justify-start" : "justify-end"}`}>
                      {zappy && (
                        <span class="grid size-6 shrink-0 place-items-center rounded-full bg-zappy-ice">
                          <Lob still ticks={false} uid={`niche-${i}`} class="size-5" />
                        </span>
                      )}
                      <p
                        class={`max-w-[78%] rounded-2xl px-3.5 py-2 ${zappy ? "rounded-bl-md border border-line bg-white" : "rounded-br-md bg-bubble"}`}
                      >
                        {s.text}
                      </p>
                    </div>
                  );
                })}
                {showTyping && visible && (
                  <div class={`flex ${next.from === "zappy" ? "justify-start pl-[30px]" : "justify-end"}`}>
                    <span
                      class={`flex gap-1 rounded-2xl px-3.5 py-3 ${next.from === "zappy" ? "rounded-bl-md border border-line bg-white" : "rounded-br-md bg-bubble"}`}
                    >
                      <TypingDots />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
