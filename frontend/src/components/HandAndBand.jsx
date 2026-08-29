import { useState } from 'react';
import Card from './Card.jsx';
import TrainerAvatar from './TrainerAvatar.jsx';
import { playSnap } from '../audio/sfx.js';
import { RECRUIT_MIME } from './TableCards.jsx';

const HAND_MIME = 'application/x-pokethnos-hand';

export default function HandAndBand({ state, actions, aside }) {
  const canEditBand = !state.pendingDecision && state.turnState === 'BUILDING_BAND';
  const p = state.players.find((pl) => pl.id === state.currentPlayerId);
  const [dragOver, setDragOver] = useState(false);
  const [handOver, setHandOver] = useState(false);
  const teams = state.currentPlayerBands || [];

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

  function addCard(cardId) {
    playSnap();
    actions.addToBand(cardId);
  }

  /*
   * A faixa continua mostrando o Bando enquanto ele existir, e não só
   * enquanto é editável: durante a escolha do Líder o turno já não é
   * "editável", mas é justamente de `.band-cards` que a animação tira as
   * cartas para fazê-las voar até a Região.
   */
  const showingBand = canEditBand || state.band.length > 0;

  return (
    <div className="hand-section">
      <div className="hand-player">
        <TrainerAvatar index={state.currentPlayerAvatar} size={300} className="hand-player-art" />
        <span className="hand-player-tag" style={{ '--pcolor': state.currentPlayerColor }}>
          {state.currentPlayerName}
        </span>
        <span className="hand-player-glory">{p ? p.glory : 0} ✦</span>
      </div>

      <div className="hand-right">
        <div className="hand-top">
          <div
            className={`hand-main${handOver ? ' drag-over' : ''}`}
            onDragOver={(e) => {
              // só aceita o que veio da mesa; a mão largando na própria mão não
              if (!e.dataTransfer.types.includes(RECRUIT_MIME)) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              setHandOver(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget)) return;
              setHandOver(false);
            }}
            onDrop={(e) => {
              if (!e.dataTransfer.types.includes(RECRUIT_MIME)) return;
              e.preventDefault();
              setHandOver(false);
              playSnap(); // quem executa a compra é a origem, no dragend
            }}
          >
            <div className="hand-label">MÃO ({p ? p.handCount : 0}/10)</div>
            <div className="hand-cards" style={{ '--n': state.hand.length }}>
              {state.hand.map((c, i) => (
                <div
                  className={`hand-slot${canEditBand ? ' draggable' : ''}`}
                  key={c.id}
                  style={{ '--i': i }}
                  draggable={canEditBand}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(HAND_MIME, c.id);
                    e.dataTransfer.setData('text/plain', c.name);
                    e.dataTransfer.effectAllowed = 'move';
                    // a foto do fantasma é tirada logo depois deste handler;
                    // sem a sombra, ela não sai recortada na borda da captura
                    e.currentTarget.classList.add('dragging');
                  }}
                  onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                >
                  <Card card={c} onClick={canEditBand ? () => addCard(c.id) : undefined} />
                </div>
              ))}
            </div>
          </div>

          {/* as ações do turno ficam encostadas na mão */}
          {aside}
        </div>

        {/*
          Uma faixa, dois estados. Parada, mostra as equipes já formadas — que
          antes só apareciam no resumo de fim de turno, depois da decisão. Ao
          formar um Bando, vira a área de encaixe. Fica ABAIXO da mão de
          propósito: acima, ela empurrava as cartas para baixo ao aparecer.
        */}
        <div
          className={`band-slot${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => {
            if (!canEditBand || !e.dataTransfer.types.includes(HAND_MIME)) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            // ignora a saída para um filho, senão pisca ao passar sobre as cartas
            if (e.currentTarget.contains(e.relatedTarget)) return;
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!canEditBand) return;
            const cardId = e.dataTransfer.getData(HAND_MIME);
            if (cardId) addCard(cardId);
          }}
        >
          {showingBand ? (
            <>
              <div className="band-label">BANDO EM FORMAÇÃO</div>
              {state.band.length === 0 ? (
                <div className="band-dropzone">Arraste cartas da mão para cá</div>
              ) : (
                <div className="band-cards">
                  {state.band.map((c) => (
                    <Card
                      key={c.id}
                      card={c}
                      title={canEditBand ? 'Clique para remover do Bando' : undefined}
                      onClick={canEditBand ? () => actions.removeFromBand(c.id) : undefined}
                    />
                  ))}
                </div>
              )}
              {bandNote && <div className={`note mt8 ${bandValid ? 'note-ok' : 'note-bad'}`}>{bandNote}</div>}
            </>
          ) : (
            <>
              <div className="band-label">SUAS EQUIPES ({teams.length})</div>
              {teams.length === 0 ? (
                <div className="empty-note">Nenhum Bando formado nesta Era ainda.</div>
              ) : (
                <div className="teams-row">
                  {teams.map((b, i) => (
                    <div className="team" key={i}>
                      <div className="team-cards">
                        {b.cards.map((c) => (
                          <Card key={c.id} card={c} crown={b.leaderId === c.id} />
                        ))}
                      </div>
                      <div className="team-label">{b.cards.length} carta{b.cards.length !== 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
