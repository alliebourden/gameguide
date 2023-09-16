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

function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
}

async function fetchGameDetails() {
        console.log('hello')
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
                    gameDetailsDiv.innerHTML = `
                        <img id="gameImage" src="${gameDetails.thumbnail}" alt="Game Image">
                        <div class="game-info">
                        <h2>${gameDetails.name}</h2>
                        <p id="gameDescription">${gameDetails.description}</p>
                        </div>
                    `;
                    gameDetailsContainer.appendChild(gameDetailsDiv);
                } else {
                    console.error('Failed to fetch game details');
                }
            } catch (error) {
                console.error('An error occurred while fetching game details:', error);
            }
        } else {
            console.error('No gameId parameter found in the URL');
        }
    }