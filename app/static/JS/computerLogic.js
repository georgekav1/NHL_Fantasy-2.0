
function choiceSelector(){

    switch (Math.floor(Math.random() * 6)) {
        case 0:
            statId = "height";
            break;
        case 1:
            statId = "weight";
            break;
        case 2:
            statId = "gamesPlayed";
            break;
        case 3:
            statId = "goals";
            break;
        case 4:
            statId = "assists";
            break;
        case 5:
            statId = "shootingPctg";
            break;
        default:
            console.error("Invalid stat selection");
            break;
    }

    if(Math.floor(Math.random() * 2) == 0){
        userChoice = "Higher";
    }else{
        userChoice = "Lower";
    }
    console.log("Computer chose:", selectedStat, userChoice);
    document.getElementById("display-choice-text").textContent = `The computer selected ${selectedStat} and chose ${userChoice}.`;
    return [statId, userChoice];
}

function turn(stat, choice){
    compare_stats(stat, choice);
}

setTimeout(() => {
    turn(choiceSelector());
}
, 10000);