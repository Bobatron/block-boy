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
        this.startPosition = { x: 0, y: 0 };
        this.goalPosition = { x: 0, y: 0 };
    }

    draw() {
        this.drawPlatforms();
        this.drawRocks();
        this.drawSpikes();
        this.drawFriendlySpikes();
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
                if (this.levelData.getString(r, c) === 'p') {
                    platforms.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockYellow.image, false, "platform"));
                }
            }
        }
        return platforms;
    }

    loadRocks() {
        let rocks = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'r') {
                    rocks.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockGrey.image, false, "rock"));
                }
            }
        }
        return rocks;
    }

    loadStartPosition() {
        let startPosition = {};
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 's') {
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
                if (this.levelData.getString(r, c) === 'g') {
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
                if (this.levelData.getString(r, c) === 'x') {
                    spikes.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockSpike.image, true, "spike"));
                }
            }
        }
        return spikes;
    }

    loadFriendlySpikes() {
        let friendlySpikes = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'f') {
                    friendlySpikes.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockFriendlySpike.image, true, "friendly-spike"));
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

    removeLevelInfo() {
        for (let i = 0; i < this.levelInfoElements.length; i++) {
            this.levelInfoElements[i].remove();
        }
    }
}