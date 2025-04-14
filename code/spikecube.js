class SpikeCube extends Platform {
    constructor(x, y, blockSize) {
        super(x, y, blockSize);
        this.blockCurrent = window.assets.images.blockSpike.get(); 
    }
    getLocation(){
        return this.x + ":" + this.y;
    }

    draw(){
        image(this.blockCurrent, this.x, this.y, this.blockSize, this.blockSize);
    }
}