class LevelObject {
    constructor(x, y, blockSize, image, killPlayer, type) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.blockSize = blockSize;
        this.killPlayer = killPlayer;
        this.type = type; // 'spike', 'platform', etc.
        this.symbol;
        switch (this.type) {
            case LevelObjectType.Spike:
                this.symbol = LevelObjectSymbol.Spike;
                break;
            case LevelObjectType.Platform:
                this.symbol = LevelObjectSymbol.Platform;
                break;
            case LevelObjectType.Rock:
                this.symbol = LevelObjectSymbol.Rock;
                break;
            case LevelObjectType.FriendlySpike:
                this.symbol = LevelObjectSymbol.FriendlySpike;
                break;
            case LevelObjectType.Start:
                this.symbol = LevelObjectSymbol.Start;
                break;
            case LevelObjectType.Goal:
                this.symbol = LevelObjectSymbol.Goal;
                break;
            case LevelObjectType.Block:
                this.symbol = LevelObjectSymbol.Block;
                break;
            case LevelObjectType.Yarn:
                this.symbol = LevelObjectSymbol.Yarn;
                break;
            case LevelObjectType.HiddenYarn:
                this.symbol = LevelObjectSymbol.HiddenYarn;
                break;
            default:
                console.warn(`Unknown type ${type} provided`);
                this.symbol = '-';
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    getLocation() {
        return this.x + ":" + this.y;
    }

    draw() {
        image(this.image, this.x, this.y, this.blockSize, this.blockSize);
    }

    setImage(image) {
        this.image = image;
    }
}

// Make LevelObject globally accessible
window.LevelObject = LevelObject;
