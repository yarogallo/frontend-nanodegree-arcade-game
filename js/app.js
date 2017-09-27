const ENEMY_ROW = [60, 143, 226];
const allEnemies = [];
let resetEnemies = null;

const GameCharacter = {
    initCharacter: function(x, y, imageSrc) {
        this.x = x;
        this.y = y;
        this.sprite = imageSrc;
    },
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

const Enemy = Object.create(GameCharacter);
console.log(Enemy.__proto__);

Enemy.initEnemy = function(x, y, imageSrc, speed) {
    this.initCharacter(x, y, imageSrc);
    this.speed = speed;
};

Enemy.update = function(dt) {
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

const Player = Object.create(GameCharacter);

Player.initPlayer = function(x, y, imageSrc) {
    this.initCharacter(x, y, imageSrc);
    this.level = 1;
};

Player.renderLevel = function() {
    let level = `Level: ${this.level}`;
    ctx.font = "bold 35px arial";
    ctx.fillText(level, 5, 95);
};

Player.reset = function() {
    this.x = 202;
    this.y = 405;
}

Player.update = function() {
    if (this.y < 0) {
        this.level === 4 ? this.level = 1 : this.level++;
        generateLevel(this.level);
        this.reset();
    }
};

Player.handleInput = function(keyCode) {
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

const Gemstone = Object.create(GameCharacter);

Gemstone.initGemstone = function(x, y, imageSrc, color) {
    this.initCharacter(x, y, imageSrc);
    this.color = color;
}

function isCollision(gameCharacter_1, gameCharacter_2) {

    return Math.abs(gameCharacter_1.x - gameCharacter_2.x) < 25 && Math.abs(gameCharacter_1.y - gameCharacter_2.y) < 15 ? true : false;

}

function generateEnemies(speed, time) {

    const getRow = () => Math.floor(Math.floor(Math.random() * 3));

    const getEnemy = () => {
        let enemy = Object.create(Enemy);
        enemy.initEnemy(-101, ENEMY_ROW[getRow()], 'images/enemy-bug.png', speed);
        return enemy;
    };

    allEnemies.push(getEnemy());

    resetEnemies = setInterval(() => {
        allEnemies.push(getEnemy());
    }, time);

}

function generateLevel(levelValue) {
    let speed = 100 + (levelValue * 50);
    let time = 1225 - (levelValue * 225);

    clearInterval(resetEnemies);
    generateEnemies(speed, time);
}

const player = Object.create(Player);
player.initPlayer(202, 405, 'images/char-pink-girl.png');


Resources.onReady(function() {

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.\
    //resetInterval = generateEnemies(250, 1000);
    generateLevel(player.level);

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