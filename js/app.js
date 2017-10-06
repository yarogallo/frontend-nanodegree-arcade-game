const ENEMY_ROW = [60, 143, 226];
const ENEMY_SPEED = [200, 250, 300];
const GEMS_COLOR = ['Orange', 'Blue', 'Green'];
const GEMS_ROW = [83, 166, 249];


const allEnemies = [];
const allGems = [];
let resetEnemies = null;
let playerSource = null;

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
    this.renderScore(350, 575);
};

Player.renderRounds = function(x, y) {
    renderText(`Rounds: ${this.rounds}`, x, y);
};

Player.renderScore = function(x, y) {
    renderText(`Score: ${this.score}`, x, y);
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

    if (this.y < 0) {

        if (this.rounds === 4) {
            this.score >= 1000 ? startOver("You won. Congratulations!!") : startOver("Sorry, you lose!!");
        } else {
            this.rounds++;
            generateGems(player.rounds);
            this.score += 100;
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

        let gem = Object.create(Gem)
        gem.initGem(10 + index * 101, GEMS_ROW[getRow()], `images/Gem-${GEMS_COLOR[getRow()]}.png`, 100);
        allGems.push(gem);
    }

}

function toggleClass(screen) {
    if (screen.classList.contains("open")) {
        screen.classList.remove("open");
        screen.classList.add("close");
    } else {
        screen.classList.remove("close");
        screen.classList.add("open");
    }

}

function startOver(smg) {
    toggleClass(document.querySelector('#restart-game-container'));

    document.getElementById('gameResult').innerText = smg;
    document.getElementById('score').innerText = player.score;
    document.getElementById('rounds').innerText = player.rounds;
}

function initGame() {
    player.setRounds(0);
    player.setScore(0);

    clearInterval(resetEnemies);
    generateGems(player.rounds);
    generateEnemies();
}

const player = Object.create(Player);
player.initPlayer(202, 390, 'images/char-cat-girl.png');

Resources.onReady(function() {
    const buttons = document.querySelectorAll('button');
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

    buttons.forEach((button) => {
        button.addEventListener('click', (evt) => {
            evt.preventDefault();
            toggleClass(evt.path[3]);
            initGame();
        });
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