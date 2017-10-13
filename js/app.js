const Game = (function() {
    const ENEMY_ROW = [60, 143, 226];
    const ENEMY_SPEED = [230, 280, 350];
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

    const player = new Player(202, 390, 'images/char-cat-girl.png', 'player'); //init player with a default image
    const allEnemies = [];
    const allGems = [];
    const allRocks = [];
    let score = 0;
    let rounds = 0;

    const getRow = () => Math.floor(Math.floor(Math.random() * 3)); // random number between 0 and 2

    const generateEnemies = () => { //fill the allEnemies array with enemies
        const createEnemy = () => {
            let enemy = new Enemy(-101, ENEMY_ROW[getRow()], 'images/enemy-bug.png', "enemy", ENEMY_SPEED[getRow()]);

            return enemy;
        };
        allEnemies.push(createEnemy());
        resetEnemies = setInterval(() => {
            allEnemies.push(createEnemy());
        }, 700);
    };

    const generateRocks = () => { //fill the allRocks array depending on rounds
        if (rounds > 0) {
            let position = ROCK_POS[rounds - 1];
            let rock = new Rock(position[0], position[1], 'images/Rock.png', 'rock');
            allRocks.push(rock);
        } else {
            allRocks.splice(0, 4);
        }
    };

    const generateGems = () => { //fill allGems array with gems taking into account the game rounds 
        allGems.splice(0, allGems.length);

        for (let index = 0; index < rounds; index++) {
            let color = GEMS_COLOR[getRow()];
            let location = GEMS_POS[getRow()][getRow()];
            let gem = new Gem(location[0], location[1], `images/Gem-${color}.png`, "gem", color);
            allGems.push(gem);
        }

    };

    const enemyOutOfCanvasHandler = (enemy) => {
        removeCharacter(enemy, allEnemies);
    }

    const collitionWithEnemyhandler = () => {
        score -= 100;
        player.initialPosition();
        if (score < 0) {
            endGame("You can't have a negative score", score, rounds);
        }
    };

    const collitionWithGemsHandler = (gem) => {
        score += gem.value;
        removeCharacter(gem, allGems);
    }

    const roundCompletedHandler = () => { // check if the Player finish a round check
        rounds++;
        score += 50;
        if (rounds === 5) { // if the round is number 4 and the score is more than or equal 1000 (player win)
            if (score <= 1000) {
                endGame("Im Sorry!! You Loose!!", score, rounds);
            } else { // the round is 4 but the score is less than 1000 (player loose)
                endGame("Congratulations!! You are a winner!!", score, rounds)
            }
        } else {
            generateGems();
            generateRocks();
        }

    };


    const handleInput = (keyCode) => { // move player lefet, right, up, down, depending on keyCode value
        switch (keyCode) {
            case "left":
                player.moveLeft();
                if (allRocks.some(player.isCollition)) player.moveRight();
                break;

            case "right":
                player.moveRight();
                if (allRocks.some(player.isCollition)) player.moveLeft();
                break;

            case "up":
                player.moveUp();
                if (allRocks.some(player.isCollition)) player.moveDown();
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
        collitionWithEnemyhandler: collitionWithEnemyhandler,
        collitionWithGemsHandler: collitionWithGemsHandler,
        enemyOutOfCanvasHandler: enemyOutOfCanvasHandler,
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
        Game.player.handleInput(allowedKeys[evt.keyCode]);
    });
});