// Canvas Related 
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
let width = 500;
let height = 700;

// Paddle
let paddleHeight = 10;
let paddleWidth = 50;
let paddle1_X = 225;
let paddle2_X = 225;

// Ball
// let ball_X = 250;
// let ball_Y = 350;
// let ballRadius = 5;

// Speed
// let velocity_Y = 4;
// let velocity_X = velocity_Y;
// let computerSpeed = 4;

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


    // window.requestAnimationFrame(animate);
}

// function update() {
    
// }

// function animate() {
//     update();
//     render();
//     window.requestAnimationFrame(animate);
// }

createCanvas();

