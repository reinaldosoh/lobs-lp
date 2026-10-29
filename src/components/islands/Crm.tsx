import { useLayoutEffect, useMemo, useRef } from "preact/hooks";
import Lob from "./Lob";
import { Clock, Hourglass, Plus, Trophy } from "./icons";
import { PanelFrame, ScaleToFit, useTick } from "./shared";

/* O Kanban de um funil do painel do lobs (apps/web/src/componentes/funis.tsx), com clientes fictícios:
   abas de funis, colunas com bolinha, nome, contagem e soma em reais, e os cartões do painel. */

type Coluna = { label: string; color: string; trophy?: boolean };
const COLUNAS: Coluna[] = [
  { label: "Novo contato", color: "#1f7df5" },
  { label: "Proposta", color: "#9a4cf5" },
  { label: "Fechou", color: "#16a34a", trophy: true },
  { label: "Não fechou", color: "#8494a8" },
];

type Seed = { name: string; previa: string; value: number | null; stage: number; days: number; parado?: number; tag?: string };
const INITIAL: Seed[] = [
  { name: "Carla Mendes", previa: "Quanto custa o plano mensal?", value: 1200, stage: 0, days: 0, tag: "Instagram" },
  { name: "João Pedro", previa: "Vocês atendem aos sábados?", value: 850, stage: 0, days: 1 },
  { name: "Beatriz Lima", previa: "Quero conhecer a clínica", value: 2400, stage: 0, days: 2, parado: 3 },
  { name: "Rodrigo Alves", previa: "Pode me mandar a proposta?", value: 3100, stage: 1, days: 1 },
  { name: "Fernanda Costa", previa: "Vou ver com meu sócio", value: 690, stage: 1, days: 4, parado: 4 },
  { name: "Lucas Martins", previa: "Proposta enviada · válida 7 dias", value: 4500, stage: 1, days: 2 },
  { name: "Marcelo Dias", previa: "Pagamento confirmado", value: 2900, stage: 2, days: 1 },
  { name: "Juliana Rocha", previa: "Contrato assinado", value: 1750, stage: 2, days: 3 },
  { name: "Tatiane Souza", previa: "Fechei com outra empresa", value: 1100, stage: 3, days: 6 },
];
const INCOMING: { name: string; previa: string; value: number }[] = [
  { name: "Patrícia Nunes", previa: "Oi! Vi o anúncio de vocês", value: 1300 },
  { name: "Gustavo Reis", previa: "Preciso de um orçamento", value: 2200 },
  { name: "Camila Torres", previa: "Tem horário essa semana?", value: 980 },
  { name: "André Lopes", previa: "Quero fechar ainda hoje", value: 3600 },
  { name: "Renata Freitas", previa: "Qual o prazo de entrega?", value: 1450 },
  { name: "Felipe Moura", previa: "Podemos marcar uma call?", value: 2750 },
  { name: "Larissa Pinto", previa: "Gostei, me manda o Pix", value: 760 },
  { name: "Thiago Barros", previa: "Quanto fica no cartão?", value: 1980 },
];
const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;

type Lead = Seed & { id: number; at: number; byLob: boolean };

/** Reproduz o funil até `tick` de forma determinística, para o servidor e o cliente concordarem. */
function simulate(tick: number) {
  let leads: Lead[] = INITIAL.map((s, i) => ({ ...s, id: i, at: -i, byLob: false }));
  let nextId = leads.length;
  let event: { lead: Lead; stage: number } | null = null;
  for (let i = 1; i <= tick; i++) {
    const from = [1, 0][i % 2];
    if (from === 0) {
      const inc = INCOMING[(nextId - INITIAL.length) % INCOMING.length];
      leads = [...leads, { ...inc, stage: 0, days: 0, id: nextId++, at: i - 0.5, byLob: false }];
    }
    const oldest = leads.filter((l) => l.stage === from).sort((a, b) => a.at - b.at)[0];
    if (oldest) {
      const moved: Lead = { ...oldest, stage: from + 1, at: i, days: 0, parado: undefined, byLob: true };
      leads = leads.map((l) => (l.id === oldest.id ? moved : l));
      event = { lead: moved, stage: from + 1 };
    }
    // Só os 4 negócios fechados mais recentes ficam à vista.
    const drop = new Set(
      leads
        .filter((l) => l.stage === 2)
        .sort((a, b) => b.at - a.at)
        .slice(4)
        .map((l) => l.id),
    );
    leads = leads.filter((l) => !drop.has(l.id));
  }
  return { leads, event };
}

function Cartao({ lead, highlighted, setRef }: { lead: Lead; highlighted: boolean; setRef: (el: HTMLElement | null) => void }) {
  return (
    <article
      ref={setRef}
      class={`relative flex flex-col gap-2.5 rounded-[18px] border bg-pn-card p-3 shadow-pn-card ${highlighted ? "border-pn-brand/50 shadow-[0_10px_24px_-10px_rgba(31,125,245,0.55)]" : "border-pn-border"}`}
    >
      {lead.tag && (
        <span class="w-fit rounded-md bg-pn-brand-soft px-2 py-0.5 text-[10.5px] font-semibold tracking-[.04em] text-pn-brand-deep uppercase">{lead.tag}</span>
      )}
      <div class="flex min-w-0 flex-col gap-0.5">
        <b class="line-clamp-2 text-[14px] leading-snug font-semibold">{lead.name}</b>
        <p class="m-0 line-clamp-2 text-[12px] leading-snug text-pn-subtle">{lead.previa}</p>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        {lead.value !== null ? (
          <span class="rounded-md bg-pn-success-soft px-1.5 py-0.5 text-[11.5px] font-semibold text-pn-success-fg tabular-nums">{brl(lead.value)}</span>
        ) : (
          <span />
        )}
        {lead.parado ? (
          <span class="flex items-center gap-1 rounded-md bg-pn-warning-soft px-1.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap text-pn-warning-fg">
            <Hourglass class="size-3.5" /> Parado há {lead.parado} dias
          </span>
        ) : (
          <span class="flex items-center gap-1 text-[11.5px] text-pn-muted">
            {lead.byLob ? <Lob still ticks={false} uid={`k-${lead.id}`} color="blue" class="w-3.5" /> : <Clock class="size-3.5" />}
            {lead.days === 0 ? "hoje" : lead.days === 1 ? "1 dia" : `${lead.days} dias`}
          </span>
        )}
      </div>
    </article>
  );
}

function Panel() {
  const { ref, tick } = useTick<HTMLDivElement>(1700);
  const state = useMemo(() => simulate(tick), [tick]);
  const gridRef = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<number, HTMLElement>());
  const lastPos = useRef(new Map<number, { x: number; y: number }>());

  // FLIP: cada cartão anima da posição anterior para a nova.
  useLayoutEffect(() => {
    const box = gridRef.current?.getBoundingClientRect();
    if (!box) return;
    const next = new Map<number, { x: number; y: number }>();
    cards.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      const pos = { x: r.left - box.left, y: r.top - box.top };
      next.set(id, pos);
      const prev = lastPos.current.get(id);
      if (!prev) return;
      const dx = prev.x - pos.x;
      const dy = prev.y - pos.y;
      if (dx || dy) {
        el.style.transition = "none";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => {
          el.style.transition = "transform 650ms cubic-bezier(0.5, 0, 0.2, 1)";
          el.style.transform = "";
        });
      }
    });
    lastPos.current = next;
  }, [state]);

  const event = state.event;

  return (
    <div ref={ref} class="h-full">
      <PanelFrame title="lobs · Painel" active="crm">
        <div class="relative bg-[linear-gradient(180deg,#e4f1ff_0%,#f4f9ff_120px)] px-3.5 pt-3.5 text-pn-fg">
          <div class="mb-3 flex items-center gap-2 overflow-hidden">
            <span class="flex h-9 shrink-0 items-center gap-2 rounded-full border border-pn-border bg-pn-card px-3.5 text-[13.5px] text-pn-neutral">
              <Lob still ticks={false} uid="aba-atendimento" color="blue" class="w-4" /> Atendimento
            </span>
            <span class="flex h-9 shrink-0 items-center gap-2 rounded-full border border-pn-brand/50 bg-pn-brand-soft px-3.5 text-[13.5px] font-semibold">
              Vendas <span class="font-normal text-pn-muted tabular-nums">{state.leads.length}</span>
            </span>
            <span class="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-pn-border-strong px-3.5 text-[13.5px] text-pn-neutral">
              <Plus class="size-4" /> Novo funil
            </span>
          </div>
          <p class="m-0 mb-3 text-[13px] text-pn-muted">O lob põe e move clientes nas colunas com dica. Troféu e fim, só a equipe.</p>
          <div ref={gridRef} class="relative flex h-[330px] items-start gap-2.5 overflow-hidden pb-6">
            {COLUNAS.map((k, s) => {
              const col = state.leads.filter((l) => l.stage === s).sort((a, b) => b.at - a.at);
              const valor = col.reduce((sum, l) => sum + (l.value ?? 0), 0);
              const parados = col.filter((l) => l.parado).length;
              return (
                <section key={k.label} class="flex min-h-[220px] min-w-0 flex-1 flex-col gap-3 rounded-[22px] border border-dashed border-pn-border-strong p-2.5">
                  <h2 class="m-0 flex items-center gap-1.5 px-1 pt-1 text-[12.5px] font-semibold">
                    <span class="size-2 shrink-0 rounded-full" style={{ background: k.color }} />
                    <span class="flex-1 truncate">{k.label}</span>
                    {k.trophy && <Trophy class="size-4 text-pn-success" />}
                    <span class="rounded-full bg-pn-card px-1.5 py-0.5 text-[11.5px] font-medium text-pn-neutral tabular-nums shadow-[0_1px_2px_rgba(11,27,46,0.06)]">{col.length}</span>
                  </h2>
                  {(valor > 0 || parados > 0) && (
                    <p class="mx-0 -mt-2 mb-0 flex flex-wrap gap-x-2 px-1.5 text-[12px] text-pn-muted">
                      {valor > 0 && <span class={`tabular-nums ${k.trophy ? "font-semibold text-pn-success" : ""}`}>{brl(valor)}</span>}
                      {parados > 0 && <span class="text-pn-warning-fg">{parados} {parados === 1 ? "parado" : "parados"}</span>}
                    </p>
                  )}
                  {col.map((lead) => (
                    <Cartao
                      key={lead.id}
                      lead={lead}
                      highlighted={event?.lead.id === lead.id}
                      setRef={(el) => {
                        if (el) cards.current.set(lead.id, el);
                        else cards.current.delete(lead.id);
                      }}
                    />
                  ))}
                </section>
              );
            })}
          </div>
          {event && (
            <div
              key={tick}
              class="animate-fade-up absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-pn-border bg-white py-1.5 pr-4 pl-1.5 text-[13px] whitespace-nowrap text-pn-fg shadow-[0_8px_20px_-8px_rgba(11,27,46,0.3)]"
            >
              <Lob still ticks={false} uid="crm" color="blue" class="size-6" />
              {event.stage === 2
                ? `Venda fechada com ${event.lead.name.split(" ")[0]} · ${brl(event.lead.value ?? 0)}`
                : `O lob moveu ${event.lead.name.split(" ")[0]} para ${COLUNAS[event.stage].label}`}
            </div>
          )}
        </div>
      </PanelFrame>
    </div>
  );
}

export default function Crm() {
  return (
    <ScaleToFit width={680}>
      <Panel />
    </ScaleToFit>
  );
}
