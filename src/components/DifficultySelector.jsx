import { motion } from "framer-motion";
import "./DifficultySelector.css";
import audioManager from "../utils/audioManager";

const DifficultySelector = ({ onSelect, disabled }) => {
  const difficulties = [
    {
      value: "beginner",
      label: "Beginner",
      description: "Depth 2",
      icon: "/icons/lightning.svg",
    },
    {
      value: "amateur",
      label: "Amateur",
      description: "Depth 4",
      icon: "/icons/target.svg",
    },
    {
      value: "expert",
      label: "Expert",
      description: "Depth 6",
      icon: "/icons/fire.svg",
    },
  ];

  const handleSelect = (value) => {
    audioManager.play("buttonClick");
    audioManager.play("gameStart");
    onSelect(value);
  };

  return (
    <motion.div
      className="difficulty-selector"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2
        className="difficulty-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Select Difficulty
      </motion.h2>
      <div className="difficulty-buttons">
        {difficulties.map((diff, index) => (
          <motion.button
            key={diff.value}
            className="difficulty-button"
            onClick={() => handleSelect(diff.value)}
            disabled={disabled}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3 + index * 0.1,
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src={diff.icon}
              alt={diff.label}
              className="difficulty-icon"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
            <span className="difficulty-label">{diff.label}</span>
            <span className="difficulty-description">{diff.description}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DifficultySelector;
