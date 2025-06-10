class SpriteManager {

    constructor({spriteSheet, spriteWidth, spriteHeight, xFrames, yFrames, animationSpeed, loop, startFrame}) {
        this.spriteSheet = spriteSheet;
        this.spriteImageIndex = 0;
        this.animationSpeed = animationSpeed;
        this.spriteImages = [];
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        // Not sure what this is for yet
        this.loop = loop;
        this.xFrames = xFrames;
        this.yFrames = yFrames;
        this.startFrame = startFrame;
        this.populateSpriteImages();
    }

    draw(x, y, width, height) {
        if (this.loop || this.spriteImageIndex < this.spriteImages.length) {
            image(this.spriteImages[floor(this.spriteImageIndex) % this.spriteImages.length], x, y, width, height);
            this.spriteImageIndex += this.animationSpeed;
        }
    }

    updateSprintImage(newImage) {
        this.spriteSheet = newImage;
        this.populateSpriteImages();
    }

    populateSpriteImages() {
        this.spriteImages = [];
        for (var y = 0; y < this.yFrames; y++) {
            for (var x = this.startFrame; x < this.xFrames; x++) {
                this.spriteImages.push(this.spriteSheet.get(x * this.spriteWidth, y * this.spriteHeight, this.spriteWidth, this.spriteHeight));
            }
        }
    }
}