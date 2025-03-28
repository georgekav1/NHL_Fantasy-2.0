// Retrieve target score from sessionStorage
let targetScore = parseInt(sessionStorage.getItem("targetScore")) || 10; 
document.getElementById("firstToX").textContent = `First to: ${targetScore}`;

// Retrieve previous scores or initialize them
let userScore = parseInt(sessionStorage.getItem("userScore")) || 0;
let player2Score = parseInt(sessionStorage.getItem("player2Score")) || 0;

// Retrieve winner from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const winner = parseInt(urlParams.get("winner")); // 0 = Player 1, 1 = Player 2, 3 = Tie

// Update scores based on the winner
if (winner === 0) {
    userScore++;
} else if (winner === 1) {
    player2Score++;
} else if (winner !== 3) {
    console.error("Invalid score increment value");
}

// Store updated scores in sessionStorage
sessionStorage.setItem("userScore", userScore);
sessionStorage.setItem("player2Score", player2Score);

// Update displayed scores
document.getElementById("userScore").textContent = `Player 1: ${userScore}`;
document.getElementById("player2Score").textContent = `Player 2: ${player2Score}`;

// Check if the game is over
if (userScore >= targetScore || player2Score >= targetScore) {
    // Redirect to gameOver.html
    window.location.href = "/gameOver";
} else {
    // Otherwise, display round result and go back to the appropriate turn after 5 seconds
    const resultMessage = document.getElementById("resultMessage");
    if (winner === 0) {
        resultMessage.textContent = "Congratulations! Player 1 won this round!";
    } else if (winner === 1) {
        resultMessage.textContent = "Congratulations! Player 2 won this round!";
    } else {
        resultMessage.textContent = "It's a tie!";
    }

    setTimeout(() => { 
        // Redirect to the appropriate turn
        if (sessionStorage.getItem("gameMode") === "passAndPlay") {
            // Alternate turns between Player 1 and Player 2
            const previousTurn = sessionStorage.getItem("previousTurn");
            if (previousTurn === "player1") {
                sessionStorage.setItem("previousTurn", "player2");
                window.location.href = "/player2Turn";
            } else {
                sessionStorage.setItem("previousTurn", "player1");
                window.location.href = "/player1Turn";
            }
        } else {
            // Default behavior for other game modes
            window.location.href = "/pass";
        }
    }, 5000);
}