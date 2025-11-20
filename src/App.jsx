import { useEffect } from 'react';
import { GameProvider } from './context/GameContext';
import { useGame } from './context/useGame';
import ChessBoard from './components/ChessBoard';
import ScorePanel from './components/ScorePanel';
import DifficultySelector from './components/DifficultySelector';
import GameControls from './components/GameControls';
import './App.css';

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

  useEffect(() => {
    if (gameState && gameState.current_player === 'black' && !gameState.game_over) {
      loadValidMoves();
    }
  }, [gameState, loadValidMoves]);

  const handleDifficultySelect = async (selectedDifficulty) => {
    await startNewGame(selectedDifficulty);
  };

  const handleNewGame = () => {
    resetGame();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Smart Horses</h1>
        <p className="app-subtitle">Strategic Knight Challenge</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {loading && !gameState && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Initializing game...</p>
          </div>
        )}

        {!gameState ? (
          <div className="game-setup">
            <DifficultySelector 
              onSelect={handleDifficultySelect} 
              disabled={loading}
            />
          </div>
        ) : (
          <div className="game-container">
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
              <div className="move-loading">
                <div className="loading-spinner small"></div>
                <span>Processing move...</span>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Minimax Algorithm with Alpha-Beta Pruning</p>
      </footer>
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
