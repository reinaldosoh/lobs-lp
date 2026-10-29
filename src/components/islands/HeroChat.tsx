import ConversasPanel from "./ConversasPanel";
import type { Step } from "./conversas-data";

export type { Step };

/** A tela "Conversas" do painel do lobs, tocando as conversas da LP. `onStep` dispara a cada passo. */
export default function HeroChat({ onStep }: { onStep?: (step: Step) => void } = {}) {
  return <ConversasPanel variant="full" onStep={onStep} />;
}
