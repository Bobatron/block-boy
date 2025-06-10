class LevelManager {
    constructor(blockSize, character) {
        this.levelData;
        this.levelConfig;
        this.blockSize = blockSize;
        this.levelInfoElements = [];
        this.character = character;
        this.platforms = [];
        this.rocks = [];
        this.spikes = [];
        this.friendlySpikes = [];
        this.yarns = [];
        this.startPosition = { x: 0, y: 0 };
        this.goalPosition = { x: 0, y: 0 };
    }

    draw() {
        // Draw yarns before rocks, so they can be hidden behind them in some levels
        this.drawYarns();
        this.drawPlatforms();
        this.drawRocks();
        this.drawSpikes();
        this.drawFriendlySpikes();
    }

    drawYarns() {
        for (let yarn of this.yarns) {
            yarn.draw();
        }
    }

    removeYarn(yarn) {
        const yarnIndex = this.yarns.indexOf(yarn);
        this.yarns.splice(yarnIndex, 1);
        assets.sounds.yay.play();
    }

    drawPlatforms() {
        for (let platform of this.platforms) {
            platform.draw();
        }
    }

    drawRocks() {
        for (let rock of this.rocks) {
            rock.draw();
        }
    }

    removeRock(rock) {
        const rockIndex = this.rocks.indexOf(rock);
        this.rocks.splice(rockIndex, 1);
        assets.sounds.breakRock.play();
    }

    drawSpikes() {
        for (let spike of this.spikes) {
            spike.draw();
        }
    }

    drawFriendlySpikes() {
        for (let friendlySpike of this.friendlySpikes) {
            friendlySpike.draw();
        }
    }

    loadPlatforms() {
        let platforms = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === LevelObjectSymbol.Platform) {
                    platforms.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, assets.images.blockYellow.image, false, LevelObjectType.Platform));
                }
            }
        }
        return platforms;
    }

    

    loadYarns() {
        let yarns = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === LevelObjectSymbol.Yarn || this.levelData.getString(r, c) === LevelObjectSymbol.HiddenYarn) {
                    yarns.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, assets.images.yarn.image, false, LevelObjectType.Yarn));
                }
            }
        }
        return yarns;
    }

    loadRocks() {
        let rocks = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === LevelObjectSymbol.Rock || this.levelData.getString(r, c) === LevelObjectSymbol.HiddenYarn) {
                    rocks.push(new Rock(c * this.blockSize, r * this.blockSize, this.blockSize));
                }
            }
        }
        return rocks;
    }

    loadStartPosition() {
        let startPosition = {};
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === LevelObjectSymbol.Start) {
                    startPosition = { x: c * this.blockSize, y: r * this.blockSize };
                    break;
                }
            }
        }
        if (debug) {
            console.log("Start Position: ", startPosition);
        }
        return startPosition.x ? startPosition : { x: 0, y: 0 };
    }

    loadGoalPosition() {
        let goalPosition = {};
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === LevelObjectSymbol.Goal) {
                    goalPosition = { x: c * this.blockSize, y: r * this.blockSize };
                    break;
                }
            }
        }
        if (debug) {
            console.log("Goal Position: ", goalPosition);
        }
        return goalPosition.x ? goalPosition : { x: 0, y: 0 };
    }

    loadSpikes() {
        let spikes = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === LevelObjectSymbol.Spike) {
                    spikes.push(new Spike(c * this.blockSize, r * this.blockSize, this.blockSize, LevelObjectType.Spike));
                }
            }
        }
        return spikes;
    }

    loadFriendlySpikes() {
        let friendlySpikes = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === LevelObjectSymbol.FriendlySpike) {
                    friendlySpikes.push(new Spike(c * this.blockSize, r * this.blockSize, this.blockSize, LevelObjectType.FriendlySpike));
                }
            }
        }
        return friendlySpikes;
    }

    getLevelConfig() {
        return this.levelConfig;
    }

    loadLevelData(levelData) {
        this.levelData = levelData;
        this.platforms = this.loadPlatforms();
        this.rocks = this.loadRocks();
        this.spikes = this.loadSpikes();
        this.yarns = this.loadYarns();
        this.friendlySpikes = this.loadFriendlySpikes();
        this.startPosition = this.loadStartPosition();
        this.goalPosition = this.loadGoalPosition();
    }

    loadLevelConfig(levelConfig) {
        this.levelConfig = levelConfig;
    }

    drawLevelInfo(currentScore) {
        this.levelInfoElements = []; // Clear previous elements
        const xOffset = 20; // Position inputs outside the canvas
        const yOffset = height + 60; // Starting y position for inputs

        // Create label
        let livesLeft = createElement('label', `Lives: ${this.character.lives}`);
        livesLeft.position(xOffset, yOffset);
        livesLeft.style('font-size', '24px'); // Set font size
        livesLeft.style('font-weight', 'bold'); // Make the font bold
        livesLeft.style('font-family', 'Arial, sans-serif'); // Use a clean, game-friendly font
        livesLeft.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
        this.levelInfoElements.push(livesLeft);
        // Create label
        let score = createElement('label', `Score: ${currentScore}`);
        score.position(xOffset + 300, yOffset);
        score.style('font-size', '24px'); // Set font size
        score.style('font-weight', 'bold'); // Make the font bold
        score.style('font-family', 'Arial, sans-serif'); // Use a clean, game-friendly font
        score.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
        this.levelInfoElements.push(score);
        // Create label
        let time = createElement('label', `Time: ${this.levelConfig.time}`);
        time.position(xOffset, yOffset + 50);
        time.style('font-size', '24px'); // Set font size
        time.style('font-weight', 'bold'); // Make the font bold
        time.style('font-family', 'Arial, sans-serif'); // Use a clean, game-friendly font
        time.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
        this.levelInfoElements.push(time);
    }

    updateLevelInfo() {
        this.levelInfoElements[0].html(`Lives: ${this.character.lives}`);
        this.levelInfoElements[2].html(`Time:  ${this.levelConfig.time}`);
    }

    updateTime(elapsedSeconds) {
        this.levelInfoElements[2].html(`Time:  ${this.levelConfig.time - elapsedSeconds}`);
    }

    updateScore(currentScore) {
        this.levelInfoElements[1].html(`Score: ${currentScore}`);
    }

    removeLevelInfo() {
        for (let i = 0; i < this.levelInfoElements.length; i++) {
            this.levelInfoElements[i].remove();
        }
    }
}