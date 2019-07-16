/*
  These are the different actions of the game duck.  Note that these are different than
  operations of the duck.
*/

import * as types from './types';

const newGame = (player) => ({
  type: types.NEW_GAME,
  payload: player
});

const gameover = (player) => ({
  type: types.GAMEOVER,
  payload: player
});

const movePlayer = (player, row, col) => ({
  type: types.MOVE,
  payload: { player, row, col }
});

const switchPlayer = player => ({
  type: types.PLAYER,
  payload: player
});

const winner = player => ({
  type: types.WINNER,
  payload: player
});

const aiAlgorithm = algorithm => ({
  type: types.AI,
  payload: algorithm
});

export {
  newGame,
  gameover,
  movePlayer,
  switchPlayer,
  winner,
  aiAlgorithm
};