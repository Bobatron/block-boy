const GameState = {
    TitleScreen: 'title',
    MainMenu: 'menu',
    GamePlay: 'gameplay',
    LevelEditor: 'level-editor',
    GameOver: 'gameover',
    LevelComplete: 'winlevel',
    LoseLife: 'loseLife',
    GameComplete: 'wingame',
};

// Make GameState globally accessible
window.GameState = GameState;