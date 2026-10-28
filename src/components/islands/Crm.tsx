import { useLayoutEffect, useMemo, useRef } from "preact/hooks";
import Lob from "./Lob";
import { WhatsAppIcon } from "./icons";
import { PanelFrame, ScaleToFit, useTick } from "./shared";

const STAGES = [
  { label: "Novo", color: "#F59E0B" },
  { label: "Qualificado", color: "#3D9BF0" },
  { label: "Proposta", color: "#8B5CF6" },
  { label: "Fechado", color: "#16A36A" },
];
const INITIAL: [string, number, number][] = [
  ["Carla Mendes", 1200, 0],
  ["João Pedro", 850, 0],
  ["Beatriz Lima", 2400, 0],
  ["Rodrigo Alves", 3100, 1],
  ["Fernanda Costa", 690, 1],
  ["Lucas Martins", 4500, 2],
  ["Juliana Rocha", 1750, 2],
  ["Marcelo Dias", 2900, 3],
];
const INCOMING: [string, number][] = [
  ["Patrícia Nunes", 1300],
  ["Gustavo Reis", 2200],
  ["Camila Torres", 980],
  ["André Lopes", 3600],
  ["Renata Freitas", 1450],
  ["Felipe Moura", 2750],
  ["Larissa Pinto", 760],
  ["Thiago Barros", 1980],
];
const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;

type Lead = { id: number; name: string; value: number; stage: number; at: number };

/** Deterministically replays the funnel up to `tick` so SSR and every client agree. */
function simulate(tick: number) {
  let leads: Lead[] = INITIAL.map(([name, value, stage], i) => ({ id: i, name, value, stage, at: -i }));
  let nextId = leads.length;
  let event: { lead: Lead; stage: number } | null = null;
  for (let i = 1; i <= tick; i++) {
    const from = [2, 1, 0][i % 3];
    if (from === 0) {
      const [name, value] = INCOMING[(nextId - INITIAL.length) % INCOMING.length];
      leads = [...leads, { id: nextId++, name, value, stage: 0, at: i - 0.5 }];
    }
    const oldest = leads.filter((l) => l.stage === from).sort((a, b) => a.at - b.at)[0];
    if (oldest) {
      const moved = { ...oldest, stage: from + 1, at: i };
      leads = leads.map((l) => (l.id === oldest.id ? moved : l));
      event = { lead: moved, stage: from + 1 };
    }
    // Keep only the 4 most recent closed deals
    const drop = new Set(
      leads
        .filter((l) => l.stage === 3)
        .sort((a, b) => b.at - a.at)
        .slice(4)
        .map((l) => l.id),
    );
    leads = leads.filter((l) => !drop.has(l.id));
  }
  return { leads, event };
}

function Panel() {
  const { ref, tick } = useTick<HTMLDivElement>(1700);
  const state = useMemo(() => simulate(tick), [tick]);
  const gridRef = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<number, HTMLDivElement>());
  const lastPos = useRef(new Map<number, { x: number; y: number }>());

  // FLIP: animate each card from its previous position to the new one.
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

  const inProposals = state.leads.filter((l) => l.stage === 2).reduce((sum, l) => sum + l.value, 0);
  const event = state.event;

  return (
    <div ref={ref} class="h-full">
      <PanelFrame title="lobs · Painel" active="crm">
        <div class="relative h-[240px] px-2.5 pt-2">
          <div class="flex items-center justify-between pb-2 text-[10px]">
            <span class="font-medium text-ink">Funil de vendas</span>
            <span class="text-muted">
              <span class="font-medium text-ink">{brl(inProposals)}</span> em propostas
            </span>
          </div>
          <div ref={gridRef} class="grid h-[200px] grid-cols-4 gap-1.5">
            {STAGES.map((stage, s) => {
              const col = state.leads.filter((l) => l.stage === s).sort((a, b) => b.at - a.at);
              return (
                <div key={stage.label} class="flex min-w-0 flex-col overflow-hidden rounded-lg bg-surface-2/60 p-1">
                  <div class="flex items-center gap-1 px-0.5 pb-1 text-[9.5px] font-medium text-ink">
                    <span class="size-1.5 rounded-full" style={{ background: stage.color }} />
                    <span class="truncate">{stage.label}</span>
                    <span class="ml-auto text-muted">{col.length}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    {col.map((lead) => {
                      const highlighted = event?.lead.id === lead.id;
                      return (
                        <div
                          key={lead.id}
                          ref={(el) => {
                            if (el) cards.current.set(lead.id, el);
                            else cards.current.delete(lead.id);
                          }}
                          class={`rounded-md border bg-white px-1.5 py-1 ${highlighted ? "border-zappy/50 shadow-[0_4px_12px_-4px_rgba(61,155,240,0.45)]" : "border-line"}`}
                        >
                          <span class="block truncate text-[9.5px] font-medium text-ink">{lead.name}</span>
                          <span class="flex items-center gap-1 text-[8.5px] text-muted">
                            {brl(lead.value)}
                            <WhatsAppIcon class="ml-auto size-2.5 text-[#25D366]" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {event && (
            <div
              key={tick}
              class="animate-fade-up absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white py-1 pr-2.5 pl-1 text-[9.5px] text-ink shadow-[0_8px_20px_-8px_rgba(11,27,46,0.3)]"
            >
              <Lob still ticks={false} uid="crm" class="size-4" />
              {event.stage === 3
                ? `Venda fechada com ${event.lead.name.split(" ")[0]} · ${brl(event.lead.value)}`
                : `O lob moveu ${event.lead.name.split(" ")[0]} para ${STAGES[event.stage].label}`}
            </div>
          )}
        </div>
      </PanelFrame>
    </div>
  );
}

export default function Crm() {
  return (
    <ScaleToFit width={440}>
      <Panel />
    </ScaleToFit>
  );
}
