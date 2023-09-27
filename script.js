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
let likedGameIds = getLikedGames();

// On page load Liked Games and Hot Games
displayLikedGames();
getHotGames();

// Main fetch function from API
async function getHotGames() {
        const res = await fetch(`${url}/hot`);
        games = await res.json();
        displayGames(currentPage);
}

// display API data for individual games
function displayGames(page) {
    const gameContainer = document.querySelector('.hotgame-contain');
    if (gameContainer) {
      const startIndex = (page - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;
      for (let i = startIndex; i < endIndex && i < games.length; i++) {
        const gameId = games[i]["gameId"];
        const isCurrentlyLiked = isGameLiked(gameId);
        const gameData = document.createElement('div');
        gameData.className = 'results';
        gameData.innerHTML = `<div class="card">
            <div class="imgBox">
                <img src="${games[i]["thumbnail"]}" alt="game photo" class="gamephoto">
            </div>
            <div class="contentBox">
                <h2>${games[i]["name"]}</h2>
                <h3 class="year">${games[i]["yearPublished"]}</h3>
                <span class="favorite${isGameLiked(gameId) ? ' liked' : ''}" data-game-id="${gameId}">
                    <span class="heart-icon${isGameLiked(gameId) ? ' liked' : ''}">${isCurrentlyLiked ? '❤️' : '🤍'}</span>
                </span>
                <a href="game-details.html?gameId=${gameId}" class="learn">Learn More</a>
            </div>
        </div>`;
        gameContainer.appendChild(gameData);
      }
    }
    const totalPages = Math.ceil(games.length / resultsPerPage);
    if (currentPage >= totalPages) {
      document.getElementById('loadMore').style.display = 'none';
    }
  }

// Code to handle the heart to toggle liked game
document.removeEventListener('click', handleFavoriteClick);

document.addEventListener('click', handleFavoriteClick);

function handleFavoriteClick(event) {
        const favoriteElement = event.target.closest('.favorite');
        if (favoriteElement) {
            event.preventDefault();
            const heartIcon = favoriteElement.querySelector('.heart-icon');
            const gameId = favoriteElement.getAttribute('data-game-id');
            const isLiked = favoriteElement.classList.contains('liked');
            if (!isLiked) {
                addGameToFavorites(gameId);
                favoriteElement.classList.add('liked');
                heartIcon.textContent = '❤️';
                console.log('red');
            } else {
                removeGameFromFavorites(gameId);
                favoriteElement.classList.remove('liked');
                heartIcon.textContent = '🤍';
                console.log('white');
            }
        }
    }

function isGameLiked(gameId) {
        return likedGameIds.includes(gameId);
};

function getLikedGames() {
        const likedGames = localStorage.getItem('likedGames');
        return likedGames ? JSON.parse(likedGames) : [];
};

function addGameToFavorites(gameId) {
        likedGameIds.push(gameId);
        localStorage.setItem('likedGames', JSON.stringify(likedGameIds));
        displayLikedGames();
    }

function removeGameFromFavorites(gameId) {
    const index = likedGameIds.indexOf(gameId);
    if (index !== -1) {
        likedGameIds.splice(index, 1);
        localStorage.setItem('likedGames', JSON.stringify(likedGameIds));
    }
    displayLikedGames();
}

// Learn More event listener
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('learn')) {
      event.preventDefault();
      const gameId = event.target.getAttribute('href').split('=')[1];
      const newPageUrl = `game-details.html?gameId=${gameId}`;
      window.location.href = `game-details.html?gameId=${gameId}`;
    }
  })


 
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

// View games by hotness (trending)
document.getElementById('sortByHot')?.addEventListener('click', () => {
        getHotGames();
});

// Load an additional 8 more games to the page
document.getElementById('loadMore').addEventListener('click', () => {
    currentPage++;
    displayGames(currentPage);
});

// Display Liked Games in library
async function displayLikedGames() {
    const likedGamesContainer = document.getElementById('likedGamesContainer');
    if (likedGamesContainer) {
        likedGamesContainer.innerHTML = '';
        const likedGames = getLikedGames();

        for (const gameId of likedGames) {
            const gameData = await fetchGameDetails(gameId);
            if (gameData) {
                const gameElement = document.createElement('div');
                gameElement.className = 'liked-game';
                gameElement.innerHTML = `<div class="liked-game-info">
                    <img src="${gameData.thumbnail}" alt="Game Thumbnail" class="liked-game-thumbnail">
                    <div class="liked-game-details">
                        <h4>${gameData.name}</h4>
                        <a href="game-details.html?gameId=${gameId}" class="learn">Learn More</a>
                    </div>
                </div>`;
                likedGamesContainer.appendChild(gameElement);
            }
        }
    }
}

// Fetch the details for the liked game
async function fetchGameDetails(gameId) {
    const apiUrl = `${url}/thing/${gameId}`;
    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const gameDetails = await res.json();
            return gameDetails;
        } else {
            console.error('Failed to fetch game details');
            return null;
        }
    } catch (error) {
        console.error('An error occurred while fetching game details:', error);
        return null;
    }
}