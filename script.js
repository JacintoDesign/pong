// Canvas Related
const container = document.getElementById("container");
const gameOverEl = document.createElement("div");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
let width = 500;
let height = 700;
let screenWidth = window.screen.width;
let canvasPosition = screenWidth / 2 - width / 2;
let isMobile = window.matchMedia("(max-width: 600px)");

// Paddle
let paddleHeight = 10;
let paddleWidth = 50;
let paddleDiff = 25;
let paddle1X = 225;
let paddle2X = 225;
let playerMoved = false;
let paddleContact = false;

// Ball
let ballX = 250;
let ballY = 350;
let ballRadius = 5;

// Speed
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Change Mobile Settings
if (isMobile.matches) {
  speedY = -2;
  speedX = speedY;
  computerSpeed = 4;
} else {
  speedY = -1;
  speedX = speedY;
  computerSpeed = 3;
}

// Score
let playerScore = 0;
let computerScore = 0;
let winningScore = 7;
let isGameOver = false;

// Render Everything on Canvas
function renderCanvas() {
  // Canvas Background
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  // Paddle Color
  context.fillStyle = "white";

  // Paddle 1
  context.fillRect(paddle1X, height - 20, paddleWidth, paddleHeight);

  // Paddle 2
  context.fillRect(paddle2X, 10, paddleWidth, paddleHeight);

  // Dashed Center Line
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = "grey";
  context.stroke();

  // Ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = "white";
  context.fill();

  // Score
  context.font = "32px Courier New";
  context.fillText(playerScore, 20, canvas.height / 2 + 50);
  context.fillText(computerScore, 20, canvas.height / 2 - 30);
}

// Create Canvas Element
function createCanvas() {
  canvas.id = "canvas";
  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);
  renderCanvas();
}

// Reset Ball to Center
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = -3;
  paddleContact = false;
}

// Adjust Ball Movement
function ballMove() {
  // Vertical Speed
  ballY += -speedY;
  // Horizontal Speed
  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
  // Bounce off Left Wall
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  // Bounce off Right Wall
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }
  // Bounce off player paddle (bottom)
  if (ballY > height - paddleDiff) {
    if (ballX > paddle1X && ballX < paddle1X + paddleWidth) {
      paddleContact = true;
      // Add Speed on Hit
      if (playerMoved) {
        speedY = speedY - 1;
        // Max Speed
        if (speedY < -5) {
          speedY = -5;
          computerSpeed = 6;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddle1X + paddleDiff);
      speedX = trajectoryX * 0.3;
      // console.log('player speed',speedY);
    } else if (ballY > height) {
      // Reset Ball, add to Computer Score
      ballReset();
      computerScore++;
      // console.log('Computer:', computerScore);
    }
  }
  // Bounce off computer paddle (top)
  if (ballY < paddleDiff) {
    if (ballX > paddle2X && ballX < paddle2X + paddleWidth) {
      // Add Speed on Hit
      if (playerMoved) {
        speedY = speedY + 1;
        // Max Speed
        if (speedY > 5) {
          speedY = 5;
        }
      }
      speedY = -speedY;
      // console.log('computer speed',speedY);
    } else if (ballY < 0) {
      // Reset Ball, add to Player Score
      ballReset();
      playerScore++;
      // console.log('Player:', playerScore);
    }
  }
}

// Computer Movement
function computerAI() {
  if (playerMoved) {
    if (paddle2X + paddleDiff < ballX) {
      paddle2X += computerSpeed;
    } else {
      paddle2X -= computerSpeed;
    }
  }
}

// Check If One Player Has Winning Score, If They Do, End Game
function gameOver() {
  if (playerScore === winningScore || computerScore === winningScore) {
    isGameOver = true;
    let winner;
    container.removeChild(canvas);
    gameOverEl.classList.add("game-over-container");
    if (playerScore === winningScore) {
      winner = "Player 1";
    }
    if (computerScore === winningScore) {
      winner = "Computer";
    }
    gameOverEl.innerHTML = `
            <h1>${winner} Wins!</h1>
            <button onclick="startGame()">Play Again</button>
        `;
    container.appendChild(gameOverEl);
  }
}

// Called Every Frame
function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver();
  window.requestAnimationFrame(animate);
}

// Start Game, Reset Everything
function startGame() {
  if (isGameOver === true) {
    container.removeChild(gameOverEl);
  }
  isGameOver = false;
  playerScore = 0;
  computerScore = 0;
  ballReset();
  createCanvas();
  window.requestAnimationFrame(animate);
  canvas.addEventListener("mousemove", function (e) {
    // console.log(e.clientX);
    playerMoved = true;
    // Compensate for canvas being centered
    paddle1X = e.clientX - canvasPosition - paddleDiff;
    if (paddle1X < paddleDiff) {
      paddle1X = 0;
    }
    if (paddle1X > width - paddleWidth) {
      paddle1X = width - paddleWidth;
    }
    canvas.style.cursor = "none";
  });
}

// On Load
startGame();
