import TileMap from "./TileMap.js";

const tileSize = 42;
const initialVelocity = 2;

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

    const textSize = 75;
    const padding = 20;
    ctx.font = `${textSize}px 'Press Start 2P'`;

    // Bereken de breedte van de tekst
    const textWidth = ctx.measureText(text).width;
    const textHeight = textSize; // Aangezien we de font-size kennen

    // Bereken de afmetingen van de zwarte balk
    const rectWidth = textWidth + 2 * padding;
    const rectHeight = textHeight + 2 * padding;

    // Bereken de positie van de zwarte balk
    const rectX = (canvas.width - rectWidth) / 2;
    const rectY = (canvas.height - rectHeight) / 2;

    // Bereken de positie van de tekst
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;

    // Teken de zwarte balk
    ctx.fillStyle = "black";
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Teken de tekst in het midden van de balk
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, textX, textY);
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
