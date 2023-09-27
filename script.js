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

displayLikedGames();
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
    };

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