function checkCollisionDown(character, obstacle) {
    var collisionXPadding = 0;
    if (!character.onGround && collideLineRect(obstacle.x + collisionXPadding, obstacle.y + 5, obstacle.x + obstacle.blockSize - collisionXPadding, obstacle.y + 5, character.x + (character.width / 3), character.y + character.height, character.width / 3, 5)) {
        // character.y = obstacle.y - obstacle.blockSize - obstacle.blockSize;
        console.log("HIT FLOOR!");
        character.hitGround(obstacle.y - obstacle.blockSize - obstacle.blockSize);
    }
}

function checkCollisionUp(character, obstacle) {
    if (collideLineRect(obstacle.x, obstacle.y, obstacle.x + obstacle.blockSize, obstacle.y, character.x + (character.width / 3), character.y, character.width / 3, 5)) {
        character.y = obstacle.y;
        console.log("HIT CEILING!");
        character.hitCeiling();
    }
}

function checkCollisionLeft(character, obstacle) {
    var collisionYPadding = 5;
    if (collideLineRect(obstacle.x, obstacle.y + collisionYPadding, obstacle.x, obstacle.y + obstacle.blockSize - collisionYPadding, character.x + (character.width / 1.5), character.y + character.height / 1.5, 5, character.height / 3) && (character.direction == "RIGHT" || character.direction == "STOP")) {
        //character.x = blocks[i].x - (character.width/2);
        console.log("HIT LEFT!");
        character.hitLeftWall();
        //rect(character.x + (character.width/1.5), character.y + character.height/1.5, 5, character.height/3);
    }
}

function checkCollisionRight(character, obstacle) {
    var collisionYPadding = 5;
    if (collideLineRect(obstacle.x + obstacle.blockSize, obstacle.y + collisionYPadding, obstacle.x + obstacle.blockSize, obstacle.y + obstacle.blockSize - collisionYPadding, character.x + (character.width / 3), character.y + character.height / 1.5, 5, character.height / 3) && (character.direction == "LEFT" || character.direction == "STOP")) {
        //character.x = blocks[i].x + blocks[i].blockSize + (character.width/2);
        console.log("HIT RIGHT!");
        character.hitRightWall();
        //rect(character.x + (character.width/1.5), character.y + character.height/1.5, 5, character.height/3);
    }
}