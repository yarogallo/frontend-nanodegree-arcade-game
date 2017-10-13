const GameCharacter = function(x, y, sprite, type) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.type = type;
}

GameCharacter.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

const Enemy = function(x, y, sprite, type, speed) {
    GameCharacter.call(this, x, y, sprite, type);
    this.speed = speed;
}

Enemy.prototype = Object.create(GameCharacter.prototype);

Enemy.prototype.outOfCanvasHandler = function() {
    return this.x > 550;
};

Enemy.prototype.update = function(dt) {
    if (Game.player.isCollition(this)) Game.collitionWithEnemyhandler(); //Game rest to the score or en the game

    if (this.outOfCanvasHandler()) Game.enemyOutOfCanvasHandler(this); // Game remove enemy that is out of canvas from allEnemies array

    this.x += (dt * this.speed); // keep moving
};

const Player = function(x, y, sprite, type) {
    GameCharacter.call(this, x, y, sprite, type);
}

Player.prototype = Object.create(GameCharacter.prototype);

Player.prototype.isRoundCompleted = function() {
    return this.y < 0;
}

Player.prototype.isCollition = function(character) {
    return Math.abs(this.x - character.x) <= 30 && Math.abs(this.y - character.y) <= 30;
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

Player.prototype.update = function() {
    if (this.isRoundCompleted()) {
        Game.roundCompletedHandler();
        this.initialPosition();
    };
};

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

const Gem = function(x, y, sprite, type, color) {
    GameCharacter.call(this, x, y, sprite, type);
    this.color = color;
    this.value = this.color === "Orange" ? 100 : this.color === "Blue" ? 150 : 120;
};

Gem.prototype.render = function() {
    GameCharacter.prototype.render.call(this);
    ctx.fillText(`${this.value}`, this.x + 10, this.y + 101);
};

Gem.prototype.update = function() {
    if (Game.player.isCollition(this)) Game.collitionWithGemsHandler(this); //Game adition to the score
};

const Rock = function(x, y, sprite, type) {
    GameCharacter.call(this, x, y, sprite, type);
}

Rock.prototype = Object.create(GameCharacter.prototype);