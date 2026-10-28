import type { Ref } from "preact";
import { useRef } from "preact/hooks";
import { useLivelyEyes } from "./eyes";

type EyeSpec = { x: number; y: number };
type LobSpec = {
  name: string;
  light: string;
  base: string;
  dark: string;
  tick: string;
  body: string;
  /** Rotation (deg) of body + eyes around the lob's centre. */
  tilt: number;
  eyes: [EyeSpec, EyeSpec];
  /** Eye slant (deg, positive = top leans right). */
  eyeTilt: number;
  /** The two "!!" strokes. */
  ticks: [string, string];
};

/** The five lobs, each with its own silhouette, drawn in a 200×200 box. */
export const LOBS: Record<"blue" | "orange" | "green" | "pink" | "purple", LobSpec> = {
  orange: {
    name: "Lob laranja",
    light: "#FFB23D",
    base: "#FF8A0F",
    dark: "#E85F00",
    tick: "#FFB21F",
    // fluffy cloud
    body: "M44 166A28 28 0 0 1 30 116A40 40 0 0 1 96 72A32 32 0 0 1 150 96A30 30 0 0 1 166 152A26 26 0 0 1 120 178A28 28 0 0 1 72 180A22 22 0 0 1 44 166Z",
    tilt: 0,
    eyes: [
      { x: 82, y: 134 },
      { x: 114, y: 134 },
    ],
    eyeTilt: 10,
    ticks: ["M56 30L64 54", "M24 58L42 70"],
  },
  green: {
    name: "Lob verde",
    light: "#86F06A",
    base: "#3FCB2E",
    dark: "#1E9A22",
    tick: "#5FDB3A",
    // soft, squishy cube leaning back
    body: "M70 74C110 72 130 72 140 74C162 78 170 92 170 116L170 146C170 170 158 182 134 182L66 182C42 182 30 170 30 146L30 114C30 90 44 76 70 74Z",
    tilt: -9,
    eyes: [
      { x: 90, y: 126 },
      { x: 122, y: 123 },
    ],
    eyeTilt: 16,
    ticks: ["M150 34L144 58", "M168 66L184 54"],
  },
  blue: {
    name: "Lob azul",
    light: "#5AB6FF",
    base: "#1F7DF5",
    dark: "#0B52D8",
    tick: "#3AA8FF",
    // big round blob with a little shoulder on the left
    body: "M30 168C16 154 18 128 36 120C32 94 50 66 92 58C140 50 180 84 182 126C184 162 164 182 122 182L66 182C48 182 38 178 30 168Z",
    tilt: 0,
    eyes: [
      { x: 110, y: 118 },
      { x: 144, y: 116 },
    ],
    eyeTilt: -4,
    ticks: ["M150 26L143 50", "M166 60L184 48"],
  },
  pink: {
    name: "Lob rosa",
    light: "#FF7CC0",
    base: "#FF2E93",
    dark: "#DC0F6E",
    tick: "#FF4FA6",
    // rounded triangle
    body: "M96 62C104 48 122 46 130 60C148 92 162 120 172 146C180 168 170 182 148 182L52 182C30 182 22 168 32 148C48 116 74 92 96 62Z",
    tilt: 0,
    eyes: [
      { x: 100, y: 136 },
      { x: 130, y: 134 },
    ],
    eyeTilt: 10,
    ticks: ["M152 50L146 72", "M166 84L182 74"],
  },
  purple: {
    name: "Lob roxo",
    light: "#C68BFF",
    base: "#9A4CF5",
    dark: "#6E24DE",
    tick: "#A45CFF",
    // low peanut: head bump on top, wide lobe on the right
    body: "M40 176C20 170 16 146 32 132C26 108 42 86 70 84C84 64 116 62 132 82C140 92 142 100 144 106C168 108 184 128 182 152C180 172 166 182 144 182L64 182C54 182 46 180 40 176Z",
    tilt: 0,
    eyes: [
      { x: 106, y: 140 },
      { x: 138, y: 138 },
    ],
    eyeTilt: 6,
    ticks: ["M150 46L144 70", "M166 80L182 68"],
  },
};
export type LobColor = keyof typeof LOBS;
/** Order of the lineup in the brand art (left → right). */
export const LOB_LINEUP: LobColor[] = ["orange", "green", "blue", "pink", "purple"];
/** Order used when cycling through them. */
export const LOB_ORDER: LobColor[] = ["blue", "orange", "green", "pink", "purple"];

type BodyProps = {
  uid: string;
  color?: LobColor;
  ticks?: boolean;
  /** Line-art version, stroked in the lob's own colour (or `outlineColor`). */
  outline?: boolean;
  outlineColor?: string;
  strokeWidth?: number;
  outlineBg?: string;
  eyesRef?: Ref<SVGGElement>;
  blinkRefs?: { current: (SVGGElement | null)[] };
};

/** One lob as an SVG group (200×200 user units). Compose it inside any <svg>. */
export function LobBody({
  uid,
  color = "blue",
  ticks = true,
  outline = false,
  strokeWidth = 0.6,
  outlineBg = "var(--bg)",
  outlineColor,
  eyesRef,
  blinkRefs,
}: BodyProps) {
  const lob = LOBS[color];
  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;
  const ink = outlineColor ?? lob.base;

  const eyes = (
    <g ref={eyesRef}>
      {lob.eyes.map(({ x, y }, i) => (
        <g
          key={i}
          class="eye-blink"
          ref={(el) => {
            if (blinkRefs) blinkRefs.current[i] = el;
          }}
        >
          <g transform={`rotate(${lob.eyeTilt} ${x} ${y})`}>
            {outline ? (
              <rect x={x - 7.5} y={y - 15} width="15" height="30" rx="7.5" fill={ink} fill-opacity="0.1" stroke={ink} stroke-width={strokeWidth} />
            ) : (
              <>
                {/* soft darker rim (gradient, no filter) so the slot looks pressed in */}
                <rect x={x - 11} y={y - 19} width="22" height="38" rx="11" fill={url("eyeRim")} />
                <rect x={x - 7.5} y={y - 15} width="15" height="30" rx="7.5" fill={url("eye")} />
              </>
            )}
          </g>
        </g>
      ))}
    </g>
  );

  const tickMarks =
    ticks &&
    (outline ? (
      // outlined capsules: a fat stroke in ink, hollowed out by a slightly thinner one in the background colour
      <g class="lob-ticks" stroke-linecap="round" fill="none">
        {lob.ticks.map((d, i) => {
          const w = i === 0 ? 11 : 10;
          return (
            <g key={i}>
              <path d={d} stroke={ink} stroke-width={w + strokeWidth} />
              <path d={d} stroke={outlineBg} stroke-width={w - strokeWidth} />
              <path d={d} stroke={ink} stroke-opacity="0.1" stroke-width={w - strokeWidth} />
            </g>
          );
        })}
      </g>
    ) : (
      <g class="lob-ticks" stroke={lob.tick} stroke-linecap="round" fill="none">
        <path d={lob.ticks[0]} stroke-width="11" />
        <path d={lob.ticks[1]} stroke-width="10" />
      </g>
    ));

  if (outline) {
    return (
      <g>
        {tickMarks}
        <g transform={`rotate(${lob.tilt} 100 128)`}>
          <path d={lob.body} fill={outlineBg} />
          <path d={lob.body} fill={ink} fill-opacity="0.05" stroke={ink} stroke-width={strokeWidth} stroke-linejoin="round" />
          {eyes}
        </g>
      </g>
    );
  }

  return (
    <g>
      <defs>
        <radialGradient id={id("fill")} cx="0.38" cy="0.28" r="0.8">
          <stop offset="0" stop-color={lob.light} />
          <stop offset="0.55" stop-color={lob.base} />
          <stop offset="1" stop-color={lob.dark} />
        </radialGradient>
        <radialGradient id={id("rim")} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.7" stop-color="#000" stop-opacity="0" />
          <stop offset="1" stop-color="#0A1030" stop-opacity="0.16" />
        </radialGradient>
        {/* soft highlight on the upper left, kept inside the silhouette */}
        <radialGradient id={id("shine")} cx="0.36" cy="0.3" r="0.42">
          <stop offset="0" stop-color="#fff" stop-opacity="0.32" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
        <radialGradient id={id("eyeRim")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.62" stop-color={lob.dark} stop-opacity="0.55" />
          <stop offset="1" stop-color={lob.dark} stop-opacity="0" />
        </radialGradient>
        <linearGradient id={id("eye")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1D1830" />
          <stop offset="1" stop-color="#07050D" />
        </linearGradient>
      </defs>

      {tickMarks}

      <g transform={`rotate(${lob.tilt} 100 128)`}>
        <path d={lob.body} fill={url("fill")} />
        <path d={lob.body} fill={url("rim")} />
        <path d={lob.body} fill={url("shine")} />
        {eyes}
      </g>
    </g>
  );
}

type LobProps = Omit<BodyProps, "eyesRef" | "blinkRefs"> & {
  class?: string;
  title?: string;
  /** Static lob: no eye tracking, no blinking. */
  still?: boolean;
  /** Pointer distance (px) at which the eyes reach full offset. */
  reach?: number;
};

export const LOB_VIEWBOX = "6 14 190 172";

/** Standalone lob whose eyes follow the pointer and blink. */
export default function Lob({ class: cls, title, still = false, reach = 320, ...body }: LobProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const blinkRefs = useLivelyEyes(
    svgRef,
    (x, y) => eyesRef.current?.setAttribute("transform", `translate(${(4.5 * x).toFixed(2)} ${(2.5 * y).toFixed(2)})`),
    { reach, still },
  );

  return (
    <svg
      ref={svgRef}
      viewBox={LOB_VIEWBOX}
      class={cls}
      role="img"
      aria-label={title ?? LOBS[body.color ?? "blue"].name}
      overflow="visible"
    >
      <LobBody {...body} eyesRef={eyesRef} blinkRefs={blinkRefs} />
    </svg>
  );
}

const LINEUP: Record<LobColor, { x: number; y: number; s: number }> = {
  orange: { x: 10, y: 70, s: 1.25 },
  green: { x: 190, y: 66, s: 1.25 },
  blue: { x: 340, y: 10, s: 1.65 },
  pink: { x: 590, y: 56, s: 1.3 },
  purple: { x: 760, y: 70, s: 1.25 },
};

/** The five lobs side by side, as in the brand art (1000×300). */
export function LobsLineup({ uid = "lineup", class: cls }: { uid?: string; class?: string }) {
  return (
    <svg viewBox="0 0 1000 300" class={cls} role="img" aria-label="Os cinco lobs" overflow="visible">
      {/* blue is drawn last so it sits in front, as in the brand art */}
      {(["orange", "green", "pink", "purple", "blue"] as LobColor[]).map((color) => {
        const p = LINEUP[color];
        return (
          <g key={color} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
            <LobBody uid={`${uid}-${color}`} color={color} />
          </g>
        );
      })}
    </svg>
  );
}
