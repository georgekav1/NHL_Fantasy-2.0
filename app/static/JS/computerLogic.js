
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
    console.log("Computer chose:", statId, userChoice);
    document.getElementById("displayChoice-text").textContent = `The computer selected ${statId} and chose ${userChoice}.`;
    return [statId, userChoice];
}

function turn(stat){
    console.log("called turn");
    console.log(stat);
    setTimeout(() =>{
        compare_stats(stat[0], stat[1]);
    } ,5000 );
    console.log("compared stats SHOULDNT GET HERE");
}

