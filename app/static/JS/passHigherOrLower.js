let selectedStat = ""; // Variable to store the selected stat
let userChoice = ""; // Variable to store the user's choice (Higher or Lower)
let statId = "";

// Select all elements with the class "higherOrLower"
const statElements = document.querySelectorAll('.higherOrLower');

// Function to show the higherOrLowerBox and adjust column widths
function showHigherOrLowerBox() {
    const higherOrLowerBox = document.querySelector('.higherOrLowerBox');
    const middleColumn = document.querySelector('.column-card-middle');
    const leftColumn = document.querySelector('.column-card-left');
    const rightColumn = document.querySelector('.column-card-right');

    higherOrLowerBox.style.display = 'block';
    middleColumn.style.width = '20%'; // Set the middle column width to 20%
    leftColumn.style.width = '40%'; // Set the left column width to 40%
    rightColumn.style.width = '40%'; // Set the right column width to 40%
}

// Function to hide the higherOrLowerBox and reset column widths
function hideHigherOrLowerBox() {
    const higherOrLowerBox = document.querySelector('.higherOrLowerBox');
    const middleColumn = document.querySelector('.column-card-middle');
    const leftColumn = document.querySelector('.column-card-left');
    const rightColumn = document.querySelector('.column-card-right');

    higherOrLowerBox.style.display = 'none';
    middleColumn.style.width = '0'; // Reset the middle column width to 0
    leftColumn.style.width = '50%'; // Reset the left column width to 50%
    rightColumn.style.width = '50%'; // Reset the right column width to 50%
}

function compare_stats(stat, choice) {
    console.log("compare_stats called", stat, choice);

    let turn = sessionStorage.getItem("turn"); // Check whose turn it is
    console.log("Current Turn:", turn);

    let playerStat, opponentStat;

    if (turn === "player1") {
        playerStat = `player-${stat}`;
        opponentStat = `opp-${stat}`;
    } else {
        playerStat = `opp-${stat}`;
        opponentStat = `player-${stat}`;
    }

    if (stat === "height") {
        let heightText = document.getElementById(playerStat).textContent.trim();
        let [feet, inches] = heightText.split(' ').filter(part => part !== 'ft' && part !== 'in').map(Number);
        user = feet * 12 + (inches || 0);
        
        heightText = document.getElementById(opponentStat).textContent.trim();
        [feet, inches] = heightText.split(' ').filter(part => part !== 'ft' && part !== 'in').map(Number);
        opp = feet * 12 + (inches || 0);
    } else {
        user = parseFloat(document.getElementById(playerStat).textContent.trim());
        opp = parseFloat(document.getElementById(opponentStat).textContent.trim());
    }

    if (isNaN(user) || isNaN(opp)) { 
        console.error("Invalid stat value");
        return;
    }

    let winner;
    if (choice === "Higher") {
        winner = user > opp ? (turn === "player1" ? 0 : 1) : (opp > user ? (turn === "player1" ? 1 : 0) : 3);
    } else {
        winner = user < opp ? (turn === "player1" ? 0 : 1) : (opp < user ? (turn === "player1" ? 1 : 0) : 3);
    }
    
    window.location.href = `/endOfTurn?winner=${winner}`;
}

// Add event listeners for the "Higher" and "Lower" buttons
document.getElementById('higherChosen').addEventListener('click', () => {
    userChoice = "Higher";
    console.log("User chose:", userChoice);

    const userSelectionText = document.querySelector('.userSelection');
    userSelectionText.textContent = `You selected ${selectedStat} and chose ${userChoice}.`;

    on_computer_turn();

    setTimeout(() => {
        hideHigherOrLowerBox(); // Hide the box after 3 seconds
    }, 3000);

    sessionStorage.setItem("lastTurn", "user");
    
    setTimeout(() => {
        compare_stats(statId,userChoice);
    }, 10000);
});

document.getElementById('lowerChosen').addEventListener('click', () => {
    userChoice = "Lower";
    console.log("User chose:", userChoice);

    const userSelectionText = document.querySelector('.userSelection');
    userSelectionText.textContent = `You selected ${selectedStat} and chose ${userChoice}.`;

    on_computer_turn();

    setTimeout(() => {
        hideHigherOrLowerBox(); // Hide the box after 3 seconds
    }, 3000);
    sessionStorage.setItem("lastTurn", "user");
    
    setTimeout(() => {
        compare_stats(statId,userChoice);
    }, 10000);
});

// Add a click event listener to each stat element
statElements.forEach(element => {
    element.addEventListener('click', (event) => {
        const clickedStat = event.target.getAttribute('data-stat');

        if (selectedStat === clickedStat) {
            hideHigherOrLowerBox(); // Hide the box if the same stat is clicked again
            selectedStat = "";
            const userSelectionText = document.querySelector('.userSelection');
            userSelectionText.textContent = "";
        } else {
            selectedStat = clickedStat;
            statId = event.target.id.split('-')[1];
            console.log("Selected stat:", selectedStat);
            console.log("Selected stat id:", statId);
            showHigherOrLowerBox(); // Show the box when a stat is selected

            const statText = document.querySelector('.higherOrLowerBox h2');
            statText.textContent = `${selectedStat} Selected, Higher or Lower?`;
        }
    });
});
