class Grid {
    constructor(canvasWidth, canvasHeight, blockSize){
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.blockSize = blockSize;
    }

    drawLine(x,y,x1,y1){
        line(x,y,x1,y1);
    }

    refresh(){
        for(var x = 0; x < this.width; x+=this.blockSize){
            this.drawLine(x, 0, x, this.height);
        }
        for(var y = 0; y < this.height; y+=this.blockSize){
            this.drawLine(0, y, this.width, y);
        }
    }

}