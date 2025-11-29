import { createContext, useState, useCallback } from "react";
import gameApi from "../api/gameApi";
import audioManager from "../utils/audioManager";

const GameContext = createContext(null);

// Aplica de forma optimista el movimiento del jugador (negras) en el estado
// local para que su caballo se mueva inmediatamente en la UI.
const applyPlayerMoveOptimistic = (state, position) => {
  if (!state) return state;

  const [newRow, newCol] = position;
  const [oldRow, oldCol] = state.black_knight;

  const board = { ...state.board };
  const newKey = `${newRow},${newCol}`;
  const oldKey = `${oldRow},${oldCol}`;

  const squareValue = board[newKey];
  let blackScore = state.black_score;

  if (typeof squareValue === "number") {
    blackScore += squareValue;
  }

  // La casilla anterior del caballo del jugador se destruye.
  board[oldKey] = "destroyed";

  return {
    ...state,
    board,
    black_knight: [newRow, newCol],
    black_score: blackScore,
    current_player: "white", // Después del movimiento del jugador, juega la máquina
  };
};

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
      setError(err.message || "Failed to start game");
      console.error("Error starting game:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const makePlayerMove = useCallback(
    async (position) => {
      if (
        !gameState ||
        gameState.current_player !== "black" ||
        gameState.game_over
      ) {
        return;
      }

      setLoading(true);
      setError(null);

      // Play move sound y mueve la ficha del jugador inmediatamente
      audioManager.play("pieceMove");
      setHighlightedSquare(position);

      const previousState = gameState;
      const optimisticState = applyPlayerMoveOptimistic(previousState, position);
      setGameState(optimisticState);

      try {
        // Lanzamos en paralelo:
        // 1) la petición al backend
        // 2) un delay mínimo de 1 segundo para que se vea claramente tu movimiento
        const movePromise = gameApi.makeMove(previousState, position);
        const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));

        const [response] = await Promise.all([movePromise, delayPromise]);

        // Estado definitivo desde el backend (incluye movimiento de la máquina)
        setGameState(response);
        setValidMoves([]);

        // Después, destacamos el movimiento de la máquina
        if (response.machine_move) {
          setTimeout(() => {
            setHighlightedSquare(response.machine_move);
            audioManager.play("pieceMove");
            setTimeout(() => {
              setHighlightedSquare(null);
            }, 1000);
          }, 400);
        } else {
          setHighlightedSquare(null);
        }
      } catch (err) {
        setError(err.message || "Invalid move");
        console.error("Error making move:", err);
        setHighlightedSquare(null);
        audioManager.play("error");
      } finally {
        setLoading(false);
      }
    },
    [gameState]
  );

  const loadValidMoves = useCallback(async () => {
    if (
      !gameState ||
      gameState.current_player !== "black" ||
      gameState.game_over
    ) {
      setValidMoves([]);
      return;
    }

    try {
      const response = await gameApi.getValidMoves(gameState, "black");

      // Caso especial: jugador sin movimientos → penalización y posible
      // movimiento automático de la máquina.
      if (response.penalty_applied && response.game_state) {
        // Actualizamos todo el estado del juego.
        setGameState(response.game_state);
        setValidMoves([]);

        if (response.machine_move) {
          // Mostrar el movimiento de la máquina con una pequeña pausa
          setTimeout(() => {
            setHighlightedSquare(response.machine_move);
            audioManager.play("pieceMove");
            setTimeout(() => {
              setHighlightedSquare(null);
              // Si después de este movimiento vuelve a ser tu turno,
              // el useEffect de App.jsx llamará de nuevo a loadValidMoves.
            }, 800);
          }, 400);
        }
      } else {
        // Caso normal: solo actualizar los movimientos válidos
        setValidMoves(response.valid_moves || response);
      }
    } catch (err) {
      console.error("Error loading valid moves:", err);
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

  const handleSquareClick = useCallback(
    (position) => {
      const [row, col] = position;
      const isValid = validMoves.some(([r, c]) => r === row && c === col);

      if (isValid) {
        makePlayerMove(position);
      }
    },
    [validMoves, makePlayerMove]
  );

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
