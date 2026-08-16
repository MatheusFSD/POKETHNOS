export default function RegionsGrid({ state }) {
  return (
    <>
      <div className="section-title">REGIÕES</div>
      <div className="regions-grid">
        {state.regions.map((r) => (
          <div className="region-card" key={r.id} style={{ '--region-color': r.color }}>
            <div className="region-name">{r.name}</div>
            <div className="region-color-name">{r.id}</div>
            <div className="glory-tokens">
              {r.tokens.map((v, i) => (
                <div className="glory-token" key={i}>{v}</div>
              ))}
            </div>
            <div className="control-markers">
              {state.players.flatMap((p) =>
                Array.from({ length: r.markers[p.id] || 0 }, (_, i) => (
                  <div className="marker" key={`${p.id}-${i}`} style={{ background: p.color }} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
