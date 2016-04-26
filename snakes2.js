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
            switch (snakeGame.status) {
                case "not started":
                    snakeGame.start();
                    break;

                case "stopped":
                    snakeGame.resume();
                    break;

                case "started":
                    snakeGame.stop();
                    break;

                default:
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
        this.status = "not started"
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
	};
	
	everyInterval() {
		// move the snake
        if (this.snake.move() == false) {
            this.gameOver();
            return;
        }
        
        // --- game over check ---
        // run out?
        var snakeHead = this.snake.head();
        if (this.gameCanvas.outOfCanvas(snakeHead)) {
            this.gameOver();
			return;
        } 
        
        // get the food?
		if (!this.snake.head().equals(this.food.point)) {
			this.canvasPainter.paint(this.snake.body.pop());	
		} else {
			this.generateFood();
		}
	};
	
	generateFood() {
		while (true) {
			var gotIt = true;
			var point = this.gameCanvas.getARandomPointOnCanvas();
			if (this.snake.partOfBody(point)) {
				gotIt = false;
			}
			if (gotIt === true) {
				this.food = new Food(point, this.foodPainter, this.canvasPainter);
				break;
			}
		}
	};
	
	start() {
		this.generateFood();
		this.resume();
	};
	
	stop() {
		clearInterval(this.snakeInterval);
		this.status = "stopped";
	};
    
    resume() {
        this.snakeInterval = setInterval(everyInterval, 100);
		this.status = "started";
    };
    
    clear() {
        clearInterval(this.snakeInterval);
        this.snake.clear();
        this.food.clear();
        this.status = "not started";
    };
	
	gameOver() {
		alert("Game Over!");
        this.clear();
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
	};
    
    outOfCanvas(pos) {
        return (pos.x < 0 || pos.x > this.width - 1 || pos.y < 0 || pos.y > this.height - 1);
    };
    
    getARandomPointOnCanvas() {
        var x = Math.round(Math.random() * this.width);
        var y = Math.round(Math.random() * this.height);
        
        return new Point(x, y);
    };
	
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
		this.canvasPainter = canvasPainter;
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
        for (var i=0; i<this.body.length; i++) {
            if (this.body[i].equals(pos)) {
                return true;
            }   
        }    
        return false;
	};
    
    clear() {
        while (this.body.length > 0) {
			this.canvasPainter.paint(this.body.pop());
		}
        
		this.init();
    };
 	
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
		
        if (this.partOfBody(newHead)) {
            return false;
        } else {
            this.body.unshift(newHead);
		    this.snakePainter.paint(newHead);
            return true;
        }
    };
	
	turn (direction) {
		if ((this.direction === "up" || this.direction === "down") && (direction === "left" || direction === "right") 
		   || (this.direction === "left" || this.direction === "right") && (direction === "up" || direction === "down")) {
			this.direction = direction;
		}
	};
}

class Food {
    constructor(point, foodPainter, canvasPainter) {
        this.point = point;
        this.foodPainter = foodPainter;
        this.canvasPainter = canvasPainter;
        
        this.foodPainter.paint(this.point);
    };
    
    clear() {
        this.canvasPainter.paint(this.point);
    };
}

class Monster {
    constructor() {
        
    };
    
    
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	};
    
    equals(anotherPoint) {
        return this.x === anotherPoint.x || this.y === anotherPoint.y
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

