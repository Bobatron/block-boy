class Rock extends LevelObject {
    constructor(x, y, blockSize) {
        super(x, y, blockSize, assets.images.blockGrey.image, false, "rock");
    }

    getRockCollisionBox() {
        return { x: this.x - (this.blockSize / 2), y: this.y - (this.blockSize / 2), blockSize: this.blockSize * 2, type: 'rock-collision-area' }
    }

    drawRockCollisionBox() {
        const collisionBox = this.getRockCollisionBox();
        noFill();
        strokeWeight(4);
        stroke(color("red"));
        rect(collisionBox.x, collisionBox.y, collisionBox.blockSize, collisionBox.blockSize);
    }
}

// Make Block globally accessible
window.Rock = Rock;