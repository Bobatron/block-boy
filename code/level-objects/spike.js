class Spike extends LevelObject {
    constructor(x, y, blockSize, type) {
        switch (type) {
            case LevelObjectType.FriendlySpike:
                super(x, y, blockSize, assets.images.blockFriendlySpike.image, true, LevelObjectType.FriendlySpike);
                break;
            case LevelObjectType.Spike:
                super(x, y, blockSize, assets.images.blockSpike.image, true, LevelObjectType.Spike);
                break;
            default:
                throw error(`Unknown spike type provided: ${type}`)

        }
    }

    getSpikeCollisionBox() {
        return { x: this.x + (this.blockSize / 4), y: this.y + (this.blockSize / 4), blockSize: this.blockSize / 2, type: CollisionType.Spike }
    }

    drawSpikeCollisionBox() {
        const collisionBox = this.getSpikeCollisionBox();
        noFill();
        strokeWeight(4);
        stroke(color("red"));
        rect(collisionBox.x, collisionBox.y, collisionBox.blockSize, collisionBox.blockSize);
    }
}

// Make Block globally accessible
window.Rock = Rock;