class Random {
    chooseMove(board) {
        const possibleTris =
            this.possibleTris(board,1, 2, 3)
            || this.possibleTris(board,4, 5, 6)
            || this.possibleTris(board,7, 8, 9)
            || this.possibleTris(board,1, 4, 7)
            || this.possibleTris(board,2, 5, 8)
            || this.possibleTris(board,3, 6, 9)
            || this.possibleTris(board,1, 5, 9)
            || this.possibleTris(board,7, 5, 3)
            ;

        if (possibleTris !== false) {
            return this.getCoord(possibleTris);
        }

        return this.getRandom(board);
    }

    possibleTris(board, p1, p2, p3) {
        const that = this;
        const originalValues = [p1 ,p2, p3];
        const boardValues = originalValues.map(function (idx) {
            return that.value(board, idx);
        });
        const sumValues = boardValues.reduce(function (carry, val) {
            return carry + val;
        });
        if (sumValues === 2 || sumValues === 4) {
            var filteredValues = boardValues.filter(function (val) {
                return val === 0;
            });
            if (filteredValues.length === 1) {
                return originalValues[boardValues.indexOf(0)];
            }
        }

        return false;
    }

    value(board, idx) {
        let row, col;
        [row, col] = this.getCoord(idx);

        return board[row][col];
    }

    getCoord(idx) {
        idx--;
        const row = parseInt(idx / 3);
        const col = idx % 3;
        return [row, col];
    }

    getRandom(board) {
        let randomIndex, row, col;

        do {
            randomIndex = Math.floor(Math.random() * 9);
            row = parseInt(randomIndex / 3);
            col = randomIndex % 3;
        } while (board[row][col] !== 0);

        return [row, col];
    }
};

export {
    Random
};