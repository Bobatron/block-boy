class Spike extends LevelObject {
    constructor(x, y, blockSize, type) {
        if (type === 'friendly-spike') {
            super(x, y, blockSize, assets.images.blockFriendlySpike.image, true, "friendly-spike");
        } else if (type === 'spike') {
            super(x, y, blockSize, assets.images.blockSpike.image, true, 'spike');
        } else {
            throw error(`Unknown spike type provided: ${type}`)
        }
    }

    getSpikeCollisionBox() {
        return { x: this.x + (this.blockSize / 4), y: this.y + (this.blockSize / 4), blockSize: this.blockSize / 2, type: 'spike-collision-area' }
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