class MouseIcon {
    constructor(size){
        // disable the cursor in the browser
        noCursor();
        this.size = size;
        this.pencilCursor = assets.images.pencilCursor.image;
        this.hammerCursor = assets.images.hammerCursor.image;
    }

    drawPencil(){
        image(this.pencilCursor, mouseX, mouseY - this.size, this.size, this.size);
    }

    drawHammer(){
        image(this.hammerCursor, mouseX, mouseY - this.size/2, this.size, this.size);
    }

}