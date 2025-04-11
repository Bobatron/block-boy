var assets = {};

function preload() {
    // initialize media
    assets.sounds = {};
    assets.images = {};
    assets.images.blockGreen = loadImage("assets/images/block-green.png");
    assets.images.blockRed = loadImage("assets/images/block-red.png");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.images.marioLeft = loadImage("assets/images/mario-left.png");
    assets.images.marioRight = loadImage("assets/images/mario-right.png");
}

// Configuration
let width = 1000;
let height = 500;
var grid;
var maxBlocks = 5;
var blockSize = 52;
var gridSize = 50;
var blockManager;
var gameState;

function setup() {
    createCanvas(width, height);
    background(51);
    frameRate();
    grid = new Grid(width, height, gridSize);
    character = new Character();
    blockManager = new BlockManager(blockSize, maxBlocks, gridSize);
    gameState = 'menu';
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
    //text(a, 30, 30);
    //ellipse(10,10,10,10);
    //sideTab(width/10, height);
    blockManager.drawAll();
    grid.refresh();
    for(let block of blockManager.blocks){
        checkCollisionLeft(character, block);
        checkCollisionRight(character, block);
        checkCollisionDown(character, block);
        checkCollisionUp(character, block);
    }
    
    if (character.y > height - 100) {
        console.log("HIT GROUND!");
        character.hitGround(height - 100);
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
    }
}