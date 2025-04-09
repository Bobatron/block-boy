var greenBlock;
var redBlock;
var popSound;
var unpopSound;
var marioLeft;
var marioRight;
var assets = {};

function preload() {
    // TODO: Rename the assets to use hypenated names
    // TODO: Try moving assets into a JSON block to help make it easier to work with
    // TODO: Use an asset naming convention
    // initialize media
    assets.sounds = {};
    assets.images = {};
    assets.images.blockGreen = loadImage("assets/images/block-green.png");
    assets.images.blockRed = loadImage("assets/images/block-red.png");
    assets.sounds.popCreate = loadSound("assets/sounds/pop-create.wav");
    assets.sounds.popRemove = loadSound("assets/sounds/pop-remove.wav");
    marioLeft = loadImage("assets/marioLeft.png");
    marioRight = loadImage("assets/marioRight.png");
}

let width = 1000;
let height = 500;
var grid;
var block;
var drawMode = false;
var mouseClicked = false;
var maxBlocks = 5;
var blockCount = 0;

function setup() {
    createCanvas(width, height);
    background(51);
    frameRate();
    a = 0;
    grid = new Grid(width, height);
    blocks = [];
    blockLocations = [];
    character = new Character();
}

function draw() {
    background(51);
    text(frameRate(), 10, 10);
    //text(a, 30, 30);
    //ellipse(10,10,10,10);
    //sideTab(width/10, height);
    grid.refresh();
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].draw();
        var collisionXPadding = 5;
        if(!character.onGround && collideLineRect(blocks[i].x + collisionXPadding, blocks[i].y + 5, blocks[i].x + blocks[i].dimension - collisionXPadding, blocks[i].y + 5, character.x + (character.width/3), character.y + character.height, character.width/3, 5)){
            character.y = blocks[i].y;
            character.hitGround(blocks[i].y);
            console.log("GROUND!");
            //rect(character.x + (character.width/3), character.y + character.height, character.width/3, 10);
        }
        var collisionYPadding = 5;
        if(collideLineRect(blocks[i].x, blocks[i].y+collisionYPadding, blocks[i].x, blocks[i].y + blocks[i].dimension - collisionYPadding, character.x + (character.width/1.5), character.y + character.height/1.5, 5, character.height/3) && (character.direction == "RIGHT" || character.direction == "STOP")){
            //character.x = blocks[i].x - (character.width/2);
            character.hitLeftWall();
            //rect(character.x + (character.width/1.5), character.y + character.height/1.5, 5, character.height/3);
        }
        if(collideLineRect(blocks[i].x + blocks[i].dimension, blocks[i].y + collisionYPadding, blocks[i].x + blocks[i].dimension, blocks[i].y + blocks[i].dimension - collisionYPadding, character.x + (character.width/3), character.y + character.height/1.5, 5, character.height/3) && (character.direction == "LEFT" || character.direction == "STOP")){
            //character.x = blocks[i].x + blocks[i].dimension + (character.width/2);
            character.hitRightWall();
            //rect(character.x + (character.width/1.5), character.y + character.height/1.5, 5, character.height/3);
        }
    }
    // TO SHOW CURRENT Y POS - HELPFUL FOR DEBUG
    // console.log("Y POS: "+character.y);
    if(character.y >= height-100){
        character.hitGround();
    }
    if(mouseIsPressed){
        addRemoveBlocks();
    }
    character.draw();
}

function sideTab(w, h) {
    rect(20, 20, w, h);
}

function addRemoveBlocks() {
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

function removeFromArray(index, array) {
    var startArray = array.slice(0, index);
    var endArray = array.slice(index + 1, array.length);
    var returnArray = startArray.concat(endArray);
    return returnArray;
}

function mouseReleased(){
    mouseClicked = false;
}