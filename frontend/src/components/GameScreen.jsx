import TopBar from './TopBar.jsx';
import RegionsGrid from './RegionsGrid.jsx';
import TableCards from './TableCards.jsx';
import RightPanel from './RightPanel.jsx';
import HandAndBand from './HandAndBand.jsx';
import DecisionModal from './modals/DecisionModal.jsx';
import PassScreen from './PassScreen.jsx';

export default function GameScreen({ state, actions, error }) {
  const canRecruit = !state.pendingDecision && state.turnState === 'CHOOSE';

  return (
    <div className="screen screen-game active">
      <div className="game-layout">
        <TopBar state={state} />

        <div className="main-area">
          <div className="board-area">
            <RegionsGrid state={state} />
            <TableCards state={state} actions={actions} canRecruit={canRecruit} />
            <div className="section-title mt8">REGISTRO</div>
            <div className="log-section log-section-board">
              {[...state.log].reverse().slice(0, 6).map((l, i) => (
                <div className="log-entry" key={i}>{l}</div>
              ))}
            </div>
          </div>

          <RightPanel state={state} actions={actions} />
        </div>

        <HandAndBand state={state} actions={actions} />
      </div>

      {error && <div className="error-banner floating">{error}</div>}
      {state.waitingPass && <PassScreen playerName={state.currentPlayerName} onReady={actions.acknowledgePass} />}
      {!state.waitingPass && state.pendingDecision && (
        <DecisionModal decision={state.pendingDecision} actions={actions} />
      )}
    </div>
  );
}
