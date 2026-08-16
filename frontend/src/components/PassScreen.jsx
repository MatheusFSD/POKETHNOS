export default function PassScreen({ playerName, onReady }) {
  return (
    <div className="pass-screen active">
      <div className="pass-icon">🎮</div>
      <div className="pass-title">VEZ DE {playerName?.toUpperCase()}</div>
      <div className="pass-subtitle">Passe o computador para este jogador</div>
      <button className="pass-btn" onClick={onReady}>ESTOU PRONTO</button>
    </div>
  );
}
