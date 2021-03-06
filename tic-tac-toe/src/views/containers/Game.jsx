import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';

import { gameOperations, gameTypes } from '../../state/ducks/game';

import Board from '../components/Board.jsx';
import PlayerInfo from '../components/PlayerInfo.jsx';
import GameoverDialog from '../components/GameoverDialog.jsx';
import DropdownAI from "../components/DropdownAI.jsx";
import { emptyBoard } from "../../state/ducks/game/reducers";

class Game extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { showDialog: false };

    // binding 'this' to the handler so we can use 'this' to refer to props of this class
    this.handleBoardOnMove = this.handleBoardOnMove.bind(this);
    this.handleSelectAlgorithm = this.handleSelectAlgorithm.bind(this);
    this.handleDialogClick = this.handleDialogClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleBoardOnMove(square) {
    // when a square is clicked we want to mark that square for the current player
    const { board, player, gameover, playTurn, computerTurn, checkWinner, ai } = this.props;
    const { row, col } = square;

    // only mark if the game is still in progress and the square is empty (none)
    // otherwise, ignore the play
    if (gameover || board[row][col] !== 0) {
      return;
    }

    // make a play for the player
    playTurn(player, board, row, col);
    computerTurn(player, board, ai);

    // then check for a winner
    const hasWinner = checkWinner(board, player);

    if (hasWinner) {
      this.setState({ showDialog: true });
    }
  }

  handleSelectAlgorithm(event) {
    const { changeAiAlgorithm } = this.props;
    changeAiAlgorithm(parseInt(event.target.value));
  }

  handleDialogClick(answer) {
    const { player, computerTurn, ai } = this.props;

    // we always want to close the dialog
    this.setState({ showDialog: false });

    // we only want to start a new game if the player clicks 'yes'
    if (answer) {
      this.props.createGame(this.props.player);

      if (this.props.playerTurn === 2) {
        computerTurn(player, emptyBoard(), ai);
      }
    }
  }

  handleDialogClose() {
    // close the dialog
    this.setState({ showDialog: false });
  }

  render() {
    const { showDialog } = this.state;
    const { board, player, playerTurn, gameover, winner, ai } = this.props;
    const draw = winner === 0;

    return (
      // at extra-small (xs) size the grid show have two rows
      // at small (sm+) and above we want 2 columns
      // Grid 'item' in a container must have columns (xs, sm, md, etc.) that add up to 12, per grid docs:
      // https://material-ui-next.com/layout/grid/
      <div>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6} md={4}>
            <Board board={board} ai={ai} onMove={this.handleBoardOnMove} />
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <PlayerInfo player={player} gameover={gameover} playerTurn={playerTurn} />
          </Grid>
        </Grid>
        <GameoverDialog
          open={showDialog}
          isDraw={draw}
          player={winner}
          playerTurn={playerTurn}
          onClick={this.handleDialogClick}
          onClose={this.handleDialogClose} />
        <DropdownAI
            onClick={this.handleSelectAlgorithm}
            options={[
              { text: "Random", value: gameTypes.RANDOM },
              { text: "Minimax", value: gameTypes.MINIMAX },
              { text: "Monte Carlo Tree Search", value: gameTypes.MCTS }
            ]} />
      </div>
    );
  }
}

const { arrayOf, number, func, bool } = PropTypes;

// we want to list our props for validation even though 
// we are using react-redux to map our state and dispatch
// to the props of this Game component
Game.propTypes = {
  board: arrayOf(arrayOf(number)).isRequired,
  player: number.isRequired,
  playerTurn: number.isRequired,
  winner: number.isRequired,
  gameover: bool.isRequired,
  playTurn: func.isRequired,
  checkWinner: func.isRequired,
  createGame: func.isRequired,
  ai: number.isRequired
};

const mapStateToProps = (state) => {
  const { gameState } = state;

  return {
    board: gameState.board,
    player: gameState.player,
    playerTurn: gameState.playerTurn,
    gameover: gameState.gameover,
    winner: gameState.winner,
    ai: gameState.ai
  };
};

const mapDispatchToProps = {
  playTurn: gameOperations.playTurn,
  checkWinner: gameOperations.checkWinner,
  createGame: gameOperations.createGame,
  computerTurn: gameOperations.computerTurn,
  changeAiAlgorithm: gameOperations.changeAiAlgorithm
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
