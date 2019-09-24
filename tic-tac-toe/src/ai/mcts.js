class MCTS {
    chooseMove(board, player) {
        let newBoard = board[0].concat(board[1], board[2]);
        let opponent = 3 - player;
        let times = 0;
        let tree = new Tree(newBoard, opponent);
        let rootNode = tree.root;

        while (times++ < 200) {
            let promisingNode = this.selection(rootNode);
            this.expansion(promisingNode);
            let winner = this.simulation(promisingNode.state, opponent);
            this.backpropagation(promisingNode, winner);
        }

        let bestChild = tree.root.bestChild(tree.root);
        return bestChild.coords();
    }

    selection(node) {
        if (node.children.length === 0) {
            return node;
        }

        let utc = new UTC();
        let childrenWeight = [];
        node.children.forEach(child => {
            childrenWeight.push(utc.calculate(node.state.simulations, child.state.wins, child.state.simulations));
        });

        let max = Math.max(...childrenWeight);
        let idx = childrenWeight.indexOf(max);

        return this.selection(node.children[idx]);
    }

    expansion(node) {
        if (node.state.checkResult() !== 0) {
            return node;
        }
        let possibleStates = node.state.getAllPossibleStates();
        possibleStates.forEach(state => {
            let newNode = new Node(state.board.positions, state.player);
            newNode.parent = node;
            node.children.push(newNode);
        });
    }

    simulation(state) {
        if (!state) {
            return;
        }

        let winner = state.checkResult();
        if (winner !== 0) {
            return winner;
        }

        let possibleStates = state.getAllPossibleStates();
        if (possibleStates.length === 0) {
            return winner;
        }

        return this.simulation(this.chooseRandomState(possibleStates));
    }

    backpropagation(node, player) {
        if (!node) {
            return;
        }

        node.state.simulations++;
        if (node.state.player === player) {
            node.state.wins++;
        }

        return this.backpropagation(node.parent, player);
    }

    chooseRandomState(states) {
        if (states.length > 0) {
            let idx = Math.floor(Math.random() * states.length);
            return states[idx];
        }

        return null;
    }
}

class Tree {
    constructor(board, player) {
        this.root = new Node(board, player);
    }
}

class Node {
    constructor(board, player) {
        this.state = new State(board, player);
        this.parent = null;
        this.children = [];
    }

    chooseRandomChildren() {
        if (this.children.length > 0) {
            let idx = Math.floor(Math.random() * this.children.length);
            return this.children[idx];
        }

        return null;
    }

    bestChild() {
        if (this.children.length === 0) {
            return null;
        }

        return this.children.reduce((prev, current) => {
            return (prev.state.simulations > current.state.simulations) ? prev : current;
        });
    }

    coords() {
        if (!this.parent) {
            return null;
        }

        let currentBoard = this.state.board.positions;
        let parentBoard = this.parent.state.board.positions;

        let boardDiff = currentBoard.reduce((carry, player, position) => {
            if (player !== parentBoard[position]) {
                carry.push(position);
            }
            return carry;
        }, []);

        return this.idxToCoord(boardDiff.pop());
    }

    idxToCoord(idx) {
        return [parseInt(idx / 3), idx % 3];
    }
}

class State {
    constructor(board, player) {
        this.board = new Board(board);
        this.player = player;
        this.wins = 10;
        this.simulations = 0;
    }

    getAllPossibleStates() {
        let states = [];
        let possibleMoves = this.board.getEmptyPositions();
        possibleMoves.forEach(movePosition => {
            let newState = new State(this.board.positions, this.switchPlayer());
            newState.board.move(movePosition, newState.player);
            states.push(newState);
        });

        return states;
    }

    switchPlayer() {
        return 3 - this.player;
    }

    checkResult() {
        return this.checkWinner(0, 1, 2)
            || this.checkWinner(3, 4, 5)
            || this.checkWinner(6, 7, 8)
            || this.checkWinner(0, 3, 6)
            || this.checkWinner(1, 4, 7)
            || this.checkWinner(2, 5, 8)
            || this.checkWinner(0, 4, 8)
            || this.checkWinner(6, 4, 2)
        ;
    }

    checkWinner(p1, p2, p3) {
        let table = this.board.positions;
        if (table[p1] === table[p2] && table[p2] === table[p3]) {
            return table[p1];
        }

        return 0;
    }
}

class Board {
    constructor(board) {
        switch (arguments.length) {
            case 0:
                this.positions = this.emptyBoard();
                break;
            case 1:
                this.positions = board.slice(0);
                break;
        }
    }

    emptyBoard() {
        return new Array(9).fill(0);
    }

    getEmptyPositions() {
        return this.positions.reduce((carry, value, idx) => { if (value === 0) carry.push(idx); return carry; }, []);
    }

    move(position, player) {
        this.positions[position] = player;
        return this;
    }
}

class UTC {
    calculate(totalVisits, nodeWins, nodeVisits) {
        if (nodeVisits === 0) {
            return Infinity;
        }

        return (nodeWins / nodeVisits) + (Math.sqrt(2) * Math.sqrt(Math.log(totalVisits) / nodeVisits));
    }
}

export {
    MCTS
};