import { useEffect, useRef, useState } from "preact/hooks";
import { Pause, Play, RotateCcw } from "./icons";
import Showreel, { SHOWREEL_DURATION } from "./Showreel";
import { useInView } from "./shared";

const STATS = [
  { value: "< 5s", label: "para responder qualquer mensagem" },
  { value: "24/7", label: "atendendo, inclusive feriados e madrugada" },
  { value: "10 min", label: "para o primeiro follow-up automático" },
];

/** Playhead for the showreel: runs on rAF while playing and on screen, loops. */
function usePlayhead(playing: boolean) {
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      tRef.current = (tRef.current + (now - last)) % SHOWREEL_DURATION;
      last = now;
      setT(tRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  const seek = (ms: number) => {
    tRef.current = ms;
    setT(ms);
  };
  return { t, seek };
}

export default function Demo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const visible = useInView(stageRef, 0.4);
  const [pausedByUser, setPausedByUser] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const playing = visible && !pausedByUser && !reduced;
  const { t, seek } = usePlayhead(playing);
  const toggle = () => setPausedByUser((v) => !v);

  return (
    <section id="demo" class="px-4 py-20 md:px-6 md:py-24">
      <div class="mx-auto max-w-[1100px]">
        <h2 class="h-section text-center">Veja os lobs em ação</h2>
        <div
          ref={stageRef}
          class="group relative mt-10 cursor-pointer overflow-hidden rounded-[24px] border border-line bg-surface shadow-[0_40px_90px_-40px_rgba(31,127,224,0.45)]"
        >
          <Showreel t={t} onClick={toggle} />
          <div class="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/25 to-transparent px-4 pt-10 pb-4 opacity-100 transition-opacity duration-300 md:px-6 md:opacity-0 md:group-hover:opacity-100">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pausar animação" : "Reproduzir animação"}
              class="grid size-9 shrink-0 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition-transform active:scale-95"
            >
              {playing ? <Pause class="size-4 fill-current" /> : <Play class="size-4 translate-x-px fill-current" />}
            </button>
            <div
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                seek(((e.clientX - r.left) / r.width) * SHOWREEL_DURATION);
              }}
              class="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/40"
            >
              <div class="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${(100 * t) / SHOWREEL_DURATION}%` }} />
            </div>
            <button
              type="button"
              onClick={() => {
                seek(0);
                setPausedByUser(false);
              }}
              aria-label="Recomeçar animação"
              class="grid size-9 shrink-0 place-items-center rounded-full bg-white/95 text-ink shadow-sm transition-transform active:scale-95"
            >
              <RotateCcw class="size-4" />
            </button>
          </div>
        </div>
        <dl class="mt-10 grid gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.value} class="border-t border-line pt-5">
              <dt class="text-[32px] leading-none font-medium tracking-[-0.6px]">{s.value}</dt>
              <dd class="mt-2 text-[15px] leading-[22px] text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
