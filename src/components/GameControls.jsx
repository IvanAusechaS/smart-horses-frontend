import './GameControls.css';

const GameControls = ({ onNewGame, onReset, gameStarted, disabled }) => {
  return (
    <div className="game-controls">
      {!gameStarted ? (
        <button 
          className="control-button primary"
          onClick={onNewGame}
          disabled={disabled}
        >
          Start Game
        </button>
      ) : (
        <button 
          className="control-button secondary"
          onClick={onReset}
          disabled={disabled}
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default GameControls;
