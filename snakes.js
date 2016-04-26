
var gameSize = 64;
var snakeMoveInterval;
var monsterMoveInterval;
var food;
var snake;
var myGameArea;
var monsters = [];

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

function paintToMonster(context, pos, px) {
    "use strict";
    paintSquare(context, pos, px, "Yellow");
}

function paintToCanvas(context, pos, px) {
"use strict";
    paintSquare(context, pos, px, "Grey");
}

function generateAMonster() {
	"using strict";
    var x = Math.round(Math.random() * gameSize);
    var y = Math.round(Math.random() * gameSize);
    
    return {x: x, y: y};
}

function Snake(pxPerSquare, gameSize) {
    
    "use strict";
    
    this.length = 1;
    this.size = gameSize;
    this.px = pxPerSquare;
    this.body = [];
    this.direction = "up";

    this.init = function () {
        this.body = [];
        this.body.push({ x: Math.round(this.size / 2) - 1, y: Math.round(this.size / 2) - 1 });
        this.body.push({ x: this.body[0].x, y: this.body[0].y + 1 });
        this.paintToSnakeBody(this.body[0]);
        this.paintToSnakeBody(this.body[1]);
    };
    
    this.create = function (context) {
        this.context = context;
        this.init();
    };

    this.move = function () {

        var newHead;
        switch (this.direction) {
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
		
		for (var i=0; i<monsters.length; i++) {
			if (newHead.x === monsters[i].x && newHead.y === monsters[i].y) {
				this.gameOver();
				return;
			}
		}
        
        if (newHead.x < 0 || newHead.x > this.size || newHead.y < 0 || newHead.y > this.size) {
            this.gameOver();
			return;
        } 
		
		this.body.unshift(newHead);
		this.paintToSnakeBody(newHead);
		if (newHead.x != food.x || newHead.y != food.y) {
			this.paintToCanvas(this.body.pop());
		} else {
			this.eat();
		}
    };
    
    this.turn = function (direction) {
        if (this.direction != direction) {
            this.direction = direction;
        }
    };
    
    this.eat = function () {
        myGameArea.foodGenerator();
    };
	
	this.gameOver = function () {
		clearInterval(snakeMoveInterval);
		clearInterval(monsterMoveInterval)
		alert("Game Over!");
		while (this.body.length > 0) {
			this.paintToCanvas(this.body.pop());
		}
		this.init();
	}

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
       
		var i;
		for (i = 0; i < 5; i++) {
            var monster = generateAMonster();
            paintToMonster(this.context, monster, this.pxPerSquare);
            monsters.push(monster);
        }
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
            
            for (var i=0; i<snake.body.length; i++) {
				var snakeBody = snake.body[i];
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
            snake.turn("left");
            break;
        case 38:
            snake.turn("up");
            break;
        case 39:
            snake.turn("right");
            break;
        case 40:
            snake.turn("down");
            break;
        default:
            //alert("invalid input");
        }

    };
}

function snakeMove() {
    "using strict";
    snake.move();
}

function monsterMove() {
	"using strict";
	for (var i=0; i<monsters.length; i++) {
		var moveX = Math.round(Math.random() * gameSize);
		var moveY = Math.round(Math.random() * gameSize);
		paintToCanvas(myGameArea.context, monsters[i], myGameArea.pxPerSquare);
		monsters[i].x = (monsters[i].x + moveX) > gameSize ? (monsters[i].x + moveX - gameSize) : (monsters[i].x + moveX);
		monsters[i].y = (monsters[i].y + moveY) > gameSize ? (monsters[i].y + moveY - gameSize) : (monsters[i].y + moveY);
		paintToMonster(myGameArea.context, monsters[i], myGameArea.pxPerSquare);
	}
}

function prepareGame() {
    "using strict";
    myGameArea = new GameArea(gameSize);
    myGameArea.create();
    
    myGameArea.foodGenerator();
    
}

/*SnakeGame = function () {
    
} */

function startGame() {
    "using strict";
    snakeMoveInterval = setInterval(snakeMove, 100);
	monsterMoveInterval = setInterval(monsterMove, 2000);
}