import { useEffect, useRef } from "preact/hooks";
import Lob from "./Lob";
import type { LobColor } from "./Lob";

/*
 * Depois do chat do hero, os cinco lobs não somem com a página: saem pela lateral, por trás do card,
 * ficam pendurados de cabeça para baixo no topo da tela olhando a pessoa e, quando a faixa
 * "Para quem" passa, cada um desce para o cartão do seu negócio e fica lá.
 * Só leitura do DOM do hero (data-hero-lob) e da faixa (data-lob-slot); nada disso existe sem JS.
 */

const BASE = 100;
const RATIO = 172 / 190;
const LOBS: LobColor[] = ["orange", "green", "blue", "pink", "purple"];
const HANG_X: Record<LobColor, number> = { orange: 0.12, green: 0.31, blue: 0.5, pink: 0.69, purple: 0.88 };
const HANG_W = 60;
const FLY_MS = 950;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const quad = (a: number, c: number, b: number, t: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * c + t * t * b;

type Estado = { fase: "hero" | "pendurado" | "voando" | "pousado"; inicio: number; de: { x: number; y: number; w: number; r: number }; alvo?: HTMLElement };

export default function LobsViagem() {
  const refs = useRef<Partial<Record<LobColor, HTMLDivElement | null>>>({});

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.getElementById("lobs-hero");
    const faixa = document.querySelector<HTMLElement>(".faixa");
    if (!hero || !faixa) return;

    const slots = (c: LobColor) => [...document.querySelectorAll<HTMLElement>(`[data-lob-slot="${c}"]`)];
    for (const c of LOBS) for (const s of slots(c)) s.classList.add("lob-slot-vazio");

    const est = Object.fromEntries(LOBS.map((c) => [c, { fase: "hero", inicio: 0, de: { x: 0, y: 0, w: 0, r: 0 } } as Estado])) as Record<LobColor, Estado>;
    const raiz = document.documentElement;
    let raf = 0;

    const pousar = (c: LobColor) => {
      est[c].fase = "pousado";
      for (const s of slots(c)) {
        s.classList.remove("lob-slot-vazio");
        s.classList.add("lob-float");
      }
    };

    const frame = (now: number) => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 64;
      const hr = hero.getBoundingClientRect();
      // 0 enquanto o hero está preso na tela; 1 depois de mais meia tela de rolagem
      const q = clamp((vh - hr.bottom) / (vh * 0.55));
      const fr = faixa.getBoundingClientRect();
      const faixaNaTela = fr.top < vh * 0.82 && fr.bottom > header;
      if (q > 0 && LOBS.some((c) => est[c].fase !== "pousado")) raiz.dataset.viagem = "1";
      else delete raiz.dataset.viagem;

      for (const c of LOBS) {
        const el = refs.current[c];
        const e = est[c];
        if (!el) continue;
        if (e.fase === "pousado") {
          el.style.opacity = "0";
          continue;
        }
        // o cartão deste lob mais perto do meio da tela (a faixa tem duas cópias de cada)
        const slot = slots(c)
          .map((el) => ({ el, d: Math.abs(el.getBoundingClientRect().left + 28 - vw / 2) }))
          .sort((a, b) => a.d - b.d)[0]?.el;
        let x = 0;
        let y = 0;
        let w = HANG_W;
        let r = 180;

        if (e.fase !== "voando") {
          if (q <= 0) {
            e.fase = "hero";
            el.style.opacity = "0";
            continue;
          }
          e.fase = "pendurado";
          const he = document.querySelector<HTMLElement>(`[data-hero-lob="${c}"]`)?.getBoundingClientRect();
          const s = he ? { x: he.left + he.width / 2, y: he.top + he.height / 2, w: he.width } : { x: vw / 2, y: vh / 2, w: HANG_W };
          const t = { x: vw * HANG_X[c], y: header + HANG_W * RATIO * 0.08 };
          const lado = { x: s.x < vw / 2 ? -HANG_W : vw + HANG_W, y: mix(s.y, t.y, 0.5) };
          const k = ease(q);
          x = quad(s.x, lado.x, t.x, k);
          y = quad(s.y, lado.y, t.y, k) + (q >= 1 ? 3 * Math.sin(now / 700 + HANG_X[c] * 9) : 0);
          w = mix(s.w, HANG_W, k);
          r = 180 * k;
          // a faixa chegou e o cartão deste lob está à vista: desce para ele
          if (q >= 1 && slot && fr.bottom < header) {
            // a pessoa já passou da faixa: o lob vai direto para o cartão
            pousar(c);
            el.style.opacity = "0";
            continue;
          }
          if (q >= 1 && slot && faixaNaTela) {
            const sr = slot.getBoundingClientRect();
            // só se joga quando o cartão dele está inteiro à vista (fora da borda esmaecida da faixa)
            if (sr.left > vw * 0.08 && sr.right < vw * 0.92) {
              e.fase = "voando";
              e.inicio = now;
              e.de = { x, y, w, r };
              e.alvo = slot;
            }
          }
        }
        if (e.fase === "voando" && e.alvo) {
          const sr = e.alvo.getBoundingClientRect();
          const t = clamp((now - e.inicio) / FLY_MS);
          const k = ease(t);
          const alvo = { x: sr.left + sr.width / 2, y: sr.top + sr.height / 2 };
          x = quad(e.de.x, mix(e.de.x, alvo.x, 0.5), alvo.x, k);
          y = quad(e.de.y, Math.min(e.de.y, alvo.y) - 60, alvo.y, k);
          w = mix(e.de.w, sr.width, k);
          r = mix(e.de.r, 360, k);
          if (t >= 1) {
            pousar(c);
            el.style.opacity = "0";
            continue;
          }
        }
        el.style.opacity = "1";
        el.style.transform = `translate(${x - BASE / 2}px, ${y - (BASE * RATIO) / 2}px) scale(${w / BASE}) rotate(${r}deg)`;
      }
      if (LOBS.every((c) => est[c].fase === "pousado")) {
        delete raiz.dataset.viagem;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      delete raiz.dataset.viagem;
    };
  }, []);

  return (
    <div class="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {LOBS.map((c) => (
        <div
          key={c}
          ref={(el) => {
            refs.current[c] = el;
          }}
          class="absolute top-0 left-0"
          style={{ width: BASE, height: BASE * RATIO, transformOrigin: "50% 50%", opacity: 0 }}
        >
          <Lob still ticks color={c} uid={`viagem-${c}`} class="size-full overflow-visible" />
        </div>
      ))}
    </div>
  );
}
