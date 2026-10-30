import { Fragment } from "preact";
import { useEffect, useRef } from "preact/hooks";
import Lob, { LOB_VIEWBOX } from "./Lob";
import { ROLES } from "./roles";

const [, , VB_W, VB_H] = LOB_VIEWBOX.split(" ").map(Number);
const RATIO = VB_H / VB_W;
/** Rendered width (px) of each lob; every size on screen is a scale of this. */
const BASE = 120;

/** Where each lob floats before the story starts (fractions of the stage). */
const SCATTER = [
  { x: 0.2, y: 0.24, s: 1.05 },
  { x: 0.8, y: 0.2, s: 0.85 },
  { x: 0.12, y: 0.74, s: 0.8 },
  { x: 0.87, y: 0.72, s: 0.9 },
  { x: 0.52, y: 0.88, s: 0.75 },
];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Pinned scroll story: the five lobs float around the stage and, as you scroll,
 * each one flies into its slot in the sentence and lights up what it does.
 */
export default function LobsStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clauseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    const frame = (now: number) => {
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = reduced ? 1 : clamp(-r.top / (span || 1));
      const st = stage.getBoundingClientRect();
      const n = ROLES.length;

      if (introRef.current) {
        const t = clamp(p / 0.12);
        introRef.current.style.opacity = String(1 - t);
        introRef.current.style.transform = `translateY(${-24 * t}px)`;
      }

      ROLES.forEach((_, i) => {
        const lob = lobRefs.current[i];
        const slot = slotRefs.current[i];
        if (!lob || !slot) return;
        // each lob lands in turn, overlapping a little with the next
        const start = 0.1 + i * 0.13;
        const t = ease(clamp((p - start) / 0.2));
        const sc = SCATTER[i];
        const bob = reduced ? 0 : (1 - t) * 10 * Math.sin(now / 900 + i * 1.7);
        const fx = sc.x * st.width;
        const fy = sc.y * st.height + bob;
        const fs = sc.s * Math.min(1, st.width / 900);
        const sr = slot.getBoundingClientRect();
        const tx = sr.left - st.left + sr.width / 2;
        const ty = sr.top - st.top + sr.height / 2;
        const ts = (sr.width * 1.05) / BASE;
        const x = mix(fx, tx, t);
        // a small hop on the way in
        const y = mix(fy, ty, t) - Math.sin(Math.PI * t) * 60;
        const s = mix(fs, ts, t);
        const rot = (1 - t) * (i % 2 ? 8 : -8) + Math.sin(Math.PI * t) * (i % 2 ? -14 : 14);
        lob.style.transform = `translate(${x - BASE / 2}px, ${y - (BASE * RATIO) / 2}px) scale(${s}) rotate(${rot}deg)`;
        const clause = clauseRefs.current[i];
        if (clause) clause.style.opacity = String(mix(0.16, 1, clamp((p - start - 0.08) / 0.12)));
      });
      const last = clauseRefs.current[n];
      if (last) last.style.opacity = String(mix(0.16, 1, clamp((p - 0.8) / 0.1)));

      if (running) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);
    // place everything once, even before the section scrolls in
    requestAnimationFrame(frame);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} class="relative h-[300vh]" aria-label="O que cada lob faz">
      <div ref={stageRef} class="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-4 md:px-6">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_15%_25%,rgba(90,182,255,0.18),transparent),radial-gradient(35%_30%_at_85%_75%,rgba(255,46,147,0.10),transparent),radial-gradient(35%_30%_at_80%_20%,rgba(255,138,15,0.10),transparent)]" />

        <div ref={introRef} class="absolute inset-x-0 top-[16%] text-center md:top-[14%]">
          <span class="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-[13px] text-muted shadow-[0_1px_0_var(--border)]">
            Cinco lobs · uma voz só
          </span>
        </div>

        <p class="relative max-w-[980px] text-center text-[30px] leading-[1.35] font-medium tracking-[-0.02em] sm:text-[40px] md:text-[54px] md:leading-[1.25]">
          {ROLES.map((role, i) => (
            <Fragment key={role.color}>
              <span
                ref={(el) => {
                  clauseRefs.current[i] = el;
                }}
                style={{ opacity: 0.16, transition: "opacity .2s linear" }}
              >
                {i === ROLES.length - 1 ? "e o " : i === 0 ? "O " : "o "}
                <span
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  class="inline-block h-[0.9em] w-[1.1em] align-[-0.12em]"
                >
                  <span class="sr-only">lob {role.area}</span>
                </span>{" "}
                {role.verb}
                {i < ROLES.length - 2 ? ", " : i === ROLES.length - 2 ? " " : ". "}
              </span>
            </Fragment>
          ))}
          <span
            ref={(el) => {
              clauseRefs.current[ROLES.length] = el;
            }}
            class="text-muted"
            style={{ opacity: 0.16, transition: "opacity .2s linear" }}
          >
            Tudo no seu WhatsApp.
          </span>
        </p>

        {ROLES.map((role, i) => (
          <div
            key={role.color}
            ref={(el) => {
              lobRefs.current[i] = el;
            }}
            class="pointer-events-none absolute top-0 left-0 will-change-transform"
            style={{ width: BASE, height: BASE * RATIO, transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <Lob color={role.color} uid={`story-${role.color}`} ticks={false} reach={600} class="size-full overflow-visible" />
          </div>
        ))}
      </div>
    </section>
  );
}
