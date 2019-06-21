/*
  Our operations are simple.  We can just forward the actions one for one.  Later on, 
  if we have more complex operations that require dispatching multiple actions, we can
  write them and export them here.
*/

import { newGame, gameover, switchPlayer, winner, movePlayer } from './actions';
import { isWinner, isDraw } from '../../utils/game';
import * as types from './types';
import { Random } from '../../../ai/random';
import { Minimax } from '../../../ai/minimax';

// NOTE: we can probably use mapDispatchToProps in the component and dispatch each of these 
// actions one after another ourselves, but using redux-thunk to defer or conditionally 
// dispatch is better and keeps our code clean in the components and operations

/**
 * Checks for a winner, if there is one, we dispatch two actions, one for winning the 
 * game (winner) and another for gameover.
 * If there isn't a winner, we need to check to see if the game ended in a draw, if so
 * we dispatch the same two actions, but with the player being NONE (0).
 * Finally, do nothing if the above two conditions aren't met.
 * @param {number[][]} board The game board
 * @param {number} player The current player
 * @returns {boolean} True, if there is a winner or a draw, false otherwise
 */
const checkWinner = (board, player) => (dispatch) => {
  // the logic to check if a player has won or the game ended in a draw are in 
  // the utils/game.js file.

  // instead of returning a promise like we would if we were making an api call
  // from our operations, we just return a boolean for the game winner
  let hasWinner = true;

  const winnerPlayer = isWinner(board);
  if (winnerPlayer) {
    dispatch(winner(winnerPlayer));
    dispatch(gameover());
  } else if (isDraw(board)) {
    dispatch(winner(0));
    dispatch(gameover());
  } else {
    hasWinner = false;
  }

  return hasWinner;
};

/**
 * When a player plays a turn we need to mark that spot on the board.  We then need to 
 * switch to the next player
 * @param {number} player The current player
 * @param {number} row The row on the board
 * @param {number} col The column on the board
 */
const playTurn = (player, board, row, col) => (dispatch) => {
  let nextPlayer;

  switch (player) {
    case 1:
      nextPlayer = 2;
      break;
    case 2:
      nextPlayer = 1;
      break;
    default:
      // throw error?
      break;
  }

  dispatch(movePlayer(player, row, col));
  dispatch(switchPlayer(nextPlayer));
};

const computerTurn = (player, board) => (dispatch) => {
  let row = 0;
  let col = 0;
  let nextPlayer = (player === 1) ? 2 : 1;

  if (!isItemInArray(board, 0)) {
    return false;
  }

  [row, col] = algorithmFactory
      .create({type: types.RANDOM})
      .chooseMove(board, nextPlayer);

  dispatch(switchPlayer(nextPlayer));
  dispatch(playTurn(nextPlayer, board, row, col));
};

const isItemInArray = (array, item) => {
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j <array[i].length; j++) {
      if (array[i][j] === item) {
        return true;
      }
    }
  }
  return false;
};

const algorithmFactory = {
  create: function(options) {
    var algorithm;
    switch (options.type) {
      case types.RANDOM:
        algorithm = new Random();
        break;
      case types.MINIMAX:
        algorithm = new Minimax();
        break;
      default:
        algorithm = new Random();
        break;
    }

    return algorithm;
  }
};

export {
  newGame,
  checkWinner,
  playTurn,
  computerTurn
};