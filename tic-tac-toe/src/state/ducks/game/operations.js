/*
  Our operations are simple.  We can just forward the actions one for one.  Later on, 
  if we have more complex operations that require dispatching multiple actions, we can
  write them and export them here.
*/

import { newGame, gameover, switchPlayer, winner, movePlayer, aiAlgorithm } from './actions';
import { isWinner, isDraw } from '../../utils/game';
import * as types from './types';
import { Random } from '../../../ai/random';
import { Minimax } from '../../../ai/minimax';
import { MCTS } from '../../../ai/mcts';

// NOTE: we can probably use mapDispatchToProps in the component and dispatch each of these 
// actions one after another ourselves, but using redux-thunk to defer or conditionally 
// dispatch is better and keeps our code clean in the components and operations

const createGame = (player) => (dispatch) => {
  dispatch(newGame(player));
};

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
    dispatch(gameover(player));
  } else if (isDraw(board)) {
    dispatch(winner(0));
    dispatch(gameover(player));
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

  nextPlayer = 3 - player;

  dispatch(movePlayer(player, row, col));
  dispatch(switchPlayer(nextPlayer));
};

const computerTurn = (player, board, ai) => (dispatch) => {
  if (isWinner(board)) return false;

  let row;
  let col;
  let nextPlayer = 3 - player;

  if (!isItemInArray(board, 0)) {
    return false;
  }

  [row, col] = algorithmFactory
      .create({type: ai})
      .chooseMove(board, nextPlayer);

  dispatch(switchPlayer(nextPlayer));
  dispatch(playTurn(nextPlayer, board, row, col));
};

const changeAiAlgorithm = (ai) => (dispatch) => {
  dispatch(aiAlgorithm(ai));
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
      case types.MINIMAX:
        algorithm = new Minimax();
        break;
      case types.MCTS:
        algorithm = new MCTS();
        break;
      default:
        algorithm = new Random();
        break;
    }

    return algorithm;
  }
};

export {
  newGame, // lo lascio ancora perché presente nel TitleBar
  createGame,
  checkWinner,
  playTurn,
  computerTurn,
  changeAiAlgorithm
};