export default function RightPanel({ state, actions }) {
  const p = state.players.find((pl) => pl.id === state.currentPlayerId);
  const noDecision = !state.pendingDecision;

  return (
    <div className="right-panel">
      <div className="panel-section">
        <h4>VEZ DE</h4>
        <div className="current-player-name">
          <span className="color-dot" style={{ background: state.currentPlayerColor }} />
          {state.currentPlayerName}
        </div>
        <div className="current-player-glory">{p ? p.glory : 0} Glória ✦</div>
        <div className="status-msg">{state.statusMessage}</div>
      </div>

      <div className="panel-section">
        <h4>AÇÕES</h4>
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
        <h4>JOGADORES</h4>
        <div className="players-list">
          {state.players.map((pl) => (
            <div className={`player-row${pl.id === state.currentPlayerId ? ' active-player' : ''}`} key={pl.id}>
              <div className="color-dot" style={{ background: pl.color }} />
              <div className="pname">{pl.name}{pl.id === state.currentPlayerId ? ' ◀' : ''}</div>
              <div className="pglory">{pl.glory}✦</div>
              <div className="pmarkers">[{pl.totalMarkers}🏴]</div>
            </div>
          ))}
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
