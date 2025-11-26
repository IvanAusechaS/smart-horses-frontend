import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GameProvider } from "./context/GameContext";
import { useGame } from "./context/useGame";
import ChessBoard from "./components/ChessBoard";
import ScorePanel from "./components/ScorePanel";
import DifficultySelector from "./components/DifficultySelector";
import GameControls from "./components/GameControls";
import audioManager from "./utils/audioManager";
import "./App.css";

function GameContent() {
  const {
    gameState,
    validMoves,
    loading,
    error,
    highlightedSquare,
    startNewGame,
    loadValidMoves,
    resetGame,
    handleSquareClick,
  } = useGame();

  const [showGameOver, setShowGameOver] = useState(false);

  // Start background music on mount
  useEffect(() => {
    audioManager.playBackgroundMusic();
    return () => {
      audioManager.stopBackgroundMusic();
    };
  }, []);

  // Check for game over and show notifications
  useEffect(() => {
    if (gameState && gameState.game_over && gameState.winner) {
      const isPlayerWin = gameState.winner === "black";

      setShowGameOver(true);

      setTimeout(() => {
        if (isPlayerWin) {
          audioManager.play("victory");
          toast.success("🎉 Victory! You won the game!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          audioManager.play("defeat");
          toast.error("😔 Game Over! The AI won this time.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }, 500);

      // Auto-dismiss overlay after 8 seconds
      setTimeout(() => {
        setShowGameOver(false);
      }, 8000);
    } else if (gameState && gameState.game_over && !gameState.winner) {
      // Draw
      setShowGameOver(true);
      toast.info("🤝 Draw! It's a tie!", {
        position: "top-center",
        autoClose: 5000,
      });

      // Auto-dismiss overlay after 8 seconds
      setTimeout(() => {
        setShowGameOver(false);
      }, 8000);
    } else {
      setShowGameOver(false);
    }
  }, [gameState]);

  useEffect(() => {
    if (
      gameState &&
      gameState.current_player === "black" &&
      !gameState.game_over
    ) {
      loadValidMoves();
    }
  }, [gameState, loadValidMoves]);

  const handleDifficultySelect = async (selectedDifficulty) => {
    await startNewGame(selectedDifficulty);
  };

  const handleNewGame = () => {
    audioManager.play("buttonClick");
    resetGame();
  };

  return (
    <div className="app">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="app-title"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          Smart Horses
        </motion.h1>
        <motion.p
          className="app-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Strategic Knight Challenge
        </motion.p>
      </motion.header>

      <main className="app-main">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !gameState && (
          <motion.div
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="loading-spinner"></div>
            <p>Initializing game...</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!gameState ? (
            <motion.div
              key="game-setup"
              className="game-setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <DifficultySelector
                onSelect={handleDifficultySelect}
                disabled={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="game-container"
              className="game-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {showGameOver && gameState.game_over && (
                <motion.div
                  className={`game-over-overlay ${
                    gameState.winner === "black" ? "victory" : "defeat"
                  }`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <motion.div
                    className="game-over-content"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {gameState.winner === "black" ? (
                      <>
                        <span className="game-over-emoji">🎉</span>
                        <h2>Victory!</h2>
                        <p>You defeated the AI!</p>
                      </>
                    ) : gameState.winner === "white" ? (
                      <>
                        <span className="game-over-emoji">😔</span>
                        <h2>Game Over</h2>
                        <p>The AI won this time</p>
                      </>
                    ) : (
                      <>
                        <span className="game-over-emoji">🤝</span>
                        <h2>Draw</h2>
                        <p>It&apos;s a tie!</p>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}

              <ScorePanel
                whiteScore={gameState.white_score}
                blackScore={gameState.black_score}
                currentPlayer={gameState.current_player}
                gameOver={gameState.game_over}
                winner={gameState.winner}
              />

              <ChessBoard
                gameState={gameState}
                onSquareClick={handleSquareClick}
                validMoves={validMoves}
                highlightedSquare={highlightedSquare}
              />

              <GameControls
                onNewGame={handleNewGame}
                onReset={handleNewGame}
                gameStarted={true}
                disabled={loading}
              />

              {loading && (
                <motion.div
                  className="move-loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="loading-spinner small"></div>
                  <span>Processing move...</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.footer
        className="app-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <p>Minimax Algorithm with Alpha-Beta Pruning</p>
      </motion.footer>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
