const Game = (function() {
    const ENEMY_ROW = [60, 143, 226];
    const ENEMY_SPEED = [200, 250, 300];
    const GEMS_ROW = [83, 166, 249];
    const GEMS_COLOR = ['Orange', 'Blue', 'Green'];
    let resetEnemies = null;

    const player = Object.create(Player);
    const allEnemies = [];
    const allGems = [];
    let score = 0;
    let rounds = 0;

    //init player with a default image
    player.initPlayer(202, 390, 'images/char-cat-girl.png');

    const getRow = () => Math.floor(Math.floor(Math.random() * 3));

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
    }

    const generateGems = () => {
        allGems.splice(0, allGems.length); //fill allGems array with gems taking into account the game rounds 

        for (let index = 0; index < rounds; index++) {
            let color = GEMS_COLOR[getRow()];
            let gem = Object.create(Gem);
            gem.initGem(10 + index * 101, GEMS_ROW[getRow()], `images/Gem-${color}.png`, "gem", color);
            allGems.push(gem);
        }

    }

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
        }
    }

    const roundCompletedHandler = (player) => { // check if the Player finish a round check
        if (player.y < 0) {
            if (rounds === 4) { // if the round is number 4 and the score is more than or equal 1000 (player win)
                if (score <= 1000) {
                    endGame("Im Sorry!! You Loose!!", score, rounds);
                } else { // the round is 4 but the score is less than 1000 (player loose)
                    endGame("Congratulations!! You are a winner!!", score, rounds)
                }
            } else {
                rounds++; //if the round is less than 4 increment score, generate gems depending of the rounds number, move player initial position
                score += 100;
                player.initialPosition();
                generateGems(rounds);
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
                break;

            case "right":
                player.moveRight();
                break;

            case "up":
                player.moveUp();
                break;

            case "down":
                player.moveDown();
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
    }

    return { //all game public properties and methos
        allEnemies: allEnemies,
        allGems: allGems,
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