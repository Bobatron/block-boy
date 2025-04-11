class BlockManager {
    constructor(gridSize, maxBlocks, canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gridSize = gridSize;
        this.maxBlocks = maxBlocks;
        this.blocks = [];
        this.mouseClicked = false;
        this.drawMode = false;
    }

    drawAll(){
        for (const block of this.blocks) {
            block.draw();
        }
    }

    setMouseClicked(isClicked) {
        this.mouseClicked = isClicked;
    }

    addBlock(x,y){
        this.blocks.push(new Block(x, y, this.gridSize));
    }

    getExistingBlockIndex(x, y) {
        for(var i = 0; i < this.blocks.length; i++) {
            if(this.blocks[i].getLocation() === x + ":" + y){
                return i;
            }
        }
        return -1;
    }

    removeBlock(index) {
        var startArray = this.blocks.slice(0, index);
        var endArray = this.blocks.slice(index + 1, this.blocks.length);
        var returnArray = startArray.concat(endArray);
        return returnArray;
    }

    addRemoveBlocks() {
        var mouseGridPosX = mouseX - (mouseX % this.gridSize);
        var mouseGridPosY = mouseY - (mouseY % this.gridSize);
        if(mouseGridPosX > this.canvasWidth - this.gridSize || mouseGridPosY > this.canvasHeight - this.gridSize){
            // Don't do anything as outside the canvas bounds
            return;
        }


        var existingBlockIndex = this.getExistingBlockIndex(mouseGridPosX, mouseGridPosY);

        if (this.mouseClicked == false && existingBlockIndex == -1) {
            this.drawMode = true;
        } else if (this.mouseClicked == false) {
            this.drawMode = false;
        }
        this.mouseClicked = true;

        if (existingBlockIndex == -1 && this.drawMode == true && this.blocks.length < this.maxBlocks) {
            this.addBlock(mouseGridPosX, mouseGridPosY);
            if (this.blocks.length === this.maxBlocks) {
                this.blocks[0].changeToRed();
            }
        } else if (this.drawMode == false && existingBlockIndex != -1 && this.blocks.length > 0) {
            this.blocks = this.removeBlock(existingBlockIndex);
            assets.sounds.popRemove.play();
        } else if (existingBlockIndex == -1 && this.drawMode == true && this.blocks.length == this.maxBlocks) {
            if (this.blocks.length > 0) {
                this.blocks = this.removeBlock(0);
                assets.sounds.popRemove.play();
            }
            if (this.blocks.length === this.maxBlocks - 1) {
                this.addBlock(mouseGridPosX, mouseGridPosY);
                this.blocks[0].changeToRed();
            }
        }
    }
}

