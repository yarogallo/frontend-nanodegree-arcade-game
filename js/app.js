const ENEMY_ROW = [60, 143, 226];
const GEMS_COLOR = ['Orange', 'Blue', 'Green'];
const GEMS_ROW = [83, 166, 249];

const allEnemies = [];
const allGems = [];
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

Enemy.initEnemy = function(x, y, imageSrc, speed) {
    this.initCharacter(x, y, imageSrc);
    this.speed = speed;
};

Enemy.update = function(dt) {

    if (isCollision(player, this)) {
        player.score -= 10;
        player.move(202, 390);
    }

    if (this.x > 550) {
        removeCharacter(allEnemies, this);
    } else {
        this.x += (dt * this.speed);
    }
};

const Player = Object.create(GameCharacter);

Player.initPlayer = function(x, y, imageSrc) {
    this.initCharacter(x, y, imageSrc);
    this.level = 1;
    this.score = 0;
};

Player.render = function() {
    GameCharacter.render.call(this);
    this.renderLevelScore();
};

Player.renderLevelScore = function() {
    renderText(`Level: ${this.level}`, 20, 575);
    renderText(`Score: ${this.score}`, 360, 575);
};

Player.move = function(x, y) {
    this.x = x;
    this.y = y;
}

// check if the player is in the sea
Player.update = function() {

    if (this.y < 0) {

        if (this.level === 4) {
            this.level = 1;
            this.score = 0;
            generateLevel(this.level);

        } else {
            this.level++;
        }

        generateLevel(this.level);
        this.move(202, 390);
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
            if (this.y < 390) {
                this.y += 83;
            };
            break;

        default:
            break;
    }

}

const Gem = Object.create(GameCharacter);

Gem.initGem = function(x, y, imageSrc, value) {
    this.initCharacter(x, y, imageSrc);
    this.value = value;
};

Gem.render = function() {
    GameCharacter.render.call(this);
    this.renderValue();
};

Gem.renderValue = function() {
    renderText(`${this.value}`, this.x + 10, this.y + 101);
};

Gem.update = function() {
    if (isCollision(player, this)) {
        player.score += this.value;
        removeCharacter(allGems, this);
    }
};

function renderText(text, x, y) {
    ctx.font = "bold 30px arial";
    ctx.fillStyle = "#ff3399";

    ctx.fillText(text, x, y);
}

function removeCharacter(arrayCharacters, character) {
    let index = arrayCharacters.indexOf(character);
    arrayCharacters.splice(index, 1);
}


function isCollision(gameCharacter_1, gameCharacter_2) {

    return Math.abs(gameCharacter_1.x - gameCharacter_2.x) <= 30 && Math.abs(gameCharacter_1.y - gameCharacter_2.y) <= 30 ? true : false;

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

function generateGems(level) {
    allGems.splice(0, allGems.length);
    const getRow = () => Math.floor(Math.floor(Math.random() * 3));

    for (let index = 0; index < level; index++) {

        let gem = Object.create(Gem)
        gem.initGem(10 + index * 101, GEMS_ROW[getRow()], `images/Gem-${GEMS_COLOR[getRow()]}.png`, 100);
        //gem.initGem(110, 249, `images/Gem-${GEMS_COLOR[getRow()]}.png`, 100)
        allGems.push(gem);
    }


}

function generateLevel(level) {
    let speed = 100 + (level * 50);
    let time = 1225 - (level * 225);

    clearInterval(resetEnemies);
    generateGems(level);
    generateEnemies(speed, time);
}

const player = Object.create(Player);
player.initPlayer(202, 390, 'images/char-pink-girl.png');


Resources.onReady(function() {

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.\
    //resetInterval = generateEnemies(250, 1000);
    generateLevel(player.level);



    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        e.preventDefault();
        e.stopPropagation();
        player.handleInput(allowedKeys[e.keyCode]);
    });
});