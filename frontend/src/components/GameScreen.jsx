import { useState } from 'react';
import TopBar from './TopBar.jsx';
import RegionsGrid from './RegionsGrid.jsx';
import TableCards from './TableCards.jsx';
import RightPanel from './RightPanel.jsx';
import HandAndBand from './HandAndBand.jsx';
import DecisionModal from './modals/DecisionModal.jsx';
import TurnSummaryModal from './modals/TurnSummaryModal.jsx';
import PassScreen from './PassScreen.jsx';

export default function GameScreen({ state, actions, error }) {
  const canRecruit = !state.pendingDecision && state.turnState === 'CHOOSE';

  // O resumo aparece antes da tela de passar a vez. Guardamos qual resumo já
  // foi encerrado por uma assinatura estável — assim o próximo turno mostra o
  // seu, sem precisar de mais uma ida ao servidor.
  const summary = state.turnSummary;
  const summarySig = summary ? `${summary.playerId}:${state.log.length}` : null;
  const [endedSig, setEndedSig] = useState(null);
  const showSummary = !!summary && state.waitingPass && endedSig !== summarySig;

  return (
    <div className="screen screen-game active">
      <div className="game-layout">
        <TopBar state={state} />

        <div className="main-area">
          <div className="board-area">
            <RegionsGrid state={state} />
            <TableCards state={state} actions={actions} canRecruit={canRecruit} />
            {/* a mão fica logo abaixo da mesa: o jogador segura as cartas na frente dela */}
            <HandAndBand state={state} actions={actions} />
          </div>

          <RightPanel state={state} actions={actions} />
        </div>
      </div>

      {error && <div className="error-banner floating">{error}</div>}

      {showSummary && (
        <TurnSummaryModal summary={summary} onEndTurn={() => setEndedSig(summarySig)} />
      )}

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
