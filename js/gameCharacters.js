const GameCharacter = {
    initCharacter(x, y, sprite, type) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.type = type
    },
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

const Enemy = Object.create(GameCharacter);

Enemy.initEnemy = function(x, y, sprite, type, speed) {
    this.initCharacter(x, y, sprite, type);
    this.speed = speed;
}

Enemy.isOutOfCanvas = function() {
    return this.x > 550;
}

Enemy.update = function(dt) {
    Game.collitionWithPlayerHandler(this); // check if there is a collition between this enemy and the player
    Game.enemyOutOfCanvasHandler(this); // check if the enmy is out of canvas
    this.x += (dt * this.speed); // keep moving
}

const Player = Object.create(GameCharacter);

Player.initPlayer = function(x, y, sprite, type) {
    this.initCharacter(x, y, sprite, type);
}

Player.initialPosition = function() {
    this.x = 202;
    this.y = 390;
}

Player.moveLeft = function() {
    if (this.x > 0) this.x -= 101;
}

Player.moveRight = function() {
    if (this.x < 404) this.x += 101;
}

Player.moveDown = function() {
    if (this.y < 390) this.y += 83;
}

Player.moveUp = function() {
    if (this.y > -10) this.y -= 83;
}

Player.isOnTheSea = function() {
    return this.y < 0;
}

Player.update = function() {
    if (this.isOnTheSea()) Game.roundCompletedHandler();
}

const Gem = Object.create(GameCharacter);

Gem.initGem = function(x, y, sprite, type, color) {
    this.initCharacter(x, y, sprite, type);
    this.color = color;
    this.value = this.color === "Orange" ? 100 : this.color === "Blue" ? 150 : 120;
}

Gem.render = function() {
    GameCharacter.render.call(this);
    ctx.fillText(`${this.value}`, this.x + 10, this.y + 101);
};

Gem.update = function() {
    Game.collitionWithPlayerHandler(this); //check collitions between player and tbhis gem
};