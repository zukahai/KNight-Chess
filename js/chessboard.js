class chessboard {
    constructor(game) {
        this.game = game;
    }

    draw() {
        let color = ['#808080', '#C0C0C0'];
        this.game.context.fillStyle = '#808080';
        this.game.context.fillRect(Xalignment, Yalignment, 8 * sizeBlock, 8 * sizeBlock);
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++) {
                this.game.context.fillStyle = color[(i + j) % 2];
                let X = Xalignment + j * sizeBlock;
                let Y = Yalignment + i * sizeBlock;
                this.game.context.fillRect(X, Y, sizeBlock + 1, sizeBlock + 1);
            }
    }
}