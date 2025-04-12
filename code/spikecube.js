class SpikeCube {
    constructor(x, y, gridSize){
        this.blockCurrent = window.assets.images.blockRed.get();
        this.x = x;
        this.y = y;
        this.location = x + ":" + y;
        this.blockSize = blockSize;
    }

    getLocation(){
        return this.x + ":" + this.y;
    }

    draw(){
        image(this.blockCurrent, this.x, this.y, this.blockSize, this.blockSize);
    }
}