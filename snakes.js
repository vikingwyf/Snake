var myObstacles = [];
var food;
var snake;
var myGameArea;

function paintSquare(context, pos, px, color) {
    "use strict";
    var pxToPaint = px - 2;
    context.fillStyle = color;
    context.fillRect(pos.x * px + 1, pos.y * px + 1, pxToPaint, pxToPaint);
}

function paintToSnake(context, pos, px) {
    "use strict";
    paintSquare(context, pos, px, "Black");
}

function paintToCanvas(context, pos, px) {
    "use strict";
    paintSquare(context, pos, px, "Grey");
}

function Snake(pxPerSquare, gameSize) {
    
    "use strict";
    
    this.length = 1;
    this.size = gameSize;
    this.px = pxPerSquare;
    this.body = [];

    this.create = function (context) {
        this.context = context;
        this.body.push({ x: Math.round(this.size / 2) - 1, y: Math.round(this.size / 2) - 1 });
        this.body.push({ x: this.body[0].x, y: this.body[0].y + 1 });
        this.paintToSnakeBody(this.body[0]);
        this.paintToSnakeBody(this.body[1]);
    };

    this.move = function (direction) {

        var newHead;
        switch (direction) {
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
            newHead = { x: this.body[0].x + 1, y: this.body[0].y };
            break;

        default:
        }

        this.body.unshift(newHead);
        this.paintToSnakeBody(newHead);
        if (newHead.x === food.x && newhead.y === food.y) {
            
        } else {
            this.paintToCanvas(this.body.pop());
        }
        
        return this.body;
    };
    
    this.eat = function () {

    };

    this.paintToSnakeBody = function (pos) {
        var pxToPaint = this.px - 2;
        this.context.fillStyle = "Black";
        this.context.fillRect(pos.x * this.px + 1, pos.y * this.px + 1, pxToPaint, pxToPaint);
    };

    this.paintToCanvas = function (pos) {
        var pxToPaint = this.px - 2;
        this.context.fillStyle = "Grey";
        this.context.fillRect(pos.x * this.px + 1, pos.y * this.px + 1, pxToPaint, pxToPaint);
    };
}

// parameter size is the number of squares per row
function GameArea(size) {
    
    "use strict";
    
    this.size = size;
    this.canvas = document.getElementById("gameArea");
    this.pxPerSquare = 10;
    snake = new Snake(this.pxPerSquare, this.size);
    
    this.create = function () {
        this.canvas.width = this.size * this.pxPerSquare;
        this.canvas.height = this.size * this.pxPerSquare;
        this.context = this.canvas.getContext("2d");
        this.drawGrid(size, this.pxPerSquare);

        snake.create(this.context);

        this.frameNo = 0;
        //this.interval = setInterval(updateGameArea, 20);
    };

    this.drawGrid = function (num, px) {
        var i;
        for (i = 1; i < num; i++) {
            this.context.beginPath();
            this.context.moveTo(0, px * i);
            this.context.lineTo(num * px, px * i);
            this.context.stroke();
        }

        for (i = 1; i < num; i++) {
            this.context.beginPath();
            this.context.moveTo(px * i, 0);
            this.context.lineTo(px * i, num * px);
            this.context.stroke();
        }
    };

    this.foodGenerator = function () {
        
        while (true) {
            var gotIt = true;
            var x = Math.round(Math.random() * this.size);
            var y = Math.round(Math.random() * this.size);
            
            var snakeBody;
            for (snakeBody in snake.body) {
                if (x === snakeBody.x && y === snakeBody.y) {
                    gotIt = false;
                    break;
                }
            }
            if (gotIt === true) {
                food = { x: x, y: y };
                paintToSnake(this.context, food, this.pxPerSquare);
                break;
            }
        }
    };

    this.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    window.onkeyup = function (e) {
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
            //alert("invalid input");
        }

    };
}

function everyinterval(n) {
    "use strict";

}

function prepareGame() {
    "use strict";
    myGameArea = new GameArea(48);
    myGameArea.create();
    
    myGameArea.foodGenerator();
}
