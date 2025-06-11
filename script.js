let score = 0;
let aiming = false;
let hasAimed = false;

const scoreDisplay = document.getElementById("score");
const bowImage = document.getElementById("bowImage");
const arrow = document.getElementById("arrow");
const timingBar = document.getElementById("timing-bar");
const bar = document.getElementById("bar");

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "e" && !aiming) {
    startAiming();
  }
});

document.addEventListener("click", () => {
  if (aiming && hasAimed) {
    shootArrow();
  }
});

function startAiming() {
  aiming = true;
  hasAimed = false;
  bowImage.src = "aim.gif";
  timingBar.style.display = "block";

  setTimeout(() => {
    bowImage.src = "ready.png";
    hasAimed = true;
  }, 1000); // Wait for aim.gif duration
}

function shootArrow() {
  hasAimed = false;
  bowImage.src = "release.gif";
  timingBar.style.display = "none";

  // Show arrow moving
  arrow.style.display = "block";
  arrow.style.top = "50%";

  const barPos = parseInt(window.getComputedStyle(bar).left);
  let points = 0;

  if (barPos >= 170 && barPos <= 180) {
    points = 10;
  } else if (barPos >= 150 && barPos <= 190) {
    points = 7;
  } else {
    points = 4;
  }

  score += points;
  scoreDisplay.textContent = "Score: " + score;

  setTimeout(() => {
    arrow.style.top = "80%";
    arrow.style.display = "none";
    bowImage.src = "noammo.png";
    aiming = false;
  }, 1000);
}
