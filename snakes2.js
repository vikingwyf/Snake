var snakeGame;

function everyInterval() {
	snakeGame.everyInterval();
};

function prepareGame() {
	snakeGame = new SnakeGame();
};

window.onkeyup = function (e) {
	var key = e.keyCode ? e.keyCode : e.which;
	var dir;
	switch (key) {
	case 13: // enter key
		if (snakeGame.started == false) {
			snakeGame.start();
		} else {
			snakeGame.stop();
		}
		break;
	case 37: // 
		snakeGame.snake.turn("left");
		break;
	case 38:
		snakeGame.snake.turn("up");
		break;
	case 39:
		snakeGame.snake.turn("right");
		break;
	case 40:
		snakeGame.snake.turn("down");
		break;
	default:
		//alert("invalid input");
	}
};

class SnakeGame {
	constructor() {
		this.started = false;
		this.width = 64;
		this.height = 48;
		this.pixelsPerSquare = 10;
		this.snakeColor = "Black";
		this.monstorColor = "Yellow";
		this.canvasColor = "Grey";
		this.foodColor = "Green";
		this.gameCanvas = new GameCanvas(this.width, this.height, this.pixelsPerSquare);
		this.context = this.gameCanvas.context;
		
		// create the snake
		this.snakePainter = new SquarePainter(this.context, this.pixelsPerSquare, this.snakeColor);
		this.canvasPainter = new SquarePainter(this.context, this.pixelsPerSquare, this.canvasColor);
		this.foodPainter = new SquarePainter(this.context, this.pixelsPerSquare, this.foodColor);
		this.snake = new Snake(this.gameCanvas.center(), this.snakePainter, this.canvasPainter);
		
		// create the food generator
		this.foodFactory = new FoodFactory(this.gameCanvas);
		this.food = this.foodFactory.generate();
	};
	
	everyInterval() {
		this.snake.move();
		if (this.snake.head().x !== this.food.x || this.snake.head().y !== this.food.y) {
			this.canvasPainter.paint(this.snake.body.pop());	
		} else {
			this.generateFood();
		}
	};
	
	generateFood() {
		while (true) {
			var gotIt = true;
			var food = this.foodFactory.generate();
			if (this.snake.partOfBody(food)) {
				gotIt = false;
			}
			if (gotIt === true) {
				this.food = food;
				this.foodPainter.paint(food);
				break;
			}
		}
	};
	
	start() {
		this.generateFood();
		this.snakeInterval = setInterval(everyInterval, 200);
		this.started = true;
	};
	
	stop() {
		clearInterval(this.snakeInterval);
		this.started = false;
	};
	
	restart() {
		this.stop();
		while (this.body.length > 0) {
			this.paintToCanvas(this.body.pop());
		}
		this.snake.init();
	};
	
	gameOver() {
		this.restart();
		alert("Game Over!");
	};
}

class GameCanvas {
	constructor (width, height, pixelsPerSquare) {
		this.width = width;
		this.height = height;	
		this.sqrPx = pixelsPerSquare; 

		this.canvas = document.getElementById("gameArea");
		this.canvas.width = this.width * this.sqrPx;
        this.canvas.height = this.height * this.sqrPx;
		this.context = this.canvas.getContext("2d");
        this.draw();
	};
	
	center() {
		return new Point(Math.round(this.width / 2) - 1, Math.round(this.height / 2) - 1);
	}
	
	draw() {
        for (var i = 1; i < this.height; i++) {
            this.context.beginPath();
            this.context.moveTo(0, this.sqrPx * i);
            this.context.lineTo(this.width * this.sqrPx, this.sqrPx * i);
            this.context.stroke();
        }

        for (var i = 1; i < this.width; i++) {
            this.context.beginPath();
            this.context.moveTo(this.sqrPx * i, 0);
            this.context.lineTo(this.sqrPx * i, this.height * this.sqrPx);
            this.context.stroke();
        }
    };
}

class Snake {
	constructor (canvasCenter, snakePainter, canvasPainter) {
		this.snakePainter = snakePainter;
		this.ffoodcanvasPainter = canvasPainter;
		this.canvasCenter = canvasCenter;
		this.init();
    };
	
	init() {
		this.body = [this.canvasCenter.itsLeftPoint(), this.canvasCenter, this.canvasCenter.itsRightPoint()];
        for (var i=0; i<this.body.length; i++) {
			this.snakePainter.paint(this.body[i]);
		}
		
		this.direction = "left";	
	};
	
	head() {
		return this.body[0];
	};
	
	partOfBody(pos) {
		return this.body.indexOf(pos) > -1;
	}
 	
	move () {
		var currentHead = this.body[0];
        var newHead;
        switch (this.direction) {
        case "up":
            newHead = currentHead.itsAbovePoint();
            break;

        case "down":
            newHead = currentHead.itsBelowPoint();
            break;

        case "left":
            newHead = currentHead.itsLeftPoint();
            break;

        case "right":
            newHead = currentHead.itsRightPoint();
            break;

        default:
        }
		
		this.body.unshift(newHead);
		this.snakePainter.paint(newHead);
	
    };
	
	turn (direction) {
		if ((this.direction === "up" || this.direction === "down") && (direction === "left" || direction === "right") 
		   || (this.direction === "left" || this.direction === "right") && (direction === "up" || direction === "down")) {
			this.direction = direction;
		}
	}
}

class FoodFactory {
	constructor (gameCanvas) {
		this.gameCanvas = gameCanvas;
	};
	
	generate() {
        var x = Math.round(Math.random() * this.gameCanvas.width);
        var y = Math.round(Math.random() * this.gameCanvas.height);
            
      	return new Point(x, y);
	};
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	};
	
	itsLeftPoint() {
		return new Point(this.x - 1, this.y);
	};
	
	itsRightPoint() {
		return new Point(this.x + 1, this.y);
	};
	
	itsAbovePoint() {
		return new Point(this.x, this.y - 1);
	};
	
	itsBelowPoint() {
		return new Point(this.x, this.y + 1);
	};
}

class SquarePainter {
	constructor(context, sqrPixels, color) {
		this.context = context;
		this.color = color;
		this.sqrPixels = sqrPixels;
	};
	
	paint(pos) {
		this.context.fillStyle = this.color;
		var pxToPaint = this.sqrPixels - 2;
    	this.context.fillRect(pos.x * this.sqrPixels + 1, pos.y * this.sqrPixels + 1, pxToPaint, pxToPaint);
	};
}

