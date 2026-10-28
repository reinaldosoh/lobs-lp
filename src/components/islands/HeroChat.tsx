import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import Lob from "./Lob";
import {
  ArrowRightLeft,
  CalendarDays,
  Check,
  CheckCheck,
  Clock,
  Copy,
  FileText,
  Landmark,
  LoaderCircle,
  Mic,
  PenLine,
  Phone,
  PixIcon,
  Plus,
  Search,
  UserRound,
  Video,
} from "./icons";

type Tool = {
  app: string;
  icon: keyof typeof TOOL_ICONS;
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
type Conversation = {
  id: string;
  name: string;
  initials: string;
  color: string;
  time: string;
  topic: string;
  steps: Step[];
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "rafa",
    name: "Rafa",
    initials: "RA",
    color: "#FDBA74",
    time: "09:12",
    topic: "Agendamento",
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
function preview(c: Conversation, upTo = c.steps.length) {
  for (let i = upTo - 1; i >= 0; i--) {
    const s = c.steps[i];
    if (s.kind === "in" || s.kind === "out") return s.text;
    if (s.kind === "tool") return s.tool.title;
  }
  return "";
}

/** How long the "typing"/"running" state lasts before a step lands. */
function stepDuration(s: Step) {
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

const TOOL_ICONS = {
  calendar: { Icon: CalendarDays, bg: "#E3EEFF", fg: "#2F6FDE" },
  file: { Icon: FileText, bg: "#FFE9E3", fg: "#D9533A" },
  crm: { Icon: UserRound, bg: "#E5F8EE", fg: "#14945F" },
  handoff: { Icon: ArrowRightLeft, bg: "#F1EAFE", fg: "#7A4FE0" },
  pix: { Icon: PixIcon, bg: "#DDF7F2", fg: "#14A38B" },
  bank: { Icon: Landmark, bg: "#E5F8EE", fg: "#14945F" },
  sign: { Icon: PenLine, bg: "#FFF3D9", fg: "#B7791F" },
  video: { Icon: Video, bg: "#E3F4FF", fg: "#1F86D1" },
  phone: { Icon: Phone, bg: "#E5F8EE", fg: "#14945F" },
};
const TOOL_LOGOS: Partial<Record<keyof typeof TOOL_ICONS, { src: string; crop?: boolean }>> = {
  calendar: { src: "/logos/google-calendar.svg" },
  video: { src: "/logos/google-meet.svg" },
  crm: { src: "/logos/rd-station.png" },
  handoff: { src: "/logos/slack.svg" },
  pix: { src: "/logos/pix.png", crop: true },
  sign: { src: "/logos/clicksign.png" },
};

function ToolLogo({ icon }: { icon: keyof typeof TOOL_ICONS }) {
  const logo = TOOL_LOGOS[icon];
  if (logo?.crop) {
    return (
      <span
        aria-hidden="true"
        class="size-6 shrink-0 bg-no-repeat"
        style={{ backgroundImage: `url(${logo.src})`, backgroundSize: "auto 100%", backgroundPosition: "left center" }}
      />
    );
  }
  if (logo) return <img src={logo.src} alt="" width={24} height={24} class="size-6 shrink-0 object-contain" />;
  const { Icon, bg, fg } = TOOL_ICONS[icon];
  return (
    <span class="grid size-6 shrink-0 place-items-center rounded-md" style={{ background: bg, color: fg }}>
      <Icon class="size-3.5" />
    </span>
  );
}

function ToolCard({ tool, running }: { tool: Tool; running: boolean }) {
  return (
    <div class="animate-fade-up w-full max-w-[360px] rounded-2xl border border-line bg-surface p-3 shadow-[0_1px_2px_rgba(11,27,46,0.04)]">
      <div class="flex items-center gap-2">
        <ToolLogo icon={tool.icon} />
        <span class="text-[13px] font-medium text-ink">{tool.app}</span>
        <span class="ml-auto">
          {running ? (
            <span class="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-zappy-strong">
              <LoaderCircle class="size-3 animate-spin" /> Executando
            </span>
          ) : (
            <span class="inline-flex items-center gap-1 rounded-full bg-[#E5F8EE] px-2 py-0.5 text-[11px] text-success">
              <Check class="size-3" /> Concluído
            </span>
          )}
        </span>
      </div>
      <div class={running ? "opacity-50 transition-opacity" : "transition-opacity"}>
        <p class="mt-2 text-[14px] leading-5 text-ink">{tool.title}</p>
        {tool.lines?.map((l) => (
          <p key={l} class="text-[13px] leading-5 text-muted">
            {l}
          </p>
        ))}
        {tool.file && (
          <div class="mt-2 flex items-center gap-2.5 rounded-xl bg-surface-2 p-2">
            <span class="grid h-9 w-7 place-items-center rounded-[5px] bg-[#E2483D] text-[8px] font-semibold text-white">PDF</span>
            <span class="min-w-0">
              <span class="block truncate text-[13px] text-ink">{tool.file.name}</span>
              <span class="block text-[12px] text-muted">{tool.file.meta}</span>
            </span>
          </div>
        )}
        {tool.code && (
          <div class="mt-2 flex items-center gap-2 rounded-xl bg-surface-2 px-2.5 py-2 font-mono text-[11px] text-muted">
            <span class="truncate">{tool.code}</span>
            <Copy class="ml-auto size-3.5 shrink-0 text-zappy-strong" />
          </div>
        )}
        {tool.chips && (
          <div class="mt-2 flex flex-wrap gap-1.5">
            {tool.chips.map((c) => (
              <span key={c} class="rounded-full border border-line bg-bg px-2.5 py-0.5 text-[12px] text-ink">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Bubble({ from, text, time }: { from: "in" | "out"; text: string; time: string }) {
  const out = from === "out";
  return (
    <div class={`animate-fade-up flex ${out ? "justify-end" : "justify-start"}`}>
      <div
        class={`max-w-[82%] rounded-2xl px-3.5 py-2 text-[14px] leading-[21px] md:max-w-[70%] ${out ? "rounded-br-md bg-bubble text-ink" : "rounded-bl-md border border-line bg-surface text-ink"}`}
      >
        {text}
        <span class="ml-2 inline-flex translate-y-[3px] items-center gap-0.5 align-baseline text-[10.5px] text-muted/80">
          {time}
          {out && <CheckCheck class="size-3.5 text-zappy" />}
        </span>
      </div>
    </div>
  );
}

function Typing({ from }: { from: "in" | "out" }) {
  const out = from === "out";
  return (
    <div class={`animate-fade-up flex ${out ? "justify-end" : "justify-start"}`}>
      <div
        class={`flex items-center gap-1 rounded-2xl px-3.5 py-3 ${out ? "rounded-br-md bg-bubble" : "rounded-bl-md border border-line bg-surface"}`}
        aria-label="digitando"
      >
        <span class="typing-dot size-1.5 rounded-full bg-muted" />
        <span class="typing-dot size-1.5 rounded-full bg-muted" />
        <span class="typing-dot size-1.5 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function SystemNote({ text }: { text: string }) {
  return (
    <div class="animate-fade-up my-1 flex items-center gap-3 text-[12px] text-muted">
      <span class="h-px flex-1 bg-line" />
      <span class="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-zappy-strong">
        <Clock class="size-3.5" />
        {text}
      </span>
      <span class="h-px flex-1 bg-line" />
    </div>
  );
}

function Avatar({ c, size = 36 }: { c: Conversation; size?: number }) {
  return (
    <span
      class="grid shrink-0 place-items-center rounded-full font-medium text-ink/80"
      style={{ background: c.color, width: size, height: size, fontSize: 0.36 * size }}
    >
      {c.initials}
    </span>
  );
}

/** `onStep` fires each time a message or tool lands in the open conversation. */
export default function HeroChat({ onStep }: { onStep?: (step: Step) => void } = {}) {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conv = CONVERSATIONS[active];
  const steps = conv.steps;
  const current = steps[step];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Each step: short pause → typing/running indicator → message lands.
  useEffect(() => {
    if (!visible || step >= steps.length) return;
    const t = pending
      ? setTimeout(() => {
          setStep((s) => s + 1);
          setPending(false);
        }, stepDuration(steps[step]))
      : setTimeout(() => setPending(true), step === 0 ? 450 : 380);
    return () => clearTimeout(t);
  }, [visible, step, pending, steps]);

  const stepCb = useRef(onStep);
  stepCb.current = onStep;
  useEffect(() => {
    if (step > 0 && steps[step - 1]) stepCb.current?.(steps[step - 1]);
  }, [step, active]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: step === 0 ? "auto" : "smooth" });
  }, [step, pending, active]);

  const select = useCallback((i: number) => {
    setActive(i);
    setStep(0);
    setPending(false);
  }, []);

  const typing = pending && current && (current.kind === "in" || current.kind === "out") ? current.kind : null;

  // Timestamp for each step: explicit time, else inherited from the previous message.
  const times: string[] = [];
  steps.reduce((prev, s) => {
    const t = s.kind === "in" || s.kind === "out" ? (s.time ?? prev) : prev;
    times.push(t);
    return t;
  }, conv.time);

  return (
    <div
      ref={rootRef}
      class="relative mx-auto w-full max-w-[940px] overflow-hidden rounded-[20px] border border-line bg-surface text-left shadow-[0_30px_80px_-30px_rgba(31,127,224,0.35),0_2px_6px_rgba(11,27,46,0.04)]"
    >
      <div class="flex h-[560px] md:h-[640px]">
        <aside class="hidden w-[280px] shrink-0 flex-col border-r border-line bg-surface-2/60 md:flex">
          <div class="flex items-center gap-2 px-4 pt-4">
            <span class="size-3 rounded-full bg-[#FF5F57]" />
            <span class="size-3 rounded-full bg-[#FEBC2E]" />
            <span class="size-3 rounded-full bg-[#28C840]" />
            <Plus class="ml-auto size-4 text-muted" />
          </div>
          <div class="px-3 pt-4 pb-2">
            <div class="flex h-9 items-center gap-2 rounded-[10px] border border-line bg-surface px-3 text-[14px] text-muted">
              <Search class="size-4" /> Buscar conversa
            </div>
          </div>
          <div class="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-2">
            {CONVERSATIONS.map((c, i) => {
              const isActive = i === active;
              const text =
                i !== active
                  ? preview(c)
                  : typing
                    ? typing === "out"
                      ? "Lob digitando…"
                      : "Digitando…"
                    : preview(c, step) || "Nova conversa";
              const highlight = isActive && typing;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => select(i)}
                  class={`flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition-colors ${isActive ? "bg-surface shadow-[0_1px_2px_rgba(11,27,46,0.06)]" : "hover:bg-surface/70"}`}
                >
                  <Avatar c={c} />
                  <span class="min-w-0 flex-1">
                    <span class="flex items-baseline gap-2">
                      <span class="truncate text-[14px] font-medium text-ink">{c.name}</span>
                      <span class="ml-auto shrink-0 text-[11.5px] text-muted">{c.time}</span>
                    </span>
                    <span class={`block truncate text-[12.5px] leading-[18px] ${highlight ? "text-zappy-strong" : "text-muted"}`}>{text}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div class="flex items-center gap-2.5 border-t border-line px-4 py-3">
            <span class="grid size-8 place-items-center rounded-full bg-zappy-ice">
              <Lob still ticks={false} uid="chat-agent" class="size-7" />
            </span>
            <span class="min-w-0">
              <span class="block text-[13px] font-medium">Lobs</span>
              <span class="flex items-center gap-1.5 text-[11.5px] text-muted">
                <span class="pulse-ring size-1.5 rounded-full bg-success" /> Online 24h · 6 conversas
              </span>
            </span>
          </div>
        </aside>

        <section class="flex min-w-0 flex-1 flex-col bg-[linear-gradient(180deg,#F8FBFF_0%,#F1F7FE_100%)]">
          <div class="no-scrollbar flex gap-2 overflow-x-auto border-b border-line bg-surface px-3 py-2.5 md:hidden">
            {CONVERSATIONS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => select(i)}
                class={`flex shrink-0 items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-[13px] transition-colors ${i === active ? "bg-surface-2 text-ink" : "text-muted"}`}
              >
                <Avatar c={c} size={24} />
                {c.name.split(" ")[0]}
              </button>
            ))}
          </div>
          <header class="flex items-center gap-3 border-b border-line bg-surface/80 px-4 py-3 backdrop-blur">
            <Avatar c={conv} size={32} />
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="truncate text-[14.5px] font-medium">{conv.name}</span>
              </div>
              <div class="h-[18px] text-[12px] leading-[18px] text-zappy-strong">{typing === "in" && "digitando…"}</div>
            </div>
          </header>
          <div ref={scrollRef} class="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 py-5 md:px-6">
            <div class="mb-3 flex justify-center">
              <span class="rounded-full bg-surface px-3 py-1 text-[11.5px] text-muted shadow-[0_1px_2px_rgba(11,27,46,0.05)]">Hoje</span>
            </div>
            {steps.slice(0, step).map((s, i) => {
              const key = `${conv.id}-${i}`;
              if (s.kind === "in" || s.kind === "out") return <Bubble key={key} from={s.kind} text={s.text} time={times[i]} />;
              if (s.kind === "tool")
                return (
                  <div key={key} class="flex justify-end">
                    <ToolCard tool={s.tool} running={false} />
                  </div>
                );
              return <SystemNote key={key} text={s.text} />;
            })}
            {pending && current?.kind === "tool" && (
              <div class="flex justify-end">
                <ToolCard tool={current.tool} running />
              </div>
            )}
            {typing && <Typing from={typing} />}
          </div>
          <footer class="flex items-center gap-2 border-t border-line bg-surface px-3 py-2.5">
            <Plus class="size-5 shrink-0 text-muted" />
            <div class="flex h-10 flex-1 items-center rounded-full bg-surface-2 px-4 text-[13.5px] text-muted">
              <span class="truncate">Um lob está respondendo {conv.name.split(" ")[0]} por você…</span>
            </div>
            <span class="grid size-10 shrink-0 place-items-center rounded-full bg-zappy text-white">
              <Mic class="size-4" />
            </span>
          </footer>
        </section>
      </div>
    </div>
  );
}
