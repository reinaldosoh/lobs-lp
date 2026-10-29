import { useState } from "preact/hooks";
import Lob from "./Lob";
import { Check, LoaderCircle, Plus, Search } from "./icons";

type Ferramenta = { nome: string; resumo: string };

/** Chip de ferramenta do plugin do lobs dentro do Claude (chamada de ferramenta, como ele mostra). */
function ChamadaClaude({ f }: { f: Ferramenta }) {
  return (
    <div class="my-1 flex items-center gap-2 rounded-xl border border-[#E8E2D6] bg-[#FAF9F5] px-3 py-2 text-[12.5px] text-[#5F5B52]">
      <Lob still ticks={false} uid={`cl-${f.nome}`} class="w-4 shrink-0" />
      <span class="min-w-0 flex-1 truncate">
        <b class="font-medium text-[#3D3929]">lobs</b> · {f.nome}
      </span>
      <Check class="size-3.5 shrink-0 text-[#3D3929]/60" />
    </div>
  );
}

function ClaudeJanela() {
  return (
    <div class="overflow-hidden rounded-2xl border border-[#E8E2D6] bg-[#FAF9F5] text-[#3D3929] shadow-[0_24px_60px_-28px_rgba(11,27,46,0.45)]">
      <div class="flex items-center gap-1.5 border-b border-[#E8E2D6] bg-[#F5F3EC] px-4 py-2.5">
        <span class="size-2.5 rounded-full bg-[#FF5F57]" /><span class="size-2.5 rounded-full bg-[#FEBC2E]" /><span class="size-2.5 rounded-full bg-[#28C840]" />
        <span class="ml-2 text-[12px] text-[#6B6757]">Claude</span>
      </div>
      <div class="flex flex-col gap-3 px-4 py-4 text-[14px] leading-[22px]">
        <div class="max-w-[85%] self-end rounded-2xl bg-[#F0EEE6] px-3.5 py-2">Como foram as conversas de hoje e quem precisa de mim?</div>
        <div>
          <ChamadaClaude f={{ nome: "listar_conversas", resumo: "" }} />
          <ChamadaClaude f={{ nome: "ver_funil_vendas", resumo: "" }} />
          <p class="mt-2 font-[ui-serif,Georgia,serif] text-[15px] leading-[23px]">
            Hoje os lobs atenderam <b>42 conversas</b>. Três leads estão quentes e a <b>Ana Clara</b> pediu para falar com a equipe. Há <b>R$ 6.250</b> em propostas abertas e 2 clientes parados.
          </p>
        </div>
        <div class="max-w-[85%] self-end rounded-2xl bg-[#F0EEE6] px-3.5 py-2">Assuma a conversa da Ana Clara e mande o lob confirmar a call de amanhã.</div>
        <div>
          <ChamadaClaude f={{ nome: "assumir_conversa", resumo: "" }} />
          <ChamadaClaude f={{ nome: "agenda_reservar", resumo: "" }} />
          <p class="mt-2 font-[ui-serif,Georgia,serif] text-[15px] leading-[23px]">Feito. A conversa está com você e a call com o Lucas ficou confirmada para amanhã às 10h.</p>
        </div>
      </div>
      <div class="m-3 mt-0 flex items-center gap-2 rounded-2xl border border-[#E8E2D6] bg-white px-3.5 py-2.5 text-[13.5px] text-[#8B8676]">
        <Plus class="size-4" /> Responder ao Claude…
      </div>
    </div>
  );
}

function ChamadaGpt({ nome, ok = true }: { nome: string; ok?: boolean }) {
  return (
    <div class="my-1 flex items-center gap-2 text-[12.5px] text-[#6e6e80]">
      {ok ? <Check class="size-3.5 text-[#10a37f]" /> : <LoaderCircle class="size-3.5 animate-spin" />}
      Usou o <b class="font-medium text-[#0d0d0d]">lobs</b> · {nome}
    </div>
  );
}

function GptJanela() {
  return (
    <div class="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white text-[#0d0d0d] shadow-[0_24px_60px_-28px_rgba(11,27,46,0.45)]">
      <div class="flex items-center gap-1.5 border-b border-[#ececec] bg-[#f9f9f9] px-4 py-2.5">
        <span class="size-2.5 rounded-full bg-[#FF5F57]" /><span class="size-2.5 rounded-full bg-[#FEBC2E]" /><span class="size-2.5 rounded-full bg-[#28C840]" />
        <span class="ml-2 text-[12px] text-[#6e6e80]">ChatGPT</span>
      </div>
      <div class="flex flex-col gap-3 px-4 py-4 text-[14px] leading-[22px]">
        <div class="max-w-[85%] self-end rounded-3xl bg-[#f4f4f4] px-4 py-2">Quais leads estão parados no funil de vendas?</div>
        <div>
          <ChamadaGpt nome="ver_funil_vendas" />
          <p class="mt-2">
            Há <b>2 clientes parados</b>: <b>Fernanda Costa</b> (R$ 690, 4 dias) e <b>Beatriz Lima</b> (R$ 2.400, 3 dias). Os outros 9 estão andando e os lobs já fizeram o follow-up de 3 deles.
          </p>
        </div>
        <div class="max-w-[85%] self-end rounded-3xl bg-[#f4f4f4] px-4 py-2">Peça para o lob chamar a Fernanda hoje à tarde.</div>
        <div>
          <ChamadaGpt nome="agendar_followup" />
          <p class="mt-2">Combinado. O lob vai retomar a conversa com a Fernanda hoje às 15h, no contexto do que já foi falado, e eu te aviso quando ela responder.</p>
        </div>
      </div>
      <div class="m-3 mt-0 flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-2.5 text-[13.5px] text-[#8e8ea0]">
        <Plus class="size-4" /> Pergunte alguma coisa
      </div>
    </div>
  );
}

export default function PluginTabs() {
  const [aba, setAba] = useState<"claude" | "chatgpt">("claude");
  return (
    <div class="grid items-stretch gap-4 lg:grid-cols-[1fr_1.15fr]">
      <div class="flex flex-col justify-center rounded-3xl border border-line bg-surface p-6 sm:p-10">
        <span class="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-medium text-[#1f7df5] ring-1 ring-line">
          <Lob still ticks={false} uid="pl0" class="w-4" /> Em breve
        </span>
        <h2 class="h-section mt-4 !text-left">Os lobs dentro do Claude e do ChatGPT</h2>
        <p class="mt-4 text-[16px] leading-[26px] text-ink/75 md:text-[18px] md:leading-[29px]">
          Com o plugin do lobs você conecta sua conta e conversa com eles na ferramenta de IA que já usa: pergunta como foi o dia, vê os leads do funil e assume ou devolve atendimentos, sem abrir o painel.
        </p>
        <div class="mt-6 flex flex-wrap gap-2 text-[15px]" role="tablist" aria-label="Escolha a ferramenta">
          {(["claude", "chatgpt"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={aba === t}
              onClick={() => setAba(t)}
              class={`rounded-full px-5 py-2 transition-colors ${aba === t ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:bg-surface-2"}`}
            >
              {t === "claude" ? "Claude" : "ChatGPT"}
            </button>
          ))}
        </div>
        <p class="mt-4 text-[14px] text-muted">Clique para ver como fica dentro de cada uma.</p>
      </div>
      <div class="relative min-h-[600px] overflow-hidden rounded-3xl border border-line bg-[radial-gradient(90%_70%_at_0%_100%,#8CC8FA_0%,transparent_60%),radial-gradient(80%_70%_at_100%_0%,#D6F4FF_0%,transparent_60%),linear-gradient(160deg,#EAF6FF_0%,#BFE2FF_55%,#93CBF8_100%)]">
        <div key={aba} class="animate-fade-up absolute inset-x-5 top-7 sm:inset-x-8">
          {aba === "claude" ? <ClaudeJanela /> : <GptJanela />}
        </div>
        <div class="pointer-events-none absolute -right-4 -bottom-10 w-[130px]"><Lob still ticks uid="pl2" color="purple" class="w-full" /></div>
        <div class="pointer-events-none absolute -bottom-10 left-2 w-[110px]"><Lob still ticks uid="pl3" color="pink" class="w-full" /></div>
      </div>
    </div>
  );
}
