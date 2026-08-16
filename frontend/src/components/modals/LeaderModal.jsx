import ModalShell from './ModalShell.jsx';
import CardRow from '../CardRow.jsx';

export default function LeaderModal({ decision, onChoose }) {
  return (
    <ModalShell title="👑 ESCOLHA O LÍDER">
      <p>Selecione 1 carta do Bando para ser o Líder.</p>
      <div className="selectable-card-row">
        <CardRow cards={decision.leaderOptions} onCardClick={(c) => onChoose(c.id)} />
      </div>
    </ModalShell>
  );
}
