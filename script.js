let score = 0;
let aiming = false;

const scoreDisplay = document.getElementById("score");
const arrow = document.getElementById("arrow");
const bow = document.getElementById("bow");
const aimVideo = document.getElementById("aimVideo");
const releaseVideo = document.getElementById("releaseVideo");
const bar = document.getElementById("bar");
const timingBar = document.getElementById("timing-bar");

document.addEventListener("keydown", (e) => {
    if (e.key === "e" || e.key === "E") {
        startAim();
    }
});

function startAim() {
    if (aiming) return;
    aiming = true;
    timingBar.style.display = "block";
    aimVideo.play();
    aimVideo.onended = () => {
        bow.src = "ready.png";
    };
}

document.addEventListener("click", () => {
    if (!aiming) return;
    aiming = false;
    releaseVideo.play();
    releaseVideo.onended = () => {
        timingBar.style.display = "none";
        shootArrow();
        bow.src = "noammo.png";
    };
});

function shootArrow() {
    arrow.style.left = "200px";
    const barPos = parseInt(window.getComputedStyle(bar).left);
    let points = 0;
    if (barPos > 75 && barPos < 95) {
        points = 10;
    } else if (barPos > 50 && barPos < 120) {
        points = 7;
    } else {
        points = 4;
    }
    score += points;
    scoreDisplay.textContent = "Score: " + score;
    setTimeout(() => {
        arrow.style.left = "-50px";
    }, 1000);
}
