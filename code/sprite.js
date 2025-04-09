class Sprite {

    constructor(sprite, width, height, xFrames, yFrames, speed, loop, startFrame) {
        this.sprite = sprite;
        this.index = 0;
        this.speed = speed;
        this.animation = [];
        this.width = width;
        this.height = height;
        this.loop = loop;
        this.xFrames = xFrames;
        this.yFrames = yFrames;

        for (var y = 0; y < this.yFrames; y++) {
            for (var x = startFrame; x < this.xFrames; x++) {
                this.animation.push(this.sprite.get(x * this.width, y * this.height, this.width, this.height));
            }
        }
    }

    draw(x, y, width, height) {
        if (this.loop || this.index < this.animation.length) {
            image(this.animation[floor(this.index) % this.animation.length], x, y, width, height);
            this.index += this.speed;
        }
    }
}