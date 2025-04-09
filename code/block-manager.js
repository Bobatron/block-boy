class BlockManager {
    constructor(blockSize, maxBlocks){
        this.blockSize = blockSize;
        this.maxBlocks = maxBlocks;
        this.blocks = new Array(maxBlocks);
    }

    // checkIfBlockAlreadyExists(){
    //     for(Block block of this.blocks){

    //     }
    // }


    addRemoveBlocks() {
        var x = mouseX - (mouseX % grid.blockSize);
        var y = mouseY - (mouseY % grid.blockSize);
        var index = blockLocations.indexOf(x + ":" + y);
    
        if (mouseClicked == false && index == -1){
            drawMode = true;
        } else if (mouseClicked == false){
            drawMode = false;
        }
        mouseClicked = true;
    
        if (index == -1 && drawMode == true && blockCount < maxBlocks && blocks.length < 5) {
                blocks.push(new Block(x, y));
                blockLocations.push(x + ":" + y);
                blockCount++;
                if(blockCount === maxBlocks){
                    blocks[0].changeToRed();
                }
        } else if (drawMode == false && index != -1 && blocks.length > 0) {
            
            blocks = removeFromArray(index, blocks);
            blockLocations = removeFromArray(index, blockLocations);
            assets.sounds.popRemove.play();
            blockCount--;
        } else if (index == -1 && drawMode == true && blockCount === maxBlocks) {
            if(blocks.length > 0){
                blocks = removeFromArray(0, blocks);
                blockLocations = removeFromArray(0, blockLocations);
                assets.sounds.popRemove.play();
            }
            if(blocks.length === maxBlocks - 1){
                blocks.push(new Block(x, y));
                blockLocations.push(x + ":" + y);
                blocks[0].changeToRed();
            }
            
        }
    }
    
    removeFromArray(index, array) {
        var startArray = array.slice(0, index);
        var endArray = array.slice(index + 1, array.length);
        var returnArray = startArray.concat(endArray);
        return returnArray;
    }
}

