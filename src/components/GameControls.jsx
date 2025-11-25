import { motion } from 'framer-motion';
import audioManager from '../utils/audioManager';
import './GameControls.css';

const GameControls = ({ onNewGame, onReset, gameStarted, disabled }) => {
  const handleNewGame = () => {
    audioManager.play('buttonClick');
    onNewGame();
  };

  const handleReset = () => {
    audioManager.play('buttonClick');
    onReset();
  };

  return (
    <motion.div 
      className="game-controls"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {!gameStarted ? (
        <motion.button 
          className="control-button primary"
          onClick={handleNewGame}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Game
        </motion.button>
      ) : (
        <motion.button 
          className="control-button secondary"
          onClick={handleReset}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
      )}
    </motion.div>
  );
};

export default GameControls;
