const LevelObjectType = {
    Spike: 'spike',
    FriendlySpike: 'friendly-spike',
    AngrySpike: 'angry-spike',
    Platform: 'platform',
    Block: 'block',
    Rock: 'rock',
    Start: 'start',
    Goal: 'goal',
    Cursor: 'cursor',
    Yarn: 'yarn',
    HiddenYarn: 'hidden-yarn',
};

const CollisionType = {
    Spike: 'spike-collision-area',
    AngrySpikeZone: 'angry-spike-zone',
    RockBreakZone: 'rock-break-zone',
    Yarn: 'yarn-collision-area',
};


const LevelObjectSymbol = {
    Spike: 'x',
    FriendlySpike: 'f',
    AngrySpike: 'a',
    Platform: 'p',
    Block: 'b',
    Rock: 'r',
    Start: 's',
    Goal: 'g',
    Yarn: 'y',
    HiddenYarn: 'h'
};

// Make LevelObjectType globally accessible
window.LevelObjectType = LevelObjectType;
// Make LevelObjectType globally accessible
window.LevelObjectSymbol = LevelObjectSymbol;
// Make LevelObjectType globally accessible
window.CollisionType = CollisionType;