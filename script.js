const board = Array(9).fill('');
const human = 'O';
const ai = 'X';
let currentPlayer = human;
let playerScore = 0;
let aiScore = 0;

const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');

// Check for winner or draw
function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes('') ? null : 'Draw';
}

// Minimax Algorithm
function minimax(board, depth, isMaximizing) {
    const result = checkWinner(board);
    if (result === ai) return 10 - depth;
    if (result === human) return depth - 10;
    if (result === 'Draw') return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = ai;
                const eval = minimax(board, depth + 1, false);
                board[i] = '';
                maxEval = Math.max(maxEval, eval);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = human;
                const eval = minimax(board, depth + 1, true);
                board[i] = '';
                minEval = Math.min(minEval, eval);
            }
        }
        return minEval;
    }
}

// Find best move for AI
function findBestMove() {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = ai;
            const score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

// Handle user move
function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] || checkWinner(board)) return;

    board[index] = human;
    e.target.textContent = human;
    e.target.classList.add('taken');

    const winner = checkWinner(board);
    if (winner) {
        if (winner === human) playerScore++;
        updateScores(winner);
        return;
    }

    // AI move
    const aiMove = findBestMove();
    board[aiMove] = ai;
    cells[aiMove].textContent = ai;
    cells[aiMove].classList.add('taken');

    const aiWinner = checkWinner(board);
    if (aiWinner) {
        if (aiWinner === ai) aiScore++;
        updateScores(aiWinner);
    }
}

// Update scores and status
function updateScores(winner) {
    if (winner === 'Draw') {
        statusText.textContent = "It's a Draw!";
    } else {
        statusText.textContent = `${winner} Wins!`;
    }
    playerScoreEl.textContent = playerScore;
    aiScoreEl.textContent = aiScore;
}

// Reset the game
function resetGame() {
    board.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
    statusText.textContent = '';
    currentPlayer = human;
}

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
