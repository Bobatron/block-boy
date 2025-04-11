var debug = true;
var assets = {};

function preload() {
    // initialize media
    assets.sounds = {};
    assets.images = {};
    assets.images.blockGreen = loadImage("assets/images/block-green.png");
    assets.images.blockRed = loadImage("assets/images/block-red.png");
    assets.images.blockYellow = loadImage("assets/images/block-yellow.png");
    assets.images.marioLeft = loadImage("assets/images/mario-left.png");
    assets.images.marioRight = loadImage("assets/images/mario-right.png");
    assets.sounds.bgMusic = loadSound("assets/sounds/bg-music.mp3");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.jump = [loadSound("assets/sounds/jump-1.wav"),loadSound("assets/sounds/jump-2.wav"), loadSound("assets/sounds/jump-3.wav")];
}

// Configuration
let canvasWidth = 1000;
let canvasHeight = 500;
var grid;
var maxBlocks = 5;
var gridSize = 50;
var blockManager;
var gameState;
var platforms = [];

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(51);
    frameRate();
    grid = new Grid(canvasWidth, canvasHeight, gridSize);
    character = new Character(0, canvasHeight - gridSize*3);
    blockManager = new BlockManager(gridSize, maxBlocks, canvasWidth, canvasHeight);
    gameState = 'menu';
    platforms[0] = new Platform(0, canvasHeight - gridSize, gridSize);
    platforms[1] = new Platform(0 + gridSize, canvasHeight - gridSize, gridSize);
    platforms[2] = new Platform(0 + gridSize*2, canvasHeight - gridSize, gridSize);
    platforms[3] = new Platform(canvasWidth - (gridSize), canvasHeight - gridSize, gridSize);
    platforms[4] = new Platform(canvasWidth - (gridSize*2), canvasHeight - gridSize, gridSize);
    platforms[5] = new Platform(canvasWidth - (gridSize*3), canvasHeight - gridSize, gridSize);
}

function draw() {
    switch (gameState) {
        case 'menu':
            drawMenuScreen();
            break;
        case 'gameplay':
            gameplay();
            break;
    }
}

function gameplay() {
    background(51);
    text(frameRate(), 10, 10);
    // text("HELLO", 30, 30);
    // ellipse(10,10,10,10);
    // sideTab(width/10, height);
    blockManager.drawAll();
    grid.refresh();
    for(let block of blockManager.blocks){
        checkCollisionLeft(character, block);
        checkCollisionRight(character, block);
        checkCollisionDown(character, block);
        checkCollisionUp(character, block);
    }

    for(let platform of platforms){
    platform.draw();
    checkCollisionLeft(character, platform);
    checkCollisionRight(character, platform);
    checkCollisionDown(character, platform);
    checkCollisionUp(character, platform);
    }
    
    if (character.y > canvasHeight - 100) {
        console.log("HIT GROUND!");
        character.hitGround(canvasHeight - 100);
    }
    if (mouseIsPressed) {
        blockManager.addRemoveBlocks();
    }
    character.draw();
}

function sideTab(w, h) {
    rect(20, 20, w, h);
}

function mouseReleased() {
    blockManager.setMouseClicked(false);
}

function keyPressed() {
    if (keyCode === ENTER && gameState === 'menu') {
        gameState = 'gameplay';
        stroke(0);
        fill(255);
        strokeWeight(1);
        textSize(12);
        textFont('Arial');
        textAlign(LEFT, BASELINE);
        textStyle(NORMAL);
        window.assets.sounds.bgMusic.play();
    }
}
