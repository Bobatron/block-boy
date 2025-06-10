function drawMenuScreen() {
    background(0);
    let r = sin(frameCount * 0.05) * 127 + 128; 
    let g = cos(frameCount * 0.03) * 127 + 128;
    let b = sin(frameCount * 0.07) * 127 + 128;

    stroke(r, g, b);
    noFill();
    strokeWeight(r); // added this for the sillies but it seems kinda cool
    rect(100, 100, width - 200, height - 200);

    noStroke();
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER);
    textFont('Impact');
    text('BLOCK BOY', width / 2, 150);
    textSize(30);
    text('MADE BY ROCKET BROS.', width / 2, 180);

    fill(0, 255, 0);
    textSize(20);
    text('How to play:', width / 2, 220);
    let player1Instruction = "Player 1 - Use the arrow keys to move Block Boy left and right\n" +
    "and the ctrl key to jump";
    fill(255, 255, 0);
    text(player1Instruction, width / 2, 245);
    let player2Instruction = "Player 2 - Use the mouse to place blocks for Block Boy to stand on\n" +
    "or remove blocks by clicking on them";
    text(player2Instruction, width / 2, 295);
    fill(0, 255, 0);
    text('Your Mission:', width / 2, 345);
    fill(255, 255, 0);
    text('Rescue Goldiblocks and...', width / 2, 370);
    fill(255, 0, 0);
    text('DON\'T DIE ', width / 2, 395);
    fill(255, 255, 255);
    text('Press enter to begin', width / 2, 420);
}

function drawLoseLifeScreen() {
    background(0);
    let r = sin(frameCount * 0.05) * 127 + 128; 
    let g = cos(frameCount * 0.03) * 127 + 128;
    let b = sin(frameCount * 0.07) * 127 + 128;

    stroke(r, g, b);
    noFill();
    strokeWeight(r); // added this for the sillies but it seems kinda cool
    rect(100, 100, width - 200, height - 200);

    noStroke();
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER);
    textFont('Impact');
    text('BLOCK BOY', width / 2, 150);
    textSize(30);
    text(`SCORE: ${score}`, width / 2, 180);
    
    textSize(50);
    fill(0, 255, 0);
    text('YOU DIED 💀', width / 2, 295);
    textSize(20);
    let loserMessage = "Is now a good time to mention that Goldiblocks can't swim?";
    fill(255, 0, 0);
    text(loserMessage, width / 2, 345);
    fill(255, 255, 255);
    textSize(30);
    text('Press enter to try again...', width / 2, 380);
}

function drawGameOverScreen() {
    background(0);
    let r = sin(frameCount * 0.05) * 127 + 128; 
    let g = cos(frameCount * 0.03) * 127 + 128;
    let b = sin(frameCount * 0.07) * 127 + 128;

    stroke(r, g, b);
    noFill();
    strokeWeight(r); // added this for the sillies but it seems kinda cool
    rect(100, 100, width - 200, height - 200);

    noStroke();
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER);
    textFont('Impact');
    text('BLOCK BOY', width / 2, 150);
    textSize(30);
    text(`SCORE: ${finalScore}`, width / 2, 180);
    
    textSize(50);
    fill(0, 255, 0);
    text('GAME OVER 😭', width / 2, 295);
    textSize(20);
    let loserMessage = "Goldiblocks was found washed up dead on the beach";
    fill(255, 0, 0);
    text(loserMessage, width / 2, 345);
    fill(255, 255, 255);
    textSize(30);
    text('Press enter to return to main menu', width / 2, 380);
}

function drawWinLevelScreen() {
    background(0);
    let r = sin(frameCount * 0.05) * 127 + 128; 
    let g = cos(frameCount * 0.03) * 127 + 128;
    let b = sin(frameCount * 0.07) * 127 + 128;

    stroke(r, g, b);
    noFill();
    strokeWeight(r); // added this for the sillies but it seems kinda cool
    rect(100, 100, width - 200, height - 200);

    noStroke();
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER);
    textFont('Impact');
    text('BLOCK BOY', width / 2, 150);
    textSize(30);
    text(`SCORE: ${score}`, width / 2, 180);
    textSize(50);
    fill(0, 255, 0);
    text('WINNER WINNER CHICKEN DINNER 🐔', width / 2, 295);
    textSize(20);
    let winnerMessage = "Sorry Block-Boy but Goldiblocks is in another castl... I mean, block room";
    fill(255, 0, 0);
    text(winnerMessage, width / 2, 345);
    fill(255, 255, 255);
    textSize(30);
    text('Press enter to start next level', width / 2, 380);
}

function drawWinGameScreen() {
    background(0);
    let r = sin(frameCount * 0.05) * 127 + 128; 
    let g = cos(frameCount * 0.03) * 127 + 128;
    let b = sin(frameCount * 0.07) * 127 + 128;

    stroke(r, g, b);
    noFill();
    strokeWeight(r); // added this for the sillies but it seems kinda cool
    rect(100, 100, width - 200, height - 200);

    noStroke();
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER);
    textFont('Impact');
    text('BLOCK BOY', width / 2, 150);
    textSize(30);
    text(`SCORE: ${finalScore}`, width / 2, 180);
    textSize(50);
    fill(0, 255, 0);
    text('CONGRATULATIONS - YOU BEAT THE GAME 🥇', width / 2, 295);
    textSize(20);
    let winnerMessage = "The real treasure was the blocks we made along the way";

    fill(255, 255, 0);
    text(winnerMessage, width / 2, 345);
    fill(255, 255, 255);
    textSize(30);
    text('Press enter to return to main menu', width / 2, 380);
}