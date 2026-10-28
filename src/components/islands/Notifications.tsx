import Lob, { LOB_ORDER } from "./Lob";
import { WhatsAppIcon } from "./icons";
import { useTick } from "./shared";

const MESSAGES = [
  "🔥 Lead quente: Ana quer fechar hoje. Já mandei a proposta.",
  "🙋 Ricardo pediu pra falar com uma pessoa. Te passei a conversa.",
  "📊 Resumo do dia: 42 atendimentos, 38 resolvidos sem você.",
  "💰 Pagamento confirmado: R$ 1.290 de Antônio Carlos.",
  "📞 Liguei pro Marcos e remarquei a visita pra quinta às 10h.",
  "⏰ 3 leads sem resposta há 1 dia. Faço o follow-up amanhã às 9h.",
];
const AGES = ["agora", "2 min", "5 min", "9 min"];

export default function Notifications() {
  const { ref, tick } = useTick<HTMLDivElement>(2200);
  // Stack of the 4 latest notifications; the newest enters on top.
  const stack = Array.from({ length: 4 }, (_, i) => tick - i).filter((n) => n > -4);

  return (
    <div ref={ref} class="relative h-[150px] w-full max-w-[360px]">
      {stack.map((n, i) => (
        <div
          key={n}
          class={`absolute inset-x-0 top-0 rounded-2xl border border-line bg-white p-3 shadow-[0_14px_34px_-16px_rgba(11,27,46,0.35)] backdrop-blur transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${i === 0 ? "animate-fade-up" : ""}`}
          style={{
            transform: `translateY(${16 * i}px) scale(${1 - 0.06 * i})`,
            transformOrigin: "top center",
            opacity: i >= 3 ? 0 : 1 - 0.28 * i,
            zIndex: 10 - i,
          }}
        >
          <div class="transition-opacity duration-300" style={{ opacity: i === 0 ? 1 : 0 }}>
            <div class="flex items-center gap-1.5 text-[11px] text-muted">
              <span class="grid size-4 place-items-center rounded-[5px] bg-[#25D366]">
                <WhatsAppIcon class="size-2.5 text-white" />
              </span>
              WHATSAPP
              <span class="ml-auto">{AGES[i]}</span>
            </div>
            <div class="mt-1.5 flex items-start gap-2">
              <span class="grid size-7 shrink-0 place-items-center rounded-full bg-zappy-ice">
                <Lob still ticks={false} color={LOB_ORDER[((n % 5) + 5) % 5]} uid={`notif-${n}`} class="size-6" />
              </span>
              <span class="min-w-0">
                <span class="block text-[12.5px] font-medium">Lobs</span>
                <span class="block text-[12.5px] leading-[18px] text-ink/85">
                  {MESSAGES[((n % MESSAGES.length) + MESSAGES.length) % MESSAGES.length]}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
