export default function EndScreen({ state, onNewGame }) {
  const standings = state.finalStandings || [];
  const winner = standings.find((s) => s.winner);

  return (
    <div className="screen screen-end active">
      <div>
        <div className="winner-title">◆ GRANDE MESTRE ◆</div>
        <div className="winner-name">{winner?.name}</div>
        <div className="final-scores">
          {standings.map((s, i) => (
            <div className={`final-score-row${i === 0 ? ' winner-row' : ''}`} key={s.playerId}>
              <div className="fn">
                <span className="color-dot" style={{ background: s.color }} />
                {i === 0 ? '👑 ' : ''}{s.name}
              </div>
              <div className="fg">{s.glory} ✦</div>
            </div>
          ))}
        </div>
        <button className="btn-primary end-newgame-btn" onClick={onNewGame}>NOVA PARTIDA</button>
      </div>
    </div>
  );
}
