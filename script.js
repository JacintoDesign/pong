const body = document.querySelector('body');
const isMobile = window.matchMedia('(max-width: 600px)');

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
let width = 500;
let height = 700;

function createCanvas() {
    canvas.id = 'canvas';
    canvas.width = width;
    canvas.height = height;
    body.appendChild(canvas);
    renderCanvas();
}

function renderCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
}

createCanvas();

