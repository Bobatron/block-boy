class Yarn extends LevelObject {
    constructor(x, y, blockSize) {
        super(x, y, blockSize, assets.images.yarn.image, false, LevelObjectType.Yarn);
    }

    getYarnCollisionBox() {
        return { x: this.x + (this.blockSize / 5), y: this.y + (this.blockSize / 5), blockSize: (this.blockSize / 5) * 3, type: CollisionType.Yarn }
    }

    drawYarnCollisionBox() {
        const collisionBox = this.getYarnCollisionBox();
        noFill();
        strokeWeight(4);
        stroke(color("red"));
        rect(collisionBox.x, collisionBox.y, collisionBox.blockSize, collisionBox.blockSize);
    }
}

// Make Yarn globally accessible
window.Yarn = Yarn;