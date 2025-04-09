class Block {
    constructor(x, y, blockSize){
        window.assets.sounds.popCreate.play();
        this.blockGreen = window.assets.images.blockGreen.get();
        this.blockRed = window.assets.images.blockRed.get();
        this.blockCurrent = this.blockGreen;
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

    changeToRed(){
        this.blockCurrent = this.blockRed;
    }

    playRemoveSound(){
        window.assets.sounds.popRemove.play();
    }

}

