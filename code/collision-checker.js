class CollisionChecker {
    constructor(canvasWidth, canvasHeight, blockSize) {
        this.collisionCheckGrid = [];
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.blockSize = blockSize;
    }

    initializeCollisionCheckGrid() {
        this.collisionCheckGrid.length = 0;
        const width = Math.floor(this.canvasWidth / this.blockSize);
        const height = Math.floor(this.canvasHeight / this.blockSize);

        for (let x = 0; x < width; x++) {
            const row = [];
            for (let y = 0; y < height; y++) {
                row.push([]);
            }
            this.collisionCheckGrid.push(row);
        }

    }

    addObjectToCollisionCheckGrid(object) {
        const xIndex = Math.floor(object.x / object.blockSize);
        const yIndex = Math.floor(object.y / object.blockSize);

        if (this.collisionCheckGrid[xIndex] && this.collisionCheckGrid[xIndex][yIndex] && this.collisionCheckGrid[xIndex][yIndex].indexOf(object) === -1) {
            this.collisionCheckGrid[xIndex][yIndex].push(object);
        }
    }

    removeObjectFromCollisionCheckGrid(object) {
        const xIndex = Math.floor(object.x / object.blockSize);
        const yIndex = Math.floor(object.y / object.blockSize);
        if (this.collisionCheckGrid[xIndex] && this.collisionCheckGrid[xIndex][yIndex]) {
            const index = this.collisionCheckGrid[xIndex][yIndex].indexOf(object);
            if (index !== -1) {
                this.collisionCheckGrid[xIndex][yIndex].splice(index, 1);
            }
        }
    }
}

function checkCollisionDown(character, obstacle) {
    collisionCheckCount++;
    if (!character.onGround && (
        character.collisionBox.bottomX1 < obstacle.x + obstacle.blockSize &&
        character.collisionBox.bottomX1 + character.collisionBox.bottomWidth > obstacle.x &&
        character.collisionBox.bottomY1 < obstacle.y + obstacle.blockSize &&
        character.collisionBox.bottomY1 + character.collisionBox.bottomHeight > obstacle.y
    )) {
        if (!obstacle.killPlayer) {
            if(collisionDebug){
                console.log("HIT FLOOR!");
            }
            character.hitFloor(obstacle.y - obstacle.blockSize);
        }
        return true;
    }
    return false;
}

function checkCollisionUp(character, obstacle) {
    collisionCheckCount++;
    if (
        character.collisionBox.topX1 < obstacle.x + obstacle.blockSize &&
        character.collisionBox.topX1 + character.collisionBox.topWidth > obstacle.x &&
        character.collisionBox.topY1 < obstacle.y + obstacle.blockSize &&
        character.collisionBox.topY1 + character.collisionBox.topHeight > obstacle.y
    ) {
        if (!obstacle.killPlayer && !obstacle.drawBlock) {
            character.y = obstacle.y;
            if(collisionDebug){
                console.log("HIT CEILING!");
            }
            character.hitCeiling(obstacle.y + obstacle.blockSize);
        }
        return true;
    }
    return false;
}

function checkCollisionRightSide(character, obstacle) {
    collisionCheckCount++;
    if ((
        character.collisionBox.rightX1 < obstacle.x + obstacle.blockSize &&
        character.collisionBox.rightX1 + character.collisionBox.rightWidth > obstacle.x &&
        character.collisionBox.rightY1 < obstacle.y + obstacle.blockSize &&
        character.collisionBox.rightY1 + character.collisionBox.rightHeight > obstacle.y
    ) && (character.direction == "RIGHT" || character.direction == "STOP")) {
        if (!obstacle.killPlayer) {
            if(collisionDebug){
                console.log("HIT RIGHT OF CHARACTER!");
            }
            character.rightSideCollision(obstacle.x - obstacle.blockSize);
        }
        return true;
    }
    return false;
}

function checkCollisionLeftSide(character, obstacle) {
    collisionCheckCount++;
    if ((
        character.collisionBox.leftX1 < obstacle.x + obstacle.blockSize &&
        character.collisionBox.leftX1 + character.collisionBox.leftWidth > obstacle.x &&
        character.collisionBox.leftY1 < obstacle.y + obstacle.blockSize &&
        character.collisionBox.leftY1 + character.collisionBox.leftHeight > obstacle.y
    ) && (character.direction == "LEFT" || character.direction == "STOP")) {
        if (!obstacle.killPlayer) {
            if(collisionDebug){
                console.log("HIT LEFT OF CHARACTER!");
            }
            character.leftSideCollision(obstacle.x + obstacle.blockSize);
        }
        return true;
    }
    return false;
}

function checkCollisionRect(character, rectangle) {
    collisionCheckCount++;
    if ((
        character.collisionBox.leftX1 + (character.collisionBoxXIncrement / 2) < rectangle.x + rectangle.blockSize &&
        character.collisionBox.leftX1 + (character.collisionBox.rightX1 - character.collisionBox.leftX1) - (character.collisionBoxXIncrement / 2) > rectangle.x &&
        character.y < rectangle.y + rectangle.blockSize &&
        character.y + character.height > rectangle.y
    )) {
        if(collisionDebug){
            console.log("COLLISION!");
        }
        return true;
    }
    return false;
}