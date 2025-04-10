/* === Navigation === */
document.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.section + '-section';

        document.querySelectorAll('.page-section').forEach(sec => {
            sec.style.display = 'none';
        });

        const target = document.getElementById(targetId);
        if (target) {
            target.style.display = 'block';
        }

        const scoreboard = document.getElementById("scoreboard");
        if (scoreboard) {
            scoreboard.style.display = (targetId === "play-section") ? "block" : "none";
        }
    });
});

/* === Game Logic === */
const choices = ["rock", "paper", "scissors"];
const icons = {
    rock: "fa-hand-back-fist",
    paper: "fa-hand",
    scissors: "fa-hand-scissors"
};

let isAnimating = false; // Anti Spam

// Event listener for each choice icon
document.querySelectorAll(".choices i").forEach(icon => {
    icon.addEventListener("click", () => {
        if (isAnimating) return; // Anti Spam in use

        const userChoice = icon.dataset.choice;
        showUserChoice(userChoice);
        animateComputerChoice(userChoice);
    });
});

// Show the user's selected choice
function showUserChoice(choice) {
    document.getElementById("user-choice").innerHTML = `<i class="fa-solid ${icons[choice]}"></i>`;
}

// Animate the computer "thinking" and then show result
function animateComputerChoice(userChoice) {
    isAnimating = true;
    let index = 0;
    const computerIcon = document.getElementById("computer-choice");

    // Rapidly cycle through icons to simulate animation
    const interval = setInterval(() => {
        const choice = choices[index % 3];
        computerIcon.innerHTML = `<i class="fa-solid ${icons[choice]}"></i>`;
        index++;
    }, 100);

    // After 1 second, stop animation and show final computer choice
    setTimeout(() => {
        clearInterval(interval);
        const finalChoice = choices[Math.floor(Math.random() * 3)];
        computerIcon.innerHTML = `<i class="fa-solid ${icons[finalChoice]}"></i>`;
        showResult(userChoice, finalChoice);
        isAnimating = false;
    }, 1000);
}

// Determine and display game outcome
function showResult(user, computer) {
    const resultDiv = document.getElementById("result");
    if (user === computer) {
        resultDiv.textContent = "It's a draw!";
    } else if (
        (user === "rock" && computer === "scissors") ||
        (user === "paper" && computer === "rock") ||
        (user === "scissors" && computer === "paper")
    ) {
        resultDiv.textContent = "You win!";
    } else {
        resultDiv.textContent = "Computer wins!";
    }
}

/* === Theme Toggle Logic === */
const toggle = document.getElementById("darkModeToggle");
const body = document.body;
const container = document.querySelector(".game-container");

// When toggle is switched, update theme classes and save to localStorage
toggle.addEventListener("change", () => {
    const isDark = body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");

    if (container) {
        container.classList.toggle("dark", isDark);
        container.classList.toggle("light", !isDark);
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// On page load, apply saved theme
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";

    body.classList.add(`${savedTheme}-theme`);
    if (container) container.classList.add(savedTheme);
    toggle.checked = savedTheme === "dark";
});

// === Scoreboard Logic ===
let userWins = 0;
let computerWins = 0;
let draws = 0;
let totalGames = 0;

function updateScoreboard(user, computer) {
    // Only count actual games
    if (!choices.includes(user) || !choices.includes(computer)) return;

    totalGames++;

    if (user === computer) {
        draws++;
    } else if (
        (user === "rock" && computer === "scissors") ||
        (user === "paper" && computer === "rock") ||
        (user === "scissors" && computer === "paper")
    ) {
        userWins++;
    } else {
        computerWins++;
    }

    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById("user-wins").textContent = userWins;
    document.getElementById("computer-wins").textContent = computerWins;
    document.getElementById("draws").textContent = draws;
    document.getElementById("total-games").textContent = totalGames;
}

function showResult(user, computer) {
    const resultDiv = document.getElementById("result");

    if (user === computer) {
        resultDiv.textContent = "It's a draw!";
    } else if (
        (user === "rock" && computer === "scissors") ||
        (user === "paper" && computer === "rock") ||
        (user === "scissors" && computer === "paper")
    ) {
        resultDiv.textContent = "You win!";
    } else {
        resultDiv.textContent = "Computer wins!";
    }

    updateScoreboard(user, computer);
}

// Reset score button
document.getElementById("reset-score").addEventListener("click", () => {
    userWins = 0;
    computerWins = 0;
    draws = 0;
    totalGames = 0;
    updateScoreDisplay();
});

