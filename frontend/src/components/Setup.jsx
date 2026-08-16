import { useState } from 'react';

const PLAYER_COLORS = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1'];

export default function Setup({ onStart, busy, error }) {
  const [count, setCount] = useState(0);
  const [names, setNames] = useState([]);

  function selectCount(n) {
    setCount(n);
    setNames(Array.from({ length: n }, (_, i) => `Jogador ${i + 1}`));
  }

  function updateName(i, value) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? value : n)));
  }

  function handleStart() {
    if (!count) return;
    const finalNames = names.map((n, i) => (n.trim() ? n.trim() : `Jogador ${i + 1}`));
    onStart(finalNames);
  }

  return (
    <div className="screen screen-setup">
      <div className="logo">◆ POKÉTHNOS ◆</div>
      <div className="subtitle-logo">Controle de Regiões com Pokémon · baseado em Ethnos</div>
      <div className="setup-box">
        <h2>NÚMERO DE JOGADORES</h2>
        <div className="player-count-btns">
          {[2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              className={`cnt-btn${count === n ? ' selected' : ''}`}
              onClick={() => selectCount(n)}
            >
              {n}
            </button>
          ))}
        </div>

        {count > 0 && (
          <div id="player-names-section">
            <div className="player-name-inputs">
              {names.map((name, i) => (
                <div className="player-name-row" key={i}>
                  <div className="color-dot" style={{ background: PLAYER_COLORS[i] }} />
                  <input
                    type="text"
                    placeholder={`Jogador ${i + 1}`}
                    value={name}
                    onChange={(e) => updateName(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
            {error && <div className="error-banner">{error}</div>}
            <button className="btn-primary" disabled={busy} onClick={handleStart}>
              {busy ? 'INICIANDO…' : '⚔ INICIAR PARTIDA'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
