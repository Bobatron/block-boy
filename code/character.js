class Character {
    constructor(startX, startY, blockSize) {
        this.debugParameterInputs = [];
        this.parameters = {
            // Vertical movement
            gravity: 1,
            jumpStrength: 20,
            topYSpeed: 5,
            // Horizontal movement
            acceleration: 0.3,
            decceleration: 0.5,
            topXSpeed: 5,
        };

        this.debugCurrentP = [];
        this.currentValues = {
            ySpeed: 0.0,
            xSpeed: 0.0,
        }
        if (window.debug) {
            this.drawDebugMenu();
        }
        // Start position
        this.x = startX;
        this.y = startY;
        // Character dimensions
        this.width = blockSize;
        this.height = blockSize;

        // States
        this.onGround = false;
        this.atLeftWall = false;
        this.atRightWall = false;
        this.jumpKeyReleased = true;
        this.jumping = false;
        this.direction = "STOP";

        // Sprite data for character
        this.marioLeft = new Sprite({
            spriteSheet: window.assets.images.marioLeft,
            spriteWidth: 50,
            spriteHeight: 50,
            xFrames: 3,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 1
        });
        this.marioRight = new Sprite({
            spriteSheet: window.assets.images.marioRight,
            spriteWidth: 50,
            spriteHeight: 50,
            xFrames: 3,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 1
        });
        this.marioStopLeft = new Sprite({
            spriteSheet: window.assets.images.marioLeft,
            spriteWidth: 50,
            spriteHeight: 50,
            xFrames: 1,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 0
        });
        this.marioStopRight = new Sprite({
            spriteSheet: window.assets.images.marioRight,
            spriteWidth: 50,
            spriteHeight: 50,
            xFrames: 1,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 0
        }); 
        this.marioDirection = [this.marioStopRight, this.marioRight];

        // Collisions
        this.collisionTopDetected = false;
        this.collisionBottomDetected = false;
        this.collisionRightDetected = false;
        this.collisionLeftDetected = false;
        this.collisionBoxYIncrement = 10;
        this.collisionBoxXIncrement = 10;
    }

    get collisionBox() {
        return {
            leftX1: this.x + this.collisionBoxXIncrement - (this.collisionBoxXIncrement / 2),
            leftY1: this.y + (this.height / 2),
            leftWidth: 1,
            leftHeight: this.height / 4 - (this.collisionBoxYIncrement / 2),
            rightX1: this.x + this.width - (this.collisionBoxXIncrement / 2),
            rightY1: this.y + (this.height / 2),
            rightWidth: 1,
            rightHeight: this.height / 4 - (this.collisionBoxYIncrement / 2),
            topX1: this.x + (this.collisionBoxXIncrement ),
            topY1: this.y,
            topWidth: this.width - (this.collisionBoxXIncrement *2),
            topHeight: 1,
            bottomX1: this.x + this.collisionBoxXIncrement,
            bottomY1: this.y + this.height,
            bottomWidth: this.width - (this.collisionBoxXIncrement * 2),
            bottomHeight: 1,
        };
    };

    drawCollisionBox() {
        noFill();
        strokeWeight(4);
        this.drawCollisionLineTop();
        this.drawCollisionLineBottom();
        this.drawCollisionLineRight();
        this.drawCollisionLineLeft();

    }

    drawCollisionLineTop() {
        if (this.collisionTopDetected) {
            stroke(color("red"));
        } else {
            stroke(color("blue"));
        }
        rect(this.collisionBox.topX1, this.collisionBox.topY1, this.collisionBox.topWidth, this.collisionBox.topHeight);
    }

    drawCollisionLineBottom() {
        if (this.collisionBottomDetected) {
            stroke(color("red"));
        } else {
            stroke(color("blue"));
        }
        rect(this.collisionBox.bottomX1, this.collisionBox.bottomY1, this.collisionBox.bottomWidth, this.collisionBox.bottomHeight);
    }

    drawCollisionLineRight() {
        if (this.collisionRightDetected) {
            stroke(color("red"));
        } else {
            stroke(color("blue"));
        }
        rect(this.collisionBox.rightX1, this.collisionBox.rightY1, this.collisionBox.rightWidth, this.collisionBox.rightHeight);
    }

    drawCollisionLineLeft() {
        if (this.collisionLeftDetected) {
            stroke(color("red"));
        } else {
            stroke(color("blue"));
        }
        rect(this.collisionBox.leftX1, this.collisionBox.leftY1, this.collisionBox.leftWidth, this.collisionBox.rightHeight);
    }



    reset(startX, startY) {
        this.x = startX;
        this.y = startY;
    }

    hitFloor(stopHeight) {
        this.currentValues.ySpeed = 0;
        this.parameters.jumpVelocity = 0;
        this.onGround = true;
        this.jumping = false;
        this.y = stopHeight;
        this.collisionBottomDetected = true;
    }

    hitCeiling(stopHeight) {
        this.currentValues.ySpeed = 0;
        this.parameters.jumpVelocity = 0;
        this.ySpeed = 0;
        this.y = stopHeight;
        this.collisionTopDetected = true;
    }

    rightSideCollision() {
        this.atLeftWall = true;
        this.currentValues.xSpeed = 0;
        this.direction = "STOP";
        this.collisionRightDetected = true;
    }

    leftSideCollision() {
        this.atRightWall = true;
        this.currentValues.xSpeed = 0;
        this.direction = "STOP";
        this.collisionLeftDetected = true;
    }

    jump() {
        this.jumping = true;
        this.currentValues.ySpeed = (this.parameters.jumpStrength + Math.abs(this.currentValues.xSpeed / 2)) * -1;
        this.onGround = false;
    }

    draw() {
        // GRAVITY
        if (this.onGround == false && this.currentValues.ySpeed < this.parameters.topYSpeed) {
            this.currentValues.ySpeed += this.parameters.gravity;
        } else if (this.onGround == true) {
            this.currentValues.ySpeed = 0;
        }
        this.y += this.currentValues.ySpeed;

        // ellipse(this.x, this.y, this.width, this.height);
        // this.marioLeft.draw(this.x, this.y, this.width, this.height);
        //  MOVING AND STANDING LEFT
        if (keyIsDown(LEFT_ARROW) && this.atRightWall == false) {
            if (this.currentValues.xSpeed <= 0 && (this.direction == "STOP" || this.direction == "RIGHT")) {
                this.direction = "LEFT";
                this.marioDirection = [this.marioStopLeft, this.marioLeft];
            }
            if (this.direction == "RIGHT") {
                this.currentValues.xSpeed -= this.parameters.acceleration;
            }
            if (this.direction == "LEFT" && this.currentValues.xSpeed > this.parameters.topXSpeed * -1) {
                this.currentValues.xSpeed -= this.parameters.acceleration;
            }
            //  MOVING AND STANDING RIGHT
        } else if (keyIsDown(RIGHT_ARROW) && this.atLeftWall == false) {
            if (this.currentValues.xSpeed >= 0 && (this.direction == "STOP" || this.direction == "LEFT")) {
                this.direction = "RIGHT";
                this.marioDirection = [this.marioStopRight, this.marioRight];
            }
            if (this.direction == "LEFT") {
                this.currentValues.xSpeed += this.parameters.acceleration;
            }
            if (this.direction == "RIGHT" && this.currentValues.xSpeed < this.parameters.topXSpeed) {
                this.currentValues.xSpeed += this.parameters.acceleration;
            }
        } else {
            // ELSE NO LEFT OF RIGHT KEY PRESS
            // IF SPEED BETWEEN -VE AND +VE ACCELERATION STOP MOVING CHARACTER
            if (this.currentValues.xSpeed > (this.parameters.acceleration + 0.1) * -1 && this.currentValues.xSpeed < this.parameters.acceleration + 0.1) {
                this.currentValues.xSpeed = 0;
                this.direction = "STOP";
            }
            // IF SPEED IN RIGHT DIRECTION THEN SLOW IT DOWN
            if (this.currentValues.xSpeed > 0.0) {
                this.currentValues.xSpeed -= this.parameters.decceleration;
            }
            if (this.currentValues.xSpeed > 0.0 && this.currentValues.xSpeed < this.parameters.decceleration) {
                this.currentValues.xSpeed = 0;
            }
            // IF SPEED IN LEFT DIRECTION THEN SLOW IT DOWN
            if (this.currentValues.xSpeed < 0.0) {
                this.currentValues.xSpeed += this.parameters.decceleration;
            }
            if (this.currentValues.xSpeed < 0.0 && this.currentValues.xSpeed > (this.parameters.decceleration * -1)) {
                this.currentValues.xSpeed = 0;
            }
        }
        // TRIGGER JUMP WHEN CONDITIONS ARE MET
        if (keyIsDown(CONTROL) && this.jumping == false && this.onGround == true && this.jumpKeyReleased == true) {
            window.assets.sounds.jump[int(random(0, 3))].play();
            this.jump();
            this.y -= 1;
            this.jumpKeyReleased = false;
            // ADDED THIS
            this.onGround = false;
        }
        // UNSET THIS FLAG TO ALLOW JUMP ACTION TO BE PERFORMED AGAIN
        if (!keyIsDown(CONTROL) && this.jumpKeyReleased == false) {
            this.jumpKeyReleased = true;
        }

        // WHETHER TO DRAW STATIC OR MOVING MARIO
        if (this.direction == "STOP") {
            this.marioDirection[0].draw(this.x, this.y, this.width, this.height);
        } else {
            this.marioDirection[1].draw(this.x, this.y, this.width, this.height);
        }
        this.x += this.currentValues.xSpeed;
        // console.log(this.currentValues.xSpeed);

        // DEBUGGING
        if (window.debug) {
            this.updateDebugValue();
            this.drawCollisionBox();
        }

        // These reset the values back for the next draw loop
        this.onGround = false;
        this.atLeftWall = false;
        this.atRightWall = false;
        this.collisionTopDetected = false;
        this.collisionBottomDetected = false;
        this.collisionRightDetected = false;
        this.collisionLeftDetected = false;


    }

    drawDebugMenu() {
        const xOffset = width + 20; // Position inputs outside the canvas
        const yOffset = 20; // Starting y position for inputs

        const parameterKeys = Object.keys(this.parameters);
        for (let i = 0; i < parameterKeys.length; i++) {
            const key = parameterKeys[i];
            // Create label
            let debugLabel = createElement('label', key);
            debugLabel.position(xOffset, yOffset + i * 30);
            debugLabel.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
            // Create input box
            let debugInput = createInput(this.parameters[key].toString());
            debugInput.position(xOffset + 100, yOffset + i * 30);
            this.debugParameterInputs.push(debugInput);
        }
        const currentKeys = Object.keys(this.currentValues);
        for (let i = 0; i < currentKeys.length; i++) {
            const key = currentKeys[i];
            // Create label
            let debugLabel = createElement('label', key + ":");
            debugLabel.position(xOffset, yOffset + (i * 30) + (parameterKeys.length * 30));
            debugLabel.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
            // Create text box
            let debugP = createP(this.currentValues[key]);
            debugP.position(xOffset + 115, yOffset + (i * 30) + (parameterKeys.length * 30) - 15);
            debugP.style('color', '#FFFFFF'); // Set text color (e.g., white for visibility)
            this.debugCurrentP.push(debugP);
        }
        let button = createButton('Update parameters');
        button.position(xOffset, yOffset + (currentKeys.length * 30) + (parameterKeys.length * 30));
        button.mousePressed(() => this.setDebugValues());
    }

    // Function to get values from inputs
    setDebugValues() {
        const keys = Object.keys(this.parameters);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = this.debugParameterInputs[i].value();
            this.parameters[key] = Number(value);
        };
    }

    updateDebugValue() {
        const keys = Object.keys(this.currentValues);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.debugCurrentP[i].html(this.currentValues[key]);
        };
    }

}