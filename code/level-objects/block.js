class Block extends LevelObject {
    constructor(x, y, blockSize){
        super(x, y, blockSize, null, false, LevelObjectType.Block);
        this.blockGreen = assets.images.blockGreen.image;
        this.blockRed = assets.images.blockRed.image;
        this.setImage(this.blockGreen);
    }

    changeToRed(){
        this.setImage(this.blockRed);
    }

    changeToGreen(){
        this.setImage(this.blockGreen);
    }
}

// Make Block globally accessible
window.Block = Block;