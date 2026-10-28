import Lob, { LOB_ORDER } from "./Lob";
import { Check, WhatsAppIcon } from "./icons";
import { useTick } from "./shared";

const CAMPAIGNS = [
  { name: "Reativação de clientes", total: 312 },
  { name: "Oferta de aniversário", total: 248 },
  { name: "Pesquisa de satisfação", total: 405 },
];
const REPLIES: [string, string][] = [
  ["Carla", "Quero sim! 🙌"],
  ["João", "Ainda tem horário essa semana?"],
  ["Bia", "Me manda os valores"],
  ["Rodrigo", "Pode reservar pra mim"],
  ["Fernanda", "Adorei, obrigada!"],
  ["Lucas", "Qual o prazo?"],
  ["Paula", "Tenho interesse 😍"],
];

export default function Campaigns() {
  const { ref, tick } = useTick<HTMLDivElement>(1200);
  // Each campaign runs for 10 ticks: 8 sending, then "Concluída".
  const round = Math.floor(tick / 10);
  const phase = tick % 10;
  const campaign = CAMPAIGNS[round % CAMPAIGNS.length];
  const progress = Math.min(1, (phase + 1) / 8);
  const sent = Math.round(campaign.total * progress);
  const read = Math.round(0.82 * sent);
  const replied = Math.round(0.16 * sent);
  const visibleReplies = Array.from({ length: Math.min(phase, 7) }, (_, i) => i).slice(-3);

  return (
    <div ref={ref} class="flex w-full max-w-[360px] flex-col items-stretch gap-2.5">
      <div class="rounded-2xl border border-line bg-white p-3.5 shadow-[0_12px_30px_-18px_rgba(11,27,46,0.35)]">
        <div class="flex items-center gap-2">
          <span class="grid size-7 place-items-center rounded-full bg-[#E7F9EE]">
            <WhatsAppIcon class="size-4 text-[#25D366]" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-[13px] font-medium">{campaign.name}</span>
            <span class="block text-[11px] text-muted">Campanha no WhatsApp</span>
          </span>
          {phase >= 8 ? (
            <span class="inline-flex items-center gap-1 rounded-full bg-[#E5F8EE] px-2 py-0.5 text-[11px] text-success">
              <Check class="size-3" /> Concluída
            </span>
          ) : (
            <span class="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-zappy-strong">Enviando</span>
          )}
        </div>
        <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            class="h-full rounded-full bg-zappy transition-[width] duration-[1100ms] ease-linear"
            style={{ width: `${100 * progress}%` }}
          />
        </div>
        <dl class="mt-3 grid grid-cols-3 text-center">
          {(
            [
              ["Enviadas", sent],
              ["Lidas", read],
              ["Responderam", replied],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt class="text-[16px] leading-5 font-medium tabular-nums">{value}</dt>
              <dd class="text-[11px] text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div class="flex h-[104px] flex-col justify-start gap-1.5 overflow-hidden">
        {visibleReplies.map((n, i) => {
          const [who, text] = REPLIES[(3 * round + n) % REPLIES.length];
          const last = visibleReplies.length - 1;
          return (
            <div
              key={`${round}-${n}`}
              class="animate-fade-up flex items-center gap-2 rounded-full border border-line bg-white py-1 pr-1 pl-3 text-[12px] transition-opacity duration-500"
              style={{ opacity: i === last ? 1 : i === last - 1 ? 0.7 : 0.4 }}
            >
              <span class="min-w-0 flex-1 truncate">
                <span class="font-medium">{who}:</span> <span class="text-ink/80">{text}</span>
              </span>
              <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-2 py-0.5 pr-2 pl-1 text-[10px] text-zappy-strong">
                <Lob still ticks={false} color={LOB_ORDER[n % LOB_ORDER.length]} uid={`camp-${n}`} class="size-3.5" /> respondendo
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
