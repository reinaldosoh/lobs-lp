import type { IconNode } from "lucide";
import { LOBS, type LobColor } from "./Lob";

/**
 * Feature icon in the lobs' visual language: a soft squircle with the same
 * light → base → shade volume as the lobs, and a white Lucide line icon on top.
 * Works statically from Astro (no client directive) and inside islands.
 */
export default function FeatureIcon({ icon, color, id, class: cls }: { icon: IconNode; color: LobColor; id: string; class?: string }) {
  const lob = LOBS[color];
  return (
    <svg viewBox="0 0 56 56" class={cls} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-fill`} cx="0.32" cy="0.25" r="0.85">
          <stop offset="0" stop-color={lob.light} />
          <stop offset="0.6" stop-color={lob.base} />
          <stop offset="1" stop-color={lob.dark} />
        </radialGradient>
        <radialGradient id={`${id}-shine`} cx="0.3" cy="0.22" r="0.45">
          <stop offset="0" stop-color="#fff" stop-opacity="0.35" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="52" height="52" rx="17" fill={`url(#${id}-fill)`} />
      <rect x="2" y="2" width="52" height="52" rx="17" fill={`url(#${id}-shine)`} />
      <rect x="2.5" y="2.5" width="51" height="51" rx="16.5" fill="none" stroke="#fff" stroke-opacity="0.28" />
      <g
        transform="translate(14 14) scale(1.1667)"
        fill="none"
        stroke="#fff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        {icon.map(([tag, attrs], i) => {
          const Tag = tag as "path";
          return <Tag key={i} {...(attrs as Record<string, string>)} />;
        })}
      </g>
    </svg>
  );
}
