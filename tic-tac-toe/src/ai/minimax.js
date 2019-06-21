import { isWinner } from '../state/utils/game';

class Minimax {
    chooseMove(board, player) {
        const moves = this.findMoves(board);
        let currentMax = -Infinity;
        let currentCoordinate = [];
        let boardClone;
        let max;
        for (let i = 0; i < moves.length; i++) {
            boardClone = JSON.parse(JSON.stringify(board));
            boardClone[moves[i][0]][moves[i][1]] = player;

            max = this.minimax(boardClone, player, 1, player);
            if (max > currentMax) {
                currentMax = max;
                currentCoordinate = moves[i];
            }
        }
        return currentCoordinate;
    }

    minimax(board, player, depth, basePlayer) {
        let winner = isWinner(board);
        if (winner) {
            return (winner === basePlayer) ? 10 : -10;
        }

        const moves = this.findMoves(board);
        if (moves.length === 0) {
            return 0;
        }

        let best = (depth % 2 === 0) ? -Infinity : Infinity;
        let nextPlayer = (player === 1) ? 2 : 1;
        let boardClone = [];

        for (let i = 0; i < moves.length; i++) {
            boardClone = JSON.parse(JSON.stringify(board));
            const x = moves[i][0];
            const y = moves[i][1];
            boardClone[x][y] = nextPlayer;

            if (depth % 2 === 0){
                best = Math.max(
                    this.minimax(boardClone, nextPlayer, depth + 1, basePlayer),
                    best);
            } else {
                best = Math.min(
                    this.minimax(boardClone, nextPlayer, depth + 1, basePlayer),
                    best);
            }
        }

        return best;
    }

    findMoves(board) {
        let moves = [];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j] === 0) {
                    moves.push([i,j]);
                }
            }
        }
        return moves;
    }

};

export {
    Minimax
};