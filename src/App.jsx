import { useState } from "react";

function Square({ value, onSquareClick, isWinner }) {
  let className = "square";
  if (isWinner) {
    className += " winner";
  }
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares, i);
  }

  const result = calculateWinner(squares);
  const winners = [];

  let status;
  if (result) {
    if (result === "Draw") {
      status = "Draw";
    } else {
      for (let w of result) {
        winners.push(w);
      }
      status = "Winner: " + squares[winners[0]];
    }
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>

      {/* Render the board using two nested loops */}
      {Array(3)
        .fill(null)
        .map((_, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {Array(3)
              .fill(null)
              .map((_, colIndex) => {
                const squareIndex = rowIndex * 3 + colIndex;
                return (
                  <Square
                    key={squareIndex}
                    value={squares[squareIndex]}
                    onSquareClick={() => handleClick(squareIndex)}
                    isWinner={winners.includes(squareIndex) ? true : false}
                  />
                );
              })}
          </div>
        ))}
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), location: null}]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares ,index) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, location: index}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }


  const moves = history.map((item, move) => {
    let description;
    if (move === 0) {
      description = "Go to game start";
    } else if (move === currentMove) {
      description = "You are at move #" + move;
    } else {
      description = "Go to move #" + move;
    }
    
    const location = item.location;
    const rowIndex = Math.floor(location / 3) + 1;
    const colIndex = location % 3 + 1;
    return (
      <li key={move}>
        {move !== currentMove ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <span>{description}</span>
        )}

        {move > 0 && `(${rowIndex},${colIndex})`}
      </li>
    );
  });



  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  if (squares.every(square => square !== null)) {
    return "Draw";
  }
  return null;
}

// In React, it’s conventional to use onSomething names for props which represent events and handleSomething for the function definitions which handle those events.

// Immutability makes complex features much easier to implement.
// Avoiding direct data mutation lets you keep previous versions of the data intact, and reuse them later.
// Immutability makes it very cheap for components to compare whether their data has changed or not.