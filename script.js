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
        if (gameContainer) {
        gameContainer.innerHTML = '';
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        function isGameLiked(gameId) {
                const likedGames = getLikedGames();
                return likedGames.includes(gameId);
              }
        for (let i = startIndex; i < endIndex && i < games.length; i++) {
                const gameId = games[i]["gameId"];
                const gameData = document.createElement('div');
                gameData.className = 'results';
                gameData.innerHTML = `<div class="card">
                                        <div class="imgBox">
                                                <img src="${games[i]["thumbnail"]}" alt="game photo" class="gamephoto">
                                        </div>
                                        <div class="contentBox"><h2>${games[i]["name"]}</h2><h3 class="year">${games[i]["yearPublished"]}</h3><a href="game-details.html?gameId=${gameId}" class="learn">Learn More</a>
                                        </div>
                                        <span class="favorite${isGameLiked(gameId) ? ' liked' : ''}" data-game-id="${gameId}">&#x2665;</span>
                                        </div>`;
                gameContainer.appendChild(gameData);
              }
}};

document.addEventListener('click', (event) => {
        if (event.target.classList.contains('favorite')) {
          event.preventDefault();
          const gameId = event.target.getAttribute('data-game-id');
          const isLiked = isGameLiked(gameId);
          if (isLiked) {
            removeGameFromFavorites(gameId);
          } else {
            addGameToFavorites(gameId);
          }
          event.target.classList.toggle('liked', !isLiked);
        }
      });

function isGameLiked(gameId) {
        const likedGames = getLikedGames();
        return likedGames.includes(gameId);
};

function getLikedGames() {
        const likedGames = localStorage.getItem('likedGames');
        return likedGames ? JSON.parse(likedGames) : [];
};

function addGameToFavorites(gameId) {
        const likedGames = getLikedGames();
        likedGames.push(gameId);
        localStorage.setItem('likedGames', JSON.stringify(likedGames));
};

function removeGameFromFavorites(gameId) {
        const likedGames = getLikedGames();
        const index = likedGames.indexOf(gameId);
        if (index !== -1) {
          likedGames.splice(index, 1);
          localStorage.setItem('likedGames', JSON.stringify(likedGames));
        }
      };

 
// Sort displayed data by year
document.getElementById('sortByYear')?.addEventListener('click', () => {
        sortByYearAscending = !sortByYearAscending;
        games.sort((a, b) => {
                if (sortByYearAscending) {
                        return a.yearPublished - b.yearPublished;
                } else {
                        return b.yearPublished - a.yearPublished;
                }
        });
        displayGames(currentPage);
});

// Sort displayed data by name
document.getElementById('sortByName')?.addEventListener('click', () => {
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


document.getElementById('sortByHot')?.addEventListener('click', () => {
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