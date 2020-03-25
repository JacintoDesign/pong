// Canvas Related 
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

// Ball
let ball_X = 250;
let ball_Y = 350;
let ballRadius = 5;

// Speed
let velocity_Y = -2;
let velocity_X = velocity_Y;
let computerSpeed = 4;

// Score 
let playerScore = 1;
let computerScore = 1;

// Create Canvas Element
function createCanvas() {
    canvas.id = 'canvas';
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
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
}

function ballReset() {
    ball_X = width / 2;
    ball_Y = height / 2;
    velocity_Y = -2;
    ball_X = velocity_X;
}

function ballMove() {
    // Vertical Speed
    ball_Y += -velocity_Y;
    // Horizontal Speed
    if (playerMoved) {
        ball_X += velocity_X;
    }
}

function ballBoundaries() {
    // Bounce off Left Wall
    if (ball_X < 0 && velocity_X < 0) {
        velocity_X =- velocity_X;
    }
    // Bounce off Right Wall
    if (ball_X > width && velocity_X > 0) {
        velocity_X =- velocity_X;
    }
    // Bounce off player paddle (bottom), or award point if missed
    if (ball_Y > height - paddleDiff) {
        if (ball_X > paddle1_X && ball_X < paddle1_X + paddleWidth) {
            if (playerMoved) {
                velocity_Y = velocity_Y - 1;
            }
            velocity_Y = -velocity_Y;
            trajectory_X = ball_X - (paddle1_X + paddleDiff);
            velocity_X = trajectory_X * 0.3;
            console.log('player Velocity',velocity_Y);
        } else if (ball_Y > height) {
            ballReset();            
            console.log('Computer: ', computerScore++);
        }
    }
    // Bounce off computer paddle (top), or award point if missed
    if (ball_Y < paddleDiff) {
        if (ball_X > paddle2_X && ball_X < paddle2_X + paddleWidth) {
            if (playerMoved) {
                velocity_Y = velocity_Y + 1;
            }
            velocity_Y = -velocity_Y;
            console.log('computer Velocity',velocity_Y);
        } else if (ball_Y < 0) {
            ballReset();
            console.log('Player: ', playerScore++);
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

function animate() {
    renderCanvas();
    ballMove();
    ballBoundaries();
    computerAI();
    window.requestAnimationFrame(animate);
}

window.onload = () => {
    createCanvas();
    window.requestAnimationFrame(animate);
    canvas.addEventListener('mousemove', (e) => {
        // console.log(e.clientX);
        playerMoved = true;
        paddle1_X = (e.clientX - canvasPosition) - paddleDiff;
        if (paddle1_X < paddleDiff) {
            paddle1_X = 0;
        } 
        if (paddle1_X > (width - paddleWidth)) {
            paddle1_X = width - paddleWidth;
        }
        // canvas.style.cursor = 'none';
    });
}

