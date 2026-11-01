import ConversasPanel from "./ConversasPanel";
import type { Step } from "./conversas-data";
import type { Nicho } from "../../variantes";

export type { Step };

/** A tela "Conversas" do painel do lobs, tocando as conversas da LP. `onStep` dispara a cada passo. */
export default function HeroChat({ onStep, nicho }: { onStep?: (step: Step) => void; nicho?: Nicho } = {}) {
  return <ConversasPanel variant="full" onStep={onStep} nicho={nicho} />;
}
