// nav bar script
const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');

hamburgerEl.addEventListener('click', () => {
    toggleMenu();
});


document.addEventListener('click', (event) => {
    if (!isInsideMenu(event.target)) {
        closeMenu();
    }
});

window.addEventListener('scroll', () => {
    closeMenu();
});

function isInsideMenu(element) {
    return navEl.contains(element) || hamburgerEl.contains(element);
}

function closeMenu() {
    if (navEl.classList.contains('nav--open')) {
        navEl.classList.remove('nav--open');
        hamburgerEl.classList.remove('hamburger--open');
    }
}

function toggleMenu() {
    navEl.classList.toggle('nav--open');
    hamburgerEl.classList.toggle('hamburger--open');
}

// API url
const url = 'https://bgg-json.azurewebsites.net';

// globals
let games = [];
let sortByYearAscending = true;
let sortByNameAscending = true;
let sortByRankAscending = true;
let currentPage = 1;
let cardsPerPage = 8
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
        gameContainer.innerHTML = '';
        const startIndex = (page - 1) * cardsPerPage;
        const totalGames = games.length;
        
        for (let i = 0; i < cardsPerPage; i++) {
            const gameIndex = (startIndex + i) % totalGames;
            const gameId = games[gameIndex]["gameId"];
            const isCurrentlyLiked = isGameLiked(gameId);
            const gameData = document.createElement('div');
            gameData.className = 'results';
            gameData.innerHTML = `<div class="card">
                <div class="imgBox">
                    <img src="${games[gameIndex]["thumbnail"]}" alt="game photo" class="gamephoto">
                </div>
                <div class="contentBox">
                    <h3>${games[gameIndex]["name"]}</h3><span class="favorite${isGameLiked(gameId) ? ' liked' : ''}" data-game-id="${gameId}">
                    <span class="heart-icon${isGameLiked(gameId) ? ' liked' : ''}">${isCurrentlyLiked ? '❤️' : '🤍'}</span>
                </span>
                    <h3 class="year">${games[gameIndex]["yearPublished"]}</h3>
                    <a href="game-details.html?gameId=${gameId}" class="learn">Learn More</a>
                </div>
            </div>`;
            gameContainer.appendChild(gameData);
        }
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
        return likedGameIds.includes(gameId.toString());
};

function getLikedGames() {
        const likedGames = localStorage.getItem('likedGames');
        return likedGames ? JSON.parse(likedGames) : [];
};

function addGameToFavorites(gameId) {
    if (isGameLiked(gameId) === false) {
        likedGameIds.push(gameId);
        localStorage.setItem('likedGames', JSON.stringify(likedGameIds));
    }
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

// Display Liked Games in library
async function displayLikedGames() {
    const likedGamesContainer = document.getElementsByClassName('likedGamesContainer')[0];
    if (likedGamesContainer) {
        likedGamesContainer.innerHTML = '';
        const likedGames = getLikedGames();

        for (const gameId of likedGames) {
            const gameData = await fetchGameDetails(gameId);
            if (gameData) {
                const isCurrentlyLiked = isGameLiked(gameId);
                const gameElement = document.createElement('div');
                gameElement.className = 'liked-game';
                gameElement.innerHTML = `
                <div class="liked-game-info">
                    <div id="likedThumbnail">
                        <img src="${gameData.thumbnail}" alt="Game Thumbnail" class="liked-game-thumbnail">
                    </div>
                    <div id="liked-game-other">
                        <h3>${gameData.name}</h3>
                        <div class="liked-page-heart"><span class="favorite${isGameLiked(gameId) ? ' liked' : ''}" data-game-id="${gameId}">
                        <span class="heart-icon${isGameLiked(gameId) ? ' liked' : ''}">${isCurrentlyLiked ? '❤️' : '🤍'}</span>
                        </span></div>
                        <a href="game-details.html?gameId=${gameId}" class="learn-liked">Learn More</a>
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
