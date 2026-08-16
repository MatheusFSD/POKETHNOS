import { useCallback, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';

/**
 * Fonte única de estado da partida no frontend. Cada ação chama a API,
 * recebe o GameStateDto atualizado e substitui o estado local — equivalente
 * ao renderAll() do jogo original, mas dirigido pela resposta do backend em
 * vez de mutação direta de um objeto global.
 */
export function useGame() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const gameIdRef = useRef(null);

  const run = useCallback(async (fn) => {
    setBusy(true);
    setError(null);
    try {
      const next = await fn();
      gameIdRef.current = next.gameId;
      setState(next);
      return next;
    } catch (e) {
      setError(e.message || 'Erro inesperado.');
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const actions = useMemo(() => {
    const id = () => gameIdRef.current;
    return {
      startGame: (playerNames) => run(() => api.createGame(playerNames)),
      refresh: () => run(() => api.getGame(id())),
      acknowledgePass: () => run(() => api.acknowledgePass(id())),
      continueAfterScoring: () => run(() => api.continueAfterScoring(id())),
      recruitDeck: () => run(() => api.recruitDeck(id())),
      recruitTable: (cardId) => run(() => api.recruitTable(id(), cardId)),
      startBand: () => run(() => api.startBand(id())),
      addToBand: (cardId) => run(() => api.addToBand(id(), cardId)),
      removeFromBand: (cardId) => run(() => api.removeFromBand(id(), cardId)),
      cancelBand: () => run(() => api.cancelBand(id())),
      playBand: () => run(() => api.playBand(id())),
      chooseLeader: (cardId) => run(() => api.chooseLeader(id(), cardId)),
      chooseFlyRegion: (regionId) => run(() => api.chooseFlyRegion(id(), regionId)),
      choosePoisonCards: (cardIds) => run(() => api.choosePoisonCards(id(), cardIds)),
      chooseFadaCards: (cardIds) => run(() => api.chooseFadaCards(id(), cardIds)),
      lutadorDecision: (accept) => run(() => api.lutadorDecision(id(), accept)),
      playSecondBand: () => run(() => api.playSecondBand(id())),
      chooseLeaderSecond: (cardId) => run(() => api.chooseLeaderSecond(id(), cardId)),
      dismissError: () => setError(null),
      newGame: () => {
        gameIdRef.current = null;
        setState(null);
        setError(null);
      },
    };
  }, [run]);

  return { state, error, busy, actions };
}
