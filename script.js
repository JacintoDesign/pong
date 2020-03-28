// Canvas Related 
const container = document.getElementById('container');
const gameOverEl = document.createElement('div');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
let width = 500;
let height = 700;
let screenWidth = window.screen.width;
let canvasPosition = (screenWidth / 2) - (width / 2);

// Paddle
let paddleHeight = 10;
let paddleWidth = 50;
let paddleDiff = 25;
let paddle1_X = 225;
let paddle2_X = 225;
let playerMoved = false;
let paddleContact = false;

// Ball
let ball_X = 250;
let ball_Y = 350;
let ballRadius = 5;

// Speed
let speed_Y = -2;
let speed_X = speed_Y;
let computerSpeed = 4;

// Score 
let playerScore = 0;
let computerScore = 0;
let winningScore = 7;
let isGameOver = false;

// Create Canvas Element
function createCanvas() {
    canvas.id = 'canvas';
    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);
    renderCanvas();
}

// Render Everything on Canvas
function renderCanvas() {
    // Canvas Background
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // Paddle Color
    context.fillStyle = 'white';

    // Paddle 1
    context.fillRect(paddle1_X, height - 20, paddleWidth, paddleHeight);

    // Paddle 2
    context.fillRect(paddle2_X, 10, paddleWidth, paddleHeight);

    // Dashed Center Line
    context.beginPath();
    context.setLineDash([4]);
    context.moveTo(0, 350);
    context.lineTo(500, 350);
    context.strokeStyle = 'grey';
    context.stroke();

    // Ball
    context.beginPath();
    context.arc(ball_X, ball_Y, ballRadius, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();

    // Score
    context.font = "32px Courier New";
    context.fillText(playerScore, 20, (canvas.height / 2) + 50);
    context.fillText(computerScore, 20, (canvas.height / 2) - 30);
}

function ballReset() {
    ball_X = width / 2;
    ball_Y = height / 2;
    speed_Y = -3;
    paddleContact = false;
}

function ballMove() {
    // Vertical Speed
    ball_Y += -speed_Y;
    // Horizontal Speed
    if (playerMoved && paddleContact) {
        ball_X += speed_X;
    }
}

function ballBoundaries() {
    // Bounce off Left Wall
    if (ball_X < 0 && speed_X < 0) {
        speed_X =- speed_X;
    }
    // Bounce off Right Wall
    if (ball_X > width && speed_X > 0) {
        speed_X =- speed_X;
    }
    // Bounce off player paddle (bottom)
    if (ball_Y > height - paddleDiff) {
        if (ball_X > paddle1_X && ball_X < paddle1_X + paddleWidth) {
            paddleContact = true;
            // Add Speed on Hit
            if (playerMoved) {
                speed_Y = speed_Y - 1;
                // Max Speed
                if (speed_Y < -5) {
                    speed_Y = -5;
                    computerSpeed = 6;
                }
            }
            speed_Y = -speed_Y;
            trajectory_X = ball_X - (paddle1_X + paddleDiff);
            speed_X = trajectory_X * 0.3;
            // console.log('player speed',speed_Y);
        } else if (ball_Y > height) {
            // Reset Ball, add to Computer Score
            ballReset();      
            computerScore++;      
            // console.log('Computer:', computerScore);
        }
    }
    // Bounce off computer paddle (top)
    if (ball_Y < paddleDiff) {
        if (ball_X > paddle2_X && ball_X < paddle2_X + paddleWidth) {
            // Add Speed on Hit
            if (playerMoved) {
                speed_Y = speed_Y + 1;
                // Max Speed
                if (speed_Y > 5) {
                    speed_Y = 5;
                }
            }
            speed_Y = -speed_Y;
            // console.log('computer speed',speed_Y);
        } else if (ball_Y < 0) {
            // Reset Ball, add to Player Score
            ballReset();
            playerScore++;
            // console.log('Player:', playerScore);
        }
    }
}

function computerAI() {
    if (playerMoved) {
        if (paddle2_X + paddleDiff < ball_X) {
            paddle2_X += computerSpeed;
        } else {
            paddle2_X -= computerSpeed;
        }
    }
}

function gameOver() {
    if (playerScore == winningScore || computerScore == winningScore) {
        isGameOver = true;
        let winner;
        container.removeChild(canvas);
        gameOverEl.classList.add('game-over-container');
        if (playerScore == winningScore) {
            winner = 'Player 1';
        }
        if (computerScore == winningScore) {
            winner = 'Computer';
        }
        gameOverEl.innerHTML = `
            <h1>${winner} Wins!</h1>
            <button onclick="startGame()">Play Again</button>
        `;
        container.appendChild(gameOverEl);
    }
}

function animate() {
    renderCanvas();
    ballMove();
    ballBoundaries();
    computerAI();
    gameOver();
    window.requestAnimationFrame(animate);
}

function startGame() {
    if (isGameOver == true) {
        container.removeChild(gameOverEl);
    }
    isGameOver = false;
    playerScore = 0;
    computerScore = 0;
    ballReset();
    createCanvas();
    window.requestAnimationFrame(animate);
    canvas.addEventListener('mousemove', (e) => {
        // console.log(e.clientX);
        playerMoved = true;
        // Compensate for canvas being centered
        paddle1_X = (e.clientX - canvasPosition) - paddleDiff;
        if (paddle1_X < paddleDiff) {
            paddle1_X = 0;
        } 
        if (paddle1_X > (width - paddleWidth)) {
            paddle1_X = width - paddleWidth;
        }
        canvas.style.cursor = 'none';
    });
}

startGame();

