// Declare game variables
let board = [];
let currentPlayer = "X";
let gridSize = 3;
let winStreak = 3;
let movesMade = 0;
let gameOver = false;
let playerXIcon = "X";
let playerOIcon = "O";

function initializeGame() {
  // Get user-defined grid size and win streak
  gridSize = parseInt(document.getElementById("grid-size").value);
  winStreak = parseInt(document.getElementById("win-streak").value);

  // Get selected icons for players
  playerXIcon = document.getElementById("player-x-icon").value;
  playerOIcon = document.getElementById("player-o-icon").value;

  // Validation: Grid size must be between 3 and 10
  if (gridSize < 3 || gridSize > 10) {
    alert("Grid size must be between 3 and 10.");
    return;
  }

  // Validation: Win streak must be between 3 and gridSize
  if (winStreak < 3 || winStreak > gridSize) {
    alert(`Win streak must be between 3 and ${gridSize}.`);
    return;
  }

  // Reset moves and game state
  movesMade = 0;
  gameOver = false;
  currentPlayer = "X";
  board = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

  // Clear and setup the game board dynamically
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = ""; // Clear previous board
  gameDiv.classList.add("board");
  gameDiv.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`; // Set grid size

  // Show the game board and reset button
  gameDiv.removeAttribute("hidden");
  document.getElementById("reset").removeAttribute("hidden");

  // Create the board cells based on grid size
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-col", j);
      cell.addEventListener("click", handleCellClick); // Add click event listener
      gameDiv.appendChild(cell); // Add cell to the game board
    }
  }

  // Update status to show current player's turn
  document.getElementById(
    "status"
  ).textContent = `Player ${currentPlayer}'s turn (${
    currentPlayer === "X" ? playerXIcon : playerOIcon
  })`;
}

function handleCellClick(event) {
  if (gameOver) return; // Do nothing if game is over

  // Get the clicked cell's row and column
  const row = event.target.getAttribute("data-row");
  const col = event.target.getAttribute("data-col");

  // Check if the cell is empty before marking
  if (board[row][col] === "") {
    board[row][col] = currentPlayer; // Mark the board
    event.target.textContent =
      currentPlayer === "X" ? playerXIcon : playerOIcon; // Update UI
    movesMade++; // Increment move count

    // Check if the current move results in a win or a draw
    if (checkWin(parseInt(row), parseInt(col))) {
      document.getElementById(
        "status"
      ).textContent = `Player ${currentPlayer} wins!`;
      gameOver = true; // End game if there's a winner
    } else if (movesMade === gridSize * gridSize) {
      document.getElementById("status").textContent = `It's a draw!`;
      gameOver = true; // Declare draw if all cells are filled
    } else {
      // Switch player for next turn
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      document.getElementById(
        "status"
      ).textContent = `Player ${currentPlayer}'s turn (${
        currentPlayer === "X" ? playerXIcon : playerOIcon
      })`;
    }
  }
}

function checkWin(row, col) {
  return (
    checkDirection(row, col, 0, 1) || // Horizontal check
    checkDirection(row, col, 1, 0) || // Vertical check
    checkDirection(row, col, 1, 1) || // Diagonal (down-right) check
    checkDirection(row, col, 1, -1)
  ); // Diagonal (up-right) check
}

function checkDirection(row, col, rowIncrement, colIncrement) {
  let count = 1; // Count the current cell

  // Check in the positive direction (e.g., right, down-right)
  for (let i = 1; i < winStreak; i++) {
    const newRow = row + i * rowIncrement;
    const newCol = col + i * colIncrement;
    if (
      newRow >= 0 &&
      newRow < gridSize &&
      newCol >= 0 &&
      newCol < gridSize &&
      board[newRow][newCol] === currentPlayer
    ) {
      count++;
    } else {
      break; // Stop
    }
  }

  // Check in the negative direction (e.g., left, up-left)
  for (let i = 1; i < winStreak; i++) {
    const newRow = row - i * rowIncrement;
    const newCol = col - i * colIncrement;
    if (
      newRow >= 0 &&
      newRow < gridSize &&
      newCol >= 0 &&
      newCol < gridSize &&
      board[newRow][newCol] === currentPlayer
    ) {
      count++;
    } else {
      break; // Stop
    }
  }

  return count >= winStreak; // Return true if win streak is reached
}
