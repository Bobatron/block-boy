class LevelManager {
    constructor(blockSize) {
        this.levelData;
        this.levelConfig;
        this.blockSize = blockSize;
    }

    getPlatforms() {
        let platforms = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'p') {
                    platforms.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockYellow.get(), false));
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
        console.log("Start Position: ", startPosition);
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
        console.log("Goal Position: ", goalPosition);
        return goalPosition.x ? goalPosition : { x: 0, y: 0 };
    }

    getSpikes() {
        let spikes = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'x') {
                    spikes.push(new LevelObject(c * this.blockSize, r * this.blockSize, this.blockSize, window.assets.images.blockSpike.get(), true));
                }
            }
        }
        return spikes;
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
}