class Character {
    constructor(startX, startY, blockSize, lives) {
        this.lives = lives;
        this.debugParameterInputs = [];
        this.parameters = {
            // Vertical movement
            // The jump/fall deceleration/acceleration amount
            gravityStrength: 0.05,
            jumpStrength: 10.0,
            topYSpeed: 5.0,
            maxFallSpeed: 10.0,
            // Horizontal movement
            groundAcceleration: 0.3,
            groundDeceleration: 0.5,
            topXSpeed: 5.0,
        };

        this.debugCurrentP = [];
        this.currentValues = {
            ySpeed: 0.0,
            xSpeed: 0.0,
            gravityAccelleration: 0.0,
            gravityDeceleration: 0.0,
            jumpSpeed: 0.0,
            fallSpeed: 0.0,
        }
        if (debug) {
            this.drawDebugMenu();
        }
        // Start position
        this.x = startX;
        this.y = startY;
        // Character dimensions
        this.blockSize = blockSize;
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
        this.blockBoyLeft = new SpriteManager({
            spriteSheet: window.assets.images.blockBoyLeft.image,
            spriteWidth: 400,
            spriteHeight: 456,
            xFrames: 4,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 1
        });
        this.blockBoyRight = new SpriteManager({
            spriteSheet: window.assets.images.blockBoyRight.image,
            spriteWidth: 400,
            spriteHeight: 456,
            xFrames: 4,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 1
        });
        this.blockBoyStopLeft = new SpriteManager({
            spriteSheet: window.assets.images.blockBoyLeft.image,
            spriteWidth: 400,
            spriteHeight: 460,
            xFrames: 1,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 0
        });
        this.blockBoyStopRight = new SpriteManager({
            spriteSheet: window.assets.images.blockBoyRight.image,
            spriteWidth: 400,
            spriteHeight: 460,
            xFrames: 1,
            yFrames: 1,
            animationSpeed: 0.3,
            loop: true,
            startFrame: 0
        });
        this.marioDirection = [this.blockBoyStopRight, this.blockBoyRight];

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
            topX1: this.x + (this.collisionBoxXIncrement * 2),
            topY1: this.y,
            topWidth: this.width - (this.collisionBoxXIncrement * 4),
            topHeight: 1,
            bottomX1: this.x + this.collisionBoxXIncrement,
            bottomY1: this.y + this.height,
            bottomWidth: this.width - (this.collisionBoxXIncrement * 2),
            bottomHeight: 1,
        };
    };

    blockBoyPanic() {
        this.blockBoyLeft.updateSprintImage(window.assets.images.blockBoyLeftPanic.image);
        this.blockBoyStopLeft.updateSprintImage(window.assets.images.blockBoyLeftPanic.image);
        this.blockBoyRight.updateSprintImage(window.assets.images.blockBoyRightPanic.image);
        this.blockBoyStopRight.updateSprintImage(window.assets.images.blockBoyRightPanic.image);
    }

    blockBoyHappy() {
        this.blockBoyLeft.updateSprintImage(window.assets.images.blockBoyLeftHappy.image);
        this.blockBoyStopLeft.updateSprintImage(window.assets.images.blockBoyLeftHappy.image);
        this.blockBoyRight.updateSprintImage(window.assets.images.blockBoyRightHappy.image);
        this.blockBoyStopRight.updateSprintImage(window.assets.images.blockBoyRightHappy.image);
    }

    blockBoyNormal() {
        this.blockBoyLeft.updateSprintImage(window.assets.images.blockBoyLeft.image);
        this.blockBoyStopLeft.updateSprintImage(window.assets.images.blockBoyLeft.image);
        this.blockBoyRight.updateSprintImage(window.assets.images.blockBoyRight.image);
        this.blockBoyStopRight.updateSprintImage(window.assets.images.blockBoyRight.image);
    }

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
        this.currentValues.fallSpeed = 0;
        this.currentValues.ySpeed = 0;
        this.onGround = true;
        this.jumping = false;
        this.y = stopHeight;
        this.collisionBottomDetected = true;
    }

    hitCeiling(stopHeight) {
        this.currentValues.ySpeed = 0;
        this.currentValues.jumpSpeed = 0;
        this.y = stopHeight;
        this.collisionTopDetected = true;
    }

    rightSideCollision(stopX) {
        this.atLeftWall = true;
        this.currentValues.xSpeed = 0;
        this.direction = "STOP";
        this.collisionRightDetected = true;
        this.x = stopX + this.collisionBoxXIncrement;
    }

    leftSideCollision(stopX) {
        this.atRightWall = true;
        this.currentValues.xSpeed = 0;
        this.x = stopX - this.collisionBoxXIncrement;
        this.direction = "STOP";
        this.collisionLeftDetected = true;
    }

    jump() {
        this.jumping = true;
        this.jumpKeyReleased = false;
        this.currentValues.jumpSpeed = (this.parameters.jumpStrength + Math.abs(this.currentValues.xSpeed / 2));
        this.onGround = false;
        this.y -= 1;
    }

    draw() {
        // GRAVITY
        if (this.onGround == false && this.currentValues.jumpSpeed > 0 && this.jumping == true && this.jumpKeyReleased == false) {
            this.currentValues.gravityAccelleration = 0.0;
            this.currentValues.gravityDeceleration += this.parameters.gravityStrength;
            this.currentValues.jumpSpeed -= this.currentValues.gravityDeceleration;
            this.currentValues.jumpSpeed = Math.max(this.currentValues.jumpSpeed, 0);
            this.y -= this.currentValues.jumpSpeed;
        } else if (this.onGround == false && this.currentValues.jumpSpeed > 0 && this.jumping == true && this.jumpKeyReleased == true) {
            this.currentValues.gravityAccelleration = 0.0;
            this.currentValues.gravityDeceleration += (this.parameters.gravityStrength * 10);
            this.currentValues.jumpSpeed -= this.currentValues.gravityDeceleration;
            this.currentValues.jumpSpeed = Math.max(this.currentValues.jumpSpeed, 0);
            this.y -= this.currentValues.jumpSpeed;
        } else if (this.onGround == false && (this.currentValues.jumpSpeed <= 0)) {
            this.currentValues.gravityDeceleration = 0.0;
            this.currentValues.gravityAccelleration += this.parameters.gravityStrength;
            this.currentValues.fallSpeed = this.currentValues.fallSpeed + this.currentValues.gravityAccelleration;
            this.currentValues.fallSpeed = Math.min(this.currentValues.fallSpeed, this.parameters.maxFallSpeed);
            this.y += this.currentValues.fallSpeed;
        } else if (this.onGround == true) {
            this.currentValues.gravityAccelleration = 0.0;
            this.currentValues.gravityDeceleration = 0.0;
            this.currentValues.jumpSpeed = 0.0;
            this.currentValues.fallSpeed = 0.0;
        }


        //  MOVING AND STANDING LEFT
        if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && this.atRightWall == false) {
            if (this.currentValues.xSpeed <= 0 && (this.direction == "STOP" || this.direction == "RIGHT")) {
                this.direction = "LEFT";
                this.marioDirection = [this.blockBoyStopLeft, this.blockBoyLeft];
            }
            if (this.direction == "RIGHT") {
                this.currentValues.xSpeed -= this.parameters.groundAcceleration;
            }
            if (this.direction == "LEFT" && this.currentValues.xSpeed > this.parameters.topXSpeed * -1) {
                this.currentValues.xSpeed -= this.parameters.groundAcceleration;
            }
            //  MOVING AND STANDING RIGHT
        } else if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && this.atLeftWall == false) {
            if (this.currentValues.xSpeed >= 0 && (this.direction == "STOP" || this.direction == "LEFT")) {
                this.direction = "RIGHT";
                this.marioDirection = [this.blockBoyStopRight, this.blockBoyRight];
            }
            if (this.direction == "LEFT") {
                this.currentValues.xSpeed += this.parameters.groundAcceleration;
            }
            if (this.direction == "RIGHT" && this.currentValues.xSpeed < this.parameters.topXSpeed) {
                this.currentValues.xSpeed += this.parameters.groundAcceleration;
            }
        } else {
            // ELSE NO LEFT OF RIGHT KEY PRESS
            // IF SPEED BETWEEN -VE AND +VE ACCELERATION STOP MOVING CHARACTER
            if (this.currentValues.xSpeed > (this.parameters.groundAcceleration + 0.1) * -1 && this.currentValues.xSpeed < this.parameters.groundAcceleration + 0.1) {
                this.currentValues.xSpeed = 0;
                this.direction = "STOP";
            }
            // IF SPEED IN RIGHT DIRECTION THEN SLOW IT DOWN
            if (this.currentValues.xSpeed > 0.0) {
                this.currentValues.xSpeed -= this.parameters.groundDeceleration;
            }
            if (this.currentValues.xSpeed > 0.0 && this.currentValues.xSpeed < this.parameters.groundDeceleration) {
                this.currentValues.xSpeed = 0;
            }
            // IF SPEED IN LEFT DIRECTION THEN SLOW IT DOWN
            if (this.currentValues.xSpeed < 0.0) {
                this.currentValues.xSpeed += this.parameters.groundDeceleration;
            }
            if (this.currentValues.xSpeed < 0.0 && this.currentValues.xSpeed > (this.parameters.groundDeceleration * -1)) {
                this.currentValues.xSpeed = 0;
            }
        }
        // TRIGGER JUMP WHEN CONDITIONS ARE MET
        if ((keyIsDown(CONTROL) || keyIsDown(32)) && this.jumping == false && this.onGround == true && this.jumpKeyReleased == true) {
            window.assets.sounds.jump[int(random(0, 3))].play();
            this.jump();
        }
        // UNSET THIS FLAG TO ALLOW JUMP ACTION TO BE PERFORMED AGAIN
        if ((!keyIsDown(CONTROL) && !keyIsDown(32)) && this.jumpKeyReleased == false) {
            this.jumpKeyReleased = true;
            console.log("Jump key released");
        }

        // WHETHER TO DRAW STATIC OR MOVING MARIO
        if (this.direction == "STOP") {
            this.marioDirection[0].draw(this.x, this.y, this.width, this.height);
        } else {
            this.marioDirection[1].draw(this.x, this.y, this.width, this.height);
        }
        this.x += this.currentValues.xSpeed;

        // DEBUGGING
        if (debug) {
            this.updateDebugValue();
        }
        if (collisionDebug) {
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
            debugLabel.style('color', '#FFFFFF'); 
            // Create input box
            let debugInput = createInput(this.parameters[key].toString());
            debugInput.position(xOffset + 150, yOffset + i * 30);
            this.debugParameterInputs.push(debugInput);
        }
        const currentKeys = Object.keys(this.currentValues);
        for (let i = 0; i < currentKeys.length; i++) {
            const key = currentKeys[i];
            // Create label
            let debugLabel = createElement('label', key + ":");
            debugLabel.position(xOffset, yOffset + (i * 30) + (parameterKeys.length * 30));
            debugLabel.style('color', '#FFFFFF'); 
            // Create text box
            let debugP = createP(this.currentValues[key]);
            debugP.position(xOffset + 150, yOffset + (i * 30) + (parameterKeys.length * 30) - 15);
            debugP.style('color', '#FFFFFF'); 
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