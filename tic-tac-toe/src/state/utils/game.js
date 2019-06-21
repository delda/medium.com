
/**
 * Checks to see if there's a winner
 * @param {number[][]} board The game board
 * @param {number} player The player
 * @returns {boolean} True if there is a winner, false otherwise
 */
const isWinner = (board) => {
  return winner(board,1, 2, 3)
      || winner(board,4, 5, 6)
      || winner(board,7, 8, 9)
      || winner(board,1, 4, 7)
      || winner(board,2, 5, 8)
      || winner(board,3, 6, 9)
      || winner(board,1, 5, 9)
      || winner(board,7, 5, 3)
      ;
};

function winner(board, p1, p2, p3) {
  if ((value(board, p1) === value(board, p2))
      && (value(board, p2) === value(board, p3))) {
    return value(board, p1);
  }
  return 0;
}

function value(board, idx) {
  idx--;
  const row = parseInt(idx / 3);
  const col = idx % 3;
  // console.log('      '+idx+':'+row+'-'+col+'='+board[row][col]);

  return board[row][col];
}

/**
 * Checks to see if there's a draw on the board
 * NOTE: this function is meant to be called if isWinner returns false
 * @param {number[][]} board The game board
 */
const isDraw = (board) => {
  // if there are squares that have a 0 in them, that means the 
  // game is still in-progress
  const notDraw = board.some(row => row.some(col => col === 0));

  return !notDraw;
};

export {
  isWinner,
  isDraw
};