import type { ComponentChildren } from "preact";
import { Fragment } from "preact";
import { useEffect, useRef } from "preact/hooks";
import HeroChat, { type Step } from "./HeroChat";
import Lob, { LOB_LINEUP, LOB_VIEWBOX, type LobColor } from "./Lob";
import { ROLES } from "./roles";

const [, , VB_W, VB_H] = LOB_VIEWBOX.split(" ").map(Number);
const RATIO = VB_H / VB_W;
/** Rendered width (px) of each lob; every size on screen is a scale of this. */
const BASE = 720;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, from: number, to: number) => ease(clamp((p - from) / (to - from)));

/** Lineup at the bottom of the hero: centre x (fraction of width) and width (fraction of width). */
const LINEUP: Record<LobColor, { x: number; w: number; dy: number }> = {
  orange: { x: 0.12, w: 0.22, dy: 0.06 },
  green: { x: 0.31, w: 0.22, dy: 0.03 },
  blue: { x: 0.5, w: 0.27, dy: 0 },
  pink: { x: 0.69, w: 0.22, dy: 0.03 },
  purple: { x: 0.88, w: 0.22, dy: 0.06 },
};

type Edge = "top" | "left" | "right";
type Spot = { edge: Edge; at: number };
/** Places on the chat window's edges where a lob can peek out from behind it. */
// (top spots stay near the corners, clear of the caption above the window)
const SPOTS_WIDE: Spot[] = [
  { edge: "top", at: 0.1 },
  { edge: "top", at: 0.9 },
  { edge: "left", at: 0.22 },
  { edge: "left", at: 0.5 },
  { edge: "left", at: 0.78 },
  { edge: "right", at: 0.22 },
  { edge: "right", at: 0.5 },
  { edge: "right", at: 0.78 },
];
const SPOTS_NARROW: Spot[] = [0.1, 0.3, 0.5, 0.7, 0.9].map((at) => ({ edge: "top", at }));
/** Where each lob lands (index into the spots above). */
const HOME_WIDE: Record<LobColor, number> = { purple: 1, blue: 2, green: 4, orange: 5, pink: 7 };
const HOME_NARROW: Record<LobColor, number> = { orange: 0, green: 1, blue: 2, pink: 3, purple: 4 };

/** How far out from behind the window a lob is: 0 hidden, PEEK eyes just over the edge, 1 fully out. */
const PEEK = 0.8;

/** Which lob shows up when a tool runs in the chat. */
const TOOL_LOB: Record<string, LobColor> = {
  "Google Agenda": "orange",
  Pix: "green",
  Banco: "green",
  "Ligação": "pink",
  "Google Meet": "purple",
  Slack: "purple",
  "RD Station CRM": "purple",
  Clicksign: "purple",
  "Gerador de propostas": "purple",
};

type Play = { spot: number; out: number; target: number; until: number; hop: number };

// Scroll timeline (fraction of the pinned scroll)
const HERO_OUT = [0.02, 0.14];
const FLY_IN = 0.05; // first lob leaves the lineup
const FLY_STEP = 0.05;
const FLY_LEN = 0.15;
const TAIL_IN = [0.36, 0.42];
const TEXT_OUT = [0.5, 0.62];
const CHAT_IN = [0.5, 0.7];
const DROP = 0.54; // first lob leaves the sentence
const DROP_STEP = 0.03;
const DROP_LEN = 0.16;

/**
 * The hero as one pinned scroll scene, like a short film:
 * 1. headline with the five lobs lined up at the bottom;
 * 2. they fly into the sentence that says what each one does;
 * 3. the WhatsApp chat rises and they settle around it: they peek from behind the window,
 *    duck, pop up somewhere else, and the right one jumps out when its tool runs in the chat.
 */
export default function LobsHero({ children }: { children?: ComponentChildren }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textSlots = useRef<Partial<Record<LobColor, HTMLSpanElement | null>>>({});
  const lobRefs = useRef<Partial<Record<LobColor, HTMLDivElement | null>>>({});
  const clauseRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const play = useRef<Partial<Record<LobColor, Play>>>({});

  const onStep = (step: Step) => {
    const c: LobColor | undefined =
      step.kind === "out" ? "blue" : step.kind === "tool" ? (TOOL_LOB[step.tool.app] ?? "purple") : step.kind === "system" ? "pink" : undefined;
    const s = c && play.current[c];
    if (!s) return;
    const now = performance.now();
    s.hop = now;
    // blue answers every message: a little hop is enough; the others jump all the way out
    s.target = c === "blue" ? Math.max(s.target, PEEK) : 1;
    s.until = now + (c === "blue" ? 1800 : 2600);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    const frame = (now: number) => {
      const r = section.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - window.innerHeight || 1));
      const st = stage.getBoundingClientRect();
      const W = st.width;
      const H = st.height;

      const heroOut = seg(p, HERO_OUT[0], HERO_OUT[1]);
      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - heroOut);
        heroRef.current.style.transform = `translateY(${-40 * heroOut}px) scale(${1 - 0.04 * heroOut})`;
        heroRef.current.style.pointerEvents = heroOut > 0.5 ? "none" : "";
      }
      const textIn = seg(p, 0.08, 0.2);
      const textOut = seg(p, TEXT_OUT[0], TEXT_OUT[1]);
      if (textRef.current) {
        textRef.current.style.opacity = String(textIn * (1 - textOut));
        textRef.current.style.transform = `translateY(${mix(40, 0, textIn) - 120 * textOut}px)`;
      }
      const wide = W >= 1100;
      const chatIn = seg(p, CHAT_IN[0], CHAT_IN[1]);
      const box = chatBoxRef.current;
      if (chatRef.current && box) {
        // the window is scaled to fit the screen, leaving room for the header, caption and perched lobs
        const room = H - (wide ? 190 : 250);
        const scale = Math.min(1, room / box.offsetHeight);
        box.style.transform = `scale(${scale})`;
        box.style.marginBottom = `${-(1 - scale) * box.offsetHeight}px`;
        chatRef.current.style.transform = `translateY(${mix(H, 0, chatIn)}px)`;
        chatRef.current.style.opacity = String(clamp(chatIn * 2));
        chatRef.current.style.pointerEvents = chatIn > 0.5 ? "auto" : "none";
      }
      const cb = box?.getBoundingClientRect();

      const lineupScale = Math.min(1, (H * 0.42) / ((W * 0.27) * RATIO)); // keep them from towering on tall phones
      ROLES.forEach((role, i) => {
        const c = role.color;
        const el = lobRefs.current[c];
        const ts = textSlots.current[c];
        if (!el || !ts || !cb) return;

        // A: lineup at the bottom of the hero, half out of view
        const L = LINEUP[c];
        // on phones they get bigger and spill past the edges, as a crowd peeking in
        const k = W < 640 ? 1.55 : 1;
        const aw = W * L.w * lineupScale * k;
        const ax = W * (0.5 + (L.x - 0.5) * (W < 640 ? 1.25 : 1));
        const ay = H - aw * RATIO * (0.36 - L.dy) + (reduced ? 0 : 4 * Math.sin(now / 1100 + i));
        // B: slot in the sentence
        const tr = ts.getBoundingClientRect();
        const bx = tr.left - st.left + tr.width / 2;
        const by = tr.top - st.top + tr.height / 2;
        const bw = tr.width * 1.08;
        // C: on an edge of the chat window, more or less out from behind it
        const order = LOB_LINEUP.indexOf(c);
        const spots = wide ? SPOTS_WIDE : SPOTS_NARROW;
        const home = (wide ? HOME_WIDE : HOME_NARROW)[c];
        const pl = (play.current[c] ??= { spot: home, out: 1, target: 1, until: 0, hop: -1e9 });
        const cw = wide ? cb.width * 0.13 : Math.min(cb.width * 0.17, 110);
        const ch = cw * RATIO;
        const spot = spots[pl.spot] ?? spots[home];
        const hopK = clamp((now - pl.hop) / 520);
        const d = (mix(-0.55, 0.45, pl.out) + 0.2 * Math.sin(Math.PI * hopK)) * ch;
        let cx = cb.left - st.left + cb.width * spot.at;
        let cy = cb.top - st.top + cb.height * spot.at;
        let tilt = 0;
        if (spot.edge === "top") cy = cb.top - st.top - d;
        else if (spot.edge === "left") (cx = cb.left - st.left - d), (tilt = -90);
        else (cx = cb.right - st.left + d), (tilt = 90);

        const t1 = seg(p, FLY_IN + i * FLY_STEP, FLY_IN + i * FLY_STEP + FLY_LEN);
        const t2 = seg(p, DROP + order * DROP_STEP, DROP + order * DROP_STEP + DROP_LEN);
        const landed = t2 >= 1;
        if (!landed || reduced) {
          // still flying (or scrolled back up): wait at home, fully out, ready to start playing
          Object.assign(pl, { spot: home, out: 1, target: 1, until: now + 700 + order * 500 });
        } else {
          if (now > pl.until) {
            const r = Math.random();
            if (pl.target < 0.05) {
              // was hidden: come back somewhere free
              const taken = new Set(Object.entries(play.current).filter(([k]) => k !== c).map(([, v]) => v!.spot));
              const free = spots.map((_, k) => k).filter((k) => !taken.has(k));
              pl.spot = free[Math.floor(Math.random() * free.length)] ?? home;
              pl.target = PEEK;
              pl.until = now + 3000 + r * 4000;
            } else if (r < 0.65 && Object.values(play.current).filter((v) => v!.target > 0.5).length > 3) {
              pl.target = 0; // duck behind the window (keeping at least three in sight)
              pl.until = now + 900 + r * 2000;
            } else {
              pl.target = 1; // pop out and look around
              pl.hop = now;
              pl.until = now + 1500;
            }
          }
          pl.out += (pl.target - pl.out) * 0.09;
        }
        el.style.zIndex = landed ? "5" : "20";
        let x = mix(mix(ax, bx, t1), cx, t2);
        let y = mix(mix(ay, by, t1), cy, t2);
        // arcs: a hop up on the way into the text, a little toss on the way down
        y -= Math.sin(Math.PI * t1) * H * 0.12 + Math.sin(Math.PI * t2) * H * 0.06;
        x += Math.sin(Math.PI * t2) * (order - 2) * 18;

        const w = mix(mix(aw, bw, t1), cw, t2);
        const spin =
          Math.sin(Math.PI * t1) * (i % 2 ? -18 : 18) + Math.sin(Math.PI * t2) * (order % 2 ? 12 : -12) + tilt * t2;
        el.style.transform = `translate(${x - BASE / 2}px, ${y - (BASE * RATIO) / 2}px) scale(${w / BASE}) rotate(${spin}deg)`;

        const clause = clauseRefs.current[i];
        if (clause) clause.style.opacity = String(mix(0.18, 1, clamp((t1 - 0.6) / 0.4)));
      });
      const tail = clauseRefs.current[ROLES.length];
      if (tail) tail.style.opacity = String(mix(0.18, 1, seg(p, TAIL_IN[0], TAIL_IN[1])));

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
    requestAnimationFrame(frame);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} id="lobs-hero" class="relative -mt-16 h-[330vh] md:-mt-[72px]">
      <div ref={stageRef} class="sticky top-0 h-svh overflow-hidden">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_100%,rgba(90,182,255,0.22),transparent),radial-gradient(30%_30%_at_10%_90%,rgba(255,138,15,0.10),transparent),radial-gradient(30%_30%_at_90%_90%,rgba(154,76,245,0.10),transparent)]" />

        {/* 1. headline */}
        <div ref={heroRef} class="absolute inset-x-0 top-0 flex h-[64%] max-sm:h-[70%] flex-col items-center justify-center px-4 pt-16 text-center md:px-6">
          {children}
        </div>

        {/* 2. the sentence */}
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center px-4 md:px-6">
          <p
            ref={textRef}
            class="max-w-[1000px] text-center text-[28px] leading-[1.4] font-medium tracking-[-0.02em] opacity-0 sm:text-[40px] md:text-[54px] md:leading-[1.28]"
          >
            {ROLES.map((r, i) => (
              <Fragment key={r.color}>
                <span
                  ref={(el) => {
                    clauseRefs.current[i] = el;
                  }}
                  style={{ opacity: 0.18 }}
                >
                  {i === ROLES.length - 1 ? "e o " : i === 0 ? "O " : "o "}
                  <span
                    ref={(el) => {
                      textSlots.current[r.color] = el;
                    }}
                    class="inline-block h-[0.9em] w-[1.15em] align-[-0.14em]"
                  >
                    <span class="sr-only">lob {r.area}</span>
                  </span>{" "}
                  {r.verb}
                  {i < ROLES.length - 2 ? ", " : i === ROLES.length - 2 ? " " : ". "}
                </span>
              </Fragment>
            ))}
            <span
              ref={(el) => {
                clauseRefs.current[ROLES.length] = el;
              }}
              class="text-muted"
              style={{ opacity: 0.18 }}
            >
              Tudo no seu WhatsApp.
            </span>
          </p>
        </div>

        {/* 3. the chat, with the lobs around it */}
        <div class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pt-16 md:px-6">
          <div ref={chatRef} class="flex w-full flex-col items-center opacity-0">
            <p class="mb-24 text-center text-[15px] text-muted min-[1100px]:mb-8 md:text-[17px]">
              Veja os lobs trabalhando numa conversa de verdade no WhatsApp
            </p>
            <div ref={chatBoxRef} class="w-full max-w-[940px] origin-top">
              <HeroChat onStep={onStep} />
            </div>
          </div>
        </div>

        {/* the five lobs, flying between the three places */}
        {ROLES.map((r) => (
          <div
            key={r.color}
            ref={(el) => {
              lobRefs.current[r.color] = el;
            }}
            data-hero-lob={r.color}
            class="pointer-events-none absolute top-0 left-0"
            style={{ width: BASE, height: BASE * RATIO, transformOrigin: "50% 50%", transform: "translateY(120vh)" }}
            aria-hidden="true"
          >
            <Lob color={r.color} uid={`hero-${r.color}`} reach={700} class="size-full overflow-visible" />
          </div>
        ))}
      </div>
    </section>
  );
}
