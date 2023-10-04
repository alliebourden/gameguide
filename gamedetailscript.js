// nav bar script
const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');

hamburgerEl.addEventListener('click', () => {
	navEl.classList.toggle('nav--open');
	hamburgerEl.classList.toggle('hamburger--open');
})

// API url
const url = 'https://bgg-json.azurewebsites.net';


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
                                    <input type="checkbox" id="mechs">
                                        <label for="mechs" class="first"><h5>Click for Mechanics</h5></label>
                                            <ul>
                                                <li>${gameDetails.mechanics}</li>
                                            </ul>
                            </div>
                        </div>    
                        <p id="gameDescription">${shortDescription}</p>
                        ${description.length > maxCharacters
                            ? '<button id="read-more-btn">Read More</button>'
                            : ''}
                    </div>
                `;
                gameDetailsContainer.appendChild(gameDetailsDiv);
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
    }
}
