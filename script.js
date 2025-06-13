let score = 0;
let aiming = false;
let hasAimed = false;
let barInterval = null;
let barDirection = 1;
let barPos = 0;
let quizPassed = false;

const scoreDisplay = document.getElementById("score");
const bowImage = document.getElementById("bowImage");
const timingBar = document.getElementById("timing-bar");
const tip = document.getElementById("bar-tip");
const gameContainer = document.getElementById("game-container");

const quizContainer = document.getElementById("quiz-container");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");

const slopeQuestions = [
  ["(7,8) (3,9)", "-0.25"],
  ["(8,5) (6,8)", "-1.5"],
  ["(6,9) (7,1)", "-8"],
  ["(3,4) (2,3)", "1"],
  ["(5,3) (6,7)", "4"],
  ["(9,6) (10,9)", "3"],
  ["(8,4) (7,9)", "-5"],
  ["(4,5) (7,7)", "0.6667"],
  ["(7,5) (9,7)", "1"],
  ["(3,2) (7,4)", "0.5"],
  ["(6,8) (9,9)", "0.3333"],
  ["(8,6) (4,7)", "-0.25"],
  ["(6,5) (3,6)", "-0.3333"],
  ["(9,2) (11,6)", "2"],
  ["(-7,4) (-8,-1)", "5"],
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
  const q = slopeQuestions[Math.floor(Math.random() * slopeQuestions.length)];
  const [text, correctAnswer] = q;

  const wrongAnswers = new Set();
  while (wrongAnswers.size < 3) {
    let fake = (Math.random() * 10 - 5).toFixed(2);
    if (fake !== correctAnswer) wrongAnswers.add(fake);
  }

  const options = [...wrongAnswers, correctAnswer].sort(() => 0.5 - Math.random());

  quizContainer.classList.remove("hidden");
  quizQuestion.textContent = `Find the slope for ${text}`;
  quizOptions.innerHTML = "";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === correctAnswer) {
        quizContainer.classList.add("hidden");
        startAiming();
      } else {
        btn.style.background = "tomato";
        setTimeout(() => quizContainer.classList.add("hidden"), 1000);
      }
    };
    quizOptions.appendChild(btn);
  });
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
