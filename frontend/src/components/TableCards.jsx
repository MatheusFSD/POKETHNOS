import { useRef } from 'react';
import Card from './Card.jsx';
import { flyCard, handTarget } from '../animations/flyCard.js';

export default function TableCards({ state, actions, canRecruit }) {
  const deckClickable = canRecruit && state.deckCount > 0;
  // trava o clique durante o voo: sem isso dá para recrutar duas cartas
  // dentro da janela da animação
  const flyingRef = useRef(false);

  /** Levanta a carta clicada até a mão e só então deixa o turno virar. */
  const recruit = (event, callAction) => {
    if (flyingRef.current) return;
    flyingRef.current = true;
    const flight = flyCard(event.currentTarget, handTarget());
    callAction(flight).finally(() => { flyingRef.current = false; });
  };

  return (
    <div className="table-section">
      <div className="section-title">CARTAS NA MESA</div>
      <div className="table-stage">
        <div className="table-surface">
          <div className="table-cards">
            <div
              className={`deck-card${deckClickable ? ' clickable' : ''}${state.deckCount === 0 ? ' empty' : ''}`}
              onClick={deckClickable ? (e) => recruit(e, (gate) => actions.recruitDeck(gate)) : undefined}
              title={state.deckCount === 0 ? 'Baralho vazio' : (deckClickable ? 'Sacar do Deck' : undefined)}
            >
              <div className="deck-count">{state.deckCount} cartas</div>
            </div>
            {state.tableCards.map((c) => (
              <Card
                key={c.id}
                card={c}
                onClick={canRecruit ? (e) => recruit(e, (gate) => actions.recruitTable(c.id, gate)) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
