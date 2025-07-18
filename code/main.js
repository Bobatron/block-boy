var debug = false;
var collisionDebug = false;
var collisionCheckCount = 0;
var assets = {};
var totalLevels = 30;
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
    assets.images.blockAngrySpike = {};
    assets.images.blockAngrySpike.source = "assets/images/block-angry-spike.png";
    assets.images.blockAngrySpike.image = loadImage(assets.images.blockAngrySpike.source);
    assets.images.blockGrey = {};
    assets.images.blockGrey.source = "assets/images/block-grey.png";
    assets.images.blockGrey.image = loadImage(assets.images.blockGrey.source);
    assets.images.blockBoyLeft = {};
    assets.images.blockBoyLeft.source = "assets/images/block-boy-left.png";
    assets.images.blockBoyLeft.image = loadImage(assets.images.blockBoyLeft.source);
    assets.images.blockBoyLeftHappy = {};
    assets.images.blockBoyLeftHappy.source = "assets/images/block-boy-left-happy.png";
    assets.images.blockBoyLeftHappy.image = loadImage(assets.images.blockBoyLeftHappy.source);
    assets.images.blockBoyRightHappy = {};
    assets.images.blockBoyRightHappy.source = "assets/images/block-boy-right-happy.png";
    assets.images.blockBoyRightHappy.image = loadImage(assets.images.blockBoyRightHappy.source);
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
    assets.images.pencilCursor = {};
    assets.images.pencilCursor.source = "assets/images/pencil.png";
    assets.images.pencilCursor.image = loadImage(assets.images.pencilCursor.source);
    assets.images.hammerCursor = {};
    assets.images.hammerCursor.source = "assets/images/hammer.png";
    assets.images.hammerCursor.image = loadImage(assets.images.hammerCursor.source);
    assets.images.goal = {};
    assets.images.goal.source = "assets/images/goal.png";
    assets.images.goal.image = loadImage(assets.images.goal.source);
    assets.images.yarn = {};
    assets.images.yarn.source = "assets/images/yarn.png";
    assets.images.yarn.image = loadImage(assets.images.yarn.source);
    assets.images.hiddenYarn = {};
    assets.images.hiddenYarn.source = "assets/images/hidden-yarn.png";
    assets.images.hiddenYarn.image = loadImage(assets.images.hiddenYarn.source);
    assets.images.qrCode = {};
    assets.images.qrCode.source = "assets/images/qr-code.jpg";
    assets.images.qrCode.image = loadImage(assets.images.qrCode.source);
    assets.images.bg1 = {};
    assets.images.bg1.source = "assets/images/background-1.png";
    assets.images.bg1.image = loadImage(assets.images.bg1.source);
    assets.images.logo = {};
    assets.images.logo.source = "assets/images/logo.png";
    assets.images.logo.image = loadImage(assets.images.logo.source);
    assets.sounds.bgMusic = loadSound("assets/sounds/bg-music.mp3");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.breakRock = loadSound("assets/sounds/break-rock.wav");
    assets.sounds.selectClick = loadSound("assets/sounds/select-click.wav");
    assets.sounds.yay = loadSound("assets/sounds/yay.wav");
    assets.sounds.win = loadSound("assets/sounds/win.wav");
    assets.sounds.lose = loadSound("assets/sounds/lose.mp3");
    assets.sounds.noDraw = loadSound("assets/sounds/no-draw.wav");
    assets.sounds.jump = [loadSound("assets/sounds/jump-1.wav"), loadSound("assets/sounds/jump-2.wav"), loadSound("assets/sounds/jump-3.wav")];

    for (let i = 0; i < totalLevels; i++) {
        const levelIndex = i + 1;
        assets.levels.data[i] = loadTable(`assets/levels/level-${levelIndex}.csv`, "csv");
        assets.levels.config[i] = loadJSON(`assets/levels/level-${levelIndex}.json`);
    }
}

// Configuration
let canvasWidth = 1500;
let canvasHeight = 780;
var grid;
var maxBlocks = 5;
var blockStock = 5;
var blockSize = 60;
var blockManager;
var collisionManager;
var gameState;
var levelManager;
var currentLevel = 0;
var goal;
var levelEditor;
var startMillis;
var currentMillis;
var pauseMillis;
var score = 0;
var finalScore = 0;
var timeRunningOut = false;
var mouseIcon;
let isPaused = false;

function setup() {
    select('body').style('background-color', '#000000'); // Set browser background to black
    createCanvas(canvasWidth, canvasHeight);
    background(51);
    gameState = GameState.TitleScreen;
    collisionManager = new CollisionManager(canvasWidth, canvasHeight, blockSize);
    character = new Character(0, 0, blockSize, startingLives);
    blockManager = new BlockManager(collisionManager);
    levelManager = new LevelManager(blockSize, character);
    grid = new Grid(canvasWidth, canvasHeight, blockSize);
    goal = new LevelObject(0, canvasHeight - blockSize * 3, blockSize, assets.images.goal.image, false, LevelObjectType.Goal);
    mouseIcon = new MouseIcon((blockSize / 5) * 3);
    // Add QR Code
    let qrImageElement = createImg(assets.images.qrCode.source);
    qrImageElement.position(canvasWidth + 50, 10);
    qrImageElement.size(250, 250);
}

function keyPressed() {
    if (keyCode === ENTER && gameState === GameState.TitleScreen) {
        gameState = GameState.MainMenu;
        assets.sounds.yay.play();
    } else if (keyCode === ENTER && gameState === GameState.MainMenu) {
        gameState = GameState.GamePlay;
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
    } else if (keyCode === ESCAPE && gameState === GameState.MainMenu) {
        gameState = GameState.LevelEditor;
        stroke(0);
        fill(255);
        strokeWeight(1);
        textSize(12);
        textFont('Arial');
        textAlign(LEFT, BASELINE);
        textStyle(NORMAL);
        levelEditor = new LevelEditor(blockSize);
    } else if (keyCode === ENTER && gameState === GameState.GameOver) {
        window.assets.sounds.bgMusic.stop();
        gameState = GameState.TitleScreen;
    } else if (keyCode === ENTER && (gameState === GameState.LevelComplete || gameState === GameState.LoseLife)) {
        gameState = GameState.GamePlay;
        stroke(0);
        fill(255);
        strokeWeight(1);
        textSize(12);
        textFont('Arial');
        textAlign(LEFT, BASELINE);
        textStyle(NORMAL);
        loadLevel();
    } else if (keyCode === ENTER && gameState === GameState.GameComplete) {
        window.assets.sounds.bgMusic.stop();
        gameState = GameState.TitleScreen;
        character.lives = startingLives;
        finalScore = 0;
        currentLevel = 0;
        score = 0;
    } else if (keyCode === ESCAPE && gameState === GameState.GamePlay) {
        if (isPaused) {
            const pauseTime = millis() - pauseMillis;
            startMillis += pauseTime;
            isPaused = false;
            window.assets.sounds.bgMusic.play();

        } else {
            pauseMillis = millis();
            isPaused = true;
            window.assets.sounds.bgMusic.pause();
        }
    }

}

function loadLevel() {
    timeRunningOut = false;
    character.blockBoyNormal();
    window.assets.sounds.lose.stop();
    window.assets.sounds.win.stop();
    if (!window.assets.sounds.bgMusic.isPlaying()) {
        window.assets.sounds.bgMusic.loop();
    }
    collisionManager.initializeCollisionCheckGrid();
    levelManager.loadLevelData(assets.levels.data[currentLevel]);
    levelManager.loadLevelConfig(assets.levels.config[currentLevel]);

    for (let i = 0; i < levelManager.platforms.length; i++) {
        collisionManager.addObjectToCollisionCheckGrid(levelManager.platforms[i]);
    }

    for (let i = 0; i < levelManager.rocks.length; i++) {
        collisionManager.addObjectToCollisionCheckGrid(levelManager.rocks[i]);
    }

    for (let i = 0; i < levelManager.spikes.length; i++) {
        collisionManager.addObjectToCollisionCheckGrid(levelManager.spikes[i]);
    }

    for (let i = 0; i < levelManager.friendlySpikes.length; i++) {
        collisionManager.addObjectToCollisionCheckGrid(levelManager.friendlySpikes[i]);
    }

    for (let i = 0; i < levelManager.angrySpikes.length; i++) {
        collisionManager.addObjectToCollisionCheckGridIncludingSurroundingBocks(levelManager.angrySpikes[i]);
    }

    for (let i = 0; i < levelManager.yarns.length; i++) {
        collisionManager.addObjectToCollisionCheckGrid(levelManager.yarns[i]);
    }

    character.reset(levelManager.startPosition.x, levelManager.startPosition.y);
    goal.reset(levelManager.goalPosition.x, levelManager.goalPosition.y);

    collisionManager.addObjectToCollisionCheckGrid(goal);

    maxBlocks = levelManager.getLevelConfig().maxBlocks;
    blockStock = levelManager.getLevelConfig().blockStock;
    blockManager.load(blockSize, maxBlocks, blockStock, canvasWidth, canvasHeight);
    if (collisionDebug) {
        console.log("Collision grid: ", collisionManager.collisionCheckGrid);
    }

    levelManager.drawLevelInfo(score);
    startMillis = millis();
}

function winLevel() {
    score += calculateScore();
    blockManager.removeblockConfig();
    levelManager.removeLevelInfo();
    gameState = GameState.LevelComplete;
    window.assets.sounds.bgMusic.rate(1);
    window.assets.sounds.win.play();
    currentLevel += 1;
    if (currentLevel >= assets.levels.data.length) {
        gameState = GameState.GameComplete;
        finalScore = score;
        // Temp approach until better win screens added
        alert(`You Won! Final Score: ${finalScore}`);
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
    window.assets.sounds.bgMusic.rate(1);
    window.assets.sounds.lose.play();
    character.lives--;
    if (character.lives <= 0) {
        gameState = GameState.GameOver;
        finalScore = score;
        // Temp approach until better game over screens added
        alert(`Game Over! Final Score: ${finalScore}`);
    } else {
        gameState = GameState.LoseLife;
    }
}

function draw() {
    switch (gameState) {
        case GameState.TitleScreen:
            drawTitleScreen();
            break;
        case GameState.MainMenu:
            drawMenuScreen();
            break;
        case GameState.GamePlay:
            gameplay();
            break;
        case GameState.GameOver:
            drawGameOverScreen();
            break;
        case GameState.LoseLife:
            drawLoseLifeScreen();
            break;
        case GameState.LevelComplete:
            drawWinLevelScreen();
            break;
        case GameState.GameComplete:
            drawWinGameScreen();
            break;
        case GameState.LevelEditor:
            drawLevelEditor();
            break;
    }
}

function drawLevelEditor() {
    background(51);
    levelEditor.draw();
}


function gameplay() {
    if (isPaused) {
        textSize(50);
        textAlign(CENTER, CENTER);
        text('PAUSED', canvasWidth / 2, canvasHeight / 2);
        return;
    }
    background(51);
    image(assets.images.bg1.image, 0, 0, canvasWidth, canvasHeight);
    if (debug) {
        text(frameRate(), 10, 10);
    }

    // Update timer and do checks
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

    // Collision check loop logic
    let startX = Math.floor(character.collisionBox.leftX1 / blockSize);
    let endX = Math.floor(character.collisionBox.rightX1 / blockSize);
    let startY = Math.floor(character.collisionBox.topY1 / blockSize);
    let endY = Math.floor(character.collisionBox.bottomY1 / blockSize);

    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            if (collisionManager.collisionCheckGrid[x] && collisionManager.collisionCheckGrid[x][y]) {
                for (let index = 0; index < collisionManager.collisionCheckGrid[x][y].length; index++) {
                    let objects = collisionManager.collisionCheckGrid[x][y];
                    let object = collisionManager.collisionCheckGrid[x][y][index];
                    // Character wont be in this grid currently but should be in the future
                    // For example when there are other moving objects that may collide with the character
                    if (object !== character) {
                        switch (object.type) {
                            case LevelObjectType.Platform:
                            case LevelObjectType.Block:
                            case LevelObjectType.Rock:
                                checkCharacterCollisionRightSide(character, object);
                                checkCharacterCollisionLeftSide(character, object);
                                checkCharacterCollisionDown(character, object);
                                checkCharacterCollisionUp(character, object);
                                break;
                            case LevelObjectType.Spike:
                            case LevelObjectType.AngrySpike:
                                if (checkCharacterCollisionRect(character, object.getSpikeCollisionBox())) {
                                    loseLife();
                                    return;
                                }
                                break;
                            case LevelObjectType.FriendlySpike:
                                if (!objects.some(obj => obj.type === LevelObjectType.Block) && checkCharacterCollisionRect(character, object.getSpikeCollisionBox())) {
                                    loseLife();
                                    return;
                                }
                                break;
                            case LevelObjectType.Yarn:
                                if (checkCharacterCollisionRect(character, object.getYarnCollisionBox())) {
                                    levelManager.removeYarn(object);
                                    collisionManager.removeObjectFromCollisionCheckGrid(object);
                                    score += 1000;
                                    levelManager.updateScore(score);
                                    if (!timeRunningOut) {
                                        character.blockBoyHappy();
                                    }
                                }
                                break;
                            case LevelObjectType.Goal:
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
    levelManager.draw();

    var mouse = {};
    mouse.x = mouseX - (mouseX % blockSize);
    mouse.y = mouseY - (mouseY % blockSize);
    mouse.blockSize = blockSize;
    mouse.type = LevelObjectType.Cursor;
    let mouseGridX = Math.floor(mouse.x / blockSize);
    let mouseGridY = Math.floor(mouse.y / blockSize);
    // Collision check logic for cursor
    if (mouseIsPressed) {
        if (collisionManager.collisionCheckGrid[mouseGridX] && collisionManager.collisionCheckGrid[mouseGridX][mouseGridY] && collisionManager.collisionCheckGrid[mouseGridX][mouseGridY][0]) {
            let object = collisionManager.collisionCheckGrid[mouseGridX][mouseGridY][0];
            switch (object.type) {
                case LevelObjectType.Platform:
                case LevelObjectType.Spike:
                case LevelObjectType.Goal:
                    if (checkObjectCollisionRect(object, mouse) == false) {
                        blockManager.addRemoveBlocks();
                    }
                    break;
                case LevelObjectType.Block:
                case LevelObjectType.FriendlySpike:
                    blockManager.addRemoveBlocks();
                    break;
                case LevelObjectType.AngrySpike:
                    if (checkObjectCollisionRect(object.getAngrySpikeZone(), mouse) == false) {
                        blockManager.addRemoveBlocks();
                    } else if (!blockManager.locked) {
                        if (assets.sounds.noDraw.isPlaying()) {
                            assets.sounds.noDraw.stop();
                            assets.sounds.noDraw.play();
                        } else {

                            assets.sounds.noDraw.play();
                        }
                    }
                    break;
                case LevelObjectType.Rock:
                    // Checking if block boy is in neighbouring tiles
                    if (checkCharacterCollisionRect(character, object.getRockCollisionBox())) {
                        levelManager.removeRock(object);
                        collisionManager.removeObjectFromCollisionCheckGrid(object);
                        blockManager.lock();
                    }

            }
        } else if (checkCharacterCollisionRect(character, mouse) == false) {
            blockManager.addRemoveBlocks();
        }
    }
    character.draw();

    // Mouse icon (cursor drawing logic)
    if (collisionManager.collisionCheckGrid[mouseGridX]?.[mouseGridY]?.[0]?.type === LevelObjectType.Rock) {
        let rock = collisionManager.collisionCheckGrid[mouseGridX][mouseGridY][0];
        checkCharacterCollisionRect(character, rock.getRockCollisionBox()) ? mouseIcon.drawHammer() : mouseIcon.drawPencil();
    } else {
        mouseIcon.drawPencil();
    }


    if (collisionDebug) {
        console.log(collisionCheckCount);
        collisionCheckCount = 0;
        for (const spike of levelManager.spikes) {
            spike.drawSpikeCollisionBox();
        }
        for (const friendlySpike of levelManager.friendlySpikes) {
            friendlySpike.drawSpikeCollisionBox();
        }
        for (const angrySpike of levelManager.angrySpikes) {
            angrySpike.drawSpikeCollisionBox();
            angrySpike.drawAngrySpikeZone();
        }
        for (const rock of levelManager.rocks) {
            rock.drawRockCollisionBox();
        }
        for (const yarn of levelManager.yarns) {
            yarn.drawYarnCollisionBox();
        }
    }
}

function mouseReleased() {
    blockManager?.setMouseClicked(false);
    blockManager?.unlock();
    levelEditor?.setMouseClicked(false);
}
