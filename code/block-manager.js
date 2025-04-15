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
        if (blockStock == 0) {
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

    drawAll() {
        for (const block of this.blocks) {
            block.draw();
        }
    }

    setMouseClicked(isClicked) {
        this.mouseClicked = isClicked;
    }

    addBlock(x, y) {
        this.blocks.push(new Block(x, y, this.gridSize));
    }

    getExistingBlockIndex(x, y) {
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].getLocation() === x + ":" + y) {
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
        if (mouseGridPosX > this.canvasWidth - this.gridSize || mouseGridPosY > this.canvasHeight - this.gridSize) {
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
        } else if (existingBlockIndex == -1 && this.drawMode == true && this.blocks.length == this.blockConfig.maxBlocks && (this.blockConfig.blockStock > 0 || this.blockConfig.unlimitedBlocks)) {
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
        let maxBLocksLabel = createElement('label', `Max Blocks: ${this.blockConfig.maxBlocks}`);
        maxBLocksLabel.position(xOffset, yOffset);
        maxBLocksLabel.style('font-size', '24px'); // Set font size
        maxBLocksLabel.style('font-weight', 'bold'); // Make the font bold
        maxBLocksLabel.style('font-family', 'Arial, sans-serif'); // Use a clean, game-friendly font
        maxBLocksLabel.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
        this.blockConfigElements.push(maxBLocksLabel);
        // Create label
        let blockStockLabel = createElement('label', `Block Stock: ${this.blockConfig.blockStock || "Unlimited"}`);
        blockStockLabel.position(xOffset + 300, yOffset);
        blockStockLabel.style('font-size', '24px'); // Set font size
        blockStockLabel.style('font-weight', 'bold'); // Make the font bold
        blockStockLabel.style('font-family', 'Arial, sans-serif'); // Use a clean, game-friendly font
        blockStockLabel.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
        this.blockConfigElements.push(blockStockLabel);
    }

    updateBlockStock() {
        if (!this.blockConfig.unlimitedBlocks) {
            this.blockConfigElements[1].html(`Block Stock: ${this.blockConfig.blockStock}`);
        }
    }

    removeblockConfig() {
        for (let i = 0; i < this.blockConfigElements.length; i++) {
            this.blockConfigElements[i].remove();
        }
    }
}
