import { motion } from "framer-motion";
import "./ScorePanel.css";

const ScorePanel = ({
  whiteScore,
  blackScore,
  currentPlayer,
  gameOver,
  winner,
}) => {
  const getStatusMessage = () => {
    if (gameOver) {
      if (winner === "white") return "Machine Wins";
      if (winner === "black") return "You Win!";
      return "Draw";
    }
    return currentPlayer === "white" ? "Machine thinking..." : "Your turn";
  };

  const getStatusClass = () => {
    if (gameOver) {
      if (winner === "white") return "status-lose";
      if (winner === "black") return "status-win";
      return "status-draw";
    }
    return currentPlayer === "black" ? "status-active" : "status-waiting";
  };

  return (
    <motion.div
      className="score-panel"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="status-section">
        <motion.div
          className={`status-message ${getStatusClass()}`}
          key={getStatusMessage()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getStatusMessage()}
        </motion.div>
      </div>

      <div className="scores-container">
        <motion.div
          className={`score-item machine ${
            currentPlayer === "white" && !gameOver ? "active" : ""
          }`}
          animate={{
            scale: currentPlayer === "white" && !gameOver ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: currentPlayer === "white" && !gameOver ? Infinity : 0,
          }}
        >
          <div className="score-label">
            <span className="player-icon">♞</span>
            <span>Machine</span>
          </div>
          <motion.div
            className="score-value"
            key={whiteScore}
            initial={{ scale: 1.5, color: "#007aff" }}
            animate={{ scale: 1, color: "#ffff" }}
            transition={{ duration: 0.4 }}
          >
            {whiteScore}
          </motion.div>
        </motion.div>

        <div className="score-divider"></div>

        <motion.div
          className={`score-item player ${
            currentPlayer === "black" && !gameOver ? "active" : ""
          }`}
          animate={{
            scale: currentPlayer === "black" && !gameOver ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: currentPlayer === "black" && !gameOver ? Infinity : 0,
          }}
        >
          <div className="score-label">
            <span className="player-icon">♞</span>
            <span>You</span>
          </div>
          <motion.div
            className="score-value"
            key={blackScore}
            initial={{ scale: 1.5, color: "#007aff" }}
            animate={{ scale: 1, color: "#ffff" }}
            transition={{ duration: 0.4 }}
          >
            {blackScore}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScorePanel;
