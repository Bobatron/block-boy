class Character {
    constructor() {
        this.debugParameterInputs = [];
        this.parameters = {
            // Vertical movement
            gravity: 0.1,
            jumpStrength: 5,
            jumpVelocity: 0,
            // Horizontal movement
            acceleration: 0.1,
            topSpeed: 5,
        };

        this.debugCurrentP = [];
        this.currentValues = {
            currentVelocity: 0.0,
            xSpeed: 0,
        }
        if(window.debug){
            this.drawDebugMenu();
        }
        // Start position
        this.x = 300;
        this.y = 0;
        // Sprite dimensions
        this.width = 100;
        this.height = 100;

        // States
        this.onGround = false;
        this.atLeftWall = false;
        this.atRightWall = false;
        this.jumpKeyReleased = true;
        this.jumping = false;
        this.direction = "STOP";

        // Sprite data for character
        this.marioLeft = new Sprite(window.assets.images.marioLeft, 99, 99, 3, 1, 0.3, true, 1);
        this.marioRight = new Sprite(window.assets.images.marioRight, 99, 99, 3, 1, 0.3, true, 1);
        this.marioStopLeft = new Sprite(window.assets.images.marioLeft, 99, 99, 1, 1, 0.1, true, 0);
        this.marioStopRight = new Sprite(window.assets.images.marioRight, 99, 99, 1, 1, 0.1, true, 0);
        this.marioDirection = [this.marioStopLeft, this.marioLeft];


    }

    hitGround(stopHeight) {
        this.currentValues.currentVelocity = 0;
        this.parameters.jumpVelocity = 0;
        this.onGround = true;
        this.jumping = false;
        this.y = stopHeight;
    }

    hitCeiling() {
        this.currentValues.currentVelocity = 0;
        this.parameters.jumpVelocity = 0;
        this.ySpeed = 0;
    }

    hitLeftWall() {
        this.atLeftWall = true;
        this.currentValues.xSpeed = 0;
        this.direction = "STOP";
    }

    hitRightWall() {
        this.atRightWall = true;
        this.currentValues.xSpeed = 0;
        this.direction = "STOP";
    }

    jump() {
        this.jumping = true;
        this.currentValues.currentVelocity = this.parameters.jumpStrength * -1;
        this.onGround = false;
    }

    draw() {
        this.updateDebugValue();
        // GRAVITY
        if (this.onGround == false && this.currentValues.currentVelocity < 15) {
            this.currentValues.currentVelocity += this.parameters.gravity;
        } else if (this.onGround == true) {
            this.currentValues.currentVelocity = 0;
        }
        this.y += this.currentValues.currentVelocity;

        // ellipse(this.x, this.y, this.width, this.height);
        // this.marioLeft.draw(this.x, this.y, this.width, this.height);
        //  MOVING AND STANDING LEFT
        if (keyIsDown(LEFT_ARROW) && this.atRightWall == false) {
            if (this.currentValues.xSpeed <= 0 && (this.direction == "STOP" || this.direction == "RIGHT")) {
                this.direction = "LEFT";
                this.marioDirection = [this.marioStopLeft, this.marioLeft];
            }
            if (this.direction == "RIGHT") {
                this.currentValues.xSpeed -= 0.5;
            }
            if (this.direction == "LEFT" && this.currentValues.xSpeed > this.parameters.topSpeed * -1) {
                this.currentValues.xSpeed -= this.parameters.acceleration;
            }
            //  MOVING AND STANDING RIGHT
        } else if (keyIsDown(RIGHT_ARROW) && this.atLeftWall == false) {
            if (this.currentValues.xSpeed >= 0 && (this.direction == "STOP" || this.direction == "LEFT")) {
                this.direction = "RIGHT";
                this.marioDirection = [this.marioStopRight, this.marioRight];
            }
            if (this.direction == "LEFT") {
                this.currentValues.xSpeed += 0.5;
            }
            if (this.direction == "RIGHT" && this.currentValues.xSpeed < this.parameters.topSpeed) {
                this.currentValues.xSpeed += this.parameters.acceleration;
            }
        } else {
            // ELSE NO LEFT OF RIGHT KEY PRESS
            // IF SPEED BETWEEN -0.1 AND 0.1 STOP MOVING CHARACTER
            if (this.currentValues.xSpeed > -0.1 && this.currentValues.xSpeed < 0.1) {
                this.currentValues.xSpeed = 0;
                this.direction = "STOP";
            }
            // IF SPEED IN RIGHT DIRECTION THEN SLOW IT DOWN
            if (this.currentValues.xSpeed > 0) {
                this.currentValues.xSpeed -= this.parameters.acceleration;
            }
            // IF SPEED IN LEFT DIRECTION THEN SLOW IT DOWN
            if (this.currentValues.xSpeed < 0) {
                this.currentValues.xSpeed += this.parameters.acceleration;
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
        // These reset the values back for the next draw loop
        this.onGround = false;
        this.atLeftWall = false;
        this.atRightWall = false;
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
            debugLabel.position(xOffset, yOffset + (i*30) + (parameterKeys.length * 30));
            // Create text box
            let debugP = createP(this.currentValues[key]);
            debugP.position(xOffset + 115, yOffset + (i*30) + (parameterKeys.length * 30) - 15);
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