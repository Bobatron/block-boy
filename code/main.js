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
    for (var i = 0; i < blockManager.blocks.length; i++) {
        // blocks[i].draw();
        var collisionXPadding = 5;
        if (!character.onGround && collideLineRect(blockManager.blocks[i].x + collisionXPadding, blockManager.blocks[i].y + 5, blockManager.blocks[i].x + blockManager.blocks[i].dimension - collisionXPadding, blockManager.blocks[i].y + 5, character.x + (character.width / 3), character.y + character.height, character.width / 3, 5)) {
            character.y = blockManager.blocks[i].y;
            character.hitGround(blockManager.blocks[i].y);
            console.log("GROUND!");
            //rect(character.x + (character.width/3), character.y + character.height, character.width/3, 10);
        }
        var collisionYPadding = 5;
        if (collideLineRect(blockManager.blocks[i].x, blockManager.blocks[i].y + collisionYPadding, blockManager.blocks[i].x, blockManager.blocks[i].y + blockManager.blocks[i].dimension - collisionYPadding, character.x + (character.width / 1.5), character.y + character.height / 1.5, 5, character.height / 3) && (character.direction == "RIGHT" || character.direction == "STOP")) {
            //character.x = blocks[i].x - (character.width/2);
            character.hitLeftWall();
            //rect(character.x + (character.width/1.5), character.y + character.height/1.5, 5, character.height/3);
        }
        if (collideLineRect(blockManager.blocks[i].x + blockManager.blocks[i].dimension, blockManager.blocks[i].y + collisionYPadding, blockManager.blocks[i].x + blockManager.blocks[i].dimension, blockManager.blocks[i].y + blockManager.blocks[i].dimension - collisionYPadding, character.x + (character.width / 3), character.y + character.height / 1.5, 5, character.height / 3) && (character.direction == "LEFT" || character.direction == "STOP")) {
            //character.x = blocks[i].x + blocks[i].dimension + (character.width/2);
            character.hitRightWall();
            //rect(character.x + (character.width/1.5), character.y + character.height/1.5, 5, character.height/3);
        }
    }
    // TO SHOW CURRENT Y POS - HELPFUL FOR DEBUG
    // console.log("Y POS: "+character.y);
    if (character.y >= height - 100) {
        character.hitGround();
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