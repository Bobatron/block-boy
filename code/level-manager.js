class LevelManager {
    constructor() {
        this.levelData;
    }

    draw(){
        for (let r = 0; r < this.levelData.getRowCount(); r++)
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
              print(this.levelData.getString(r, c));
            }
    }

    getPlatforms() {
        let platforms = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'platform') {
                    platforms.push(new Platform(c * gridSize, r * gridSize, gridSize));
                }
            }
        }
        return platforms;
    }

    getSpikeCubes() {
        let spikecubes = [];
        for (let r = 0; r < this.levelData.getRowCount(); r++) {
            for (let c = 0; c < this.levelData.getColumnCount(); c++) {
                if (this.levelData.getString(r, c) === 'spikecube') {
                    spikecubes.push(new SpikeCube(c * gridSize, r * gridSize, gridSize));
                }
            }
        }
        return spikecubes;
    }

    loadLevel(level) {
        this.levelData = level;
    }
}