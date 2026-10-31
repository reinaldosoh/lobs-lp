import { useState } from "preact/hooks";
import Lob from "./Lob";
import { siWhatsapp } from "simple-icons";
import { CADASTRO_URL, DEMO_WHATSAPP_URL, DEMO_PRONTO } from "../../site";

// Estimativa do documento do teste: contatos por semana × 4,3 semanas × % perdida × valor médio.
const PERDAS = [10, 20, 30];
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const num = (s: string) => Math.max(0, Number(s.replace(/\D/g, "")) || 0);

export default function Calculadora() {
  const [contatos, setContatos] = useState("10");
  const [valor, setValor] = useState("150");
  const [perda, setPerda] = useState(20);
  const total = Math.round(num(contatos) * 4.3 * (perda / 100) * num(valor));
  const campo = "mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-[17px] tabular-nums outline-none focus:border-[#1f7df5] focus:ring-2 focus:ring-[#1f7df5]/20";

  return (
    <div class="grid gap-4 md:grid-cols-[1.1fr_1fr]">
      <div class="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <label class="text-[15px] font-medium">
          Contatos novos por semana no WhatsApp
          <input class={campo} inputMode="numeric" value={contatos} onInput={(e) => setContatos(e.currentTarget.value)} />
        </label>
        <label class="text-[15px] font-medium">
          Valor médio de uma venda ou atendimento
          <span class="relative block">
            <span class="pointer-events-none absolute top-1/2 left-4 mt-1 -translate-y-1/2 text-[17px] text-muted">R$</span>
            <input class={`${campo} pl-11`} inputMode="numeric" value={valor} onInput={(e) => setValor(e.currentTarget.value)} />
          </span>
        </label>
        <div>
          <p class="text-[15px] font-medium">Quantos desses se perdem por demora ou falta de retorno</p>
          <div class="mt-2 grid grid-cols-3 gap-2" role="group">
            {PERDAS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={perda === p}
                onClick={() => setPerda(p)}
                class={`h-12 rounded-xl border text-[16px] tabular-nums transition-colors ${perda === p ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:bg-surface-2"}`}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      </div>
      <div class="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-8">
        <p class="text-[16px] text-white/70">Você pode estar deixando</p>
        <p class="mt-1 text-[44px] leading-[1.05] font-medium tracking-[-0.03em] tabular-nums sm:text-[56px]">{brl(total)}</p>
        <p class="mt-1 text-[16px] text-white/70">por mês na mesa.</p>
        <p class="mt-6 border-t border-white/15 pt-5 text-[15px] text-white/80">O plano com IA custa R$ 146/mês.</p>
        <a href={CADASTRO_URL} class="btn-glossy mt-6 inline-flex h-[52px] items-center justify-center rounded-full px-7 text-[17px]">
          Recuperar esses clientes
        </a>
        {DEMO_PRONTO && (
          <a href={DEMO_WHATSAPP_URL} target="_blank" rel="noopener" class="mt-2.5 inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-[17px] text-white transition-colors hover:bg-white/10">
            <svg viewBox="0 0 24 24" class="size-5 text-[#25D366]" fill="currentColor" aria-hidden="true"><path d={siWhatsapp.path} /></svg>
            Conversar com os lobs
          </a>
        )}
        <span class="absolute -top-3 -right-3 w-[84px]">
          <Lob still ticks uid="calc" color="orange" class="w-full" />
        </span>
      </div>
    </div>
  );
}
