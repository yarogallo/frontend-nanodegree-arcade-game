// all cahracters in the game inherit from GameCharacter, and all have a location and a image src
// they share two methods, render and isCollition

const GameCharacter = function(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
    // render the character in the canvas, is the same for all characters
GameCharacter.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    // check if there is a collition between two characters of the game
GameCharacter.prototype.isCollition = function(character) {
    return Math.abs(this.x - character.x) <= 30 && Math.abs(this.y - character.y) <= 30;
}

const Enemy = function(x, y, sprite, speed) {
    GameCharacter.call(this, x, y, sprite);
    this.speed = speed;
}

Enemy.prototype = Object.create(GameCharacter.prototype);
Enemy.prototype.constructor = Enemy; //constructor point to Enemy

Enemy.prototype.outOfCanvasHandler = function() { // check ifthe enemy is out of canvas
    return this.x > 550;
};

Enemy.prototype.move = function(dt) { //move the enemy for axis
        this.x += (dt * this.speed);
    }
    //each time check if the teh enemy crash with the game player, and let the game know that there was a crash between an enemy and the player.
    //Check if this enemy is out of canvas, tell the game and the game is going to remove this enemy from the game.
    // if the enemy is not out of canvas then keep moving
Enemy.prototype.update = function(dt) {
    if (this.isCollition(Game.player)) {
        Game.playerCrashWithEnemy();
    }
    if (this.outOfCanvasHandler()) {
        Game.enemyOutOfCanvas(this);
    } else {
        this.move(dt);
    }
};

const Player = function(x, y, sprite) {
    GameCharacter.call(this, x, y, sprite);
}

Player.prototype = Object.create(GameCharacter.prototype);
Player.prototype.constructor = Player;

//Check if the player arrived to the sea(if completed a round)
Player.prototype.isRoundCompleted = function() {
    return this.y < 0;
}

Player.prototype.initialPosition = function() {
    this.x = 202;
    this.y = 390;
};

Player.prototype.moveLeft = function() {
    if (this.x > 0) this.x -= 101;
};

Player.prototype.moveRight = function() {
    if (this.x < 404) this.x += 101;
};

Player.prototype.moveDown = function() {
    if (this.y < 390) this.y += 83;
};

Player.prototype.moveUp = function() {
    if (this.y > -10) this.y -= 83;
};

// If a round is completed, the player return to his initial position and let the game know that a round has been completed, 
// The game take action after the player finish a round, increment score, increment rounds  and check if the game ends.
Player.prototype.update = function() {
    if (this.isRoundCompleted()) {
        this.initialPosition();
        Game.roundCompleted();
    }
};

// any time that the player make a move is going to check if there is a rock on his way
// if there is a rock, the player return return to his anterior position.
Player.prototype.handleInput = function(keyCode) {
    switch (keyCode) {
        case "left":
            this.moveLeft();
            Game.allRocks.forEach((rock) => { if (this.isCollition(rock)) this.moveRight(); });
            break;

        case "right":
            this.moveRight();
            Game.allRocks.forEach((rock) => { if (this.isCollition(rock)) this.moveLeft(); });
            break;

        case "up":
            this.moveUp();
            Game.allRocks.forEach((rock) => { if (this.isCollition(rock)) this.moveDown(); });
            break;

        case "down":
            this.moveDown();
            Game.allRocks.forEach((rock) => { if (this.isCollition(rock)) this.moveUp(); });
            break;

        default:
            break;
    }
}

const Gem = function(x, y, sprite, color) {
    GameCharacter.call(this, x, y, sprite);
    this.color = color;
    this.value = this.color === "Orange" ? 100 : this.color === "Blue" ? 150 : 120;
};
Gem.prototype = Object.create(GameCharacter.prototype);
Gem.prototype.constructor = Gem;

Gem.prototype.render = function() {
    GameCharacter.prototype.render.call(this);
    ctx.fillText(`${this.value}`, this.x + 10, this.y + 101);
};
//Gems are going tocheck if there was a collition with the player, and let the Game know, because the game has to increment his score depending on the gem value 
Gem.prototype.update = function() {
    if (this.isCollition(Game.player)) Game.playerCrashWithGem(this);
};
// The only work that the rocks have is block the player.
const Rock = function(x, y, sprite) {
    GameCharacter.call(this, x, y, sprite);
}

Rock.prototype = Object.create(GameCharacter.prototype);
Rock.prototype.constructor = GameCharacter;