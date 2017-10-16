const GameCharacter = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
}

GameCharacter.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

GameCharacter.prototype.isCollition = function(character) {
    return Math.abs(this.x - character.x) <= 30 && Math.abs(this.y - character.y) <= 30;
}

const Enemy = function(x, y, sprite, speed) {
    GameCharacter.call(this, x, y, sprite);
    this.speed = speed;
}

Enemy.prototype = Object.create(GameCharacter.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.outOfCanvasHandler = function() {
    return this.x > 550;
};

Enemy.prototype.move = function(dt) {
    this.x += (dt * this.speed);
}

Enemy.prototype.update = function(dt) {
    if (this.isCollition(Game.player)) {
        Game.playerCrashWithEnemy(); // tell the game that threre is a collition between one enemy an the player
    }
    if (this.outOfCanvasHandler()) {
        Game.enemyOutOfCanvas(this); //the game remove character from the game
    } else {
        this.move(dt);
    }
};

const Player = function(x, y, sprite) {
    GameCharacter.call(this, x, y, sprite);
}

Player.prototype = Object.create(GameCharacter.prototype);
Player.prototype.constructor = Player;

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

// if the player is in the sea, return to initial position and let the game know that a round has been completed 
Player.prototype.update = function() {
    if (this.isRoundCompleted()) {
        this.initialPosition();
        Game.roundCompleted();
    }
};

// any time that the player make a move is going to check if there is a rock on his way
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
console.log(Gem.prototype);

Gem.prototype.render = function() {
    GameCharacter.prototype.render.call(this);
    ctx.fillText(`${this.value}`, this.x + 10, this.y + 101);
};

Gem.prototype.update = function() {
    if (this.isCollition(Game.player)) Game.playerCrashWithGem(this); //tel the game there is a collition between a gem an a player
};

const Rock = function(x, y, sprite) {
    GameCharacter.call(this, x, y, sprite);
}

Rock.prototype = Object.create(GameCharacter.prototype);
Rock.prototype.constructor = GameCharacter;