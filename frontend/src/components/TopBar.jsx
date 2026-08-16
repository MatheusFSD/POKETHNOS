export default function TopBar({ state }) {
  const pips = [0, 1, 2].map((i) => {
    const seen = state.dragonsSeen.find((d) => d.revealOrder === i);
    const isDragonite = seen && seen.name === 'Dragonite';
    return { seen: !!seen, isDragonite, label: seen ? (isDragonite ? '🔥' : `D${i + 1}`) : (i < 2 ? `D${i + 1}` : '🔥') };
  });

  return (
    <div className="top-bar">
      <div className="top-bar-title">◆ POKÉTHNOS</div>
      <div className="era-info">
        <div className="era-badge">Era {state.era} / {state.totalEras}</div>
        <div>
          <div className="dragons-label">Dragões</div>
          <div className="dragons-display">
            {pips.map((p, i) => (
              <div key={i} className={`dragon-pip${p.seen ? ' revealed' : ''}${p.isDragonite ? ' dragonite' : ''}`}>
                {p.label}
              </div>
            ))}
          </div>
        </div>
        <div className="glory-track">
          {state.players.map((p) => (
            <div className="glory-chip" key={p.id}>
              <div className="pcolor" style={{ background: p.color }} />
              <span>{p.name.split(' ')[0]}: {p.glory}✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
