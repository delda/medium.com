import { combineReducers } from 'redux';

import * as types from './types';

const emptyBoard = () => [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

const move = (board, { player, row, col }) => {
  const updated = board.slice();

  updated[row][col] = player;

  return updated;
};

const changeTurn = (player) => {
  return 3 - player;
};

const boardReducer = (state = [[]], action) => {
  switch (action.type) {
    case types.NEW_GAME:
      return emptyBoard();
    case types.MOVE:
      return move(state, action.payload);
    default:
      return state;
  }
};

const gameoverReducer = (state = false, action) => {
  switch (action.type) {
    case types.NEW_GAME:
      return false;
    case types.GAMEOVER:
      return true;
    case types.WINNER:
      return true;
    default:
      return state;
  }
};

const winnerReducer = (state = -1, action) => {
  switch (action.type) {
    case types.WINNER:
      return action.payload;
    case types.NEW_GAME:
      return -1;
    default:
      return state;
  }
};

const playerReducer = (state = 0, action) => {
  switch (action.type) {
    case types.NEW_GAME:
    case types.PLAYER:
      return action.payload;
    case types.GAMEOVER:
      return changeTurn(action.payload);
    default:
      return state;
  }
};

const aiReducer = (state = types.RANDOM, action) => {
  if (action.type === types.AI) return action.payload;
  return state;
};

export default combineReducers({
  board: boardReducer,
  gameover: gameoverReducer,
  winner: winnerReducer,
  player: playerReducer,
  ai: aiReducer
});