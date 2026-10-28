import { siGooglecalendar, siGooglemeet, siGooglesheets, siSlack, siWhatsapp } from "simple-icons";
import Lob, { LOBS } from "./Lob";
import { ROLES } from "./roles";

/** Where each lob floats around the hub (percent of the stage) and its float delay. */
const SPOTS = [
  { x: 50, y: 6, w: 17, d: 0 },
  { x: 14, y: 26, w: 13, d: -1.2 },
  { x: 86, y: 28, w: 13, d: -2.1 },
  { x: 20, y: 80, w: 12, d: -0.6 },
  { x: 80, y: 80, w: 12, d: -1.7 },
];

const TOOLS = [
  { name: "Google Agenda", icon: siGooglecalendar, x: 31, y: 12 },
  { name: "Slack", icon: siSlack, x: 72, y: 10 },
  { name: "Google Sheets", icon: siGooglesheets, x: 4, y: 54 },
  { name: "Google Meet", icon: siGooglemeet, x: 96, y: 56 },
  { name: "RD Station", icon: null, x: 50, y: 96 },
];

/** "Your lobs, connected": the five float around one WhatsApp number, tools orbiting. */
export default function LobsConectados() {
  return (
    <div class="relative mx-auto aspect-[4/5] w-full max-w-[1000px] sm:aspect-[16/10]">
      {/* colour glows behind each lob */}
      {ROLES.map((role, i) => (
        <div
          key={role.color}
          class="pointer-events-none absolute size-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ left: `${SPOTS[i].x}%`, top: `${SPOTS[i].y + 6}%`, background: LOBS[role.color].base, opacity: 0.13 }}
        />
      ))}

      {/* hub: one number, one voice */}
      <div class="absolute top-1/2 left-1/2 w-[62%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-line bg-surface p-5 shadow-[0_30px_60px_-30px_rgba(11,27,46,0.35)] sm:p-6">
        <div class="flex items-center gap-3">
          <span class="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white">
            <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
              <path d={siWhatsapp.path} />
            </svg>
          </span>
          <div>
            <p class="text-[15px] font-medium">Sua empresa</p>
            <p class="text-[12.5px] text-success">online agora</p>
          </div>
        </div>
        <div class="mt-4 space-y-2 text-[13.5px] leading-[20px]">
          <p class="w-fit max-w-[85%] rounded-2xl rounded-tl-md bg-surface-2 px-3 py-2">Oi! Tem horário amanhã à tarde?</p>
          <p class="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-bubble px-3 py-2">Tenho às 15h e às 16h30. Já deixo reservado e te mando a confirmação 🙂</p>
        </div>
        <div class="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-[12px] text-muted">
          <span class="flex -space-x-1.5">
            {ROLES.map((r) => (
              <span key={r.color} class="size-3.5 rounded-full ring-2 ring-white" style={{ background: LOBS[r.color].base }} />
            ))}
          </span>
          Cinco lobs por trás, uma voz só
        </div>
      </div>

      {ROLES.map((role, i) => (
        <div
          key={role.color}
          class="lob-float absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${SPOTS[i].x}%`, top: `${SPOTS[i].y + 6}%`, width: `${SPOTS[i].w}%`, animationDelay: `${SPOTS[i].d}s` }}
        >
          <Lob color={role.color} uid={`conn-${role.color}`} reach={700} class="w-full overflow-visible" title={`Lob ${role.area}`} />
        </div>
      ))}

      {TOOLS.map((t, i) => (
        <span
          key={t.name}
          class="lob-float absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] whitespace-nowrap shadow-[0_8px_20px_-14px_rgba(11,27,46,0.4)] sm:text-[13px]"
          style={{ left: `${t.x}%`, top: `${t.y}%`, animationDelay: `${-0.8 * i}s`, animationDuration: "7s" }}
        >
          {t.icon ? (
            <svg viewBox="0 0 24 24" class="size-3.5" fill={`#${t.icon.hex}`} aria-hidden="true">
              <path d={t.icon.path} />
            </svg>
          ) : (
            <span class="size-2.5 rounded-full" style={{ background: LOBS.purple.base }} />
          )}
          {t.name}
        </span>
      ))}
    </div>
  );
}
