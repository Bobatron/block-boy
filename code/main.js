var debug = true;
var assets = {};

function preload() {
    // initialize media
    assets.sounds = {};
    assets.images = {};
    assets.levels = [];
    assets.images.blockGreen = loadImage("assets/images/block-green.png");
    assets.images.blockRed = loadImage("assets/images/block-red.png");
    assets.images.blockYellow = loadImage("assets/images/block-yellow.png");
    assets.images.marioLeft = loadImage("assets/images/mario-left.png");
    assets.images.marioRight = loadImage("assets/images/mario-right.png");
    assets.sounds.bgMusic = loadSound("assets/sounds/bg-music.mp3");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.jump = [loadSound("assets/sounds/jump-1.wav"),loadSound("assets/sounds/jump-2.wav"), loadSound("assets/sounds/jump-3.wav")];

    assets.levels[0] = loadTable("assets/levels/level-1.csv", "csv");
    assets.levels[1] = loadTable("assets/levels/level-2.csv", "csv");

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
var levelManager;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(51);
    frameRate();
    grid = new Grid(canvasWidth, canvasHeight, gridSize);
    character = new Character(0, canvasHeight - gridSize*3);
    blockManager = new BlockManager(gridSize, maxBlocks, canvasWidth, canvasHeight);
    gameState = 'menu';
    levelManager = new LevelManager();
    levelManager.loadLevel(assets.levels[0]);
    platforms = levelManager.getPlatforms();
    levelManager.draw();
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

    for(let spikecube of spikecubes){
        platform.draw();
        checkCollisionLeft(character, spikecube);
        checkCollisionRight(character, spikecube);
        checkCollisionDown(character, spikecube);
        checkCollisionUp(character, spikecube);
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
