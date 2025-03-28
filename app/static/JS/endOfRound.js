// Retrieve target score from sessionStorage
let targetScore = parseInt(sessionStorage.getItem("targetScore")) || 10; 
document.getElementById("firstToX").textContent = `First to: ${targetScore}`;

// Retrieve previous scores or initialize them
let userScore = parseInt(sessionStorage.getItem("userScore")) || 0;
let computerScore = parseInt(sessionStorage.getItem("computerScore")) || 0;

const urlParams = new URLSearchParams(window.location.search);
const winner = parseInt(urlParams.get("winner"));

if (winner === 0) {
    userScore++;
} else if (winner === 1) {
    computerScore++;
} else if(winner !== 3) {
    console.error("Invalid score increment value");
}

// Store updated scores in sessionStorage
sessionStorage.setItem("userScore", userScore);
sessionStorage.setItem("computerScore", computerScore);
//sessionStorage.setItem("roundWinner", roundWinner);

// Update displayed scores
document.getElementById("userScore").textContent = `User: ${userScore}`;
document.getElementById("computerScore").textContent = `CPU: ${computerScore}`;

// Check if the game is over
if (userScore>= targetScore || computerScore >= targetScore) {

    // Redirect to gameOver.html
    window.location.href = "/gameOver";
} else {
    // Otherwise, display round result and go back to card.html after 5 seconds
    const resultMessage = document.getElementById("resultMessage");
    if (winner === 0) {
        resultMessage.textContent = "Congratulations! You won this round!";
    } else if (winner === 1) {
        resultMessage.textContent = "The computer won this round. Better luck next time!";
    } else {
        resultMessage.textContent = "It's a tie!";
    }

    setTimeout(() => { 
        const previousUrl = document.referrer;
        if (previousUrl.includes("pickUpCard")) {
            window.location.href = "/card"; 
        }
        window.location.href = "/pickUpCard"; 
    }, 5000);
}
