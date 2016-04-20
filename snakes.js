var myObstacles = [];
var myScore;
var snake;

function prepareGame() {
    myGameArea = new gameArea(48);
    myGameArea.create();
}

// parameter size is the number of squares per row
function gameArea(size) {
    this.size = size;
    this.canvas = document.getElementById("gameArea");
    this.pxPerSquare = 10;
    snake = new snake(this.pxPerSquare, this.size);
    
    this.create = function() {
        this.canvas.width = this.size * this.pxPerSquare;
        this.canvas.height = this.size * this.pxPerSquare;
        this.context = this.canvas.getContext("2d");
        this.drawGrid(size, this.pxPerSquare);

        snake.create(this.context);
        snake.move("up");

        this.frameNo = 0;
        //this.interval = setInterval(updateGameArea, 20);
    }

    this.drawGrid = function(num, px) {
        for (var i=1; i<num; i++) {
            this.context.beginPath();
            this.context.moveTo(0, px*i);
            this.context.lineTo(num*px, px*i);
            this.context.stroke();
        }

        for (var i=1; i<num; i++) {
            this.context.beginPath();
            this.context.moveTo(px*i, 0);
            this.context.lineTo(px*i, num*px);
            this.context.stroke();
        }
    }

    this.foodGenerator = function() {

    }

    this.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        switch (key) {
            case 37:
                snake.move("left");
                break;
            case 38:
                snake.move("up");
                break;
            case 39:
                snake.move("right");
                break;
            case 40:
                snake.move("down");
                break;
            default:
                alert("invalid input");
        }

    }
}

function snake(pxPerSquare, gameSize) {
    this.length = 1;
    this.size = gameSize;
    this.px = pxPerSquare;
    this.body = []

    this.create = function(context) {
        this.context = context;
        this.body.push({ x: Math.round(this.size/2) - 1, y: Math.round(this.size/2) - 1 });
        this.paintToSnakeBody(this.body[0]);
    }

    this.move = function(direction) {

        var newHead;
        switch(direction) {
            case "up": 
                newHead = { x: this.body[0].x, y: this.body[0].y - 1 }; 
                break;

            case "down":
                newHead = { x: this.body[0].x, y: this.body[0].y + 1 }; 
                break;

            case "left":
                newHead = { x: this.body[0].x - 1, y: this.body[0].y }; 
                break;

            case "right":
                newHead = { x: this.body[0].x + 1, y: this.body[0].y - 1 }; 
                break;

            default:
        }

        this.body.unshift(newHead);
        this.paintToSnakeBody(newHead);
        this.paintToCanvas(this.body.pop());

        return this.body;
    }

    this.eat = function() {

    }

    this.paintToSnakeBody = function(pos) {
        this.context.fillStyle="Black";
        this.context.fillRect(pos.x*this.px, pos.y*this.px, this.px, this.px);
    }

    this.paintToCanvas = function(pos) {
        this.context.fillStyle="Grey";
        this.context.fillRect(pos.x*this.px, pos.y*this.px, this.px, this.px);
    }
}



function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}