// Function to show the loading GIF and adjust column widths
function showLoadingGif() {
    const middleColumn = document.querySelector('.column-card-middle');
    const leftColumn = document.querySelector('.column-card-left');
    const rightColumn = document.querySelector('.column-card-right');
    const loadingGif = document.querySelector('.computer-choice');
    const displayChoiceBox = document.querySelector('.displayChoice');

    middleColumn.style.width = '10%'; // Set the middle column width to 20%
    leftColumn.style.width = '45%'; // Set the left column width to 40%
    rightColumn.style.width = '45%'; // Set the right column width to 40%
    loadingGif.style.display = 'block'; // Show the loading GIF
    displayChoiceBox.style.display = 'none'; // Hide the displayChoice box initially
}

// Function to hide the loading GIF and show the displayChoice box
function hideLoadingGif() {
    const middleColumn = document.querySelector('.column-card-middle');
    const loadingGif = document.querySelector('.computer-choice');
    const displayChoiceBox = document.querySelector('.displayChoice');

    loadingGif.style.display = 'none'; // Hide the loading GIF

    on_computer_turn(); // Show the stats immediately after the GIF disappears

    setTimeout(() => {
        displayChoiceBox.style.display = 'block'; // Show the displayChoice box
    }, 3000); // 2-second delay
}

// Call the functions to show and hide the loading GIF with a delay
showLoadingGif();

setTimeout(async() => {
    await hideLoadingGif();
    sessionStorage.setItem("lastTurn", "computer");
    console.log("about to run turn");
    setTimeout(() =>{
        turn(choiceSelector());
    }
    , 5000);
    console.log("ran turn");

}, 5000); // 5-second delay to simulate the computer's turn

