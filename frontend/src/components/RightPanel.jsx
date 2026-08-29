export default function RightPanel({ state, actions }) {
  const p = state.players.find((pl) => pl.id === state.currentPlayerId);
  const noDecision = !state.pendingDecision;

  return (
    <div className="right-panel">
      <div className="panel-section">
        <h4>AÇÕES</h4>
        <div className="status-msg">{state.statusMessage}</div>
        <div className="action-btns">
          {noDecision && state.turnState === 'CHOOSE' && (
            <>
              {p && p.handCount >= 10 && <div className="note">Mão cheia (10 cartas)! Você deve jogar um Bando.</div>}
              <button className="btn-action" onClick={actions.startBand}>⚔ Formar Bando de Aliados</button>
            </>
          )}
          {noDecision && state.turnState === 'BUILDING_BAND' && (
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

      <div className="panel-section">
        <h4>REGISTRO</h4>
        <div className="log-section">
          {[...state.log].reverse().map((l, i) => (
            <div className="log-entry" key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
