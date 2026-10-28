import Lob from "./Lob";
import { Check, UserRound } from "./icons";
import { PanelFrame, ScaleToFit, useTick } from "./shared";

type Outcome = "resolved" | "human";
type Status = "novo" | "ia" | Outcome;

const CONVERSATIONS: { name: string; initials: string; color: string; ask: string; reply: string; outcome: Outcome }[] = [
  {
    name: "Luana Prado",
    initials: "LP",
    color: "#FDBA74",
    ask: "Vocês abrem no sábado?",
    reply: "Abrimos sim, das 9h às 13h! Quer que eu já reserve um horário?",
    outcome: "resolved",
  },
  {
    name: "Ricardo Melo",
    initials: "RM",
    color: "#93C5FD",
    ask: "Quero negociar um pedido grande",
    reply: "Ótimo! Vou te passar pro time comercial agora mesmo.",
    outcome: "human",
  },
  {
    name: "Tatiane Souza",
    initials: "TS",
    color: "#F9A8D4",
    ask: "Qual o prazo de entrega pra SP?",
    reply: "Para São Paulo capital são 2 dias úteis 📦",
    outcome: "resolved",
  },
  {
    name: "Bruno Carvalho",
    initials: "BC",
    color: "#86EFAC",
    ask: "Consigo parcelar em 6x?",
    reply: "Consegue sim! Em até 6x sem juros no cartão.",
    outcome: "resolved",
  },
  {
    name: "Helena Ramos",
    initials: "HR",
    color: "#C4B5FD",
    ask: "Meu pedido chegou com defeito",
    reply: "Sinto muito, Helena! Já abri a troca e te mandei a etiqueta.",
    outcome: "resolved",
  },
  {
    name: "Diego Fontes",
    initials: "DF",
    color: "#FDE68A",
    ask: "Preciso de um contrato personalizado",
    reply: "Entendi! Vou chamar alguém do time pra te atender.",
    outcome: "human",
  },
];
const COUNT = CONVERSATIONS.length;
const RESOLVED_PER_CYCLE = CONVERSATIONS.filter((c) => c.outcome === "resolved").length;
const wrap = (i: number) => ((i % COUNT) + COUNT) % COUNT;

const BADGES: Record<Status, [string, string]> = {
  novo: ["Novo", "bg-[#FFF3D9] text-[#B7791F]"],
  ia: ["Lob", "bg-surface-2 text-zappy-strong"],
  resolved: ["Resolvido", "bg-[#E5F8EE] text-success"],
  human: ["Você", "bg-[#F1EAFE] text-[#7A4FE0]"],
};

function Badge({ status }: { status: Status }) {
  const [label, cls] = BADGES[status];
  return <span class={`shrink-0 rounded-full px-1.5 py-px text-[9px] font-medium ${cls}`}>{label}</span>;
}

function Panel() {
  const { ref, tick } = useTick<HTMLDivElement>(1400);
  // Each conversation plays over 5 ticks: new → typing → reply → outcome.
  const round = Math.floor(tick / 5);
  const phase = tick % 5;
  const conv = CONVERSATIONS[wrap(round)];
  const status: Status =
    phase === 0 ? "novo" : phase < 3 ? "ia" : conv.outcome === "human" ? (phase === 4 ? "human" : "ia") : "resolved";

  const rows = Array.from({ length: 5 }, (_, i) => {
    const r = round - i;
    const c = CONVERSATIONS[wrap(r)];
    return { key: r, conv: c, status: i === 0 ? status : c.outcome };
  });

  let resolved = 128 + Math.floor(round / COUNT) * RESOLVED_PER_CYCLE;
  for (let i = 0; i < wrap(round); i++) if (CONVERSATIONS[i].outcome === "resolved") resolved++;
  if (status === "resolved") resolved++;

  const cursorToButton = conv.outcome === "human" && phase >= 3;
  const takenOver = conv.outcome === "human" && phase === 4;
  const cursor = cursorToButton
    ? { left: "calc(100% - 44px)", top: "calc(100% - 22px)" }
    : round % 2 === 0
      ? { left: "24%", top: "30%" }
      : { left: "30%", top: "64%" };

  return (
    <div ref={ref} class="h-full">
      <PanelFrame title="lobs · Painel" active="helpdesk">
        <div class="relative grid h-[240px] grid-cols-[38%_1fr]">
          <div class="flex min-w-0 flex-col border-r border-line">
            <div class="flex items-center justify-between px-2.5 py-1.5 text-[10px] text-muted">
              <span class="font-medium text-ink">Conversas</span>
              <span>
                <span class="font-medium text-success">{resolved}</span> resolvidas hoje
              </span>
            </div>
            <div class="flex-1 overflow-hidden">
              {rows.map(({ key, conv: c, status: s }, i) => (
                <div key={key} class={`helpdesk-row flex items-center gap-1.5 px-2.5 py-1.5 ${i === 0 ? "bg-surface-2/70" : ""}`}>
                  <span
                    class="grid size-5 shrink-0 place-items-center rounded-full text-[7.5px] font-medium text-ink/80"
                    style={{ background: c.color }}
                  >
                    {c.initials}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-[10px] font-medium text-ink">{c.name}</span>
                    <span class="block truncate text-[9px] text-muted">{c.ask}</span>
                  </span>
                  <Badge status={s} />
                </div>
              ))}
            </div>
          </div>
          <div class="flex min-w-0 flex-col bg-[#F8FBFF]">
            <div class="flex items-center gap-1.5 border-b border-line bg-white px-2.5 py-1.5">
              <span
                class="grid size-5 place-items-center rounded-full text-[7.5px] font-medium text-ink/80"
                style={{ background: conv.color }}
              >
                {conv.initials}
              </span>
              <span class="truncate text-[10.5px] font-medium">{conv.name}</span>
              <span class="ml-auto">
                <Badge status={status} />
              </span>
            </div>
            <div key={round} class="flex flex-1 flex-col gap-1.5 overflow-hidden p-2.5 text-[10px] leading-[14px]">
              <p class="animate-fade-up max-w-[85%] self-start rounded-xl rounded-bl-sm border border-line bg-white px-2 py-1">{conv.ask}</p>
              {phase === 1 && (
                <span class="animate-fade-up flex gap-0.5 self-end rounded-xl rounded-br-sm bg-bubble px-2 py-1.5">
                  <span class="typing-dot size-1 rounded-full bg-muted" />
                  <span class="typing-dot size-1 rounded-full bg-muted" />
                  <span class="typing-dot size-1 rounded-full bg-muted" />
                </span>
              )}
              {phase >= 2 && (
                <p class="animate-fade-up max-w-[85%] self-end rounded-xl rounded-br-sm bg-bubble px-2 py-1">{conv.reply}</p>
              )}
              {phase >= 3 && conv.outcome === "resolved" && (
                <span class="animate-fade-up inline-flex items-center gap-1 self-center rounded-full bg-[#E5F8EE] px-2 py-0.5 text-[9px] text-success">
                  <Check class="size-2.5" /> Resolvido pelo lob
                </span>
              )}
              {takenOver && (
                <span class="animate-fade-up inline-flex items-center gap-1 self-center rounded-full bg-[#F1EAFE] px-2 py-0.5 text-[9px] text-[#7A4FE0]">
                  <UserRound class="size-2.5" /> Você assumiu a conversa
                </span>
              )}
            </div>
            <div class="flex items-center gap-1.5 border-t border-line bg-white px-2.5 py-1.5">
              {takenOver ? (
                <span class="text-[9.5px] text-ink">Você está no controle</span>
              ) : (
                <span class="flex items-center gap-1 text-[9.5px] text-muted">
                  <Lob still ticks={false} uid="helpdesk" class="size-3.5" /> Lob respondendo
                </span>
              )}
              <span
                class={`ml-auto rounded-full px-2.5 py-0.5 text-[9.5px] text-white transition-transform duration-150 ${takenOver ? "scale-95 bg-[#7A4FE0]" : "bg-ink"}`}
              >
                {takenOver ? "Assumido" : "Assumir"}
              </span>
            </div>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="pointer-events-none absolute size-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-[left,top] duration-[900ms] ease-[cubic-bezier(0.5,0,0.2,1)]"
            style={cursor}
          >
            <path d="M4 2l16 9.5-7 1.5-3.5 7z" fill="#0B1B2E" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
        </div>
      </PanelFrame>
    </div>
  );
}

export default function Helpdesk() {
  return (
    <ScaleToFit width={440}>
      <Panel />
    </ScaleToFit>
  );
}
