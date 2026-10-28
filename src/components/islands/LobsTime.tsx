import { animate } from "motion/mini";
import { useEffect, useRef, useState } from "preact/hooks";
import Lob, { LOBS } from "./Lob";
import { ROLES } from "./roles";
import { useInView } from "./shared";

const POP = [0.34, 1.56, 0.64, 1] as const;

/** The squad: five lobs on a dark stage, one card each. Hover a card and its lob jumps. */
export default function LobsTime() {
  const [hot, setHot] = useState<number | null>(null);
  const lobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const bandRef = useRef<HTMLDivElement>(null);
  const visible = useInView(bandRef, 0.4);
  const entered = useRef(false);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // hidden until the entrance (hydration happens well before the section is on screen)
  useEffect(() => {
    if (reduced()) return;
    [...lobRefs.current, ...cardRefs.current].forEach((el) => el && (el.style.opacity = "0"));
  }, []);

  // first time on screen: the lobs pop up one by one, then the cards rise
  useEffect(() => {
    if (!visible || entered.current) return;
    entered.current = true;
    if (reduced()) return;
    lobRefs.current.forEach((el, i) => {
      if (el) animate(el, { opacity: [0, 1], transform: ["translateY(70%) scale(.6)", "translateY(0) scale(1)"] }, { duration: 0.7, delay: 0.08 * i, ease: POP });
    });
    cardRefs.current.forEach((el, i) => {
      if (el) animate(el, { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0)"] }, { duration: 0.6, delay: 0.3 + 0.07 * i, ease: [0.2, 0.7, 0.2, 1] });
    });
  }, [visible]);

  const jump = (i: number) => {
    setHot(i);
    const el = lobRefs.current[i];
    if (!el || reduced()) return;
    animate(el, { transform: ["translateY(0) rotate(0deg)", "translateY(-22%) rotate(-6deg)", "translateY(0) rotate(0deg)"] }, { duration: 0.55, ease: [0.3, 0.7, 0.3, 1] });
  };

  return (
    <div>
      <div ref={bandRef} class="relative overflow-hidden rounded-[28px] bg-[#0B1B2E] px-4 pt-10 pb-0 sm:px-8 md:pt-14">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_120%,rgba(31,125,245,0.45),transparent_70%)]" />
        <div class="relative mx-auto grid max-w-[900px] grid-cols-5 items-end gap-2 sm:gap-6">
          {ROLES.map((role, i) => (
            <button
              key={role.color}
              type="button"
              class="group relative flex flex-col items-center outline-none"
              onMouseEnter={() => jump(i)}
              onFocus={() => jump(i)}
              onClick={() => jump(i)}
              aria-label={`Lob ${role.area}`}
            >
              <span
                class={`mb-3 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-white transition-[opacity,transform] duration-300 sm:text-[13px] ${hot === i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0 sm:opacity-60"}`}
                style={{ background: hot === i ? LOBS[role.color].base : "rgba(255,255,255,0.08)" }}
              >
                {role.area}
              </span>
              <div
                ref={(el) => {
                  lobRefs.current[i] = el;
                }}
                class="w-full"
                style={{ transformOrigin: "50% 100%" }}
              >
                <Lob color={role.color} uid={`time-${role.color}`} reach={500} class="w-full overflow-visible" />
              </div>
            </button>
          ))}
        </div>
        {/* status strip, like a team that's online */}
        <div class="relative -mx-4 mt-6 flex items-center justify-center gap-2 bg-[linear-gradient(90deg,#1F7DF5,#16B8A6,#FFB21F,#FF8A0F,#FF2E93)] px-4 py-2.5 text-[13px] font-medium text-white sm:-mx-8">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
            <span class="relative inline-flex size-2 rounded-full bg-white" />
          </span>
          Os cinco online, trabalhando juntos por trás de um só número
        </div>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ROLES.map((role, i) => {
          const c = LOBS[role.color];
          return (
            <article
              key={role.color}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onMouseEnter={() => jump(i)}
              class="flex flex-col rounded-[20px] border bg-surface p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1"
              style={{
                borderColor: hot === i ? c.base : "var(--border)",
                boxShadow: hot === i ? `0 18px 40px -22px ${c.base}` : "none",
              }}
            >
              <div class="flex items-center gap-2.5">
                <Lob still ticks={false} color={role.color} uid={`card-${role.color}`} class="h-7 w-8" />
                <h3 class="text-[17px] font-medium">{role.area}</h3>
              </div>
              <p class="mt-3 text-[14.5px] leading-[23px] text-muted">{role.text}</p>
              <ul class="mt-auto flex flex-wrap gap-1.5 pt-4">
                {role.tags.map((t) => (
                  <li key={t} class="rounded-full px-2.5 py-0.5 text-[12px]" style={{ background: `${c.light}2E`, color: c.dark }}>
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
