/**
 * Métricas da LP no PostHog (D-042), para a jornada de cada cliente no admin do lobs:
 * - a chave pública vem do app (`/metricas.json`); sem ela, nada sai;
 * - os eventos vão pelo app (`app.lobsbot.com.br/ingest`), que tira o IP antes do PostHog;
 * - o id anônimo fica num cookie de `.lobsbot.com.br`: quando a pessoa cria a conta no app, a
 *   visita na LP vira dela (o painel faz `identify`);
 * - páginas vistas, saída (com o quanto rolou), seções vistas e cliques nos botões, com um rótulo
 *   fechado (nunca texto digitado); sem gravação de tela e sem autocapture.
 * Carrega depois da página (não atrasa a LP).
 */
const APP = "https://app.lobsbot.com.br";

type Captura = (evento: string, props?: Record<string, string | number | boolean>) => void;

/** O que o clique quer dizer, pelo destino do link (lista fechada). */
function alvoDoLink(a: HTMLAnchorElement): string | null {
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("#")) return href === "#planos" ? "planos" : `secao:${href.slice(1, 40)}`;
  let u: URL;
  try {
    u = new URL(a.href);
  } catch {
    return null;
  }
  if (u.origin === APP) {
    if (u.pathname.startsWith("/assinar")) return `assinar:${(u.searchParams.get("plano") ?? "").slice(0, 40)}`;
    if (u.pathname === "/" || u.pathname === "") return a.textContent?.includes("Entrar") ? "entrar" : "testar_gratis";
    if (u.pathname.startsWith("/termos")) return "termos";
    if (u.pathname.startsWith("/privacidade")) return "privacidade";
    return "app";
  }
  if (u.hostname.includes("wa.me") || u.hostname.includes("whatsapp")) return "whatsapp";
  if (u.protocol === "mailto:") return "email";
  return null;
}

async function iniciar(): Promise<void> {
  let chave = "";
  try {
    const r = await fetch(`${APP}/metricas.json`, { credentials: "omit" });
    if (r.ok) chave = String(((await r.json()) as { chave?: unknown }).chave ?? "");
  } catch {
    return;
  }
  if (!/^phc_[A-Za-z0-9]{20,80}$/.test(chave)) return;
  const { default: posthog } = await import("posthog-js");
  posthog.init(chave, {
    api_host: `${APP}/ingest`,
    ui_host: "https://us.posthog.com",
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
    disable_surveys: true,
    disable_external_dependency_loading: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    person_profiles: "identified_only",
    persistence: "localStorage+cookie",
    cross_subdomain_cookie: true,
    request_batching: false,
    ip: false,
  });
  posthog.register({ lp_variante: document.documentElement.dataset.variante ?? "a" });
  const capturar: Captura = (e, p) => posthog.capture(e, p, { transport: "sendBeacon" });

  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const alvo = alvoDoLink(a);
      if (alvo) capturar("lp_clique", { alvo });
    },
    true,
  );

  const vistas = new Set<string>();
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const en of entradas) {
        const id = (en.target as HTMLElement).id;
        if (!en.isIntersecting || vistas.has(id)) continue;
        vistas.add(id);
        capturar(id === "planos" ? "lp_planos_vistos" : "lp_secao_vista", { secao: id.slice(0, 40) });
      }
    },
    { threshold: 0.35 },
  );
  for (const s of document.querySelectorAll<HTMLElement>("section[id]")) observador.observe(s);
}

const depois = () => void iniciar();
if ("requestIdleCallback" in window) (window as Window).requestIdleCallback(depois, { timeout: 2500 });
else setTimeout(depois, 1200);
