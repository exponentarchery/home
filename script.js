let score = 0;
let aiming = false;
let hasAimed = false;
let barInterval = null;
let barDirection = 1; // 1 = right, -1 = left
let barPos = 0;

const scoreDisplay = document.getElementById("score");
const bowImage = document.getElementById("bowImage");
const timingBar = document.getElementById("timing-bar");
const tip = document.getElementById("bar-tip");
const gameContainer = document.getElementById("game-container");

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "e" && !aiming) {
    startAiming();
  }
});

document.addEventListener("click", () => {
  if (aiming && hasAimed) {
    shoot();
  }
});

function startAiming() {
  aiming = true;
  hasAimed = false;
  bowImage.src = "aim.gif";
  timingBar.style.display = "block";
  barPos = 0;
  tip.style.left = "0px";

  if (barInterval) clearInterval(barInterval);
  barDirection = 1;

  barInterval = setInterval(() => {
    barPos += barDirection * 2;
    if (barPos >= 190) {
      barDirection = -1;
      barPos = 190;
    } else if (barPos <= 0) {
      barDirection = 1;
      barPos = 0;
    }
    tip.style.left = `${barPos}px`;
  }, 10);

  setTimeout(() => {
    bowImage.src = "ready.png";
    hasAimed = true;
  }, 1000);
}

function shoot() {
  hasAimed = false;
  clearInterval(barInterval);
  timingBar.style.display = "none";
  bowImage.src = "release.gif";

  let rel = barPos / 190;
  let points = 0;
  if (barPos >= 180 && barPos <= 190) {
    points = 10;
  } else if (barPos >= 160 && barPos <= 200) {
    points = 7;
  } else {
    points = 4;
  }

  score += points;
  scoreDisplay.textContent = "Score: " + score;

  showHit(rel, points);

  setTimeout(() => {
    bowImage.src = "noammo.png";
    aiming = false;
  }, 1000);
}

function showHit(rel, points) {
  const target = document.getElementById("target");
  const rect = target.getBoundingClientRect();

  const x = rect.left + rect.width * (0.2 + 0.6 * rel);
  const y = rect.top + rect.height * (0.2 + 0.6 * Math.random());

  const dot = document.createElement("div");
  dot.className = "hit-dot";
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  const tag = document.createElement("div");
  tag.className = "score-float";
  tag.style.left = `${x - 10}px`;
  tag.style.top = `${y - 30}px`;
  tag.innerText = `+${points}`;

  gameContainer.appendChild(dot);
  gameContainer.appendChild(tag);

  setTimeout(() => {
    dot.remove();
    tag.remove();
  }, 2000);
}
