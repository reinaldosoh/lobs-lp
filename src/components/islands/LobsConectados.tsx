import { siGooglecalendar, siGooglemeet, siGooglesheets, siSlack, siWhatsapp } from "simple-icons";
import Lob, { LOBS } from "./Lob";
import type { LobColor } from "./Lob";

type Icon = { hex: string; path: string } | null;
type Item = { cor: LobColor; nome: string; tools: { n: string; i: Icon }[]; texto: string; delay: number };

const ESQUERDA: Item[] = [
  {
    cor: "orange",
    nome: "Lob Agenda",
    tools: [{ n: "Google Agenda", i: siGooglecalendar }, { n: "Google Meet", i: siGooglemeet }],
    texto: "Acha o horário, marca, remarca e confirma. Se for online, já cria a call no Google Meet.",
    delay: -1.2,
  },
  {
    cor: "green",
    nome: "Lob Financeiro",
    tools: [{ n: "Google Sheets", i: siGooglesheets }],
    texto: "Registra pagamentos e metas na sua planilha e mostra quanto falta para fechar o mês.",
    delay: -2.1,
  },
];
const DIREITA: Item[] = [
  {
    cor: "pink",
    nome: "Lob Relacionamento",
    tools: [{ n: "RD Station", i: null }],
    texto: "Qualifica o lead, atualiza o funil e chama de volta quem sumiu, sem ninguém preencher nada.",
    delay: -0.6,
  },
  {
    cor: "purple",
    nome: "Lob Integrações",
    tools: [{ n: "Slack", i: siSlack }],
    texto: "Avisa o seu time no Slack com o resumo da conversa e liga tudo ao que você já usa.",
    delay: -1.7,
  },
];

function Linha({ it }: { it: Item }) {
  return (
    <div class="flex items-center gap-4">
      <div class="lob-float w-[84px] shrink-0 sm:w-[96px]" style={{ animationDelay: `${it.delay}s` }}>
        <Lob color={it.cor} uid={`conn-${it.cor}`} reach={700} class="w-full overflow-visible" title={it.nome} />
      </div>
      <div class="min-w-0">
        <h3 class="text-[17px] font-medium">{it.nome}</h3>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          {it.tools.map((t) => (
            <span key={t.n} class="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[12.5px]">
              {t.i ? (
                <svg viewBox="0 0 24 24" class="size-3.5" fill={`#${t.i.hex}`} aria-hidden="true">
                  <path d={t.i.path} />
                </svg>
              ) : (
                <span class="size-2.5 rounded-full" style={{ background: LOBS.purple.base }} />
              )}
              {t.n}
            </span>
          ))}
        </div>
        <p class="mt-2 text-[14px] leading-[22px] text-ink/75">{it.texto}</p>
      </div>
    </div>
  );
}

/** "Seus lobs, conectados": um card só. O Atendimento fala no WhatsApp; cada outro lob controla a sua ferramenta. */
export default function LobsConectados() {
  return (
    <div class="relative mx-auto max-w-[1100px] rounded-[32px] border border-line bg-surface p-6 sm:p-10">
      <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      <div class="pointer-events-none absolute -top-24 -left-24 size-[360px] rounded-full opacity-[0.14] blur-3xl" style={{ background: LOBS.orange.base }} />
      <div class="pointer-events-none absolute -right-24 -bottom-24 size-[360px] rounded-full opacity-[0.14] blur-3xl" style={{ background: LOBS.purple.base }} />
      <div class="pointer-events-none absolute top-1/2 left-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl" style={{ background: LOBS.blue.base }} />
      </div>

      <div class="relative grid items-center gap-8 lg:grid-cols-[1fr_340px_1fr] lg:gap-10">
        <div class="order-2 flex flex-col gap-8 lg:order-1">{ESQUERDA.map((it) => <Linha key={it.cor} it={it} />)}</div>

        <div class="order-1 mx-auto w-full max-w-[360px] lg:order-2">
          <div class="relative rounded-[24px] border border-line bg-white p-5 pt-12 shadow-[0_30px_60px_-30px_rgba(11,27,46,0.35)]">
            <div class="lob-float absolute -top-10 left-1/2 w-[92px] -translate-x-1/2">
              <Lob color="blue" uid="conn-blue" reach={700} class="w-full overflow-visible" title="Lob Atendimento" />
            </div>
            <div class="flex items-center gap-3">
              <span class="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                <svg viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
                  <path d={siWhatsapp.path} />
                </svg>
              </span>
              <div>
                <p class="text-[15px] font-medium">Sua empresa</p>
                <p class="text-[12.5px] text-success">online agora · Lob Atendimento</p>
              </div>
            </div>
            <div class="mt-4 space-y-2 text-[13.5px] leading-[20px]">
              <p class="w-fit max-w-[85%] rounded-2xl rounded-tl-md bg-surface-2 px-3 py-2">Oi! Tem horário amanhã à tarde?</p>
              <p class="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-bubble px-3 py-2">Tenho às 15h e às 16h30. Já deixo reservado e te mando a confirmação 🙂</p>
            </div>
            <div class="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-[12px] text-muted">
              <span class="flex -space-x-1.5">
                {(["blue", "orange", "green", "pink", "purple"] as LobColor[]).map((c) => (
                  <span key={c} class="size-3.5 rounded-full ring-2 ring-white" style={{ background: LOBS[c].base }} />
                ))}
              </span>
              Cinco lobs por trás, uma voz só
            </div>
          </div>
        </div>

        <div class="order-3 flex flex-col gap-8">{DIREITA.map((it) => <Linha key={it.cor} it={it} />)}</div>
      </div>
    </div>
  );
}
