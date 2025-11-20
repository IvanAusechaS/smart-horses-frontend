import './DifficultySelector.css';

const DifficultySelector = ({ onSelect, disabled }) => {
  const difficulties = [
    { 
      value: 'beginner', 
      label: 'Beginner', 
      description: 'Depth 2',
      icon: '⚡'
    },
    { 
      value: 'amateur', 
      label: 'Amateur', 
      description: 'Depth 4',
      icon: '🎯'
    },
    { 
      value: 'expert', 
      label: 'Expert', 
      description: 'Depth 6',
      icon: '🔥'
    },
  ];

  return (
    <div className="difficulty-selector">
      <h2 className="difficulty-title">Select Difficulty</h2>
      <div className="difficulty-buttons">
        {difficulties.map((diff) => (
          <button
            key={diff.value}
            className="difficulty-button"
            onClick={() => onSelect(diff.value)}
            disabled={disabled}
          >
            <span className="difficulty-icon">{diff.icon}</span>
            <span className="difficulty-label">{diff.label}</span>
            <span className="difficulty-description">{diff.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
