import { useState } from "preact/hooks";
import { Check } from "./icons";
import Lob from "./Lob";
import { APP_URL } from "../../site";

type Ciclo = "mensal" | "anual";

type Plano = {
  nome: string;
  /** Código do plano no checkout (app.lobsbot.com.br/assinar?plano=<codigo>-<ciclo>). */
  codigo: string;
  desc: string;
  destaque?: boolean;
  mensal: string;
  anual: { parcelas: string; pix: string };
  itens: string[];
};

const PLANOS: Plano[] = [
  {
    nome: "Essencial",
    codigo: "essencial",
    desc: "O painel do lobs para a sua equipe atender.",
    mensal: "96",
    anual: { parcelas: "39,90", pix: "386" },
    itens: ["Conversas do WhatsApp no painel", "CRM e Kanban de clientes", "Campanhas e avisos no seu WhatsApp", "Sua equipe assume qualquer conversa"],
  },
  {
    nome: "Com IA",
    codigo: "lobs-ia",
    desc: "Tudo do Essencial, com os lobs atendendo por você.",
    destaque: true,
    mensal: "146",
    anual: { parcelas: "59,90", pix: "589" },
    itens: ["Tudo do plano Essencial", "Os lobs atendem 24h no WhatsApp", "Agendam, cobram e fazem follow-up sozinhos", "Ligações com voz natural", "Tudo registrado no painel"],
  },
];

export default function Planos({ notaComIa }: { notaComIa?: string }) {
  const [ciclo, setCiclo] = useState<Ciclo>("anual");
  return (
    <div>
      <div class="mx-auto flex w-fit rounded-full border border-line bg-surface p-1 text-[14px]" role="group" aria-label="Cobrança">
        {(["mensal", "anual"] as Ciclo[]).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={ciclo === c}
            onClick={() => setCiclo(c)}
            class={`rounded-full px-5 py-2 transition-colors ${ciclo === c ? "bg-ink text-white" : "text-muted"}`}
          >
            <span class="capitalize">{c}</span>
            {c === "anual" && <span class={`ml-1.5 text-[12px] ${ciclo === c ? "text-white/75" : "text-[#16a34a]"}`}>economize até 66%</span>}
          </button>
        ))}
      </div>
      <div class="mx-auto mt-8 grid max-w-[820px] gap-4 md:grid-cols-2">
        {PLANOS.map((p) => (
          <div
            key={p.nome}
            class={`relative flex flex-col rounded-3xl border bg-surface p-7 ${p.destaque ? "border-[#1f7df5]/50 shadow-[0_24px_60px_-28px_rgba(31,125,245,0.55)]" : "border-line"}`}
          >
            <div class="relative -mx-7 -mt-7 mb-6 h-[150px] overflow-hidden rounded-t-3xl bg-[radial-gradient(90%_70%_at_0%_100%,#8CC8FA_0%,transparent_60%),radial-gradient(80%_70%_at_100%_0%,#D6F4FF_0%,transparent_60%),linear-gradient(160deg,#EAF6FF_0%,#BFE2FF_55%,#93CBF8_100%)]">
              {p.destaque ? (
                <div class="absolute inset-x-0 -bottom-5 flex justify-center gap-1">
                  {(["orange", "green", "blue", "pink", "purple"] as const).map((c) => (
                    <Lob key={c} still ticks uid={`plano-${c}`} color={c} class="w-[78px]" />
                  ))}
                </div>
              ) : (
                <div class="absolute -bottom-5 left-1/2 w-[110px] -translate-x-1/2">
                  <Lob still ticks uid="plano-blue" color="blue" class="w-full" />
                </div>
              )}
              {p.destaque && <span class="absolute top-3 left-4 rounded-full bg-[#1f7df5] px-3 py-1 text-[12px] font-medium text-white">Mais popular</span>}
            </div>
            <h3 class="text-[20px] font-medium">{p.nome}</h3>
            <p class="mt-1 min-h-[48px] text-[15px] text-muted">{p.desc}</p>
            {ciclo === "mensal" ? (
              <p class="mt-6 flex items-baseline gap-1.5">
                <span class="text-[42px] leading-none font-medium tracking-[-0.02em]">R$ {p.mensal}</span>
                <span class="text-[15px] text-muted">/mês</span>
              </p>
            ) : (
              <div class="mt-6">
                <p class="flex items-baseline gap-1.5">
                  <span class="text-[15px] text-muted">12x de</span>
                  <span class="text-[42px] leading-none font-medium tracking-[-0.02em]">R$ {p.anual.parcelas}</span>
                </p>
                <p class="mt-2 text-[15px] text-muted">
                  ou <b class="font-medium text-ink">R$ {p.anual.pix}</b> à vista no Pix
                </p>
              </div>
            )}
            <div class="mt-6 flex flex-col gap-2.5">
              <a href={APP_URL} class="btn-glossy inline-flex h-12 items-center justify-center rounded-full px-6 text-[16px]">
                Testar grátis
              </a>
              <a href={`${APP_URL}/assinar?plano=${p.codigo}-${ciclo}`} class="inline-flex h-12 items-center justify-center rounded-full bg-surface-2 px-6 text-[16px] text-ink transition-colors hover:bg-[#dcebfb]">
                Assinar {p.nome}
              </a>
            </div>
            <ul class="mt-6 flex flex-col gap-2.5 text-[15px]">
              {p.itens.map((i) => (
                <li key={i} class="flex items-start gap-2.5">
                  <Check class="mt-0.5 size-4 shrink-0 text-[#16a34a]" />
                  {i}
                </li>
              ))}
            </ul>
            {p.destaque && notaComIa && <p class="mt-6 rounded-2xl bg-[#e7f9ee] px-4 py-3 text-[15px] font-medium text-[#13703a]">{notaComIa}</p>}
          </div>
        ))}
      </div>
      <p class="mt-6 text-center text-[14px] text-muted">Teste grátis, sem cartão de crédito. Cancele quando quiser.</p>
    </div>
  );
}
