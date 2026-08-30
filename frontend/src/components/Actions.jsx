/** Ações do turno, ao lado da mão — que é onde o jogador está olhando. */
export default function Actions({ state, actions, frozen }) {
  const p = state.players.find((pl) => pl.id === state.currentPlayerId);
  const livre = !state.pendingDecision && !frozen;
  const montando = livre && state.turnState === 'BUILDING_BAND';
  const podeIniciar = livre && state.turnState === 'CHOOSE';

  return (
    <div className="hand-actions">
      <div className="panel-section">
        <div className="action-btns">
          {podeIniciar && (
            <>
              <button className="btn-action" onClick={actions.startBand}>
                ⚔ Formar Bando de Aliados
              </button>
              {p && p.handCount >= 10 && (
                <div className="note note-bad">Mão cheia (10 cartas)! Você deve jogar um Bando.</div>
              )}
            </>
          )}

          {montando && (
            <>
              <button
                className="btn-action confirm"
                disabled={state.band.length === 0}
                onClick={state.secondBand ? actions.playSecondBand : actions.playBand}
              >
                ✔ Confirmar {state.secondBand ? '2° ' : ''}Bando ({state.band.length} carta{state.band.length !== 1 ? 's' : ''})
              </button>
              <button className="btn-action danger" onClick={actions.cancelBand}>✖ Cancelar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
