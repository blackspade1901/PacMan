// --- BOARD SETUP ---
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;
let gameStarted = false;

// --- IMAGES ---
let blueGhostImage, orangeGhostImage, pinkGhostImage, redGhostImage;
let pacmanUpImage, pacmanDownImage, pacmanLeftImage, pacmanRightImage;
let wallImage, foodImage;
let heartImage;

// --- Sounds ---
let sounds = {};

let leaderboard = JSON.parse(localStorage.getItem("pacmanLeaderboard")) || [];

// --- MAP & ENTITIES ---
// Map Legend:
// 'X' = Wall
// 'P' = Pacman (player)
// 'r' = Red Ghost
// 'b' = Blue Ghost
// 'o' = Orange Ghost
// 'p' = Pink Ghost
// ' ' = Empty space (food will spawn here)
// 'O' = Unused/empty tunnel space
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX"
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R']; // Up, Down, Left, Right
let score = 0;
let lives = 3;
let level = 1;
let gameOver = false;

let levelTransition = false;

let animationFrame = 0;

// --- ON LOAD ---
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    loadImages();
    loadMap();
    loadSounds();

    drawIntro(); // draw intro first
    sounds.background.play(); // intro music

    document.addEventListener("keydown", startGame); // start game on any key
}

// --- LOAD IMAGES ---
function loadImages() {
    wallImage = new Image();
    wallImage.src = "../Output/pacman-elements/wall.png";

    foodImage = new Image();
    foodImage.src = "../Output/pacman-elements/cherry.png";

    heartImage = new Image();
    heartImage.src = "../Output/pacman-elements/heart.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "../Output/pacman-elements/blueGhost.png";
    orangeGhostImage = new Image();
    orangeGhostImage.src = "../Output/pacman-elements/orangeGhost.png";
    pinkGhostImage = new Image();
    pinkGhostImage.src = "../Output/pacman-elements/pinkGhost.png";
    redGhostImage = new Image();
    redGhostImage.src = "../Output/pacman-elements/redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "../Output/pacman-elements/pacmanUp.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "../Output/pacman-elements/pacmanDown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "../Output/pacman-elements/pacmanLeft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "../Output/pacman-elements/pacmanRight.png";

}

// --- LOAD MAP ---
function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const tile = tileMap[r][c];
            const x = c * tileSize;
            const y = r * tileSize;

            if (tile === 'X') walls.add(new Block(wallImage, x, y, tileSize, tileSize));
            else if (tile === 'b') ghosts.add(new Block(blueGhostImage, x, y, tileSize, tileSize));
            else if (tile === 'o') ghosts.add(new Block(orangeGhostImage, x, y, tileSize, tileSize));
            else if (tile === 'p') ghosts.add(new Block(pinkGhostImage, x, y, tileSize, tileSize));
            else if (tile === 'r') ghosts.add(new Block(redGhostImage, x, y, tileSize, tileSize));
            else if (tile === 'P') pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            else if (tile === ' ') {
                // empty space -> add food item (cherry or dot)
                let food; // local variable to hold each new food block
                let cherryChance = Math.max(0.05 - (level - 1) * 0.01, 0.01); // min 1%
                if (Math.random() < cherryChance) {
                    food = new Block(foodImage, x + 6, y + 6, 20, 20);
                    food.points = 40;
                } else {
                    food = new Block(null, x + 14, y + 14, 4, 4);
                    food.points = 10;
                }
                foods.add(food); // remember to add it to the set
            }
        }
    }
}

// --- GAME LOOP ---
function update() {
    animationFrame++;
    if (gameOver) {
        showEndScreen();
        return;   // stop everything
    }

    move();
    draw();
    setTimeout(update, 50);
}

// --- DRAW ---
function draw() {
    context.clearRect(0, 0, board.width, board.height);

    // Pacman
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);

    // Ghosts
    for (let ghost of ghosts.values())
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);

    // Walls
    for (let wall of walls.values())
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);

    // Food
    for (let food of foods.values()) {
        if (food.image) context.drawImage(food.image, food.x, food.y, food.width, food.height);
        else {
            context.fillStyle = "white";
            context.fillRect(food.x, food.y, food.width, food.height);
        }
    }

    // Lives + Score
    context.fillStyle = "white";
    context.font = "14px sans-serif";
    context.fillText(score, tileSize / 2 + 20, tileSize / 2 + 12);

    // Draw hearts
    for (let i = 0; i < lives; i++) {
        context.drawImage(heartImage, tileSize / 2 + i * 20, 2, 16, 16);
    }
}

// --- DRAW INTRO SCREEN ---
function drawIntro() {
    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    animationFrame++;

    const pulse = 60 + Math.sin(animationFrame * 0.1) * 8;

    context.fillStyle = "yellow";
    context.font = pulse + "px 'Comic Sans MS', sans-serif";
    context.textAlign = "center";

    context.shadowColor = "yellow";
    context.shadowBlur = 20;

    context.fillText("READY?", board.width / 2, board.height / 2);

    context.shadowBlur = 0;

    context.font = "20px Comic Sans MS, sans-serif";
    context.fillText("Press any key to start!", board.width / 2, board.height / 2 + 60);

    if (!gameStarted) {
        requestAnimationFrame(drawIntro);
    }
}

// --- MOVE ---
function move() {
    // --- Pacman Turn & Move ---
    if (canMove(pacman, pacman.nextDirection)) {
        pacman.direction = pacman.nextDirection;
        pacman.updateVelocity();
    }
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    // --- Pacman Wall Collision ---
    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            pacman.velocityX = 0;
            pacman.velocityY = 0;
            break;
        }
    }

    // --- Update Pacman Image ---
    switch (pacman.direction) {
        case 'U': pacman.image = pacmanUpImage; break;
        case 'D': pacman.image = pacmanDownImage; break;
        case 'L': pacman.image = pacmanLeftImage; break;
        case 'R': pacman.image = pacmanRightImage; break;
    }

    // --- Ghosts Move & Collision ---
    let ghostCollisionThisFrame = false;
    for (let ghost of ghosts.values()) {
        // Check collision first
        if (!ghostCollisionThisFrame && collision(ghost, pacman)) {
            lives -= 1;
            sounds.ghostHit.currentTime = 0;
            sounds.ghostHit.play();
            ghostCollisionThisFrame = true;

            if (lives <= 0) {
                gameOver = true;
                sounds.death.currentTime = 0;
                sounds.death.play();
                sounds.background.pause();
                sounds.background.currentTime = 0;

                saveScore(score);
                return;
            }
            resetPositions();
            break; // stop checking further ghosts
        }

        // Move ghost smoothly
        ghost.x += ghost.velocityX;
        ghost.y += ghost.velocityY;

        // Only decide new direction when ghost is aligned to grid
        const onGridX = ghost.x % tileSize === 0;
        const onGridY = ghost.y % tileSize === 0;

        if (onGridX && onGridY) {
            const possibleDirections = directions.filter(dir => {
                if ((dir === 'U' && ghost.direction === 'D') ||
                    (dir === 'D' && ghost.direction === 'U') ||
                    (dir === 'L' && ghost.direction === 'R') ||
                    (dir === 'R' && ghost.direction === 'L')) return false;
                return canMove(ghost, dir);
            });

            if (possibleDirections.length === 0) {
                ghost.updateDirection(oppositeDirection(ghost.direction));
            }
            if (Math.random() < 0.3 + level * 0.05) {
                // Slight chase behavior
                let bestDir = possibleDirections[0];
                let minDistance = Infinity;

                for (let dir of possibleDirections) {
                    let testX = ghost.x;
                    let testY = ghost.y;
                    // match ghost speed formula for grid alignment
                    const speed = tileSize / 8 + (level - 1);

                    if (dir == 'U') testY -= speed;
                    if (dir == 'D') testY += speed;
                    if (dir == 'L') testX -= speed;
                    if (dir == 'R') testX += speed;

                    const distance = Math.hypot(pacman.x - testX, pacman.y - testY);

                    if (distance < minDistance) {
                        minDistance = distance;
                        bestDir = dir;
                    }
                }

                ghost.updateDirection(bestDir);
            } else {
                ghost.updateDirection(
                    possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
                );
            }
        }
    }

    // --- Food Collision ---
    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;
            score += food.points;

            // Play sound safely
            if (food.points === 40) {
                sounds.fruitBig.currentTime = 0;
                sounds.fruitBig.play();
            } else {
                sounds.fruitSmall.currentTime = 0;
                sounds.fruitSmall.play();
            }
            break;
        }
    }
    foods.delete(foodEaten);

    if (foods.size === 0 && !levelTransition) {
        levelTransition = true;
        level++;

        setTimeout(() => {
            loadMap();
            resetPositions();
            levelTransition = false;
        }, 800);
    }
}

// --- PACMAN INPUT ---
function movePacman(e) {
    if (gameOver) {
        sounds.background.pause();
        sounds.background.currentTime = 0;
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        gameOver = false;
        update();
        return;
    }

    if (e.code == "ArrowUp" || e.code == "KeyW") pacman.nextDirection = 'U';
    else if (e.code == "ArrowDown" || e.code == "KeyS") pacman.nextDirection = 'D';
    else if (e.code == "ArrowLeft" || e.code == "KeyA") pacman.nextDirection = 'L';
    else if (e.code == "ArrowRight" || e.code == "KeyD") pacman.nextDirection = 'R';
}

// --- COLLISION ---
function collision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

// --- RESET POSITIONS ---
function resetPositions() {
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    for (let ghost of ghosts.values()) {
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
}

// --- BLOCK CLASS ---
class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.nextDirection = this.direction;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        this.direction = direction;
        this.nextDirection = direction;
        this.updateVelocity();
    }

    updateVelocity() {
        // base movement speed (pixels per frame) – use an integer divisor of tileSize
        const baseSpeed = tileSize / 8; // 32/8=4px per frame

        let speed = baseSpeed;

        // ghosts slightly accelerate per level
        if (this !== pacman) {
            speed = baseSpeed + (level - 1);
        }

        if (this.direction == 'U') { this.velocityX = 0; this.velocityY = -speed; }
        else if (this.direction == 'D') { this.velocityX = 0; this.velocityY = speed; }
        else if (this.direction == 'L') { this.velocityX = -speed; this.velocityY = 0; }
        else if (this.direction == 'R') { this.velocityX = speed; this.velocityY = 0; }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 'R';
        this.nextDirection = 'R';
    }
}

// --- CAN MOVE ---
function canMove(block, direction) {
    let testX = block.x;
    let testY = block.y;

    const baseSpeed = tileSize / 8;
    let speed = baseSpeed;

    if (block !== pacman) {
        speed = baseSpeed + (level - 1);
    }

    if (direction == 'U') testY -= speed;
    if (direction == 'D') testY += speed;
    if (direction == 'L') testX -= speed;
    if (direction == 'R') testX += speed;

    for (let wall of walls.values()) {
        if (testX < wall.x + wall.width &&
            testX + block.width > wall.x &&
            testY < wall.y + wall.height &&
            testY + block.height > wall.y) {
            return false;
        }
    }
    return true;
}

function oppositeDirection(dir) {
    if (dir === 'U') return 'D';
    if (dir === 'D') return 'U';
    if (dir === 'L') return 'R';
    if (dir === 'R') return 'L';
}

function loadSounds() {
    sounds.background = new Audio('../Output/pacman-music/start-pacman.mp3');
    sounds.background.loop = true;

    sounds.death = new Audio('../Output/pacman-music/pacman_death.wav')
    sounds.fruitBig = new Audio('../Output/pacman-music/pacman_eatfruit.wav'); // 40 point fruit
    sounds.fruitSmall = new Audio('../Output/pacman-music/pacman_chomp.wav'); // 10 point fruit
    sounds.ghostHit = new Audio('../Output/pacman-music/pac-man-slap.mp3');
}

// Last Total score screen
function showEndScreen() {
    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    const pulse = 48 + Math.sin(animationFrame * 0.1) * 6;

    context.fillStyle = "yellow";
    context.font = pulse + "px Comic Sans MS, sans-serif";

    context.textAlign = "center";
    context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 60);

    context.font = "36px Comic Sans MS, sans-serif";
    context.fillText("You Scored: " + score, boardWidth / 2, boardHeight / 2);

    drawLeaderboard();
}

// Score saving
function saveScore(newScore) {
    leaderboard.push(newScore);

    leaderboard.sort((a, b) => b - a); // descending

    if (leaderboard.length > 5) {
        leaderboard = leaderboard.slice(0, 5);
    }

    localStorage.setItem("pacmanLeaderboard", JSON.stringify(leaderboard));
}

// leader board logic
function drawLeaderboard() {
    context.font = "22px Comic Sans MS, sans-serif";
    context.fillStyle = "white";

    context.fillText("Top Scores:", boardWidth / 2, boardHeight / 2 + 60);

    for (let i = 0; i < leaderboard.length; i++) {
        context.fillText(
            (i + 1) + ". " + leaderboard[i],
            boardWidth / 2,
            boardHeight / 2 + 100 + i * 30
        );
    }
}

// --- START GAME ---
function startGame(e) {
    if (!gameStarted) {
        gameStarted = true;

        // pause intro music so it doesn't continue into the game
        sounds.background.pause();
        sounds.background.currentTime = 0;

        // Initialize ghost directions
        for (let ghost of ghosts.values()) {
            ghost.updateDirection(directions[Math.floor(Math.random() * 4)]);
        }

        update(); // start game loop
        document.removeEventListener("keydown", startGame);
        document.addEventListener("keydown", movePacman); // respond on keydown

        // immediately handle the key that started the game so Pac‑Man isn't unresponsive
        movePacman(e);
    }
}