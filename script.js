let score = 0;
let aiming = false;
let hasAimed = false;
let barInterval = null;
let barDirection = 1;
let barPos = 0;

const scoreDisplay = document.getElementById("score");
const bowImage = document.getElementById("bowImage");
const timingBar = document.getElementById("timing-bar");
const tip = document.getElementById("bar-tip");
const gameContainer = document.getElementById("game-container");

const quizContainer = document.getElementById("quiz-container");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");

const slopeQuestions = [
  { q: "(7,8) (3,9)", a: "-0.25" },
  { q: "(8,5) (6,8)", a: "-1.5" },
  { q: "(6,9) (7,1)", a: "-8" },
  { q: "(3,4) (2,3)", a: "1" },
  { q: "(5,3) (6,7)", a: "4" },
  { q: "(9,6) (10,9)", a: "3" },
  { q: "(8,4) (7,9)", a: "-5" },
  { q: "(4,5) (7,7)", a: "0.67" },
  { q: "(7,5) (9,7)", a: "1" },
  { q: "(4,3) (5,6)", a: "3" },
  { q: "(7,3) (9,9)", a: "3" },
  { q: "(1,5) (2,6)", a: "1" },
  { q: "(3,2) (7,4)", a: "0.5" },
  { q: "(1,2) (6,5)", a: "0.6" },
  { q: "(5,2) (7,3)", a: "0.5" },
  { q: "(8,7) (6,4)", a: "1.5" },
  { q: "(4,6) (9,6)", a: "0" },
  { q: "(6,8) (9,9)", a: "0.33" },
  { q: "(8,6) (4,7)", a: "-0.25" },
  { q: "(6,5) (3,6)", a: "-0.33" },
  { q: "(9,2) (11,6)", a: "2" },
  { q: "(8,5) (9,6)", a: "1" },
  { q: "(-3,5) (-8,6)", a: "-0.2" },
  { q: "(-7,4) (-8,-1)", a: "5" },
  { q: "(-4,2) (9,-5)", a: "-0.54" },
  { q: "(-9,5) (-6,-7)", a: "-4" },
  { q: "(-3,7) (9,-5)", a: "-1" },
  { q: "(4,2) (6,-7)", a: "-4.5" },
  { q: "(8,4) (9,6)", a: "2" }
];

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "e" && !aiming) {
    showQuiz();
  }
});

document.addEventListener("click", () => {
  if (aiming && hasAimed) {
    shoot();
  }
});

function showQuiz() {
  const question = slopeQuestions[Math.floor(Math.random() * slopeQuestions.length)];
  const correct = question.a;
  const options = new Set([correct]);

  while (options.size < 4) {
    const fake = (Math.random() * 10 - 5).toFixed(2);
    options.add(fake);
  }

  quizQuestion.textContent = `Find the slope for points: ${question.q}`;
  quizOptions.innerHTML = "";

  Array.from(options).sort(() => Math.random() - 0.5).forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === correct) {
        quizContainer.classList.add("hidden");
        startAiming();
      } else {
        showIncorrect();
      }
    };
    quizOptions.appendChild(btn);
  });

  quizContainer.classList.remove("hidden");
}

function showIncorrect() {
  const overlay = document.getElementById("incorrect-overlay");
  overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.add("hidden");
    quizContainer.classList.add("hidden");
  }, 3000); // now pauses for 3 seconds
}

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

  const center = 100;
  const tipCenter = barPos + 5;
  const distance = Math.abs(tipCenter - center);

  let points = 0;
  if (distance <= 10) {
    points = 9;
  } else if (distance <= 30) {
    points = 6;
  } else {
    points = 4;
  }

  score += points;
  scoreDisplay.textContent = "Score: " + score;

  showHit(barPos / 190, points);

  setTimeout(() => {
    bowImage.src = "noammo.png";
    aiming = false;
  }, 1000);
}

function showHit(rel, points) {
  const target = document.getElementById("target");
  const rect = target.getBoundingClientRect();

  const x = rect.left + rect.width * (0.2 + 0.6 * rel);
  const y = rect.top + rect.height * (0.4 + 0.1 * Math.random());

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
