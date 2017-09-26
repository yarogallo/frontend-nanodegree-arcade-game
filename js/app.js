const ENEMY_ROW = [60, 143, 226];
const allEnemies = [];


const GameCharacter = function(x, y, imageSrc) {
    this.x = x;
    this.y = y;
    this.sprite = imageSrc;
}

GameCharacter.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

const Enemy = function(x, y, speed) {
    GameCharacter.call(this, x, y, 'images/enemy-bug.png');
    this.speed = speed;
};

Enemy.prototype = Object.create(GameCharacter.prototype);

Enemy.prototype.update = function(dt) {

    if (isCollision(player, this)) {
        player.reset();
    }

    if (this.x > 550) {
        let index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
    } else {
        this.x += (dt * this.speed);
    }

};

const Player = function(x, y) {
    GameCharacter.call(this, x, y, 'images/char-pink-girl.png')
};

Player.prototype = Object.create(GameCharacter.prototype);
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 405;
}

Player.prototype.update = function() {
    if (this.y < 0) {
        this.reset();
    }
};

Player.prototype.handleInput = function(keyCode) {
    switch (keyCode) {
        case "left":
            if (this.x > 0) {
                this.x -= 101;
            };
            break;

        case "right":
            if (this.x < 404) {
                this.x += 101;
            };
            break;

        case "up":
            if (this.y > -10) {
                this.y -= 83;
            };
            break;

        case "down":
            if (this.y < 405) {
                this.y += 83;
            };
            break;

        default:
            break;
    }

}

function isCollision(gameCharacter_1, gameCharacter_2) {

    return Math.abs(gameCharacter_1.x - gameCharacter_2.x) < 20 && Math.abs(gameCharacter_1.y - gameCharacter_2.y) < 15 ? true : false;

}

function generateEnemies(speed, time) {
    const getRow = () => Math.floor(Math.floor(Math.random() * 3));

    allEnemies.push(new Enemy(0, ENEMY_ROW[getRow()], speed));

    let reset = setInterval(() => {
        allEnemies.push(new Enemy(-101, ENEMY_ROW[getRow()], speed))
    }, time);

    return reset;
}


var player = new Player(202, 405);


Resources.onReady(function() {

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.\
    let resetInterval = generateEnemies(250, 1000);
    // var allEnemies = [new Enemy(10, 20), new Enemy(5, 6)];

    player.render();

    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });
});