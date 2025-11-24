import { createContext, useState, useCallback } from 'react';
import gameApi from '../api/gameApi';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highlightedSquare, setHighlightedSquare] = useState(null);

  const startNewGame = useCallback(async (selectedDifficulty) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameApi.createNewGame(selectedDifficulty);
      setGameState(response);
      setDifficulty(selectedDifficulty);
      setValidMoves([]);
      setHighlightedSquare(null);
    } catch (err) {
      setError(err.message || 'Failed to start game');
      console.error('Error starting game:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const makePlayerMove = useCallback(async (position) => {
    if (!gameState || gameState.current_player !== 'black' || gameState.game_over) {
      return;
    }

    setLoading(true);
    setError(null);
    setHighlightedSquare(position);

    try {
      const response = await gameApi.makeMove(gameState, position);
      // Backend returns the game state directly in the response
      setGameState(response);
      setValidMoves([]);
      
      // Highlight machine's move briefly
      if (response.machine_move) {
        setTimeout(() => {
          setHighlightedSquare(response.machine_move);
          setTimeout(() => {
            setHighlightedSquare(null);
          }, 800);
        }, 400);
      }
    } catch (err) {
      setError(err.message || 'Invalid move');
      console.error('Error making move:', err);
      setHighlightedSquare(null);
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  const loadValidMoves = useCallback(async () => {
    if (!gameState || gameState.current_player !== 'black' || gameState.game_over) {
      setValidMoves([]);
      return;
    }

    try {
      const moves = await gameApi.getValidMoves(gameState, 'black');
      setValidMoves(moves);
    } catch (err) {
      console.error('Error loading valid moves:', err);
      setValidMoves([]);
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(null);
    setDifficulty(null);
    setValidMoves([]);
    setLoading(false);
    setError(null);
    setHighlightedSquare(null);
  }, []);

  const handleSquareClick = useCallback((position) => {
    const [row, col] = position;
    const isValid = validMoves.some(([r, c]) => r === row && c === col);
    
    if (isValid) {
      makePlayerMove(position);
    }
  }, [validMoves, makePlayerMove]);

  const value = {
    gameState,
    difficulty,
    validMoves,
    loading,
    error,
    highlightedSquare,
    startNewGame,
    makePlayerMove,
    loadValidMoves,
    resetGame,
    handleSquareClick,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
