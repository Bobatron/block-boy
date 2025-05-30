class Block extends LevelObject {
    constructor(x, y, blockSize){
        super(x, y, blockSize, null, false, "block");
        this.blockGreen = window.assets.images.blockGreen.get();
        this.blockRed = window.assets.images.blockRed.get();
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