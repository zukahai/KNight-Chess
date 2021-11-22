game_W = 0, game_H = 0;
sizeChess = sizeBlock = 0;
Xalignment = Yalignment = 0;

let KNightIM = new Image();
KNightIM.src = "images/knight.png";
let rockIM = new Image();
rockIM.src = "images/rock.png";
xKNight = yKNight = 3;
xKNight2 = yKNight2 = xDestination = yDestination = 0;
typeMove = 0;
N = 8;
Nrock = 10;
data = Array.from(new Array(N), () => Array.from(new Array(N), () => 0));
win = false;
step = 1;
level = 1;

blockArrived = []

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.initData();

        this.loop();

        this.listenMouse();
        this.listenTouch();
    }

    initData() {
        let k = 2;
        if (level < 3) {
            Nrock = 20;
            k = 2;
        }

        if (level >= 10) {
            Nrock = 15;
            k = 3;
        }

        if (level >= 20) {
            Nrock = 10;
            k = 4;
        }

        if (level >= 30) {
            Nrock = 10;
            k = 5;
        }
        blockArrived = [];
        this.chessBoard = new chessboard(this);
        this.render();
        do {
            this.randomData();
            step = this.bfs().length - 1;
            Nrock--;
        } while (step < k);
        console.log(Nrock, ' ', step);
    }

    listenTouch() {
        document.addEventListener("touchmove", evt => {
            if (win)
                return;
            var y = evt.touches[0].pageY;
            var x = evt.touches[0].pageX;
            if (x <= Xalignment + sizeBlock / 2)
                x = Xalignment + sizeBlock / 2;
            if (y <= Yalignment + sizeBlock / 2)
                y = Yalignment + sizeBlock / 2;
            if (x >= Xalignment + sizeChess - sizeBlock / 2)
                x = Xalignment + sizeChess - sizeBlock / 2;
            if (y >= Yalignment + sizeChess)
                y = Yalignment + sizeChess - sizeBlock / 2;
            if (typeMove == 1) {
                xKNight2 = x;
                yKNight2 = y;
            }

        })

        document.addEventListener("touchstart", evt => {
            if (win)
                return;
            var y = evt.touches[0].pageY;
            var x = evt.touches[0].pageX;
            let Y = Math.floor((x - Xalignment) / sizeBlock);
            let X = Math.floor((y - Yalignment) / sizeBlock);
            console.log(X, ' ', Y);
            if (X == xKNight && Y == yKNight) {
                typeMove = 1;
                xKNight2 = x;
                yKNight2 = y;
            }


        })

        document.addEventListener("touchend", evt => {
            if (win)
                return;
            let Y = Math.floor((xKNight2 - Xalignment) / sizeBlock);
            let X = Math.floor((yKNight2 - Yalignment) / sizeBlock);

            // console.log(X, ' ', Y, ' ', xKNight, ' ', yKNight);

            if (typeMove == 1 && (Math.abs(X - xKNight) * Math.abs(Y - yKNight) == 2) && (data[X][Y] == 0 || data[X][Y] == 4)) {
                xKNight = X;
                yKNight = Y;
                data[X][Y] = 2;
                blockArrived.push({ x: xKNight, y: yKNight });
                step--;

                if (X == xDestination && Y == yDestination) {
                    this.initData();
                    level++;
                    console.log("Win");
                } else if (step == 0) {
                    window.alert("Lost");
                }

            }
            typeMove = 0;
        })
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            if (win)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            let Y = Math.floor((x - Xalignment) / sizeBlock);
            let X = Math.floor((y - Yalignment) / sizeBlock);
            console.log(X, ' ', Y);
            if (X == xKNight && Y == yKNight) {
                typeMove = 1;
                xKNight2 = x;
                yKNight2 = y;
            }
        })

        document.addEventListener("mousemove", evt => {
            if (win)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (x <= Xalignment + sizeBlock / 2)
                x = Xalignment + sizeBlock / 2;
            if (y <= Yalignment + sizeBlock / 2)
                y = Yalignment + sizeBlock / 2;
            if (x >= Xalignment + sizeChess - sizeBlock / 2)
                x = Xalignment + sizeChess - sizeBlock / 2;
            if (y >= Yalignment + sizeChess - sizeBlock / 2)
                y = Yalignment + sizeChess - sizeBlock / 2;
            if (typeMove == 1) {
                xKNight2 = x;
                yKNight2 = y;
            }
        })

        document.addEventListener("mouseup", evt => {
            if (win)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            let Y = Math.floor((xKNight2 - Xalignment) / sizeBlock);
            let X = Math.floor((yKNight2 - Yalignment) / sizeBlock);

            // console.log(X, ' ', Y, ' ', xKNight, ' ', yKNight);

            if (typeMove == 1 && (Math.abs(X - xKNight) * Math.abs(Y - yKNight) == 2) && (data[X][Y] == 0 || data[X][Y] == 4)) {
                xKNight = X;
                yKNight = Y;
                data[X][Y] = 2;
                blockArrived.push({ x: xKNight, y: yKNight });
                step--;

                if (X == xDestination && Y == yDestination) {
                    this.initData();
                    console.log("Win");
                    level++;
                } else if (step == 0) {
                    window.alert("Lost");
                }

            }
            typeMove = 0;
        })
    }

    isPoint(x, y) {
        if (x < 0)
            return false;
        if (y < 0)
            return false;
        if (x >= N)
            return false;
        if (y >= N)
            return false;
        return true;
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 30);
    }

    update() {
        this.render();
    }

    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;

            let min = this.canvas.width;
            if (this.canvas.height < min)
                min = this.canvas.height;

            sizeBlock = min / (N + 2);
            sizeChess = N * sizeBlock;

            Xalignment = (game_W - min) / 2 + sizeBlock;
            Yalignment = (game_H - min) / 2 + 3 * sizeBlock / 2;
            if (game_W < game_H)
                Yalignment = (game_H - min) / 2 + sizeBlock;
        }
    }

    bfs() {
        let stack = [];
        let a = Array.from(new Array(N * N), () => -1);
        stack.push({ x: xKNight, y: yKNight });
        a[xKNight * N + yKNight] = -100;
        let index = 0;
        let x, y;
        while (index < stack.length) {
            let i = stack[index].x;
            let j = stack[index].y;
            let xArr = [i - 1, i - 2, i + 1, i + 2, i + 2, i + 1, i - 1, i - 2];
            let yArr = [j + 2, j + 1, j + 2, j + 1, j - 1, j - 2, j - 2, j - 1];

            for (let I = 0; I < xArr.length; I++) {
                x = xArr[I];
                y = yArr[I];
                if (this.isPoint(x, y) && a[x * N + y] == -1 && data[x][y] != 1) {
                    a[x * N + y] = i * N + j;
                    stack.push({ x: x, y: y });
                }
            }
            index++;
        }
        let ans = [{ x: xDestination, y: yDestination }];
        x = xDestination;
        y = yDestination;
        if (a[x][y] == -1)
            return ans;
        while (a[x * N + y] != -100) {
            let k = a[x * N + y];
            x = Math.floor(k / N);
            y = k % N;
            ans.push({ x: x, y: y });
        }
        return ans;
    }

    randomData() {
        data = Array.from(new Array(N), () => Array.from(new Array(N), () => 0));
        // data[xKNight][yKNight] = 2;
        let x, y;
        x = xKNight = Math.round(Math.random() * (N * N * N)) % N;
        y = yKNight = Math.round(Math.random() * (N * N * N)) % N;
        blockArrived[0] = { x: xKNight, y: yKNight };
        data[x][y] = 3;

        do {
            x = Math.round(Math.random() * (N * N * N)) % N;
            y = Math.round(Math.random() * (N * N * N)) % N;
        } while (data[x][y] == 1);

        for (let i = 0; i < Nrock; i++) {
            do {
                x = Math.round(Math.random() * (N * N * N)) % N;
                y = Math.round(Math.random() * (N * N * N)) % N;
            } while (data[x][y] > 0);
            data[x][y] = 1;
        }

        do {
            x = Math.round(Math.random() * (N * N * N)) % N;
            y = Math.round(Math.random() * (N * N * N)) % N;
        } while (data[x][y] > 0);
        xDestination = x;
        yDestination = y;
        data[xDestination][yDestination] = 4;
        console.log(data);
    }

    draw() {
        this.clearScreen();
        this.chessBoard.draw();
        this.drawRock();
        this.drawDestination();
        this.drawBlockArrived();
        this.drawNextKnight();
        this.drawKnight(typeMove);
        this.drawText();
    }

    drawRock() {
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++)
                if (data[i][j] == 1) {
                    let w = sizeBlock / 1.3;
                    let X = Xalignment + j * sizeBlock + (sizeBlock - w) / 2;
                    let Y = Yalignment + i * sizeBlock + (sizeBlock - w) / 2;
                    this.context.drawImage(rockIM, X, Y, w, w);
                }
    }

    drawText() {
        this.context.font = this.getSize() / 1.5 + 'px Arial Black';
        this.context.fillStyle = "#FF00CC";
        let s = " steps"
        if (step < 2)
            s = " step"
        this.context.textAlign = "center";
        this.context.fillText(step + s + " left to get to the red box", game_W / 2, Yalignment - sizeBlock / 2);
        this.context.fillText("Level " + level, game_W / 2, Yalignment + sizeBlock / 2 + sizeChess);
    }

    drawKnight(type) {
        if (type == 0)
            this.context.drawImage(KNightIM, Xalignment + yKNight * sizeBlock, Yalignment + xKNight * sizeBlock, sizeBlock, sizeBlock);
        if (type == 1)
            this.context.drawImage(KNightIM, xKNight2 - sizeBlock / 2, yKNight2 - sizeBlock / 2, sizeBlock, sizeBlock);
    }

    drawNextKnight() {
        this.context.fillStyle = '#33CC99';
        for (let i = 0; i < N; i++)
            for (let j = 0; j < N; j++)
                if (Math.abs(i - xKNight) * Math.abs(j - yKNight) == 2 && (data[i][j] == 0 || data[i][j] == 4)) {
                    let R = sizeBlock / 3;
                    let X = Xalignment + j * sizeBlock + sizeBlock / 2;
                    let Y = Yalignment + i * sizeBlock + sizeBlock / 2;

                    this.context.beginPath();
                    this.context.arc(X, Y, R, 0, 2 * Math.PI);
                    this.context.fill();
                }
    }

    drawBlockArrived() {
        this.context.fillStyle = 'green';
        for (let i = 0; i < blockArrived.length; i++) {
            let X = Xalignment + blockArrived[i].y * sizeBlock;
            let Y = Yalignment + blockArrived[i].x * sizeBlock;
            this.context.fillRect(X, Y, sizeBlock + 1, sizeBlock + 1);
        }
    }

    drawDestination() {
        this.context.fillStyle = 'red';
        let X = Xalignment + yDestination * sizeBlock;
        let Y = Yalignment + xDestination * sizeBlock;
        this.context.fillRect(X, Y, sizeBlock + 1, sizeBlock + 1);
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, game_W, game_H);
    }

    getSize() {
        var area = game_W * game_H;
        return Math.sqrt(area / 300);
    }
}

var g = new game();