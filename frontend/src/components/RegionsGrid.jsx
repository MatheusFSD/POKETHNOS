import { useState } from 'react';
import Card from './Card.jsx';
import TrainerAvatar from './TrainerAvatar.jsx';
import marrom from '../assets/biomas/marrom.jpg';
import verde from '../assets/biomas/verde.jpg';
import vermelho from '../assets/biomas/vermelho.jpg';
import azul from '../assets/biomas/azul.jpg';
import roxo from '../assets/biomas/roxo.jpg';
import cinza from '../assets/biomas/cinza.jpg';

/** Paisagem de cada bioma, indexada pelo id da região que vem do backend. */
const BIOMAS = { marrom, verde, vermelho, azul, roxo, cinza };

export default function RegionsGrid({ state }) {
  const [tip, setTip] = useState(null);

  /* O balão é `position: fixed` porque o card da região tem `overflow:
     hidden` (para a paisagem respeitar os cantos arredondados) — dentro
     dele, o balão seria decepado. */
  function showTip(e, marker, regionName) {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ marker, regionName, x: r.left + r.width / 2, y: r.top });
  }

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
                {r.markerList
                  ? r.markerList.map((m, i) => (
                      <div
                        className="marker"
                        key={i}
                        style={{ background: m.playerColor }}
                        onMouseEnter={(e) => showTip(e, m, r.name)}
                        onMouseLeave={() => setTip(null)}
                      />
                    ))
                  : /* partida antiga, sem procedência: só as bolinhas */
                    state.players.flatMap((p) =>
                      Array.from({ length: r.markers[p.id] || 0 }, (_, i) => (
                        <div className="marker" key={`${p.id}-${i}`} style={{ background: p.color }} />
                      )),
                    )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tip && (
        <div className="marker-tip" style={{ left: tip.x, top: tip.y }}>
          <div className="marker-tip-who">
            <TrainerAvatar index={tip.marker.playerAvatar} size={34} />
            <span className="marker-tip-name" style={{ '--pcolor': tip.marker.playerColor }}>
              {tip.marker.playerName}
            </span>
          </div>
          <div className="marker-tip-cards">
            {tip.marker.cards.map((c) => (
              <Card key={c.id} card={c} crown={tip.marker.leaderId === c.id} />
            ))}
          </div>
          <div className="marker-tip-foot">
            Bando de {tip.marker.cards.length} carta{tip.marker.cards.length !== 1 ? 's' : ''}
            {tip.marker.leaderName ? ` · Líder: ${tip.marker.leaderName}` : ''} · Era {tip.marker.era}
          </div>
        </div>
      )}
    </>
  );
}
