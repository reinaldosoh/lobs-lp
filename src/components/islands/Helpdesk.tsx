import ConversasPanel from "./ConversasPanel";
import { PanelFrame, ScaleToFit } from "./shared";

/** A aba Help desk da janela "lobs · Painel": a mesma tela de Conversas, sem a ficha, em miniatura. */
export default function Helpdesk() {
  return (
    <ScaleToFit width={650}>
      <PanelFrame title="lobs · Painel" active="helpdesk">
        <ConversasPanel variant="mini" autoAdvance />
      </PanelFrame>
    </ScaleToFit>
  );
}
