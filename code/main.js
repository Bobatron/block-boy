var debug = false;
var collisionDebug = false;
var collisionCheckCount = 0;
var assets = {};
var totalLevels = 14;
var startingLives = 5;

function preload() {
    // initialize media
    assets.sounds = {};
    assets.images = {};
    assets.levels = {};
    assets.levels.data = [];
    assets.levels.config = [];
    assets.images.blockGreen = {};
    assets.images.blockGreen.source = "assets/images/block-green.png";
    assets.images.blockGreen.image = loadImage(assets.images.blockGreen.source);
    assets.images.blockRed = {};
    assets.images.blockRed.source = "assets/images/block-red.png";
    assets.images.blockRed.image = loadImage(assets.images.blockRed.source);
    assets.images.blockYellow = {};
    assets.images.blockYellow.source = "assets/images/block-yellow.png";
    assets.images.blockYellow.image = loadImage(assets.images.blockYellow.source);
    assets.images.blockSpike = {};
    assets.images.blockSpike.source = "assets/images/block-spike.png";
    assets.images.blockSpike.image = loadImage(assets.images.blockSpike.source);
    assets.images.blockFriendlySpike = {};
    assets.images.blockFriendlySpike.source = "assets/images/block-friendly-spike.png";
    assets.images.blockFriendlySpike.image = loadImage(assets.images.blockFriendlySpike.source);
    assets.images.blockBoyLeft = {};
    assets.images.blockBoyLeft.source = "assets/images/block-boy-left.png";
    assets.images.blockBoyLeft.image = loadImage(assets.images.blockBoyLeft.source);
    assets.images.blockBoyLeftPanic = {};
    assets.images.blockBoyLeftPanic.source = "assets/images/block-boy-left-panic.png";
    assets.images.blockBoyLeftPanic.image = loadImage(assets.images.blockBoyLeftPanic.source);
    assets.images.blockBoyRightPanic = {};
    assets.images.blockBoyRightPanic.source = "assets/images/block-boy-right-panic.png";
    assets.images.blockBoyRightPanic.image = loadImage(assets.images.blockBoyRightPanic.source);
    assets.images.blockBoyRight = {};
    assets.images.blockBoyRight.source = "assets/images/block-boy-right.png";
    assets.images.blockBoyRight.image = loadImage(assets.images.blockBoyRight.source);
    assets.images.blockBoy = {};
    assets.images.blockBoy.source = "assets/images/block-boy.png";
    assets.images.blockBoy.image = loadImage(assets.images.blockBoy.source);
    assets.images.goal = {};
    assets.images.goal.source = "assets/images/goal.png";
    assets.images.goal.image = loadImage(assets.images.goal.source);
    assets.images.bg1 = {};
    assets.images.bg1.source = "assets/images/background-1.png";
    assets.images.bg1.image = loadImage(assets.images.bg1.source);
    assets.sounds.bgMusic = loadSound("assets/sounds/bg-music.mp3");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.selectClick = loadSound("assets/sounds/select-click.wav");
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
var levelEditor;
var startMillis;
var currentMillis;
var score = 0;
var finalScore = 0;
var timeRunningOut = false;

function setup() {
    select('body').style('background-color', '#000000'); // Set browser background to black
    createCanvas(canvasWidth, canvasHeight);
    background(51);
    gameState = 'menu';
    collisionChecker = new CollisionChecker(canvasWidth, canvasHeight, blockSize);
    character = new Character(0, 0, blockSize, startingLives);
    blockManager = new BlockManager(collisionChecker);
    levelManager = new LevelManager(blockSize, character);
    grid = new Grid(canvasWidth, canvasHeight, blockSize);
    goal = new LevelObject(0, canvasHeight - blockSize * 3, blockSize, assets.images.goal.image, false, "goal");
}

function keyPressed() {
    if (keyCode === ENTER && gameState === 'menu') {
        gameState = 'gameplay';
        if (character.lives <= 0) {
            character.lives = startingLives;
            finalScore = 0;
            currentLevel = 0;
            score = 0;
        }
        stroke(0);
        fill(255);
        strokeWeight(1);
        textSize(12);
        textFont('Arial');
        textAlign(LEFT, BASELINE);
        textStyle(NORMAL);
        loadLevel();
    }
    if (keyCode === ESCAPE && gameState === 'menu') {
        gameState = 'level-editor';
        stroke(0);
        fill(255);
        strokeWeight(1);
        textSize(12);
        textFont('Arial');
        textAlign(LEFT, BASELINE);
        textStyle(NORMAL);
        levelEditor = new LevelEditor(blockSize);
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
    timeRunningOut = false;
    character.blockBoyNormal();
    window.assets.sounds.bgMusic.rate(1);
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

    levelManager.drawLevelInfo(score);
    startMillis = millis();
}

function winLevel() {
    score += calculateScore();
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

function calculateScore() {
    const elapsedSeconds = Math.floor((currentMillis - startMillis) / 1000);
    const levelConfig = levelManager.getLevelConfig();
    let score = Math.max(0, levelConfig.time - elapsedSeconds) * 100;
    if (!blockManager.blockConfig.unlimitedBlocks) {
        score += blockManager.blockConfigCurrentValues.blockStock * 100;
    }
    score += character.lives * 1000;
    return score;
}

function loseLife() {
    blockManager.removeblockConfig();
    levelManager.removeLevelInfo();
    window.assets.sounds.bgMusic.stop();
    character.lives--;
    gameState = 'gameover';
    if (character.lives <= 0) {
        finalScore = score;
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
        case 'level-editor':
            drawLevelEditor();
            break;
    }
}

function drawLevelEditor() {
    background(51);
    levelEditor.draw();
}


function gameplay() {
    currentMillis = millis();
    const elapsedSeconds = Math.floor((currentMillis - startMillis) / 1000);
    levelManager.updateTime(elapsedSeconds);
    if (levelManager.getLevelConfig().time - elapsedSeconds <= 0) {
        loseLife();
        return;
    }
    if (levelManager.getLevelConfig().time - elapsedSeconds <= 10 && timeRunningOut === false) {
        timeRunningOut = true;
        window.assets.sounds.bgMusic.rate(1.5);
        character.blockBoyPanic();
    }

    background(51);
    image(assets.images.bg1.image, 0, 0, canvasWidth, canvasHeight);
    if (debug) {
        text(frameRate(), 10, 10);
    }

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
    blockManager?.setMouseClicked(false);
    levelEditor?.setMouseClicked(false);
}

