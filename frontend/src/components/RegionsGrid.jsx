import marrom from '../assets/biomas/marrom.jpg';
import verde from '../assets/biomas/verde.jpg';
import vermelho from '../assets/biomas/vermelho.jpg';
import azul from '../assets/biomas/azul.jpg';
import roxo from '../assets/biomas/roxo.jpg';
import cinza from '../assets/biomas/cinza.jpg';

/** Paisagem de cada bioma, indexada pelo id da região que vem do backend. */
const BIOMAS = { marrom, verde, vermelho, azul, roxo, cinza };

export default function RegionsGrid({ state }) {
  return (
    <>
      <div className="section-title">REGIÕES</div>
      <div className="regions-grid">
        {state.regions.map((r) => (
          <div className="region-card" key={r.id} data-region={r.id} style={{ '--region-color': r.color }}>
            <div
              className="region-banner"
              style={BIOMAS[r.id] ? { backgroundImage: `url(${BIOMAS[r.id]})` } : undefined}
            >
              <span className="region-name">{r.name}</span>
            </div>

            <div className="region-body">
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
          </div>
        ))}
      </div>
    </>
  );
}
