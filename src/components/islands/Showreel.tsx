import type { ComponentChildren, JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { siGmail, siGooglesheets, siHubspot, siNotion } from "simple-icons";
import { Check, Phone, WhatsAppIcon } from "./icons";
import Lob, { LOB_LINEUP, type LobColor } from "./Lob";

/*
 * The lobs showreel: a 42s, 8-scene animated film rendered live (no video file).
 * Everything is a pure function of the playhead `t`, so play/pause/seek/restart
 * are exact and the scenes stay crisp at any size.
 */

const W = 1120;
const H = 630;

// ─── timeline ────────────────────────────────────────────────────────────────
const SCENES = [
  { id: "lost", dur: 4500 },
  { id: "intro", dur: 5000 },
  { id: "reply", dur: 6000 },
  { id: "resolve", dur: 5500 },
  { id: "followup", dur: 6000 },
  { id: "connect", dur: 5000 },
  { id: "panel", dur: 4500 },
  { id: "outro", dur: 5500 },
] as const;
type SceneId = (typeof SCENES)[number]["id"];
const STARTS = SCENES.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SCENES[i - 1].dur], []);
export const SHOWREEL_DURATION = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;
const FADE = 380;

// ─── easing helpers ──────────────────────────────────────────────────────────
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const backOut = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
/** 0→1 progress of a segment starting at `start` lasting `dur` (eased). */
const p = (t: number, start: number, dur = 500, ease = easeOut) => ease(clamp((t - start) / dur));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Fade/slide/blur in at `start`. */
function enter(t: number, start: number, { dur = 520, y = 14, blur = 0, scale = 1 } = {}): JSX.CSSProperties {
  const k = p(t, start, dur);
  return {
    opacity: k,
    transform: `translateY(${(1 - k) * y}px) scale(${lerp(scale, 1, k)})`,
    filter: blur ? `blur(${(1 - k) * blur}px)` : undefined,
  };
}
function pop(t: number, start: number, dur = 520): JSX.CSSProperties {
  const k = clamp((t - start) / dur);
  return { opacity: clamp(k * 2.2), transform: `scale(${lerp(0.4, 1, backOut(k))})` };
}

/** Words that sharpen in one by one (the film's signature headline reveal). */
function Words({ text, t, start, stagger = 150, class: cls, style }: { text: string; t: number; start: number; stagger?: number; class?: string; style?: JSX.CSSProperties }) {
  return (
    <span class={cls} style={style}>
      {text.split(" ").map((w, i) => {
        const k = p(t, start + i * stagger, 520);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: k,
              filter: `blur(${(1 - k) * 10}px)`,
              transform: `translateY(${(1 - k) * 8}px)`,
              marginRight: "0.24em",
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}

// ─── brand bits ──────────────────────────────────────────────────────────────
const GRADIENT_LIGHT = "linear-gradient(90deg, #2E86FF 0%, #18B9A0 30%, #F2A900 50%, #FF7A2E 70%, #FF3D9E 100%)";
const GRADIENT_DARK = "linear-gradient(90deg, #4DA3FF 0%, #B8F5E6 32%, #FFE89A 48%, #FFA566 68%, #FF6BC6 100%)";
function Wordmark({ dark, style }: { dark?: boolean; style?: JSX.CSSProperties }) {
  return (
    <span
      style={{
        // backgroundImage, not the `background` shorthand: updating the shorthand would reset background-clip
        backgroundImage: dark ? GRADIENT_DARK : GRADIENT_LIGHT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        ...style,
      }}
    >
      lobs
    </span>
  );
}
const BLUE = "#1F7DF5";
const SKY = "#5AB6FF";

function Mono({ children, style }: { children: ComponentChildren; style?: JSX.CSSProperties }) {
  return (
    <span class="font-mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", ...style }}>
      {children}
    </span>
  );
}

function SimpleIcon({ icon, size }: { icon: { path: string; hex: string }; size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

type Integration = { id: string; label: string; logo: (size: number) => JSX.Element };
const img = (src: string) => (size: number) => <img src={src} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: "contain" }} />;
const INTEGRATIONS: Integration[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    logo: (s) => (
      <span style={{ width: s, height: s, borderRadius: s * 0.28, background: "#25D366", display: "grid", placeItems: "center" }}>
        <WhatsAppIcon class="size-3/5 text-white" />
      </span>
    ),
  },
  { id: "gcal", label: "Google Agenda", logo: img("/logos/google-calendar.svg") },
  { id: "gmail", label: "Gmail", logo: (s) => <SimpleIcon icon={siGmail} size={s} /> },
  { id: "sheets", label: "Planilhas", logo: (s) => <SimpleIcon icon={siGooglesheets} size={s} /> },
  { id: "meet", label: "Google Meet", logo: img("/logos/google-meet.svg") },
  { id: "slack", label: "Slack", logo: img("/logos/slack.svg") },
  { id: "rd", label: "RD Station", logo: img("/logos/rd-station.png") },
  { id: "hubspot", label: "HubSpot", logo: (s) => <SimpleIcon icon={siHubspot} size={s} /> },
  {
    id: "pix",
    label: "Pix",
    logo: (s) => (
      <span
        style={{ width: s, height: s, backgroundImage: "url(/logos/pix.png)", backgroundSize: "auto 100%", backgroundPosition: "left center", backgroundRepeat: "no-repeat" }}
      />
    ),
  },
  { id: "clicksign", label: "Clicksign", logo: img("/logos/clicksign.png") },
  { id: "notion", label: "Notion", logo: (s) => <SimpleIcon icon={siNotion} size={s} /> },
];
const byId = (id: string) => INTEGRATIONS.find((i) => i.id === id)!;

function Tile({ it, size = 48, logo = 0.5, style }: { it: Integration; size?: number; logo?: number; style?: JSX.CSSProperties }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: "#fff",
        boxShadow: "0 10px 24px -12px rgba(11,27,46,0.35), 0 1px 2px rgba(11,27,46,0.08)",
        display: "grid",
        placeItems: "center",
        ...style,
      }}
    >
      <span style={{ display: "grid", placeItems: "center", width: size * logo, height: size * logo }}>{it.logo(size * logo)}</span>
    </span>
  );
}

function LobAvatar({ color = "blue", size = 22, uid }: { color?: LobColor; size?: number; uid: string }) {
  return (
    <span style={{ width: size, height: size, display: "inline-grid", placeItems: "center", flexShrink: 0 }}>
      <Lob still ticks={false} color={color} uid={uid} class="size-full" />
    </span>
  );
}

/** Pointer with a little "lob" tag, like a teammate's cursor. */
function Cursor({ x, y, style }: { x: number; y: number; style?: JSX.CSSProperties }) {
  return (
    <span style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 20, ...style }}>
      <svg viewBox="0 0 24 24" width="18" height="18" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>
        <path d="M4 2l16 9.5-7 1.5-3.5 7z" fill="#0B1B2E" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
      <span
        style={{
          position: "absolute",
          left: 16,
          top: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 8px 2px 3px",
          borderRadius: 999,
          background: BLUE,
          color: "#fff",
          fontSize: 10,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        <LobAvatar uid="cursor" size={14} />
        lob
      </span>
    </span>
  );
}

// ─── scenes ──────────────────────────────────────────────────────────────────
const H1: JSX.CSSProperties = { fontSize: 46, lineHeight: 1.08, fontWeight: 500, letterSpacing: "-0.02em" };

function SceneLost({ t }: { t: number }) {
  const minutes = Math.round(lerp(1, 21, p(t, 900, 1100, (x) => x)));
  const days = t > 2300;
  const fadeBubble = p(t, 3600, 600);
  return (
    <div class="absolute inset-0 flex flex-col items-center" style={{ paddingTop: 150 }}>
      <h2 style={{ ...H1, textAlign: "center", color: "#0B1B2E" }}>
        <Words text="Toda mensagem sem resposta" t={t} start={150} />
        <br />
        <Words text="é um" t={t} start={1200} />
        <Words text="cliente perdido." t={t} start={1450} style={{ color: "#EF4444" }} />
      </h2>
      <div style={{ marginTop: 44, opacity: 1 - fadeBubble, filter: `blur(${fadeBubble * 8}px)` }}>
        <div
          style={{
            ...enter(t, 350),
            maxWidth: 330,
            padding: "10px 14px",
            borderRadius: "16px 16px 16px 6px",
            background: "#fff",
            border: "1px solid #D8E7F6",
            fontSize: 14,
            lineHeight: "21px",
            color: "#0B1B2E",
            boxShadow: "0 12px 30px -18px rgba(11,27,46,0.35)",
          }}
        >
          Oi! Vocês ainda atendem hoje? Queria fechar ainda essa semana 🙏
          <span style={{ marginLeft: 8, fontSize: 10.5, color: "#94A3B8" }}>18:47 ✓✓</span>
        </div>
        <div style={{ ...enter(t, 800), marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: days ? "#EF4444" : "#94A3B8", transition: "color .3s" }}>
          <span style={{ width: 7, height: 7, borderRadius: 9, background: "currentColor" }} />
          <Mono>{days ? "sem resposta há 3 dias" : `sem resposta há ${minutes} min`}</Mono>
        </div>
      </div>
    </div>
  );
}

const ORBIT = ["hubspot", "clicksign", "sheets", "meet", "whatsapp", "gcal", "gmail", "slack", "rd", "pix"];
function SceneIntro({ t }: { t: number }) {
  return (
    <div class="absolute inset-0">
      {/* orbit guide */}
      <div
        style={{
          position: "absolute",
          left: W / 2 - 430,
          top: H / 2 - 240,
          width: 860,
          height: 480,
          borderRadius: "50%",
          border: "1px dashed rgba(31,125,245,0.18)",
          opacity: p(t, 200, 800),
        }}
      />
      {ORBIT.map((id, i) => {
        const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2 + t * 0.00005;
        const x = W / 2 + Math.cos(a) * 430;
        const y = H / 2 + Math.sin(a) * 240;
        return (
          <span key={id} style={{ position: "absolute", left: x - 26, top: y - 26, ...pop(t, 250 + i * 90) }}>
            <Tile it={byId(id)} size={52} />
          </span>
        );
      })}
      <div class="absolute inset-0 flex flex-col items-center" style={{ paddingTop: 150 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
          {LOB_LINEUP.map((c, i) => (
            <span key={c} style={{ width: c === "blue" ? 74 : 56, height: c === "blue" ? 66 : 50, ...pop(t, 150 + i * 110, 600) }}>
              <Lob color={c} uid={`reel-intro-${c}`} still class="size-full overflow-visible" />
            </span>
          ))}
        </div>
        <div style={{ ...H1, fontSize: 30, marginTop: 30, color: "#0B1B2E" }}>
          <Words text="Conheça os" t={t} start={900} />
        </div>
        <div style={{ ...enter(t, 1250, { blur: 14, y: 18, scale: 0.94 }), fontSize: 112, lineHeight: 1, marginTop: 2 }}>
          <Wordmark />
          <span style={{ color: "#FF3D9E", fontWeight: 700 }}>.</span>
        </div>
        <div style={{ ...enter(t, 1900), marginTop: 22, color: "#5D6E83" }}>
          <Mono>
            <span style={{ color: BLUE }}>→ 00</span> / agentes de IA que falam a favor da sua empresa
          </Mono>
        </div>
      </div>
    </div>
  );
}

function Bubble({ out, children, style }: { out?: boolean; children: ComponentChildren; style?: JSX.CSSProperties }) {
  return (
    <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", ...style }}>
      <div
        style={{
          maxWidth: "82%",
          padding: "8px 12px",
          fontSize: 13,
          lineHeight: "19px",
          color: "#0B1B2E",
          borderRadius: out ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          background: out ? "#DCEFFF" : "#fff",
          border: out ? "none" : "1px solid #D8E7F6",
        }}
      >
        {children}
      </div>
    </div>
  );
}
function Typing({ out, style }: { out?: boolean; style?: JSX.CSSProperties }) {
  return (
    <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", ...style }}>
      <span
        style={{ display: "flex", gap: 4, padding: "11px 12px", borderRadius: 14, background: out ? "#DCEFFF" : "#fff", border: out ? "none" : "1px solid #D8E7F6" }}
      >
        <span class="typing-dot size-1.5 rounded-full bg-muted" />
        <span class="typing-dot size-1.5 rounded-full bg-muted" />
        <span class="typing-dot size-1.5 rounded-full bg-muted" />
      </span>
    </div>
  );
}
const between = (t: number, a: number, b: number) => t >= a && t < b;

function SceneReply({ t }: { t: number }) {
  return (
    <div class="absolute inset-0">
      <div style={{ position: "absolute", left: 90, top: 190, width: 440 }}>
        <div style={enter(t, 100)}>
          <Mono style={{ color: "#5D6E83" }}>
            <span style={{ color: BLUE }}>→ 01</span> / atende na hora
          </Mono>
        </div>
        <h2 style={{ ...H1, marginTop: 16, color: "#0B1B2E" }}>
          <Words text="Responde em" t={t} start={200} />
          <br />
          <Words text="segundos." t={t} start={520} style={{ color: BLUE }} />
        </h2>
        <p style={{ ...enter(t, 1000), marginTop: 18, fontSize: 16, lineHeight: "25px", color: "#5D6E83", maxWidth: 360 }}>
          24 horas por dia. Feriado, madrugada, fim de semana. Ninguém espera.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 120,
          width: 370,
          height: 360,
          ...enter(t, 150, { y: 24 }),
          borderRadius: 18,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid #D8E7F6",
          boxShadow: "0 30px 70px -30px rgba(31,125,245,0.45)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderBottom: "1px solid #E7EEF7" }}>
          <LobAvatar uid="reel-reply" size={26} />
          <span style={{ display: "grid", lineHeight: 1.15 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0B1B2E" }}>Lobs</span>
            <span style={{ fontSize: 10.5, color: "#16A36A" }}>online</span>
          </span>
          <span style={{ marginLeft: "auto", color: "#94A3B8" }}>
            <Mono style={{ fontSize: 9.5 }}>02:14</Mono>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 14 }}>
          {t > 600 && <Bubble style={enter(t, 600, { dur: 320, y: 6 })}>Oi, ainda dá pra agendar pra amanhã cedo?</Bubble>}
          {between(t, 1050, 1650) && <Typing out style={enter(t, 1050, { dur: 250, y: 4 })} />}
          {t > 1650 && (
            <Bubble out style={enter(t, 1650, { dur: 320, y: 6 })}>
              Dá sim! Tenho 8h30 ou 9h. Qual fica melhor? 😊
            </Bubble>
          )}
          {t > 2600 && <Bubble style={enter(t, 2600, { dur: 320, y: 6 })}>9h!</Bubble>}
          {between(t, 2950, 3500) && <Typing out style={enter(t, 2950, { dur: 250, y: 4 })} />}
          {t > 3500 && (
            <div style={{ display: "flex", justifyContent: "flex-end", ...enter(t, 3500, { dur: 360, y: 6 }) }}>
              <div style={{ width: "88%", padding: 10, borderRadius: 12, background: "#fff", border: "1px solid #D8E7F6", display: "flex", alignItems: "center", gap: 8 }}>
                <Tile it={byId("gcal")} size={26} logo={0.7} style={{ boxShadow: "none" }} />
                <span style={{ display: "grid", lineHeight: 1.25 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0B1B2E" }}>Consulta marcada</span>
                  <span style={{ fontSize: 10.5, color: "#5D6E83" }}>Google Agenda · amanhã, 9h</span>
                </span>
                <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#16A36A", display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Check class="size-3" /> Feito
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: W - 90 - 370 + 16,
          top: 120 + 360 + 14,
          ...pop(t, 1750, 500),
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px 6px 6px",
          borderRadius: 999,
          background: "#0B1B2E",
          color: "#fff",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        <LobAvatar uid="reel-fast" size={18} /> respondeu em 0,8s
      </div>
    </div>
  );
}

const TASKS = [
  { title: "Consulta marcada", sub: "Google Agenda · Rafa, sex 9h", it: "gcal" },
  { title: "Contrato enviado para assinatura", sub: "Clicksign · Antônio Carlos", it: "clicksign" },
  { title: "Cobrança gerada", sub: "Pix · R$ 1.290,00", it: "pix" },
  { title: "Lead qualificado", sub: "RD Station · Ana Clara, score 87", it: "rd" },
];
function SceneResolve({ t }: { t: number }) {
  const step = (i: number) => 1100 + i * 950;
  const done = TASKS.filter((_, i) => t > step(i)).length;
  const active = Math.min(TASKS.length - 1, done);
  const cardX = (W - 640) / 2;
  const cardY = 210;
  const rowY = (i: number) => cardY + 54 + i * 62;
  const cur = t < step(0) - 500 ? { x: cardX + 700, y: rowY(0) + 120 } : { x: cardX + 560, y: rowY(active) + 22 };
  return (
    <div class="absolute inset-0">
      <div style={{ position: "absolute", left: 90, top: 92 }}>
        <div style={enter(t, 250)}>
          <Mono style={{ color: "rgba(255,255,255,0.75)" }}>→ 02 / resolve de verdade</Mono>
        </div>
        <h2 style={{ ...H1, marginTop: 14, color: "#fff" }}>
          <Words text="Não só responde." t={t} start={350} />
          <Words text="Resolve." t={t} start={850} style={{ color: "#BFE3FF" }} />
        </h2>
      </div>
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY,
          width: 640,
          ...enter(t, 500, { y: 30 }),
          borderRadius: 18,
          background: "#fff",
          boxShadow: "0 40px 80px -30px rgba(5,30,90,0.6)",
          padding: "14px 16px 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600, color: "#0B1B2E", paddingBottom: 8 }}>
          Tarefas dos lobs · hoje
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 500, color: BLUE, background: "#E9F3FE", padding: "3px 9px", borderRadius: 999 }}>
            ● {done}/4 concluídas
          </span>
        </div>
        {TASKS.map((task, i) => {
          const isDone = t > step(i);
          const isActive = i === active && !isDone && t > step(i) - 650;
          return (
            <div
              key={task.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 54,
                marginTop: 8,
                padding: "0 12px",
                borderRadius: 12,
                border: `1.5px solid ${isActive ? "rgba(31,125,245,0.55)" : "transparent"}`,
                background: isActive ? "#F4F9FF" : "transparent",
                transition: "background .3s, border-color .3s",
              }}
            >
              <Tile it={byId(task.it)} size={30} logo={0.66} style={{ boxShadow: "none", border: "1px solid #EEF3F9" }} />
              <span style={{ display: "grid", lineHeight: 1.3 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0B1B2E" }}>{task.title}</span>
                <span style={{ fontSize: 11, color: "#5D6E83" }}>{task.sub}</span>
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  padding: "4px 9px",
                  borderRadius: 999,
                  color: isDone ? "#16A36A" : "#94A3B8",
                  background: isDone ? "#E5F8EE" : "#F1F5F9",
                  transform: isDone ? "scale(1)" : "scale(0.96)",
                  transition: "all .3s cubic-bezier(.2,.7,.2,1)",
                }}
              >
                {isDone ? "✓ FEITO" : "NA FILA"}
              </span>
            </div>
          );
        })}
      </div>
      <Cursor
        x={cur.x}
        y={cur.y}
        style={{ opacity: p(t, 700, 400), transition: "left .6s cubic-bezier(.5,0,.2,1), top .6s cubic-bezier(.5,0,.2,1)" }}
      />
    </div>
  );
}

function SceneFollowup({ t }: { t: number }) {
  const minutes = Math.round(lerp(0, 10, p(t, 900, 1800, (x) => x)));
  const ring = minutes / 10;
  const red = minutes >= 10;
  const R = 42;
  const C = 2 * Math.PI * R;
  const cy = 360;
  return (
    <div class="absolute inset-0">
      <div class="absolute inset-x-0 flex flex-col items-center" style={{ top: 92 }}>
        <div style={enter(t, 100)}>
          <Mono style={{ color: "#5D6E83" }}>
            <span style={{ color: BLUE }}>→ 03</span> / follow-up automático
          </Mono>
        </div>
        <h2 style={{ ...H1, marginTop: 14, color: "#0B1B2E" }}>
          <Words text="Ninguém fica" t={t} start={200} />
          <Words text="no vácuo." t={t} start={500} style={{ color: BLUE }} />
        </h2>
      </div>
      {/* timeline */}
      <div style={{ position: "absolute", left: 120, right: 120, top: cy, height: 2, background: "linear-gradient(90deg, transparent, #BFDBFE 12%, #BFDBFE 88%, transparent)", opacity: p(t, 500, 600) }} />
      <div style={{ position: "absolute", left: 110, top: cy - 78, width: 300, ...enter(t, 600) }}>
        <Bubble out>
          Te mandei a proposta! Qualquer dúvida, é só chamar 😉 <span style={{ fontSize: 10, color: "#94A3B8" }}>14:05 ✓✓</span>
        </Bubble>
      </div>
      <div
        style={{
          position: "absolute",
          left: W / 2 - 56,
          top: cy - 56,
          width: 112,
          height: 112,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: `0 16px 40px -16px ${red ? "rgba(239,68,68,0.55)" : "rgba(31,125,245,0.45)"}`,
          display: "grid",
          placeItems: "center",
          ...pop(t, 700, 600),
        }}
      >
        <svg width="112" height="112" viewBox="0 0 112 112" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx="56" cy="56" r={R} fill="none" stroke="#EEF3F9" stroke-width="5" />
          <circle
            cx="56"
            cy="56"
            r={R}
            fill="none"
            stroke={red ? "#EF4444" : BLUE}
            stroke-width="5"
            stroke-linecap="round"
            stroke-dasharray={C}
            stroke-dashoffset={C * (1 - ring)}
          />
        </svg>
        <span style={{ textAlign: "center", lineHeight: 1 }}>
          <span style={{ fontSize: 26, fontWeight: 600, color: "#0B1B2E" }}>{minutes}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0B1B2E" }}>min</span>
          <br />
          <Mono style={{ fontSize: 7.5, color: "#94A3B8", letterSpacing: "0.18em" }}>sem resposta</Mono>
        </span>
      </div>
      {/* the lob calls */}
      <div
        style={{
          position: "absolute",
          left: W / 2 + 110,
          top: cy - 104,
          ...enter(t, 2900),
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px 7px 7px",
          borderRadius: 999,
          background: "#fff",
          border: "1px solid #D8E7F6",
          boxShadow: "0 10px 26px -14px rgba(11,27,46,0.4)",
          fontSize: 12.5,
          color: "#0B1B2E",
        }}
      >
        <span style={{ width: 26, height: 26, borderRadius: 99, background: "#E5F8EE", color: "#14945F", display: "grid", placeItems: "center" }}>
          <Phone class="size-3.5" />
        </span>
        <span>
          <b style={{ fontWeight: 600 }}>O lob ligou pro Alfredo</b> · 1min 12s
        </span>
      </div>
      <div style={{ position: "absolute", left: W / 2 + 110, top: cy - 44, width: 300, ...enter(t, 3700) }}>
        <Bubble>
          Fechado! Pode mandar o Pix 🙌 <span style={{ fontSize: 10, color: "#94A3B8" }}>14:17</span>
        </Bubble>
      </div>
      <div class="absolute inset-x-0 flex justify-center" style={{ top: cy + 92 }}>
        <span
          style={{
            ...pop(t, 4300, 600),
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px 8px 8px",
            borderRadius: 999,
            background: "#16A36A",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            boxShadow: "0 14px 30px -12px rgba(22,163,106,0.7)",
          }}
        >
          <span style={{ width: 22, height: 22, borderRadius: 99, background: "rgba(255,255,255,0.22)", display: "grid", placeItems: "center" }}>↑</span>+ R$ 4.750
          recuperados
        </span>
      </div>
    </div>
  );
}

const ARC = ["whatsapp", "gcal", "gmail", "sheets", "meet", "slack", "rd", "hubspot", "pix", "clicksign", "notion"];
function SceneConnect({ t }: { t: number }) {
  const hub = { x: W / 2, y: 330 };
  // a wide "smile" under the hub: ends higher, middle lower
  const nodes = ARC.map((id, i) => {
    const u = (i / (ARC.length - 1)) * 2 - 1;
    return { id, x: hub.x + u * 430, y: hub.y + 40 + (1 - u * u) * 110 };
  });
  return (
    <div class="absolute inset-0">
      <div class="absolute inset-x-0 flex flex-col items-center" style={{ top: 92 }}>
        <div style={enter(t, 150)}>
          <Mono style={{ color: "rgba(255,255,255,0.6)" }}>
            <span style={{ color: SKY }}>→ 04</span> / conecta em tudo
          </Mono>
        </div>
        <h2 style={{ ...H1, marginTop: 14, color: "#fff", textAlign: "center" }}>
          <Words text="Se a sua empresa usa," t={t} start={250} />
          <br />
          <Words text="os lobs usam." t={t} start={850} style={{ color: SKY }} />
        </h2>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n, i) => {
          const k = p(t, 900 + i * 90, 700);
          const len = Math.hypot(n.x - hub.x, n.y - hub.y);
          const pulse = ((t / 1400 + i * 0.37) % 1) * len;
          return (
            <g key={n.id} opacity={0.9}>
              <line
                x1={hub.x}
                y1={hub.y}
                x2={n.x}
                y2={n.y}
                stroke="rgba(150,200,255,0.35)"
                stroke-width="1.2"
                stroke-dasharray={len}
                stroke-dashoffset={len * (1 - k)}
              />
              {k >= 1 && (
                <circle
                  cx={hub.x + ((n.x - hub.x) * pulse) / len}
                  cy={hub.y + ((n.y - hub.y) * pulse) / len}
                  r="2.4"
                  fill="#9FD3FF"
                />
              )}
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const it = byId(n.id);
        return (
          <span key={n.id} style={{ position: "absolute", left: n.x - 24, top: n.y - 24, width: 48, textAlign: "center", ...pop(t, 1000 + i * 90) }}>
            <Tile it={it} size={48} />
            <span style={{ display: "block", marginTop: 6, fontSize: 10, color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap", marginLeft: -20, marginRight: -20 }}>
              {it.label}
            </span>
          </span>
        );
      })}
      <span
        style={{
          position: "absolute",
          left: hub.x - 62,
          top: hub.y - 62,
          width: 124,
          height: 124,
          borderRadius: "50%",
          background: "radial-gradient(circle, #fff 0%, #EAF4FF 70%)",
          boxShadow: "0 0 0 10px rgba(90,182,255,0.12), 0 0 60px 10px rgba(90,182,255,0.35)",
          display: "grid",
          placeItems: "center",
          ...pop(t, 500, 700),
        }}
      >
        <span style={{ width: 84, height: 76 }}>
          <Lob uid="reel-hub" still class="size-full overflow-visible" />
        </span>
      </span>
    </div>
  );
}

function ScenePanel({ t }: { t: number }) {
  const k = p(t, 300, 1800, easeInOut);
  const convs = Math.round(lerp(1170, 1284, k)).toLocaleString("pt-BR");
  const pct = Math.round(lerp(84, 92, k));
  const bars = [22, 30, 26, 38, 44, 40, 52, 58, 50, 66, 48, 36];
  const rows = [
    { name: "Rafa", color: "orange" as LobColor, text: "Consulta marcada para sexta, 9h", tag: "Resolvido", c: "#16A36A", bg: "#E5F8EE" },
    { name: "Alfredo", color: "green" as LobColor, text: "Voltou depois da ligação e fechou", tag: "Venda", c: BLUE, bg: "#E9F3FE" },
    { name: "Ana Clara", color: "pink" as LobColor, text: "Lead quente encaminhado para o Lucas", tag: "Com você", c: "#7A4FE0", bg: "#F1EAFE" },
  ];
  const tile: JSX.CSSProperties = { flex: 1, padding: "14px 16px", borderRadius: 12, background: "#F7FAFE", border: "1px solid #EEF3F9" };
  return (
    <div class="absolute inset-0">
      <div style={{ position: "absolute", left: 90, top: 70 }}>
        <div style={enter(t, 100)}>
          <Mono style={{ color: "#5D6E83" }}>
            <span style={{ color: BLUE }}>→ 05</span> / você no controle
          </Mono>
        </div>
        <h2 style={{ ...H1, marginTop: 12, color: "#0B1B2E" }}>
          <Words text="Tudo no" t={t} start={180} />
          <Words text="seu painel." t={t} start={420} style={{ color: BLUE }} />
        </h2>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 200,
          ...enter(t, 300, { y: 30 }),
          borderRadius: 16,
          background: "#fff",
          border: "1px solid #E1EBF6",
          boxShadow: "0 30px 70px -30px rgba(31,125,245,0.4)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, height: 30, padding: "0 12px", borderBottom: "1px solid #EEF3F9", background: "#FBFCFE" }}>
          <span style={{ width: 9, height: 9, borderRadius: 9, background: "#FF5F57" }} />
          <span style={{ width: 9, height: 9, borderRadius: 9, background: "#FEBC2E" }} />
          <span style={{ width: 9, height: 9, borderRadius: 9, background: "#28C840" }} />
          <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 11, color: "#94A3B8" }}>lobs · Painel</span>
        </div>
        <div style={{ display: "flex", gap: 10, padding: 14 }}>
          <div style={tile}>
            <div style={{ fontSize: 30, fontWeight: 600, color: "#0B1B2E", fontVariantNumeric: "tabular-nums" }}>{convs}</div>
            <div style={{ fontSize: 11, color: "#5D6E83" }}>conversas atendidas</div>
          </div>
          <div style={tile}>
            <div style={{ fontSize: 30, fontWeight: 600, color: BLUE, fontVariantNumeric: "tabular-nums" }}>{pct}%</div>
            <div style={{ fontSize: 11, color: "#5D6E83" }}>resolvidas pelos lobs</div>
          </div>
          <div style={tile}>
            <div style={{ fontSize: 30, fontWeight: 600, color: "#16A36A" }}>0</div>
            <div style={{ fontSize: 11, color: "#5D6E83" }}>clientes no vácuo</div>
          </div>
          <div style={{ ...tile, flex: 1.4 }}>
            <Mono style={{ fontSize: 8.5, color: "#94A3B8" }}>conversas por hora</Mono>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 44, marginTop: 8 }}>
              {bars.map((h, i) => (
                <span
                  key={i}
                  style={{
                    flex: 1,
                    borderRadius: 3,
                    height: h * 0.66 * p(t, 400 + i * 60, 600),
                    background: i === 9 ? BLUE : "#BFDBFE",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: "0 14px 10px" }}>
          {rows.map((r, i) => (
            <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, height: 34, borderTop: "1px solid #F1F5F9", ...enter(t, 1300 + i * 220, { y: 8 }) }}>
              <LobAvatar uid={`reel-row-${i}`} color={r.color} size={20} />
              <span style={{ width: 90, fontSize: 12, fontWeight: 600, color: "#0B1B2E" }}>{r.name}</span>
              <span style={{ fontSize: 12, color: "#5D6E83" }}>{r.text}</span>
              <span style={{ marginLeft: "auto", fontSize: 10.5, fontWeight: 500, color: r.c, background: r.bg, padding: "2px 9px", borderRadius: 999 }}>{r.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CHIPS = ["whatsapp", "gcal", "rd", "pix", "slack", "hubspot"];
function SceneOutro({ t }: { t: number }) {
  const clicked = t > 3350;
  const curK = p(t, 2300, 900, easeInOut);
  const btn = { x: W / 2, y: 452 };
  const cur = { x: lerp(btn.x + 260, btn.x + 70, curK), y: lerp(btn.y + 140, btn.y + 4, curK) };
  const press = between(t, 3250, 3420) ? 0.96 : 1;
  return (
    <div class="absolute inset-0 flex flex-col items-center" style={{ paddingTop: 96 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 56 }}>
        {LOB_LINEUP.map((c, i) => (
          <span key={c} style={{ width: c === "blue" ? 60 : 46, height: c === "blue" ? 54 : 42, ...pop(t, 100 + i * 90, 560) }}>
            <Lob color={c} uid={`reel-outro-${c}`} still class="size-full overflow-visible" />
          </span>
        ))}
      </div>
      <h2 style={{ ...H1, marginTop: 30, textAlign: "center", color: "#0B1B2E" }}>
        <Words text="Nenhum cliente fica" t={t} start={450} />
        <br />
        <Words text="sem resposta." t={t} start={850} style={{ color: BLUE }} />
      </h2>
      <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
        {CHIPS.map((id, i) => {
          const it = byId(id);
          return (
            <span
              key={id}
              style={{
                ...enter(t, 1300 + i * 80, { y: 6 }),
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px 4px 5px",
                borderRadius: 999,
                background: "#fff",
                border: "1px solid #E1EBF6",
                fontSize: 11.5,
                color: "#0B1B2E",
              }}
            >
              <span style={{ width: 16, height: 16, display: "grid", placeItems: "center" }}>{it.logo(16)}</span>
              {it.label}
            </span>
          );
        })}
      </div>
      <div
        style={{
          ...pop(t, 1800, 600),
          position: "absolute",
          left: btn.x - 130,
          top: btn.y - 26,
          width: 260,
          height: 52,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            height: "100%",
            padding: "0 8px 0 20px",
            borderRadius: 999,
            color: "#fff",
            fontSize: 16,
            fontWeight: 500,
            background: clicked ? "linear-gradient(#4ADE80, #16A34A)" : "linear-gradient(#5AB6FF 0%, #1F7DF5 58%, #1466E6 100%)",
            boxShadow: clicked ? "0 14px 30px -12px rgba(22,163,74,0.7)" : "0 14px 30px -12px rgba(31,125,245,0.75)",
            transform: `scale(${press})`,
            transition: "background .35s, box-shadow .35s, transform .12s",
          }}
        >
          <WhatsAppIcon class="size-5" />
          Falar com um lob
          <span style={{ marginLeft: "auto", width: 36, height: 36, borderRadius: 99, background: "rgba(255,255,255,0.22)", display: "grid", placeItems: "center" }}>
            {clicked ? <Check class="size-4" /> : "→"}
          </span>
        </span>
      </div>
      <Cursor x={cur.x} y={cur.y} style={{ opacity: p(t, 2300, 300) }} />
    </div>
  );
}

const RENDER: Record<SceneId, (props: { t: number }) => JSX.Element> = {
  lost: SceneLost,
  intro: SceneIntro,
  reply: SceneReply,
  resolve: SceneResolve,
  followup: SceneFollowup,
  connect: SceneConnect,
  panel: ScenePanel,
  outro: SceneOutro,
};

// ─── stage ───────────────────────────────────────────────────────────────────
function useStageScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, scale };
}

export default function Showreel({ t, onClick }: { t: number; onClick?: () => void }) {
  const { ref, scale } = useStageScale();
  const time = ((t % SHOWREEL_DURATION) + SHOWREEL_DURATION) % SHOWREEL_DURATION;
  const idx = STARTS.findIndex((s, i) => time >= s && time < s + SCENES[i].dur);
  const local = time - STARTS[idx];

  // background moods: blue for "resolve", navy for "connect"
  const sceneT = (id: SceneId) => time - STARTS[SCENES.findIndex((s) => s.id === id)];
  const blueT = sceneT("resolve");
  const blueIn = blueT >= -600 && blueT < 5500 ? p(blueT, -500, 700, easeInOut) : 0;
  const blueOut = blueT >= 5100 ? p(blueT, 5100, 400) : 0;
  const navyT = sceneT("connect");
  const navy = navyT >= -400 && navyT < 5000 ? p(navyT, -400, 500) * (1 - p(navyT, 4600, 400)) : 0;
  const darkText = blueIn - blueOut > 0.5 || navy > 0.5;

  const opacity = Math.min(p(local, 0, FADE), 1 - p(local, SCENES[idx].dur - FADE, FADE));
  const Scene = RENDER[SCENES[idx].id];

  return (
    <div ref={ref} class="relative w-full overflow-hidden" style={{ aspectRatio: `${W} / ${H}` }} onClick={onClick}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: "#F4F9FF",
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        {/* light backdrop: soft colour blobs + dotted grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(40% 50% at 12% 8%, rgba(116,185,246,0.35), transparent 70%), radial-gradient(35% 40% at 92% 20%, rgba(196,181,253,0.22), transparent 70%), radial-gradient(40% 40% at 60% 105%, rgba(134,239,172,0.22), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(31,125,245,0.16) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage: "radial-gradient(70% 70% at 50% 50%, transparent 30%, #000 100%)",
            WebkitMaskImage: "radial-gradient(70% 70% at 50% 50%, transparent 30%, #000 100%)",
          }}
        />
        {/* blue wipe (rises from the bottom) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, #5AB6FF 0%, #1F7DF5 45%, #1257D8 100%)",
            transform: `translateY(${(1 - blueIn) * 100}%)`,
            opacity: 1 - blueOut,
          }}
        />
        {/* navy */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: navy,
            background: "radial-gradient(60% 70% at 50% 70%, #16336B 0%, #0B1B3A 60%, #07122A 100%)",
          }}
        />

        <div key={SCENES[idx].id} style={{ position: "absolute", inset: 0, opacity }}>
          <Scene t={local} />
        </div>

        {/* frame chrome */}
        <div style={{ position: "absolute", left: 28, top: 22, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 22, height: 20 }}>
            <Lob uid="reel-chrome" still ticks={false} class="size-full" />
          </span>
          <Wordmark dark={darkText} style={{ fontSize: 17 }} />
        </div>
        <span style={{ position: "absolute", right: 28, top: 26, color: darkText ? "rgba(255,255,255,0.6)" : "#94A3B8", transition: "color .3s" }}>
          <Mono style={{ fontSize: 9 }}>agentes de IA · WhatsApp e voz</Mono>
        </span>
        <span style={{ position: "absolute", left: 28, bottom: 20, color: darkText ? "rgba(255,255,255,0.5)" : "#A3B1C2", transition: "color .3s" }}>
          <Mono style={{ fontSize: 9 }}>lobs</Mono>
        </span>
        <span style={{ position: "absolute", right: 28, bottom: 20, color: darkText ? "rgba(255,255,255,0.5)" : "#A3B1C2", transition: "color .3s" }}>
          <Mono style={{ fontSize: 9 }}>nenhum cliente fica sem resposta</Mono>
        </span>
      </div>
    </div>
  );
}
