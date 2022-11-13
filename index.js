import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
    let btnClass = props.color ? "winnerSquare" : "square"

    return (
        <button className={btnClass} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

  
class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                color={this.props.colors[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
          <div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            colors: Array(9).fill(false),
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        } else if (calculateLoss(squares)) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const loss = calculateLoss(current.squares);
        const colors = this.state.colors.slice();

        const moves = history.map((step, move) => {
          const desc = move ? 
            'Go to move #' + move :
            'Go to game start';
          return (
            <li key={move}>
              <button className="moveButton" onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          )
        })

        let status;
        if (winner) {
            status = "And the winner is... " + winner.side + '!';
            for (let i = 0; i < winner.line.length; i++) {
                colors[winner.line[i]] = true;
            }
        } else if (loss) {
            status = "It's a tie.";
        } else {
            status = "Your turn: " + (this.state.xIsNext ? 'X': 'O');
        }

        const resultGif = () => {
            if (winner) {
                return (
                    <img src={ require('./assets/winner.gif') } alt="Winner!" />
                )
            } else if (loss) {
                return (
                    <img src={ require('./assets/tie.gif')} alt="Tie!" />
                )
            }
        }

        return ( 
          <div className="game-page">
            <div className="game-header">
                <h1>Tic-Tac-Toe</h1>
                <p>This is a simple game of tic-tac-toe. Enjoy!</p>
            </div>
            <div className="game-board">
                <Board
                  squares={current.squares}
                  colors={colors}
                  onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div className="game-status">{status}</div>
                <ol>{moves}</ol>
            </div>
            <div className="game-result-image">
                {resultGif()}
            </div>
          </div>
        );
    }
}
  

// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

class Winner {
    constructor(side, line) {
        this.side = side
        this.line = line
    }
}

function calculateLoss(squares) {
    
    if (squares.every(square => square !== null)) {
        return true;
    }
    return false;
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
            return new Winner(squares[a], [a, b, c]);
        }
    }
    
    return null;
}
