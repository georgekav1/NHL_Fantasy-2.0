const proxyUrl = "/proxy/";
const topPlayersApi = proxyUrl + "https://api-web.nhle.com/v1/skater-stats-leaders/20242025/2?categories=goals&limit=75";

async function fetchPlayer(){
    
    const lastUpdated = localStorage.getItem('lastUpdated');
    const now = new Date();

    if (!lastUpdated || (now - new Date(lastUpdated) || localStorage.getItem("playerIds").length == 0) > 24 * 60 * 60 * 1000) {

        const response = await fetch(topPlayersApi);
        const data = await response.json();
        
        const playerIds = data.goals.map(player => player.id);
        
        localStorage.setItem('playerIds', JSON.stringify(playerIds));
        localStorage.setItem('lastUpdated', now);
        console.log("data updated");

    } else {
        console.log('Data is up to date.');   
    }
    localStorage.setItem('usedPlayers', null)
    console.log("used to null");
}

fetchPlayer();
