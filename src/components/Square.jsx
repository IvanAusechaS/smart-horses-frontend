import './Square.css';

const Square = ({ position, value, knight, isValid, isDestroyed, onClick, isHighlighted }) => {
  const [row, col] = position;
  const isLight = (row + col) % 2 === 0;

  const handleClick = () => {
    if (!isDestroyed && onClick) {
      onClick(position);
    }
  };

  const getSquareClass = () => {
    let classes = ['square'];
    classes.push(isLight ? 'light' : 'dark');
    
    if (isDestroyed) classes.push('destroyed');
    if (isValid) classes.push('valid-move');
    if (isHighlighted) classes.push('highlighted');
    if (knight) classes.push('has-knight');
    
    return classes.join(' ');
  };

  const getValueDisplay = () => {
    if (isDestroyed) return null;
    if (value === null || value === undefined) return null;
    
    const numValue = typeof value === 'number' ? value : 0;
    if (numValue === 0) return null;
    
    return (
      <span className={`point-value ${numValue > 0 ? 'positive' : 'negative'}`}>
        {numValue > 0 ? '+' : ''}{numValue}
      </span>
    );
  };

  return (
    <div className={getSquareClass()} onClick={handleClick}>
      {knight && (
        <div className={`knight ${knight}`}>
          <span className="knight-symbol">♞</span>
        </div>
      )}
      {getValueDisplay()}
      {isDestroyed && <div className="destroyed-marker"></div>}
    </div>
  );
};

export default Square;
