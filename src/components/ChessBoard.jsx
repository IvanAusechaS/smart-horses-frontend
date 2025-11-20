import Square from './Square';
import './ChessBoard.css';

const ChessBoard = ({ gameState, onSquareClick, validMoves = [], highlightedSquare }) => {
  const { board, white_knight, black_knight } = gameState;

  const getSquareValue = (row, col) => {
    const key = `${row},${col}`;
    return board[key];
  };

  const isDestroyed = (row, col) => {
    const value = getSquareValue(row, col);
    return value === 'destroyed';
  };

  const getKnight = (row, col) => {
    if (white_knight && white_knight[0] === row && white_knight[1] === col) {
      return 'white';
    }
    if (black_knight && black_knight[0] === row && black_knight[1] === col) {
      return 'black';
    }
    return null;
  };

  const isValidMove = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  const isHighlighted = (row, col) => {
    return highlightedSquare && 
           highlightedSquare[0] === row && 
           highlightedSquare[1] === col;
  };

  return (
    <div className="chess-board-container">
      <div className="chess-board">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="board-row">
            {Array.from({ length: 8 }, (_, col) => (
              <Square
                key={`${row}-${col}`}
                position={[row, col]}
                value={getSquareValue(row, col)}
                knight={getKnight(row, col)}
                isValid={isValidMove(row, col)}
                isDestroyed={isDestroyed(row, col)}
                isHighlighted={isHighlighted(row, col)}
                onClick={onSquareClick}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="board-labels">
        <div className="row-labels">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="label">{8 - i}</span>
          ))}
        </div>
        <div className="col-labels">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="label">{String.fromCharCode(65 + i)}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
