// nav bar script
const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');

hamburgerEl.addEventListener('click', () => {
	navEl.classList.toggle('nav--open');
	hamburgerEl.classList.toggle('hamburger--open');
})

// API url
const url = 'https://bgg-json.azurewebsites.net';

// globals
let games = [];
let sortByYearAscending = true;
let sortByNameAscending = true;
const resultsPerPage = 8;
let currentPage = 1;


getHotGames();

// Main fetch function
async function getHotGames() {
        const res = await fetch(`${url}/hot`);
        games = await res.json();
        displayGames(currentPage);
}

// display API data 
function displayGames(page) {
        const gameContainer = document.getElementsByClassName('hotgame-contain')[0];
        gameContainer.innerHTML = '';
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        for (let i = startIndex; i < endIndex && i < games.length; i++) {
                const gameId = games[i]["gameId"];
                const gameData = document.createElement('div');
                gameData.className = 'results';
                gameData.innerHTML = `<div class="card"><div class="imgBox"><img src="${games[i]["thumbnail"]}" alt="game photo" class="gamephoto"></div><div class="contentBox"><h2>${games[i]["name"]}</h2><h3 class="year">${games[i]["yearPublished"]}</h3><a href="game-details.html?gameId=${gameId}" class="learn">Learn More</a></div>`;
                gameContainer.appendChild(gameData);
              }
}
 
// Sort displayed data by year
document.getElementById('sortByYear').addEventListener('click', () => {
        sortByYearAscending = !sortByYearAscending;
        games.sort((a, b) => {
                if (sortByYearAscending) {
                        return a.yearPublished - b.yearPublished;
                } else {
                        return b.yearPublished - a.yearPublished;
                }
        });
        displayGames(currentPage);
})

// Sort displayed data by name
document.getElementById('sortByName').addEventListener('click', () => {
        sortByNameAscending = !sortByNameAscending;
        games.sort((a, b) => {
                if (sortByNameAscending) {
                        return a.name.localeCompare(b.name);
                } else {
                        return b.name.localeCompare(a.name);
                }
        });
        displayGames(currentPage);
})


document.getElementById('sortByHot').addEventListener('click', () => {
        getHotGames();
});

// Buttons to navigate the displayed results
document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
                currentPage--;
                displayGames(currentPage)
        }
})

document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(games.length / resultsPerPage);
        if (currentPage < totalPages) {
                currentPage++;
                displayGames(currentPage);
        }
})

// Learn More event listener
document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('learn')) {
          event.preventDefault();
          const gameId = event.target.getAttribute('href').split('=')[1];
          const newPageUrl = `game-details.html?gameId=${gameId}`;
          window.location.href = `game-details.html?gameId=${gameId}`;
        }
      })

// Get URL parameter to use in fetchGameDetails 
function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
}

// Fetch game details description
async function fetchGameDetails() {
        const gameDetailsContainer = document.getElementsByClassName('game-details')[0];
        gameDetailsContainer.innerHTML = '';
        const gameId = getUrlParameter('gameId');
        
        if (gameId) {
            const apiUrl = `${url}/thing/${gameId}`;
            
            try {
                const res = await fetch(apiUrl);
                
                if (res.ok) {
                    const gameDetails = await res.json();
                    const gameDetailsDiv = document.createElement('div');
                    gameDetailsDiv.className = 'results';
                    const description = gameDetails.description;
                    const maxCharacters = 250;
                    const shortDescription = description.length > maxCharacters
                        ? description.slice(0, maxCharacters) + '...'
                        : description;
                    gameDetailsDiv.innerHTML = `
                        <div class="game-info">
                            <img id="gameImage" src="${gameDetails.thumbnail}" alt="Game Image">
                            <h2 id="gameName">${gameDetails.name}</h2>
                            <div class="top-info">
                                <div class="players">
                                    <img src="images/people.png" id="people">
                                    <h5 id="players">Players: ${gameDetails.minPlayers} - ${gameDetails.maxPlayers}</h5>
                                </div>
                                <div class="playtime">
                                    <img src="images/clock.png" id="clock">
                                    <h5 id="playtime">Playtime: ${gameDetails.playingTime} minutes</h5>
                                </div>
                                <div class="mechanics">
                                    <img src="images/dice.png" id="dice">
                                    <h5>Mechanics:</h5>
                                    <select id="mechanicsDropdown"></select>
                                </div>
                            </div>
                            <p id="gameDescription">${shortDescription}</p>
                            ${description.length > maxCharacters
                                ? '<button id="read-more-btn">Read More</button>'
                                : ''}
                        </div>
                        <h1 class="gd-name">${gameDetails.name}</h1>
                        <p id="game-escription">${gameDetails.description}</p>
                        <img id="game-image" src="${gameDetails.image}" alt="Game Image">
                    `;
                    gameDetailsContainer.appendChild(gameDetailsDiv);
                    const mechanicsDropdown = document.getElementById('mechanicsDropdown');
                    mechanicsDropdown.innerHTML = '';
                    if (gameDetails.mechanics && gameDetails.mechanics.length > 0) {
                        for (const mechanic of gameDetails.mechanics) {
                            const option = document.createElement('option');
                            option.text = mechanic;
                            mechanicsDropdown.appendChild(option);
                        }
                    } else {
                        const defaultOption = document.createElement('option');
                        defaultOption.text = 'No mechanics available';
                        mechanicsDropdown.appendChild(defaultOption);
                    }
                    const gameDescription = document.getElementById('gameDescription');
                    gameDescription.innerHTML = shortDescription;
                    const readMoreButton = document.getElementById('read-more-btn');
                    let isFullDescriptionVisible = false;
                    
                    if (readMoreButton) {
                        readMoreButton.addEventListener('click', () => {
                            isFullDescriptionVisible = !isFullDescriptionVisible;
    
                            if (isFullDescriptionVisible) {
                                gameDescription.innerHTML = description;
                                readMoreButton.textContent = 'Read Less';
                            } else {
                                gameDescription.innerHTML = shortDescription;
                                readMoreButton.textContent = 'Read More';
                            }
                        });
                    }
                } else {
                    console.error('Failed to fetch game details');
                }
            } catch (error) {
                console.error('An error occurred while fetching game details:', error);
            }
        } else {
            console.error('No gameId parameter found in the URL');
        }}