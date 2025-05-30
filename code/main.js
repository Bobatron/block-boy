var debug = false;
var collisionDebug = false;
var collisionCheckCount = 0;
var assets = {};
var totalLevels = 12;
var startingLives = 5;

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
    assets.images.blockFriendlySpike = loadImage("assets/images/block-friendly-spike.png");
    assets.images.blockBoyLeft = loadImage("assets/images/block-boy-left.png");
    assets.images.blockBoyRight = loadImage("assets/images/block-boy-right.png");
    assets.images.goal = loadImage("assets/images/goal.png");
    assets.sounds.bgMusic = loadSound("assets/sounds/bg-music.mp3");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.jump = [loadSound("assets/sounds/jump-1.wav"), loadSound("assets/sounds/jump-2.wav"), loadSound("assets/sounds/jump-3.wav")];

    for (let i = 0; i < totalLevels; i++) {
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
var friendlySpikes = [];
var levelManager;
var currentLevel = 0;
var goal;

function setup() {
    select('body').style('background-color', '#000000'); // Set browser background to black
    createCanvas(canvasWidth, canvasHeight);
    background(51);
    if(debug) {
        frameRate();
    }
    gameState = 'menu';
    collisionChecker = new CollisionChecker(canvasWidth, canvasHeight, blockSize);
    character = new Character(0, 0, blockSize, startingLives);
    blockManager = new BlockManager(collisionChecker);
    levelManager = new LevelManager(blockSize, character);
    grid = new Grid(canvasWidth, canvasHeight, blockSize);
    goal = new LevelObject(0, canvasHeight - blockSize * 3, blockSize, assets.images.goal, false, "goal");
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

    friendlySpikes = levelManager.getFriendlySpikes();
    for (let i = 0; i < friendlySpikes.length; i++) {
        collisionChecker.addObjectToCollisionCheckGrid(friendlySpikes[i]);
    }

    let startPosition = levelManager.getStartPosition();
    let goalPosition = levelManager.getGoalPosition();
    character.reset(startPosition.x, startPosition.y, blockSize);
    goal.reset(goalPosition.x, goalPosition.y);

    collisionChecker.addObjectToCollisionCheckGrid(goal);

    maxBlocks = levelManager.getLevelConfig().maxBlocks;
    blockStock = levelManager.getLevelConfig().blockStock;
    blockManager.load(blockSize, maxBlocks, blockStock, canvasWidth, canvasHeight);
    if (collisionDebug) {
        console.log("Collision grid: ", collisionChecker.collisionCheckGrid);
    }

    levelManager.drawLevelInfo();
}

function winLevel() {
    blockManager.removeblockConfig();
    levelManager.removeLevelInfo();
    gameState = 'winlevel';
    window.assets.sounds.bgMusic.stop();
    currentLevel += 1;
    if (currentLevel >= assets.levels.data.length) {
        gameState = 'wingame';
        currentLevel = 0;
    }
}

function gameover() {
    currentLevel = 0;
    character.lives = startingLives;
}

function loseLife() {
    blockManager.removeblockConfig();
    levelManager.removeLevelInfo();
    window.assets.sounds.bgMusic.stop();
    character.lives--;
    gameState = 'gameover';
    if (character.lives <= 0) {
        gameover();
    }
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

    // Collision check loop logic
    let startX = Math.floor(character.collisionBox.leftX1 / blockSize);
    let endX = Math.floor(character.collisionBox.rightX1 / blockSize);
    let startY = Math.floor(character.collisionBox.topY1 / blockSize);
    let endY = Math.floor(character.collisionBox.bottomY1 / blockSize);

    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            if (collisionChecker.collisionCheckGrid[x] && collisionChecker.collisionCheckGrid[x][y]) {
                for (let index = 0; index < collisionChecker.collisionCheckGrid[x][y].length; index++) {
                    let objects = collisionChecker.collisionCheckGrid[x][y];
                    let object = collisionChecker.collisionCheckGrid[x][y][index];
                    // Character wont be in this grid currently but should be in the future
                    // For example when there are other moving objects that may collide with the character
                    if (object !== character) {
                        switch (object.type) {
                            case "platform":
                            case "block":
                                checkCharacterCollisionRightSide(character, object);
                                checkCharacterCollisionLeftSide(character, object);
                                checkCharacterCollisionDown(character, object);
                                checkCharacterCollisionUp(character, object);
                                break;
                            case "spike":
                                if (checkCharacterCollisionRect(character, object)) {
                                    loseLife();
                                    return;
                                }
                                break;
                            case "friendly-spike":
                                if (!objects.some(obj => obj.type === "block") && checkCharacterCollisionRect(character, object)) {
                                    loseLife();
                                    return;
                                }
                                break;
                            case "goal":
                                if (checkCharacterCollisionRect(character, object)) {
                                    winLevel();
                                }
                                break;
                        }
                    }
                }
            }
        }
    }
    // Game over if character falls below the canvas height
    if (character.y > canvasHeight - blockSize) {
        if (collisionDebug) {
            console.log("HIT GROUND!");
        }
        loseLife();
    }

    // Draw logic
    blockManager.draw();
    grid.draw();
    goal.draw();
    for (let platform of platforms) {
        platform.draw();
    }
    for (let spike of spikes) {
        spike.draw();
    }
    for (let friendlySpike of friendlySpikes) {
        friendlySpike.draw();
    }

    if (mouseIsPressed) {
        var mouse = {};
        mouse.x = mouseX - (mouseX % blockSize);
        mouse.y = mouseY - (mouseY % blockSize);
        mouse.blockSize = blockSize;
        mouse.type = "cursor";

        // Collision check loop logic for cursor
        let mouseGridX = Math.floor(mouse.x / blockSize);
        let mouseGridY = Math.floor(mouse.y / blockSize);

        if (collisionChecker.collisionCheckGrid[mouseGridX] && collisionChecker.collisionCheckGrid[mouseGridX][mouseGridY] && collisionChecker.collisionCheckGrid[mouseGridX][mouseGridY][0]) {
            let object = collisionChecker.collisionCheckGrid[mouseGridX][mouseGridY][0];
            switch (object.type) {
                case "platform":
                case "spike":
                case "goal":
                    if (checkObjectCollisionRect(object, mouse) == false) {
                        blockManager.addRemoveBlocks();

                    }
                    break;
                case "block":
                case "friendly-spike":
                    blockManager.addRemoveBlocks();
                    break;
            }
        } else if (checkCharacterCollisionRect(character, mouse) == false) {
            blockManager.addRemoveBlocks();

        }


    }

    character.draw();


    if (collisionDebug) {
        console.log(collisionCheckCount);
        collisionCheckCount = 0;
    }
}

function mouseReleased() {
    blockManager.setMouseClicked(false);
}

