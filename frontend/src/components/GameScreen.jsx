import { useState } from 'react';
import TopBar from './TopBar.jsx';
import RegionsGrid from './RegionsGrid.jsx';
import TableCards from './TableCards.jsx';
import Actions from './Actions.jsx';
import HandAndBand from './HandAndBand.jsx';
import DecisionModal from './modals/DecisionModal.jsx';
import TurnSummaryModal from './modals/TurnSummaryModal.jsx';
import LogModal from './modals/LogModal.jsx';
import PassScreen from './PassScreen.jsx';

export default function GameScreen({ state, actions, error }) {
  const canRecruit = !state.pendingDecision && state.turnState === 'CHOOSE';
  const [logOpen, setLogOpen] = useState(false);

  // O resumo aparece antes da tela de passar a vez. Guardamos qual resumo já
  // foi encerrado por uma assinatura estável — assim o próximo turno mostra o
  // seu, sem precisar de mais uma ida ao servidor.
  const summary = state.turnSummary;
  const summarySig = summary ? `${summary.playerId}:${state.log.length}` : null;
  const [endedSig, setEndedSig] = useState(null);
  const showSummary = !!summary && state.waitingPass && endedSig !== summarySig;

  /**
   * Enquanto o resumo está aberto, o tabuleiro continua sendo o de quem
   * acabou de jogar.
   *
   * O backend já avançou o turno ao responder, então `state` traz o próximo
   * jogador — e com ele o retrato, a glória e, pior, a MÃO dele, que ficaria
   * à mostra atrás do modal num jogo de mesmo computador. O retrato do turno
   * (`turnSummary`) tem exatamente esses dados do jogador anterior, então a
   * troca só acontece de fato quando a tela azul de passar a vez entra.
   */
  const view = showSummary
    ? {
        ...state,
        currentPlayerId: summary.playerId,
        currentPlayerName: summary.playerName,
        currentPlayerColor: summary.playerColor,
        currentPlayerAvatar: summary.playerAvatar,
        hand: summary.hand,
        band: [],
        statusMessage: 'Turno encerrado.',
        players: state.players.map((p) => ({ ...p, current: p.id === summary.playerId })),
      }
    : state;

  return (
    <div className="screen screen-game active">
      <div className="game-layout">
        <TopBar state={view} />

        <div className="main-area">
          {/* mesa e mão ocupam o topo da coluna principal */}
          <div className="board-area">
            <TableCards state={view} actions={actions} canRecruit={canRecruit && !showSummary} />
            <HandAndBand
              state={view}
              actions={actions}
              aside={<Actions state={view} actions={actions} frozen={showSummary} />}
            />
          </div>

          {/* menu lateral: regiões e o acesso ao registro */}
          <div className="side-panel">
            <RegionsGrid state={view} />
            <button className="log-btn" onClick={() => setLogOpen(true)}>
              📜 REGISTRO<span className="log-btn-count">{state.log.length}</span>
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error-banner floating">{error}</div>}

      {logOpen && <LogModal log={state.log} onClose={() => setLogOpen(false)} />}

      {showSummary && (
        <TurnSummaryModal summary={summary} onEndTurn={() => setEndedSig(summarySig)} />
      )}

      {/* a partir daqui já é o próximo jogador: usa o estado real */}
      {state.waitingPass && !showSummary && (
        <PassScreen
          playerName={state.currentPlayerName}
          avatar={state.currentPlayerAvatar}
          color={state.currentPlayerColor}
          onReady={actions.acknowledgePass}
        />
      )}

      {!state.waitingPass && state.pendingDecision && (
        <DecisionModal decision={state.pendingDecision} actions={actions} />
      )}
    </div>
  );
}
