import type { ComponentChildren } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import Lob from "./Lob";
import type { LobColor } from "./Lob";
import {
  ArrowLeft,
  ArrowRightLeft,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  FileText,
  Landmark,
  LoaderCircle,
  PenLine,
  Phone,
  PixIcon,
  Plus,
  Search,
  Star,
  UserRound,
  Video,
} from "./icons";
import { CONVERSATIONS, preview, stepDuration } from "./conversas-data";
import type { Conversation, Step, Tool, ToolIcon } from "./conversas-data";

/* A tela "Conversas" do painel do lobs (apps/web/src/rotas/conversas.tsx), com dados fictícios:
   lista à esquerda, conversa no meio e ficha do cliente à direita. Os tokens são os do painel (pn-*). */

const CHIPS: { label: string; count?: number; on?: boolean; warn?: boolean }[] = [
  { label: "Precisa de você" },
  { label: "Com o lob", count: 6, on: true },
  { label: "Com a equipe", count: 2 },
  { label: "Comigo", count: 1 },
  { label: "Pausadas" },
  { label: "Encerradas" },
  { label: "Todas", count: 9 },
];

const TOOL_ICONS: Record<ToolIcon, { Icon: typeof CalendarDays; bg: string; fg: string }> = {
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
const TOOL_LOGOS: Partial<Record<ToolIcon, { src: string; crop?: boolean }>> = {
  calendar: { src: "/logos/google-calendar.svg" },
  video: { src: "/logos/google-meet.svg" },
  crm: { src: "/logos/rd-station.png" },
  handoff: { src: "/logos/slack.svg" },
  pix: { src: "/logos/pix.png", crop: true },
  sign: { src: "/logos/clicksign.png" },
};
/** O chip de cada ferramenta que o lob usou, na cor do lob que fez o trabalho (como o painel). */
const TOOL_CHIP: Record<ToolIcon, { text: string; color: LobColor }> = {
  calendar: { text: "usou a agenda", color: "orange" },
  video: { text: "marcou a call", color: "orange" },
  file: { text: "montou a proposta", color: "purple" },
  crm: { text: "anotou um dado", color: "purple" },
  handoff: { text: "avisou a equipe", color: "green" },
  pix: { text: "gerou a cobrança", color: "blue" },
  bank: { text: "conferiu o pagamento", color: "blue" },
  sign: { text: "enviou para assinar", color: "blue" },
  phone: { text: "combinou um retorno", color: "pink" },
};

function ToolLogo({ icon }: { icon: ToolIcon }) {
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

function ToolChip({ icon }: { icon: ToolIcon }) {
  const c = TOOL_CHIP[icon];
  return (
    <span class="animate-fade-up flex items-center gap-1.5 self-center rounded-full border border-pn-border bg-pn-card px-2.5 py-0.5 text-[11.5px] text-pn-muted shadow-sm">
      <Lob still ticks={false} uid={`chip-${icon}`} color={c.color} class="w-3.5" />
      {c.text}
    </span>
  );
}

function ToolCard({ tool, running }: { tool: Tool; running: boolean }) {
  return (
    <div class="animate-fade-up w-full max-w-[320px] self-end rounded-2xl border border-pn-border bg-pn-card p-3 shadow-[0_1px_1px_rgba(11,27,46,0.08)]">
      <div class="flex items-center gap-2">
        <ToolLogo icon={tool.icon} />
        <span class="text-[13px] font-medium text-pn-fg">{tool.app}</span>
        <span class="ml-auto">
          {running ? (
            <span class="inline-flex items-center gap-1 rounded-full bg-pn-brand-soft px-2 py-0.5 text-[11px] text-pn-brand">
              <LoaderCircle class="size-3 animate-spin" /> Executando
            </span>
          ) : (
            <span class="inline-flex items-center gap-1 rounded-full bg-pn-success-soft px-2 py-0.5 text-[11px] text-pn-success-fg">
              <Check class="size-3" /> Concluído
            </span>
          )}
        </span>
      </div>
      <div class={running ? "opacity-50 transition-opacity" : "transition-opacity"}>
        <p class="mt-2 text-[14px] leading-5 text-pn-fg">{tool.title}</p>
        {tool.lines?.map((l) => (
          <p key={l} class="text-[12.5px] leading-5 text-pn-muted">
            {l}
          </p>
        ))}
        {tool.file && (
          <div class="mt-2 flex items-center gap-2.5 rounded-xl bg-pn-chat p-2">
            <span class="grid h-9 w-7 place-items-center rounded-[5px] bg-[#E2483D] text-[8px] font-semibold text-white">PDF</span>
            <span class="min-w-0">
              <span class="block truncate text-[13px] text-pn-fg">{tool.file.name}</span>
              <span class="block text-[12px] text-pn-muted">{tool.file.meta}</span>
            </span>
          </div>
        )}
        {tool.code && (
          <div class="mt-2 flex items-center gap-2 rounded-xl bg-pn-chat px-2.5 py-2 font-mono text-[11px] text-pn-muted">
            <span class="truncate">{tool.code}</span>
            <Copy class="ml-auto size-3.5 shrink-0 text-pn-brand" />
          </div>
        )}
        {tool.chips && (
          <div class="mt-2 flex flex-wrap gap-1.5">
            {tool.chips.map((c) => (
              <span key={c} class="rounded-full border border-pn-border bg-pn-bg px-2.5 py-0.5 text-[12px] text-pn-fg">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** A bolha do painel: o cliente à esquerda, branca; o lob à direita, azul com o selo "lob". */
function Bolha({ from, text, time }: { from: "in" | "out"; text: string; time: string }) {
  const out = from === "out";
  return (
    <div
      class={`animate-fade-up relative max-w-[78%] whitespace-pre-wrap break-words rounded-[18px] px-3.5 py-2 text-[14px] leading-snug shadow-[0_1px_1px_rgba(11,27,46,0.08)] ${out ? "self-end rounded-tr-[6px] border border-pn-brand/20 bg-gradient-to-b from-[#e6f1ff] to-[#d8e9ff] text-pn-fg" : "self-start rounded-tl-[6px] bg-pn-card text-pn-fg"}`}
    >
      {out && (
        <span class="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-pn-brand">
          <Lob still ticks={false} uid="bolha" color="blue" class="w-3.5" />
          lob
        </span>
      )}
      {text}
      <div class="mt-1 flex justify-end gap-1.5 text-[10.5px] text-pn-subtle">
        <span>{time}</span>
        {out && <CheckCheck class="size-3.5 text-pn-brand" />}
      </div>
    </div>
  );
}

function Digitando({ from }: { from: "in" | "out" }) {
  const out = from === "out";
  return (
    <div
      class={`animate-fade-up flex w-fit items-center gap-1 rounded-[18px] px-3.5 py-3 shadow-[0_1px_1px_rgba(11,27,46,0.08)] ${out ? "self-end rounded-tr-[6px] border border-pn-brand/20 bg-gradient-to-b from-[#e6f1ff] to-[#d8e9ff]" : "self-start rounded-tl-[6px] bg-pn-card"}`}
      aria-label="digitando"
    >
      <span class="typing-dot size-1.5 rounded-full bg-pn-subtle" />
      <span class="typing-dot size-1.5 rounded-full bg-pn-subtle" />
      <span class="typing-dot size-1.5 rounded-full bg-pn-subtle" />
    </div>
  );
}

function Foto({ c, size = "size-10", text = "text-[14px]", badge = false }: { c: Conversation; size?: string; text?: string; badge?: boolean }) {
  return (
    <span class={`relative grid ${size} shrink-0 place-items-center rounded-full bg-pn-surface ${text} font-semibold text-pn-brand`}>
      {c.name.slice(0, 1).toUpperCase()}
      {badge && (
        <span class="absolute -right-0.5 -bottom-0.5 grid size-[18px] place-items-center rounded-full bg-pn-card ring-2 ring-white">
          <Lob still ticks={false} uid={`item-${c.id}`} color="blue" class="w-3.5" />
        </span>
      )}
    </span>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ComponentChildren }) {
  return (
    <div class="flex flex-col gap-1.5 border-t border-pn-border px-[18px] py-3.5">
      <span class="text-[12px] text-pn-muted">{titulo}</span>
      {children}
    </div>
  );
}

function Ficha({ c, step }: { c: Conversation; step: number }) {
  const stage = [...c.stages].reverse().find((s) => step >= s.at)?.label ?? c.stages[0].label;
  const sabe = c.knows.filter((k) => step >= k.at);
  return (
    <aside class="hidden w-[230px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-pn-border bg-pn-card shadow-pn-card lg:flex">
      <div class="flex flex-col items-center gap-1.5 px-[18px] pt-5 pb-4 text-center">
        <Foto c={c} size="size-14" text="text-[18px]" />
        <b class="text-[16px]">{c.name}</b>
        <span class="text-[12.5px] text-pn-muted">···{c.phone} · Cliente desde {c.since}</span>
        <span class="mt-1 inline-flex items-center gap-1 rounded-full border border-dashed border-pn-border-strong px-2.5 py-0.5 text-[12.5px] text-pn-muted">
          <Plus class="size-3" /> etiqueta
        </span>
      </div>
      <Secao titulo="Agora">
        <p class="m-0 text-[14px]">O lob está atendendo.</p>
      </Secao>
      <Secao titulo="Etapa">
        <div class="flex h-9 items-center justify-between rounded-xl border border-pn-input bg-pn-surface px-3 text-[14px]">
          <span key={stage} class="animate-fade-up">{stage}</span>
          <ChevronDown class="size-4 text-pn-subtle" />
        </div>
      </Secao>
      <Secao titulo="O que o lob sabe">
        {sabe.length === 0 ? (
          <p class="m-0 text-[13px] leading-[1.45] text-pn-muted">
            Nada ainda. O lob anota sozinho o que a pessoa conta e que vale para as próximas vezes.
          </p>
        ) : (
          <ul class="m-0 flex list-none flex-col gap-1.5 p-0 text-[13.5px]">
            {sabe.map((k) => (
              <li key={k.text} class="animate-fade-up flex items-start gap-2">
                <Lob still ticks={false} uid={`fato-${c.id}`} color="blue" class="mt-0.5 w-3.5 shrink-0" />
                <span class="min-w-0 flex-1">{k.text}</span>
              </li>
            ))}
          </ul>
        )}
        <span class="text-[13px] text-pn-muted">+ Ensinar algo sobre esta pessoa</span>
      </Secao>
      <Secao titulo="Notas da equipe">
        <div class="rounded-[18px] border border-pn-input bg-pn-card px-3 py-2 text-[13px] leading-snug text-pn-subtle">
          Um recado para a equipe sobre este cliente. Ele não vê.
        </div>
      </Secao>
    </aside>
  );
}

export type Variant = "full" | "mini";

/** `onStep` dispara a cada mensagem ou ferramenta que chega na conversa aberta. */
export default function ConversasPanel({
  variant = "full",
  autoAdvance = false,
  onStep,
}: {
  variant?: Variant;
  autoAdvance?: boolean;
  onStep?: (step: Step) => void;
}) {
  const mini = variant === "mini";
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lido, setLido] = useState<Set<string>>(() => new Set(["rafa"]));
  const [view, setView] = useState<"chat" | "list">("chat");
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

  // Cada passo: pausa curta, indicador de digitando/executando, e a mensagem chega.
  useEffect(() => {
    if (!visible) return;
    if (step >= steps.length) {
      if (!autoAdvance) return;
      const t = setTimeout(() => go((active + 1) % CONVERSATIONS.length), 2600);
      return () => clearTimeout(t);
    }
    const t = pending
      ? setTimeout(() => {
          setStep((s) => s + 1);
          setPending(false);
        }, stepDuration(steps[step]))
      : setTimeout(() => setPending(true), step === 0 ? 450 : 380);
    return () => clearTimeout(t);
  }, [visible, step, pending, steps, active, autoAdvance]);

  const stepCb = useRef(onStep);
  stepCb.current = onStep;
  useEffect(() => {
    if (step > 0 && steps[step - 1]) stepCb.current?.(steps[step - 1]);
  }, [step, active]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: step === 0 ? "auto" : "smooth" });
  }, [step, pending, active]);

  const go = useCallback((i: number) => {
    setActive(i);
    setStep(0);
    setPending(false);
    setLido((l) => new Set(l).add(CONVERSATIONS[i].id));
  }, []);

  const typing = pending && current && (current.kind === "in" || current.kind === "out") ? current.kind : null;

  // Hora de cada passo: a explícita ou a da mensagem anterior.
  const times: string[] = [];
  steps.reduce((prev, s) => {
    const t = s.kind === "in" || s.kind === "out" ? (s.time ?? prev) : prev;
    times.push(t);
    return t;
  }, conv.time);

  const lista = (
    <div
      class={`${mini || view === "list" ? "flex" : "hidden md:flex"} min-w-0 flex-col overflow-hidden rounded-[20px] border border-pn-border bg-pn-card shadow-pn-card ${mini ? "w-[220px] shrink-0" : "w-full shrink-0 md:w-[250px]"}`}
    >
      <div class="no-scrollbar -mb-px flex gap-1.5 overflow-x-auto border-b border-pn-border p-3 md:flex-wrap">
        {CHIPS.map((c) => (
          <span
            key={c.label}
            class={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12.5px] ${c.on ? "border-pn-brand/60 bg-pn-brand-soft text-pn-fg" : "border-pn-border text-pn-muted"}`}
          >
            {c.label}
            {c.count ? <span class="ml-1.5 text-pn-subtle tabular-nums">{c.count}</span> : null}
          </span>
        ))}
        <span class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-pn-border px-2.5 py-1 text-[12.5px] text-pn-muted">
          <Star class="size-3.5" /> Favoritas
        </span>
      </div>
      <div class="relative border-b border-pn-border p-3">
        <div class="flex h-9 items-center gap-2 rounded-full border border-pn-input bg-pn-surface px-3 text-[13px] text-pn-subtle">
          <Search class="size-4 shrink-0" /> <span class="truncate">Nome, mensagem ou telefone</span>
        </div>
      </div>
      <div class="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {CONVERSATIONS.map((c, i) => {
          const ativa = i === active;
          const naoLidas = ativa || lido.has(c.id) ? 0 : c.unread;
          const previa = !ativa
            ? preview(c)
            : typing
              ? typing === "out"
                ? "O lob está digitando…"
                : "Digitando…"
              : preview(c, step) || "Nova conversa";
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                go(i);
                setView("chat");
              }}
              class={`flex w-full gap-3 border-b border-pn-border/60 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-pn-brand-soft/60 ${ativa ? "bg-pn-brand-soft" : ""}`}
            >
              <Foto c={c} badge />
              <span class="min-w-0 flex-1">
                <span class="flex items-baseline gap-2">
                  <b class="truncate text-[14px]">{c.name}</b>
                  <span class="text-[11.5px] text-pn-subtle">···{c.phone}</span>
                  <span class="ml-auto shrink-0 text-[11.5px] text-pn-subtle">{c.time}</span>
                </span>
                <span class="mt-0.5 flex items-center gap-2">
                  <span class={`truncate text-[12.5px] ${ativa && typing ? "text-pn-brand" : "text-pn-muted"}`}>{previa}</span>
                  {naoLidas > 0 && (
                    <span class="ml-auto grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-pn-brand px-1.5 text-[11px] font-semibold text-white">
                      {naoLidas}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const conversa = (
    <div
      class={`${mini || view === "chat" ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-pn-border bg-pn-card shadow-pn-card`}
    >
      <div class="flex items-center gap-2 border-b border-pn-border px-3 py-3 md:px-3.5">
        <button
          type="button"
          aria-label="Voltar para a lista"
          onClick={() => setView("list")}
          class={`${mini ? "hidden" : "grid md:hidden"} size-8 shrink-0 place-items-center rounded-lg text-pn-fg hover:bg-pn-brand-soft`}
        >
          <ArrowLeft class="size-5" />
        </button>
        <Foto c={conv} />
        <div class="min-w-0 flex-1">
          <b class="block truncate text-[15px]">{conv.name}</b>
          <span class={`block h-[18px] text-[12px] leading-[18px] ${typing === "in" ? "text-pn-brand" : "text-pn-subtle"}`}>
            {typing === "in" ? "digitando…" : `···${conv.phone}`}
          </span>
        </div>
        <span class={`inline-flex items-center whitespace-nowrap rounded-full bg-pn-brand-soft px-2.5 py-0.5 text-xs font-medium text-pn-brand ${mini ? "" : "max-md:hidden"}`}>Com o lob</span>
        <span class={`btn-glossy inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 text-[12.5px] font-semibold ${mini ? "" : "max-md:hidden"}`}>
          <UserRound class="size-4" /> Assumir
        </span>
        <span class={`px-1 text-[12.5px] font-medium text-pn-fg ${mini ? "" : "max-md:hidden"}`}>Encerrar</span>
      </div>
      <div
        ref={scrollRef}
        class="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto bg-pn-chat px-3 py-4 md:px-4"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0 1.2px, transparent 1.6px), radial-gradient(circle at 70% 65%, rgba(31,125,245,0.06) 0 1.4px, transparent 1.8px)",
          backgroundSize: "22px 22px, 30px 30px",
        }}
      >
        <div class="my-1.5 self-center rounded-lg bg-pn-card/95 px-3 py-1 text-[12px] font-medium text-pn-muted shadow-[0_1px_2px_rgba(11,27,46,0.12)]">
          Hoje
        </div>
        {steps.slice(0, step).map((s, i) => {
          const key = `${conv.id}-${i}`;
          if (s.kind === "in" || s.kind === "out") return <Bolha key={key} from={s.kind} text={s.text} time={times[i]} />;
          if (s.kind === "tool")
            return (
              <div key={key} class="contents">
                <ToolChip icon={s.tool.icon} />
                <ToolCard tool={s.tool} running={false} />
              </div>
            );
          return (
            <div key={key} class="animate-fade-up my-1 self-center rounded-full bg-pn-card/80 px-3 py-1 text-[11.5px] text-pn-muted shadow-sm">
              {s.text}
            </div>
          );
        })}
        {pending && current?.kind === "tool" && (
          <div class="contents">
            <ToolChip icon={current.tool.icon} />
            <ToolCard tool={current.tool} running />
          </div>
        )}
        {typing && <Digitando from={typing} />}
      </div>
      <div class="border-t border-pn-border px-[18px] py-3 text-[13px] text-pn-muted">
        O lob está atendendo. Assuma para responder você mesmo.
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      class="relative mx-auto w-full overflow-hidden rounded-[20px] border border-pn-border bg-[linear-gradient(180deg,#e4f1ff_0%,#f4f9ff_140px)] text-left text-pn-fg shadow-[0_30px_80px_-30px_rgba(31,127,224,0.35),0_2px_6px_rgba(11,27,46,0.04)]"
    >
      <div class="px-4 pt-3.5 pb-3 md:px-[18px]">
        <h3 class="m-0 text-[18px] leading-tight font-semibold tracking-[-0.01em]">Conversas</h3>
        <p class="m-0 mt-0.5 text-[12.5px] text-pn-muted">O lob atendendo no WhatsApp, e a equipe quando precisa</p>
      </div>
      <div class={`flex gap-3.5 px-3 pb-3 md:px-3.5 md:pb-3.5 ${mini ? "h-[400px]" : "h-[560px] md:h-[600px]"}`}>
        {lista}
        {conversa}
        {!mini && <Ficha c={conv} step={step} />}
      </div>
    </div>
  );
}
