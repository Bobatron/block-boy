class LevelManager {
    constructor(blockSize, character) {
        this.levelData;
        this.levelConfig;
        this.blockSize = blockSize;
        this.levelInfoElements = [];
        this.character = character;
    }

    getPlatforms() {
        let platforms = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'p') {
                    platforms.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockYellow.get(), false, "platform"));
                }
            }
        }
        return platforms;
    }

    getStartPosition() {
        let startPosition = {};
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 's') {
                    startPosition = { x: c * this.blockSize, y: r * this.blockSize };
                    break;
                }
            }
        }
        if(debug){
            console.log("Start Position: ", startPosition);
        }
        return startPosition.x ? startPosition : { x: 0, y: 0 };
    }

    getGoalPosition() {
        let goalPosition = {};
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'g') {
                    goalPosition = { x: c * this.blockSize , y: r * this.blockSize };
                    break;
                }
            }
        }
        if(debug){
            console.log("Goal Position: ", goalPosition);
        }
        return goalPosition.x ? goalPosition : { x: 0, y: 0 };
    }

    getSpikes() {
        let spikes = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'x') {
                    spikes.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockSpike.get(), true, "spike"));
                }
            }
        }
        return spikes;
    }

    getFriendlySpikes() {
        let friendlySpikes = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'f') {
                    friendlySpikes.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockFriendlySpike.get(), true, "friendly-spike"));
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
    }

    loadLevelConfig(levelConfig) {
        this.levelConfig = levelConfig;
    }

    drawLevelInfo() {
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
        let score = createElement('label', `Score: 0`);
        score.position(xOffset + 300, yOffset);
        score.style('font-size', '24px'); // Set font size
        score.style('font-weight', 'bold'); // Make the font bold
        score.style('font-family', 'Arial, sans-serif'); // Use a clean, game-friendly font
        score.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
        this.levelInfoElements.push(score);
    }

    updateLevelInfo() {
        this.levelInfoElements[0].html(`Lives: ${this.character.lives}`);
    }

    removeLevelInfo() {
        for (let i = 0; i < this.levelInfoElements.length; i++) {
            this.levelInfoElements[i].remove();
        }
    }
}