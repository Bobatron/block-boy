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
    text('Player 1 - move using the arrow keys', width / 2, 245);
    text('Player 2 - Click the mouse to create blocks for player 1 to stand on:', width / 2, 270);
    text('Your Mission...', width / 2, 295);
    text('DON\'T DIE ', width / 2, 320);
    fill(255, 255, 255);
    text('Press Enter to begin', width / 2, 380);

}
