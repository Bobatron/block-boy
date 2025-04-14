class LevelObject{
    constructor(x, y, blockSize, image, killPlayer){
        this.image = image;
        this.x = x;
        this.y = y;
        this.blockSize = blockSize;
        this.killPlayer = killPlayer;
    }

    reset(x, y){
        this.x = x;
        this.y = y;
    }

    getLocation(){
        return this.x + ":" + this.y;
    }

    draw(){
        image(this.image, this.x, this.y, this.blockSize, this.blockSize);
    }
}
