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
            case 'spike':
                this.symbol = 'x';
                break;
            case 'platform':
                this.symbol = 'p';
                break;
            case 'rock':
                this.symbol = 'r';
                break;
            case 'friendly-spike':
                this.symbol = 'f';
                break;
            case 'start':
                this.symbol = 's';
                break;
            case 'goal':
                this.symbol = 'g';
                break;
            case 'block':
                this.symbol = 'b';
                break;
            default:
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
