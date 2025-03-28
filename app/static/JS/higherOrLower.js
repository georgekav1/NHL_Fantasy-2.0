let selectedStat = ""; // Variable to store the selected stat
let userChoice = ""; // Variable to store the user's choice (Higher or Lower)



// Select all elements with the class "higherOrLower"
const statElements = document.querySelectorAll('.higherOrLower');

// function penguin_attack() {
//     setTimeout(() => {
//         document.getElementById('penguin').src = "../../static/images/loading-bar.gif";
//         setTimeout(() => {
//             document.getElementById('penguin').src = ""; // Hide the gif by clearing the src

//             // Hide the higherOrLowerBox when the GIF is hidden
//             const higherOrLowerBox = document.querySelector('.higherOrLowerBox');
//             higherOrLowerBox.style.display = 'none';
//         }, 4000);
//     }, 500);
//     on_computer_turn();
// }

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

// Add event listeners for the "Higher" and "Lower" buttons
document.getElementById('higherChosen').addEventListener('click', () => {
    userChoice = "Higher";
    console.log("User chose:", userChoice);

    const userSelectionText = document.querySelector('.userSelection');
    userSelectionText.textContent = `You selected ${selectedStat} and chose ${userChoice}.`;

    setTimeout(() => {
        hideHigherOrLowerBox(); // Hide the box after 3 seconds
    }, 3000);

    on_computer_turn();
});

document.getElementById('lowerChosen').addEventListener('click', () => {
    userChoice = "Lower";
    console.log("User chose:", userChoice);

    const userSelectionText = document.querySelector('.userSelection');
    userSelectionText.textContent = `You selected ${selectedStat} and chose ${userChoice}.`;

    setTimeout(() => {
        hideHigherOrLowerBox(); // Hide the box after 3 seconds
    }, 3000);

    on_computer_turn();
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
            console.log("Selected stat:", selectedStat);
            showHigherOrLowerBox(); // Show the box when a stat is selected

            const statText = document.querySelector('.higherOrLowerBox h2');
            statText.textContent = `${selectedStat} Selected, Higher or Lower?`;
        }
    });
});
