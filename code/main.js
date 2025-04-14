var debug = true;
var assets = {};

function preload() {
    // initialize media
    assets.sounds = {};
    assets.images = {};
    assets.levels = {};
    assets.levels.data = [];
    assets.levels.config = [];
    assets.images.blockGreen = loadImage("assets/images/block-green.png");
    assets.images.blockRed = loadImage("assets/images/block-red.png");
    assets.images.blockYellow = loadImage("assets/images/block-yellow.png");
    assets.images.marioLeft = loadImage("assets/images/mario-left.png");
    assets.images.marioRight = loadImage("assets/images/mario-right.png");
    assets.images.goal = loadImage("assets/images/goal.png");
    assets.sounds.bgMusic = loadSound("assets/sounds/bg-music.mp3");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.jump = [loadSound("assets/sounds/jump-1.wav"), loadSound("assets/sounds/jump-2.wav"), loadSound("assets/sounds/jump-3.wav")];

    for (let i = 0; i < 3; i++) {
        assets.levels.data[i] = loadTable(`assets/levels/level-${i}.csv`, "csv");
        assets.levels.config[i] = loadJSON(`assets/levels/level-${i}.json`);
    }
}

// Configuration
let canvasWidth = 1000;
let canvasHeight = 500;
var grid;
var maxBlocks = 5;
var blockStock = 5;
var blockSize = 50;
var blockManager;
var gameState;
var platforms = [];
var levelManager;
var currentLevel = 0;
var goal;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(51);
    frameRate();
    gameState = 'menu';
    blockManager = new BlockManager(blockSize, maxBlocks, canvasWidth, canvasHeight);
    levelManager = new LevelManager(blockSize);
    grid = new Grid(canvasWidth, canvasHeight, blockSize);
    character = new Character(0, canvasHeight - blockSize * 3);
    goal = new LevelObject(0, canvasHeight - blockSize * 3, blockSize, assets.images.goal);
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
        loadLevel();
    }
}

function loadLevel() {
    window.assets.sounds.bgMusic.play();
    levelManager.loadLevelData(assets.levels.data[currentLevel]);
    levelManager.loadLevelConfig(assets.levels.config[currentLevel]);
    platforms = levelManager.getPlatforms();
    let startPosition = levelManager.getStartPosition();
    let goalPosition = levelManager.getGoalPosition();
    character.reset(startPosition.x, startPosition.y);
    goal.reset(goalPosition.x, goalPosition.y);
    maxBlocks = levelManager.getLevelConfig().maxBlocks;
    blockStock = levelManager.getLevelConfig().blockStock;
    blockManager.load(blockSize, maxBlocks, blockStock, canvasWidth, canvasHeight);
}

function endLevel() {
    gameState = 'menu';
    window.assets.sounds.bgMusic.stop();
    currentLevel += 1;
    if (currentLevel >= assets.levels.data.length) {
        currentLevel = 0;
    }
}


function draw() {
    switch (gameState) {
        case 'menu':
            drawMenuScreen();
            break;
        case 'gameplay':
            gameplay();
            collideDebug(true);
            break;
    }
}

function gameplay() {
    background(51);
    text(frameRate(), 10, 10);
    blockManager.drawAll();
    grid.refresh();
    goal.draw();
    if(checkCollisionGoal(character, goal)){
        endLevel();
    }

    for (let block of blockManager.blocks) {
        checkCollisionLeft(character, block);
        checkCollisionRight(character, block);
        checkCollisionDown(character, block);
        checkCollisionUp(character, block);
    }

    for (let platform of platforms) {
        platform.draw();
        checkCollisionLeft(character, platform);
        checkCollisionRight(character, platform);
        checkCollisionDown(character, platform);
        checkCollisionUp(character, platform);
    }

    if (character.y > canvasHeight - 100) {
        console.log("HIT GROUND!");
        endLevel();
    }
    
    if (mouseIsPressed) {
        blockManager.addRemoveBlocks();
    }
    character.draw();
}

function mouseReleased() {
    blockManager.setMouseClicked(false);
}

