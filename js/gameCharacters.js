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


Enemy.prototype.update = function(dt) {
    Game.collitionWithPlayerHandler(this); // check if there is a collition between this enemy and the player
    Game.enemyOutOfCanvasHandler(this); // check if the enemy is out of canvas
    this.x += (dt * this.speed); // keep moving
};

const Player = function(x, y, sprite, type) {
    GameCharacter.call(this, x, y, sprite, type);
}

Player.prototype = Object.create(GameCharacter.prototype);

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
    Game.roundCompletedHandler(this);
};

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
    Game.collitionWithPlayerHandler(this); //check collitions between player and tbhis gem
};

const Rock = function(x, y, sprite, type) {
    GameCharacter.call(this, x, y, sprite, type);
}

Rock.prototype = Object.create(GameCharacter.prototype);