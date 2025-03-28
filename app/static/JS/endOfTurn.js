// This script handles the end of a turn in a card game, updating scores and redirecting players based on the game state.

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
document.getElementById("userScore").textContent = `P1: ${userScore}`;
document.getElementById("player2Score").textContent = `P2: ${player2Score}`;

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

    // Switch turn after the round
    let nextTurn = sessionStorage.getItem("turn") === "player1" ? "player2" : "player1";
    sessionStorage.setItem("turn", nextTurn);

    // Redirect to the correct turn page
    setTimeout(() => {
        window.location.href = nextTurn === "player1" ? "/player1Turn" : "/player2Turn";
    }, 5000);

    setTimeout(() => {
        const previousUrl = document.referrer;

        // Check if the previous URL includes "pickUpCard"
        if (previousUrl.includes("pickUpCard")) {
            window.location.href = "/player1Turn"; 
        } else {
            // If not, navigate to "pass.html"
            window.location.href = "/pass"; 
        }
    }, 5000);

console.log("Winner:", winner);
console.log("User Score (Player 1):", userScore);
console.log("Player 2 Score:", player2Score);
}
