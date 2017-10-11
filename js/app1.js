const Game = (function() {
    const ENEMY_ROW = [60, 143, 226];
    const ENEMY_SPEED = [200, 250, 300];
    const ROCK_POS = [
        [111, 83],
        [414, 83],
        [313, 249],
        [10, 166]
    ];
    const GEMS_POS = [
        [
            [10, 83],
            [212, 83],
            [212, 166]
        ],
        [
            [111, 166],
            [313, 166],
            [414, 166]
        ],
        [
            [10, 249],
            [212, 249],
            [313, 83]
        ]
    ];
    const GEMS_COLOR = ['Orange', 'Blue', 'Green'];
    let resetEnemies = null;

    const player = Object.create(Player);
    const rock = Object.create(Rock);
    const allEnemies = [];
    const allGems = [];
    const allRocks = [];
    let score = 0;
    let rounds = 0;

    //init player with a default image
    player.initPlayer(202, 390, 'images/char-cat-girl.png');
    rock.initRock(313, 166, 'images/Rock.png', 'rock');

    const getRow = () => Math.floor(Math.floor(Math.random() * 3)); // random number between 0 and 2

    const generateEnemies = () => { //fill the allEnemies array with enemies
        const createEnemy = () => {
            let enemy = Object.create(Enemy);
            enemy.initEnemy(-101, ENEMY_ROW[getRow()], 'images/enemy-bug.png', "enemy", ENEMY_SPEED[getRow()]);

            return enemy;
        };
        allEnemies.push(createEnemy());
        resetEnemies = setInterval(() => {
            allEnemies.push(createEnemy());
        }, 700);
    };

    const generateRocks = () => { //fill the allRocks array depending on rounds
        if (rounds > 0) {
            let rock = Object.create(Rock);
            let position = ROCK_POS[rounds - 1];
            rock.initRock(position[0], position[1], 'images/Rock.png', 'rock');
            allRocks.push(rock);
        } else {
            allRocks.splice(0, 4);
        }
    };

    const generateGems = () => { //fill allGems array with gems taking into account the game rounds 
        allGems.splice(0, allGems.length);

        for (let index = 0; index < rounds; index++) {
            let color = GEMS_COLOR[getRow()];
            let gem = Object.create(Gem);
            let location = GEMS_POS[getRow()][getRow()];
            gem.initGem(location[0], location[1], `images/Gem-${color}.png`, "gem", color);
            allGems.push(gem);
        }

    };

    const collitionWithPlayerHandler = (character) => {
        if (Math.abs(player.x - character.x) <= 30 && Math.abs(player.y - character.y) <= 30) {
            if (character.type === "enemy") { // if there is a collition with an enemy and game score negative, the game is over (player loose)
                if ((score -= 100) < 0) {
                    endGame("You can't have a negative score", score, rounds);
                }
                player.initialPosition();
            }
            if (character.type === "gem") { // if threre is a collition with a gem, score is aumented with the gem value 
                score += character.value;
                removeCharacter(character, allGems);
            }
            return true;
        }
        return false;
    };

    const roundCompletedHandler = (player) => { // check if the Player finish a round check
        if (player.y < 0) {
            rounds++;
            score += 50;
            if (rounds === 5) { // if the round is number 4 and the score is more than or equal 1000 (player win)
                if (score <= 1000) {
                    endGame("Im Sorry!! You Loose!!", score, rounds);
                } else { // the round is 4 but the score is less than 1000 (player loose)
                    endGame("Congratulations!! You are a winner!!", score, rounds)
                }
            } else {
                player.initialPosition();
                generateGems();
                generateRocks();
            }
        }

    };

    const enemyOutOfCanvasHandler = (enemy) => { // if there is an enemy out of canvas, remove it from allEnemies array
        if (enemy.x > 550) {
            removeCharacter(enemy, allEnemies);
        }
    };

    const handleInput = (keyCode) => { // move player lefet, right, up, down, depending on keyCode value
        switch (keyCode) {
            case "left":
                player.moveLeft();
                if (allRocks.some(collitionWithPlayerHandler)) player.moveRight();
                break;

            case "right":
                player.moveRight();
                if (allRocks.some(collitionWithPlayerHandler)) player.moveLeft();
                break;

            case "up":
                player.moveUp();
                if (allRocks.some(collitionWithPlayerHandler)) player.moveDown();
                break;

            case "down":
                player.moveDown();
                if (allRocks.some(collitionWithPlayerHandler)) player.moveUp();
                break;

            default:
                break;
        }
    }

    const renderGameProgress = () => { // render score and rounds for the user keep track on his progress in the game
        ctx.fillText(`Score: ${score}`, 30, 100);
        ctx.fillText(`Rounds: ${rounds}`, 330, 100);
    };

    const removeCharacter = (character, arrayCharacters) => {
        let index = arrayCharacters.indexOf(character);
        arrayCharacters.splice(index, 1);
    }

    const startGame = () => {
        score = 0;
        rounds = 0;
        player.initialPosition();
        clearInterval(resetEnemies);
        generateEnemies();
        generateGems();
        generateRocks();
    };

    return { //all game public properties and methos
        allEnemies: allEnemies,
        allGems: allGems,
        allRocks: allRocks,
        player: player,
        score: score,
        rounds: rounds,
        startGame: startGame,
        roundCompletedHandler: roundCompletedHandler,
        collitionWithPlayerHandler: collitionWithPlayerHandler,
        enemyOutOfCanvasHandler: enemyOutOfCanvasHandler,
        handleInput: handleInput,
        renderGameProgress: renderGameProgress
    };
})();

function endGame(smg, score, rounds) { //show screen corresponding to the end game
    const finalScreen = document.getElementById('final-screen');
    document.getElementById('gameResult').innerText = smg;
    document.getElementById('score').innerText = score;
    document.getElementById('rounds').innerText = rounds;
    finalScreen.classList.remove("close");
}

function choosePlayerHandler(evt) {
    let anotherPlayerSelected = document.querySelector('.bouncing');

    evt.preventDefault();
    if (anotherPlayerSelected) anotherPlayerSelected.classList.remove('bouncing');
    evt.target.classList.add("bouncing");
    Game.player.sprite = evt.target.value;
}

function startGameHandler(evt) {
    let rows = [].slice.call(document.querySelectorAll(".row"));
    evt.preventDefault();
    evt.stopPropagation();

    rows.forEach((row) => {
        if (!row.classList.contains('close')) {
            row.classList.add('close');
        }
    });

    Game.startGame();
}

Resources.onReady(function() {
    const gameButtons = [].slice.call(document.querySelectorAll('.game-button'));
    const playersToChoose = [].slice.call(document.querySelectorAll('.player-input'));

    playersToChoose.forEach((player) => {
        player.addEventListener("click", choosePlayerHandler);
    });

    gameButtons.forEach((button) => {
        button.addEventListener('click', startGameHandler);
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
        Game.handleInput(allowedKeys[evt.keyCode]);
    });
});