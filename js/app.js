const ENEMY_ROW = [60, 143, 226];
const ENEMY_SPEED = [200, 250, 300];
const GEMS_ROW = [83, 166, 249];
const GEMS_COLOR = ['Orange', 'Blue', 'Green'];

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
        player.score -= 100;
        player.move(202, 390);
    }

    this.x > 550 ? removeCharacter(allEnemies, this) : this.x += (dt * this.speed);
};

const Player = Object.create(GameCharacter);

Player.initPlayer = function(x, y, imageSrc) {
    this.initCharacter(x, y, imageSrc);
};

Player.render = function() {
    GameCharacter.render.call(this);
    this.renderRounds(20, 575);
    this.renderScore(320, 575);
};

Player.renderRounds = function(x, y) {
    renderText(`Rounds: ${this.rounds}`, x, y, "#4f0404");
};

Player.renderScore = function(x, y) {
    renderText(`Score: ${this.score}`, x, y, "#4f0404");
};

Player.move = function(x, y) {
    this.x = x;
    this.y = y;
}

Player.setRounds = function(value) {
    this.rounds = value;
};

Player.setScore = function(value) {
    this.score = value;
};

// check if the player is in the sea
Player.update = function() {
    if (this.score < 0) {
        startOver("Sorry, you can't have negative score");
    }
    if (this.y < 0) { // its on the sea
        if (this.rounds === 4) {
            if (this.score >= 1000) {
                startOver("You won. Congratulations!!")
            } else {
                startOver("Sorry, you lose!!");
            }
        } else {
            this.rounds++;
            this.score += 100;
            generateGems(player.rounds);
        }
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

Gem.initGem = function(x, y, imageSrc, color) {
    this.initCharacter(x, y, imageSrc);
    this.color = color;
};

Gem.setValue = function() {
    this.value = this.color === "Orange" ? 100 : this.color === "Blue" ? 150 : 120;
}

Gem.render = function() {
    GameCharacter.render.call(this);
    this.renderValue();
};

Gem.renderValue = function() {
    renderText(`${this.value}`, this.x + 10, this.y + 101, "#b20a0a");
};

Gem.update = function() {
    if (isCollision(player, this)) {

        player.score += this.value;
        removeCharacter(allGems, this);
    }
};

function renderText(text, x, y, color) {
    ctx.font = "bold 30px arial";
    ctx.fillStyle = color;

    ctx.fillText(text, x, y);
}

function removeCharacter(arrayCharacters, character) {
    let index = arrayCharacters.indexOf(character);
    arrayCharacters.splice(index, 1);
}


function isCollision(gameCharacter_1, gameCharacter_2) {

    return Math.abs(gameCharacter_1.x - gameCharacter_2.x) <= 30 && Math.abs(gameCharacter_1.y - gameCharacter_2.y) <= 30 ? true : false;

}

function generateEnemies() {

    const getRow = () => Math.floor(Math.floor(Math.random() * 3));

    const getEnemy = () => {
        let enemy = Object.create(Enemy);
        enemy.initEnemy(-101, ENEMY_ROW[getRow()], 'images/enemy-bug.png', ENEMY_SPEED[getRow()]);

        return enemy;
    };

    allEnemies.push(getEnemy());

    resetEnemies = setInterval(() => {
        allEnemies.push(getEnemy());
    }, 700);

}

function generateGems(amount) {
    allGems.splice(0, allGems.length);
    const getRow = () => Math.floor(Math.floor(Math.random() * 3));

    for (let index = 0; index < amount; index++) {

        let gem = Object.create(Gem);
        let color = GEMS_COLOR[getRow()];
        gem.initGem(10 + index * 101, GEMS_ROW[getRow()], `images/Gem-${color}.png`, color);
        gem.setValue();
        allGems.push(gem);
    }

}

function initGame() {
    player.setRounds(0);
    player.setScore(0);

    clearInterval(resetEnemies);
    generateGems(player.rounds);
    generateEnemies();
}

function startOver(smg) {
    const restartScreen = document.getElementById('restart-game-container');
    const gameResult = document.getElementById('gameResult');
    const finalScore = document.getElementById('score');
    const finalRounds = document.getElementById('rounds');

    gameResult.innerText = smg;
    finalScore.innerText = player.score;
    finalRounds.innerText = player.rounds;
    restartScreen.classList.remove("close");
    initGame();
}

function initGameHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    let screen = evt.target.id === 'start-game-button' ? document.getElementById('start-game-container') :
        document.getElementById('restart-game-container');

    initGame();
    screen.classList.add('close');
}

const player = Object.create(Player);
player.initPlayer(202, 390, 'images/char-cat-girl.png');

Resources.onReady(function() {
    const gameButtons = document.querySelectorAll('.gameButton');
    const myPlayers = document.querySelectorAll('.player');

    myPlayers.forEach((myPlayer) => {
        myPlayer.addEventListener("click", (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            let anotherSelectedPlayer = document.getElementsByClassName('bouncing')[0];
            if (anotherSelectedPlayer) {
                anotherSelectedPlayer.classList.remove('bouncing');
            }
            evt.target.classList.add("bouncing");
            player.sprite = evt.target.value;
        })
    });


    gameButtons.forEach((button) => {
        button.addEventListener('click', initGameHandler);
    });

    document.addEventListener('keyup', (evt) => {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        evt.preventDefault();
        evt.stopPropagation();
        player.handleInput(allowedKeys[evt.keyCode]);
    });
});