import { animate } from "motion/mini";
import { useEffect, useRef, useState } from "preact/hooks";
import Lob, { LOB_ORDER, LOB_VIEWBOX } from "./Lob";
import { useInView } from "./shared";

const POP = [0.34, 1.56, 0.64, 1] as const; // overshoot: lands with a little bounce
const SINK = [0.5, 0, 0.75, 0] as const;
const [, , VB_W, VB_H] = LOB_VIEWBOX.split(" ").map(Number);
const VIEWBOX_RATIO = `${VB_W} / ${VB_H}`;

/** Cycles through the five lobs: the current one sinks away, the next pops in. Click to skip. */
export default function LobCycler({
  class: cls = "",
  interval = 2800,
  reach,
  uid = "cycle",
  outline,
  strokeWidth,
}: {
  class?: string;
  interval?: number;
  /** Pointer distance (px) at which the eyes reach full offset. */
  reach?: number;
  /** Unique id prefix for the SVG defs (stable between SSR and hydration). */
  uid?: string;
  /** Line-art lobs (each stroked in its own colour). */
  outline?: boolean;
  strokeWidth?: number;
}) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLSpanElement>(null);
  const lobRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const busy = useRef(false);
  const visible = useInView(rootRef, 0.1);

  const go = async (next: number) => {
    if (busy.current || next === active) return;
    const from = lobRefs.current[active];
    const to = lobRefs.current[next];
    if (!from || !to) return;
    busy.current = true;
    setActive(next);
    const out = animate(from, { opacity: [1, 0], scale: [1, 0.55], rotate: ["0deg", "8deg"] }, { duration: 0.24, ease: SINK });
    const inn = animate(
      to,
      { opacity: [0, 1], scale: [0.35, 1], rotate: ["-14deg", "0deg"] },
      { duration: 0.6, delay: 0.12, ease: POP },
    );
    await Promise.all([out, inn]);
    from.style.opacity = "0";
    to.style.opacity = "1";
    busy.current = false;
  };

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go((active + 1) % LOB_ORDER.length), interval);
    return () => clearTimeout(t);
  }, [visible, active, interval]);

  return (
    <span
      ref={rootRef}
      // keep the caller's positioning (e.g. `absolute`); otherwise anchor the stacked lobs
      class={`${/\babsolute\b/.test(cls) ? "" : "relative "}block cursor-pointer ${cls}`}
      style={{ aspectRatio: VIEWBOX_RATIO }}
      onClick={() => go((active + 1) % LOB_ORDER.length)}
      role="img"
      aria-label="Lobs"
    >
      {LOB_ORDER.map((color, i) => (
        <span
          key={color}
          ref={(el) => {
            lobRefs.current[i] = el;
          }}
          style={{ position: "absolute", inset: 0, opacity: i === 0 ? 1 : 0, transformOrigin: "50% 85%" }}
          aria-hidden="true"
        >
          <Lob color={color} uid={`${uid}-${color}`} still={i !== active} reach={reach} outline={outline} strokeWidth={strokeWidth} class="size-full overflow-visible" />
        </span>
      ))}
    </span>
  );
}
