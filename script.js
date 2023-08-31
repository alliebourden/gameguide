// nav bar script
const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');

hamburgerEl.addEventListener('click', () => {
	navEl.classList.toggle('nav--open');
	hamburgerEl.classList.toggle('hamburger--open');
})

const url = 'https://bgg-json.azurewebsites.net';

const getHotGames = async () => {
    try {
        const res = await fetch(`${url}/hot`);
        const hotgames = await res.json();
        return hotgames;
    } catch (err) {
        console.log(err)
    }
}

const hotgames = getHotGames();

// getHotGames().then(r => {
//     let i = 0;
//     let limit = 10;
//     r.forEach(hotgame => {
//         if (i < limit) {
//             let name = document.getElementById(`name${i}`);
//             name.innerHTML = hotgame.name;
//             i++;
//         }    
//     })
//     } )

// getHotGames().then(r => {
//     let i = 0;
//     let limit = 10;
//     r.forEach(hotgame => {
//         if (i < limit) {
//             let year = document.getElementById(`year${i}`);
//             year.innerHTML = hotgame.yearPublished;
//             i++;
//         }    
//     })
//     } )


function getData() {
    fetch('https://bgg-json.azurewebsites.net/hot')
    .then(res => {
        if (!res.ok) {
            throw Error("ERROR");
        }
        return res.json();
    })
    .then(data => {
        console.log(data);
        const html = data.map(game => {
            return `
            <div class="game">
                <h4>${game.name}</h4>
                <img src="${game.thumbnail}"></img>
                <p>${game.yearPublished}</p>
            </div>
            `;
        }).join('');
        console.log(html);
        document
            .querySelector('#hotgame')
            .insertAdjacentHTML("afterbegin", html);
    })
    .catch(error => {
        console.log(error);
    });
}

