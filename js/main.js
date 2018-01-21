const options = document.querySelector("#options");
const boardEl = document.querySelector("#board");
const squares = document.querySelectorAll(".square");
const button = document.querySelector("button");
const messageBox = document.querySelector("#message");
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

let board;
let aiPlayer;
let huPlayer;

startGame();

function setupGame(choice) {
  board = Array.from(Array(9).keys(null));
  huPlayer = choice;
  aiPlayer = huPlayer === "X" ? "O" : "X";

  options.style.display = "none";
  boardEl.style.display = "grid";

  squares.forEach(square => {
    square.addEventListener("click", markSquare);
  });

  if (aiPlayer === "X") {
    turn(bestSpot(), aiPlayer);
  }

  options.style.display = "none";
}

function startGame() {
  options.style.display = "block";
  boardEl.style.display = "none";
  button.style.opacity = "0";
  messageBox.style.display = "none";
  boardEl.style.backgroundColor = "#ddd";

  squares.forEach(square => {
    square.style.transform = "scale(1)";
    square.style.boxShadow = "none";
    square.style.borderRadius = "0";
    square.textContent = "";
    square.style.backgroundColor = "#eee";
  });
}

function markSquare(square) {
  let squareIndex = parseInt(square.target.getAttribute("data-num"));
  if (square.target.textContent === "") {
    turn(squareIndex, huPlayer);
    if (!checkWin(board, huPlayer) && !checkTie()) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareIndex, player) {
  // squareElem.textContent = player;
  squares[squareIndex].textContent = player;
  board[squareIndex] = player;
  const gameWon = checkWin(board, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let gameWon = null;
  let markedBoard = board.reduce(
    (accumulator, currentsquare, index) =>
      //initial value of  accumulator is set to []
      //if the current player is marked on the board the index of the marked square will be pushed into the new array
      currentsquare === player ? accumulator.concat(index) : accumulator,
    []
  );

  for ([index, row] of winningCombos.entries()) {
    if (row.every(elem => markedBoard.indexOf(elem) > -1)) {
      //checks if every item from each row matches the current marked squares of the board
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function checkEmptySquares() {
  return board.filter((square, index) => index === square);
  // return board.filter(square => typeof square === "number");
}

function checkTie() {
  if (checkEmptySquares().length === 0) {
    for (let i = 0; i < squares.length; i++) {
      squares[i].style.backgroundColor = "rgba(235, 221, 96, 0.4)";
      squares[i].removeEventListener("click", markSquare, false);
    }
    messageBox.style.backgroundColor = "rgba(235, 221, 96, 0.5)";
    button.style.opacity = "1";
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function declareWinner(message) {
  messageBox.style.display = "block";
  document.querySelector("#message h1").textContent = message;
}

function bestSpot() {
  return minimax(board, aiPlayer).index;
}

function minimax(newBoard, player) {
  let availSpots = checkEmptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function gameOver(gameWon) {
  for (let index of winningCombos[gameWon.index]) {
    if (gameWon.player == huPlayer) {
      squares[index].style.backgroundColor = "green";
    } else {
      squares[index].style.backgroundColor = "rgba(255, 105, 105, 0.4)";
      messageBox.style.backgroundColor = "rgba(255, 105, 105, 0.5)";
      squares[index].style.boxShadow = "2px 2px 22px -4px rgba(0, 0, 0, 0.6)";
      squares[index].style.borderRadius = "50%";
      squares[index].style.transform = "scale(0.8)";
      boardEl.style.backgroundColor = "#eee";
    }
  }
  for (let i = 0; i < squares.length; i++) {
    squares[i].removeEventListener("click", markSquare, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
  button.style.opacity = "1";
}
