import Card from './Card.jsx';

export default function TableCards({ state, actions, canRecruit }) {
  const deckClickable = canRecruit && state.deckCount > 0;

  return (
    <div className="table-section">
      <div className="section-title">CARTAS NA MESA</div>
      <div className="flex-row">
        <div
          className={`deck-card${deckClickable ? ' clickable' : ''}${state.deckCount === 0 ? ' empty' : ''}`}
          onClick={deckClickable ? actions.recruitDeck : undefined}
          title={state.deckCount === 0 ? 'Baralho vazio' : (deckClickable ? 'Sacar do Deck' : undefined)}
        >
          <div className="deck-count">{state.deckCount} cartas</div>
        </div>
        {state.tableCards.map((c) => (
          <Card
            key={c.id}
            card={c}
            onClick={canRecruit ? () => actions.recruitTable(c.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
