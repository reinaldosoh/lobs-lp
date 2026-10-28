import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

/** Ticks every `ms` while the element is on screen (paused when scrolled away). */
export function useTick<T extends HTMLElement>(ms: number) {
  const ref = useRef<T>(null);
  const [tick, setTick] = useState(0);
  const visible = useInView(ref, 0.15);
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [visible, ms]);
  return { ref, tick };
}

export function useInView(ref: { current: Element | null }, threshold: number) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return visible;
}

/** Renders children at a fixed width and scales them down to fit the container. */
export function ScaleToFit({ width, children }: { width: number; children: ComponentChildren }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} class="w-full">
      <div
        style={{
          width,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          marginInline: scale === 1 ? "auto" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const TABS = [
  { id: "helpdesk", label: "Help desk" },
  { id: "crm", label: "CRM" },
  { id: "campanhas", label: "Campanhas" },
];

export function PanelFrame({
  title,
  active,
  children,
}: {
  title: string;
  active: string;
  children: ComponentChildren;
}) {
  return (
    <div class="overflow-hidden rounded-[12px] border border-black/10 bg-white shadow-[0_24px_60px_-20px_rgba(11,27,46,0.35),0_2px_6px_rgba(11,27,46,0.06)] ">
      <div class="relative flex h-8 items-center gap-1.5 border-b border-line bg-[#FBFCFE] px-3">
        <span class="size-2.5 rounded-full bg-[#FF5F57]" />
        <span class="size-2.5 rounded-full bg-[#FEBC2E]" />
        <span class="size-2.5 rounded-full bg-[#28C840]" />
        <span class="absolute inset-x-0 text-center text-[11px] text-muted">{title}</span>
      </div>
      <div class="flex items-center gap-1 border-b border-line px-3 py-1.5">
        {TABS.map((t) => (
          <span
            key={t.id}
            class={`rounded-md px-2 py-0.5 text-[10.5px] ${t.id === active ? "bg-surface-2 font-medium text-ink" : "text-muted"}`}
          >
            {t.label}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}
