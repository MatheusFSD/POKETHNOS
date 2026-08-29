import Card from './Card.jsx';
import TrainerAvatar from './TrainerAvatar.jsx';

export default function HandAndBand({ state, actions }) {
  const canEditBand = !state.pendingDecision && state.turnState === 'BUILDING_BAND';
  const p = state.players.find((pl) => pl.id === state.currentPlayerId);

  let bandNote = '';
  let bandValid = false;
  if (state.band.length > 0) {
    const first = state.band[0];
    const allSameColor = state.band.every((c) => c.regionId === first.regionId);
    const allSameClass = state.band.every((c) => c.cls === first.cls);
    bandValid = allSameColor || allSameClass;
    bandNote = bandValid
      ? `✔ Bando válido — ${allSameColor ? `Cor: ${first.regionId}` : ''}${allSameColor && allSameClass ? ' e ' : ''}${allSameClass ? `Classe: ${first.cls}` : ''}`
      : '✖ Inválido! Cartas devem ter a mesma cor OU a mesma classe.';
  }

  return (
    <div>
      {state.band.length > 0 && (
        <div className="band-area">
          <div className="band-label">BANDO EM FORMAÇÃO</div>
          <div className="band-cards">
            {state.band.map((c) => (
              <Card
                key={c.id}
                card={c}
                title="Clique para remover do Bando"
                onClick={canEditBand ? () => actions.removeFromBand(c.id) : undefined}
              />
            ))}
          </div>
          <div className={`note mt8 ${bandValid ? 'note-ok' : 'note-bad'}`}>{bandNote}</div>
        </div>
      )}

      <div className="hand-section">
        {/* o dono da mão, à esquerda das cartas que ele está segurando */}
        <div className="hand-player">
          <TrainerAvatar
            index={state.currentPlayerAvatar}
            size={300}
            className="hand-player-art"
          />
          <span className="hand-player-tag" style={{ '--pcolor': state.currentPlayerColor }}>
            {state.currentPlayerName}
          </span>
          <span className="hand-player-glory">{p ? p.glory : 0} ✦</span>
        </div>

        <div className="hand-main">
          <div className="hand-label">MÃO ({p ? p.handCount : 0}/10)</div>
          <div className="hand-cards" style={{ '--n': state.hand.length }}>
            {state.hand.map((c, i) => (
              <div className="hand-slot" key={c.id} style={{ '--i': i }}>
                <Card
                  card={c}
                  onClick={canEditBand ? () => actions.addToBand(c.id) : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
