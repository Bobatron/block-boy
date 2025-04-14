class BlockManager {
    constructor() {
        this.blockConfig = {};
        this.canvasWidth;
        this.canvasHeight;
        this.gridSize;
        this.blocks = [];
        this.mouseClicked = false;
        this.drawMode = false;
        this.blockConfigElements = [];
        this.limitedBlocks = false;
    }

    load(gridSize, maxBlocks, blockStock, canvasWidth, canvasHeight) {
        this.blockConfig = {
            maxBlocks: maxBlocks,
            blockStock: blockStock,
            unlimitedBlocks: false
        };
        this.blockConfigCurrentValues = {
            maxBlocks: maxBlocks,
            blockStock: blockStock,
        };
        if(blockStock == 0){
            this.blockConfig.unlimitedBlocks = true;
        }
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gridSize = gridSize;
        this.blocks = [];
        this.mouseClicked = false;
        this.drawMode = false;
        this.removeblockConfig();
        this.blockConfigElements = [];
        this.drawblockConfig();
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

        if (existingBlockIndex == -1 && this.drawMode == true && this.blocks.length < this.blockConfig.maxBlocks && (this.blockConfig.blockStock > 0 || this.blockConfig.unlimitedBlocks)) {
            this.addBlock(mouseGridPosX, mouseGridPosY);
            if (this.blocks.length === this.blockConfig.maxBlocks) {
                this.blocks[0].changeToRed();
            }
            this.blockConfig.blockStock--;
            this.updateBlockStock();
        } else if (this.drawMode == false && existingBlockIndex != -1 && this.blocks.length > 0) {
            this.blocks = this.removeBlock(existingBlockIndex);
            assets.sounds.popRemove.play();
        } else if (existingBlockIndex == -1 && this.drawMode == true && this.blocks.length == this.blockConfig.maxBlocks) {
            if (this.blocks.length > 0) {
                this.blocks = this.removeBlock(0);
                assets.sounds.popRemove.play();
            }
            if (this.blocks.length === this.blockConfig.maxBlocks - 1 && (this.blockConfig.blockStock > 0 || this.blockConfig.unlimitedBlocks)) {
                this.addBlock(mouseGridPosX, mouseGridPosY);
                this.blocks[0].changeToRed();
                this.blockConfig.blockStock--;
                this.updateBlockStock();
            }
        }
    }

    drawblockConfig() {
        const xOffset = 20; // Position inputs outside the canvas
        const yOffset = height + 20; // Starting y position for inputs

       // Create label
       let maxBLocksLabel = createElement('label', "Max Blocks:");
       maxBLocksLabel.position(xOffset, yOffset);
       this.blockConfigElements.push(maxBLocksLabel);
       // Create text box
       let maxBlocksValue = createP(this.blockConfig.maxBlocks);
       maxBlocksValue.position(xOffset + 115, yOffset - 15);
       this.blockConfigElements.push(maxBlocksValue);

       // Create label
       let blockStockLabel = createElement('label', "Block Stock:");
       blockStockLabel.position(xOffset + 150, yOffset);
       this.blockConfigElements.push(blockStockLabel);
       // Create text box
       let blockStockValue = createP(this.blockConfig.blockStock || "Unlimited");
       blockStockValue.position(xOffset + 265, yOffset - 15);
       this.blockConfigElements.push(blockStockValue);
    }

    updateBlockStock() {
        if(!this.blockConfig.unlimitedBlocks) {
            this.blockConfigElements[3].html(this.blockConfig.blockStock);
        }
    }

    removeblockConfig() {
        for (let i = 0; i < this.blockConfigElements.length; i++) {
            this.blockConfigElements[i].remove();
        }
    }
}
