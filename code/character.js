class Character {
    constructor() {
        this.x = 300;
        this.y = 0;
        this.width = 100;
        this.height = 100;

        this.acceleration = 0.1;
        this.jumping = false;
        this.jumpVelocity = 0;

        // TODO: DO YOU NEED TO HAVE A MIN SPEED TO REPRESENT MOVEMENT IN LEFT DIRECTION?
        this.minXSpeed = -5;
        this.maxXSpeed = 5;
        this.xSpeed = 0;


        this.currentVelocity = 0.0;
        this.onGround = false;
        this.atLeftWall = false;
        this.atRightWall = false;
        this.jumpKeyReleased = true;

        this.marioLeft = new Sprite(window.marioLeft, 99, 99, 3, 1, 0.3, true, 1);
        this.marioRight = new Sprite(window.marioRight, 99, 99, 3, 1, 0.3, true, 1);
        this.marioStopLeft = new Sprite(window.marioLeft, 99, 99, 1, 1, 0.1, true, 0);
        this.marioStopRight = new Sprite(window.marioRight, 99, 99, 1, 1, 0.1, true, 0);
        this.marioDirection = [this.marioStopLeft, this.marioLeft];

        this.direction = "STOP";
    }

    hitGround(y){
        this.currentVelocity = 0;
        this.jumpVelocity = 0;
        this.onGround = true;
        this.jumping = false;
        this.y = y;
    }

    hitLeftWall(){
        this.atLeftWall = true;
        this.xSpeed = 0;
        this.direction = "STOP";
    }

    hitRightWall(){
        this.atRightWall = true;
        this.xSpeed = 0;
        this.direction = "STOP";
    }
    
    jump(){
        this.jumping = true;
        this.currentVelocity = -3;
        this.onGround = false;
    }

    draw() {
        // GRAVITY
        if(this.onGround == false && this.currentVelocity < 5){
            this.currentVelocity += this.acceleration;
        } else if(this.onGround == true) {
            this.currentVelocity = 0;
        }
        this.y += this.currentVelocity;

        // ellipse(this.x, this.y, this.width, this.height);
        // this.marioLeft.draw(this.x, this.y, this.width, this.height);
        //  MOVING AND STANDING LEFT
        if (keyIsDown(LEFT_ARROW) && this.atRightWall == false) {
            if(this.xSpeed <= 0 && (this.direction == "STOP" || this.direction == "RIGHT")){
            this.direction = "LEFT";
            this.marioDirection = [this.marioStopLeft, this.marioLeft];
            }
            if(this.direction == "RIGHT"){
                this.xSpeed -= 0.5;
            }
            if(this.direction == "LEFT" && this.xSpeed > this.minXSpeed){
                this.xSpeed -= this.acceleration;
            }
        //  MOVING AND STANDING RIGHT
        } else if (keyIsDown(RIGHT_ARROW) && this.atLeftWall == false) {
            if(this.xSpeed >= 0 && (this.direction == "STOP" || this.direction == "LEFT")){
                this.direction = "RIGHT";
                this.marioDirection = [this.marioStopRight, this.marioRight];
                }
                if(this.direction == "LEFT"){
                    this.xSpeed += 0.5;
                }
                if(this.direction == "RIGHT" && this.xSpeed < this.maxXSpeed){
                    this.xSpeed += this.acceleration;
                }
        } else {
            // ELSE NO LEFT OF RIGHT KEY PRESS
            // IF SPEED BETWEEN -0.1 AND 0.1 STOP MOVING CHARACTER
            if(this.xSpeed > -0.1 && this.xSpeed < 0.1){
                this.xSpeed = 0;
                this.direction = "STOP";
            }
            // IF SPEED IN RIGHT DIRECTION THEN SLOW IT DOWN
            if(this.xSpeed > 0){
                this.xSpeed -= this.acceleration;
            }
            // IF SPEED IN LEFT DIRECTION THEN SLOW IT DOWN
            if(this.xSpeed < 0){
                this.xSpeed += this.acceleration;
            }
        }
        // TRIGGER JUMP WHEN CONDITIONS ARE MET
        if (keyIsDown(CONTROL) && this.jumping == false && this.onGround == true && this.jumpKeyReleased == true) {
            this.jump();
            this.y -= 10;
            this.jumpKeyReleased = false;
            // ADDED THIS
            this.onGround = false;
        }
        // UNSET THIS FLAG TO ALLOW JUMP ACTION TO BE PERFORMED AGAIN
        if (!keyIsDown(CONTROL) && this.jumpKeyReleased == false){
            this.jumpKeyReleased = true;
        }

        // WHETHER TO DRAW STATIC OR MOVING MARIO
        if(this.direction == "STOP"){
            this.marioDirection[0].draw(this.x, this.y, this.width, this.height);
        } else {
            this.marioDirection[1].draw(this.x, this.y, this.width, this.height);
        }
        this.x += this.xSpeed;
        console.log(this.xSpeed);
        // WHAT ARE THESE FOR? TRY UNSETTING - ARE THEY TO PREVENT GETTING STUCK?
        // this.onGround = false;
        this.atLeftWall = false;
        this.atRightWall = false;
    }
}