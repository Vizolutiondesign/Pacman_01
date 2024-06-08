import TileMap from "./TileMap.js";

const tileSize = 40;
const initialVelocity = 2.5;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
let pacman = tileMap.getPacman(initialVelocity);
let enemies = tileMap.getEnemies(initialVelocity);

let score = 0;
let level = 1;
let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("sounds/gameOver.wav");
const gameWinSound = new Audio("sounds/gameWin.wav");

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
  updateScoreBoard();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
      score += level * 50; // -------------> Score voor uitspelen level <--------------------
      level++;

      setTimeout(() => {
        resetGame();
      }, 2000);
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
      setTimeout(() => {
        resetGame(true);
      }, 2000);
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "Level up!";
    if (gameOver) {
      text = "Game Over";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);

    // Gebruik het standaard lettertype van de HTML en stel de kleur in op rood
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Bereken de positie om de tekst in het midden van het canvas te plaatsen
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Tekst grootte instellen (indien nodig)
    ctx.font = "75px sans-serif";

    ctx.fillText(text, x, y);
  }
}


function updateScoreBoard() {
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("level").textContent = `Level: ${level}`;
}

function resetGame(restart = false) {
  tileMap.resetMap();
  if (restart) {
    level = 1;
  }
  if (level > 1) {
    for (let i = 0; i < level; i++) {
      tileMap.makeHarder();
    }
  }
  pacman = tileMap.getPacman(initialVelocity);
  enemies = tileMap.getEnemies(initialVelocity);
  gameOver = false;
  gameWin = false;
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);

// Upload score en laad eindscherm
function openNieuwePagina() {
  console.log(score);
  //-----------------> upload score naar database <-------------

  window.location.href = "GameOver.html";
}

// Timer einde spel
setTimeout(openNieuwePagina, 5 * 60 * 1000); // 5 minuten * 60 seconden * 1000 milliseconden
