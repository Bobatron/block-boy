var debug = false;
var collisionCheckCount = 0;
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
    assets.images.blockSpike = loadImage("assets/images/block-spike.png");
    assets.images.marioLeft = loadImage("assets/images/mario-left.png");
    assets.images.marioRight = loadImage("assets/images/mario-right.png");
    assets.images.goal = loadImage("assets/images/goal.png");
    assets.sounds.bgMusic = loadSound("assets/sounds/bg-music.mp3");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.jump = [loadSound("assets/sounds/jump-1.wav"), loadSound("assets/sounds/jump-2.wav"), loadSound("assets/sounds/jump-3.wav")];

    for (let i = 0; i < 11; i++) {
        assets.levels.data[i] = loadTable(`assets/levels/level-${i}.csv`, "csv");
        assets.levels.config[i] = loadJSON(`assets/levels/level-${i}.json`);
    }
}

// Configuration
let canvasWidth = 1250;
let canvasHeight = 650;
var grid;
var maxBlocks = 5;
var blockStock = 5;
var blockSize = 50;
var blockManager;
var collisionChecker;
var gameState;
var platforms = [];
var spikes = [];
var levelManager;
var currentLevel = 0;
var goal;

function setup() {
    select('body').style('background-color', '#000000'); // Set browser background to black
    createCanvas(canvasWidth, canvasHeight);
    background(51);
    frameRate();
    gameState = 'menu';
    collisionChecker = new CollisionChecker(canvasWidth, canvasHeight, blockSize);
    blockManager = new BlockManager(collisionChecker);
    levelManager = new LevelManager(blockSize);
    grid = new Grid(canvasWidth, canvasHeight, blockSize);
    character = new Character(0, 0, blockSize);
    goal = new LevelObject(0, canvasHeight - blockSize * 3, blockSize, assets.images.goal, false);
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
    if (keyCode === ENTER && gameState === 'gameover') {
        gameState = 'menu';
    }
    if (keyCode === ENTER && gameState === 'winlevel') {
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
    if (keyCode === ENTER && gameState === 'wingame') {
        gameState = 'menu';
    }
}

function loadLevel() {
    window.assets.sounds.bgMusic.loop();
    collisionChecker.initializeCollisionCheckGrid();
    levelManager.loadLevelData(assets.levels.data[currentLevel]);
    levelManager.loadLevelConfig(assets.levels.config[currentLevel]);
    platforms = levelManager.getPlatforms();
    for (let i = 0; i < platforms.length; i++) {
        collisionChecker.addObjectToCollisionCheckGrid(platforms[i]);
    }
    spikes = levelManager.getSpikes();
    for (let i = 0; i < spikes.length; i++) {
        collisionChecker.addObjectToCollisionCheckGrid(spikes[i]);
    }
    let startPosition = levelManager.getStartPosition();
    let goalPosition = levelManager.getGoalPosition();
    character.reset(startPosition.x, startPosition.y, blockSize);
    goal.reset(goalPosition.x, goalPosition.y);
    maxBlocks = levelManager.getLevelConfig().maxBlocks;
    blockStock = levelManager.getLevelConfig().blockStock;
    blockManager.load(blockSize, maxBlocks, blockStock, canvasWidth, canvasHeight);
    console.log("CollisionGrid Length ", collisionChecker.collisionCheckGrid);
}

function winLevel() {
    gameState = 'winlevel';
    window.assets.sounds.bgMusic.stop();
    currentLevel += 1;
    if (currentLevel >= assets.levels.data.length) {
        gameState = 'wingame';
        currentLevel = 0;
    }
}

function gameover() {
    gameState = 'gameover';
    window.assets.sounds.bgMusic.stop();
    currentLevel = 0;
}

function draw() {
    switch (gameState) {
        case 'menu':
            drawMenuScreen();
            break;
        case 'gameplay':
            gameplay();
            break;
        case 'gameover':
            drawGameOverScreen();
            break;
        case 'winlevel':
            drawWinLevelScreen();
            break;
        case 'wingame':
            drawWinGameScreen();
            break;
    }
}

function gameplay() {
    background(51);
    text(frameRate(), 10, 10);
    blockManager.draw();
    grid.draw();
    goal.draw();
    if (checkCollisionRect(character, goal)) {
        winLevel();
    }

    let startX = Math.floor(character.collisionBox.leftX1 / blockSize);
    let endX = Math.floor(character.collisionBox.rightX1  / blockSize);
    let startY = Math.floor(character.collisionBox.topY1 / blockSize);
    let endY = Math.floor(character.collisionBox.bottomY1 / blockSize);


    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            if (collisionChecker.collisionCheckGrid[x] && collisionChecker.collisionCheckGrid[x][y]) {
                for (let index = 0; index < collisionChecker.collisionCheckGrid[x][y].length; index++) {
                    let object = collisionChecker.collisionCheckGrid[x][y][index];
                    // Character wont be in this grid currently but should be in the future
                    if (object !== character) {
                        checkCollisionRightSide(character, object);
                        checkCollisionLeftSide(character, object);
                        checkCollisionDown(character, object);
                        checkCollisionUp(character, object);
                    }
                }
            }
        }
    }

    for (let platform of platforms) {
        platform.draw();
    }

    for (let spike of spikes) {
        spike.draw();
        if (checkCollisionRect(character, spike)) {
            console.log("YOWZA!");
            gameover();
        }
    }

    if (character.y > canvasHeight - blockSize) {
        console.log("HIT GROUND!");
        gameover();
    }

    character.draw();
    
    if (mouseIsPressed) {
        var mouse = {};
        mouse.x = mouseX - (mouseX % blockSize);
        mouse.y = mouseY - (mouseY % blockSize);
        mouse.blockSize = blockSize;
        mouse.drawBlock = true;
        if (checkCollisionUp(character, mouse)) {
        } else {
            blockManager.addRemoveBlocks();
        }
    }
    
    if(debug){
        console.log(collisionCheckCount);
        collisionCheckCount = 0;
    }
}

function mouseReleased() {
    blockManager.setMouseClicked(false);
}

