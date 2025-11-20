import './ScorePanel.css';

const ScorePanel = ({ whiteScore, blackScore, currentPlayer, gameOver, winner }) => {
  const getStatusMessage = () => {
    if (gameOver) {
      if (winner === 'white') return 'Machine Wins';
      if (winner === 'black') return 'You Win!';
      return 'Draw';
    }
    return currentPlayer === 'white' ? 'Machine thinking...' : 'Your turn';
  };

  const getStatusClass = () => {
    if (gameOver) {
      if (winner === 'white') return 'status-lose';
      if (winner === 'black') return 'status-win';
      return 'status-draw';
    }
    return currentPlayer === 'black' ? 'status-active' : 'status-waiting';
  };

  return (
    <div className="score-panel">
      <div className="status-section">
        <div className={`status-message ${getStatusClass()}`}>
          {getStatusMessage()}
        </div>
      </div>
      
      <div className="scores-container">
        <div className={`score-item machine ${currentPlayer === 'white' && !gameOver ? 'active' : ''}`}>
          <div className="score-label">
            <span className="player-icon">♞</span>
            <span>Machine</span>
          </div>
          <div className="score-value">{whiteScore}</div>
        </div>

        <div className="score-divider"></div>

        <div className={`score-item player ${currentPlayer === 'black' && !gameOver ? 'active' : ''}`}>
          <div className="score-label">
            <span className="player-icon">♞</span>
            <span>You</span>
          </div>
          <div className="score-value">{blackScore}</div>
        </div>
      </div>
    </div>
  );
};

export default ScorePanel;
