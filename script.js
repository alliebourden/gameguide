// nav bar script
const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');

hamburgerEl.addEventListener('click', () => {
	navEl.classList.toggle('nav--open');
	hamburgerEl.classList.toggle('hamburger--open');
})

const url = 'https://bgg-json.azurewebsites.net';

var hotGames = [];

fetch(`${url}/hot`)
    .then(res => res.json())
    .then(json => json.forEach(obj =>
        { let hotGame = {};
        hotGame.name = obj.name;
        hotGame.year = obj.yearPublished;
        hotGame.url = obj.thumbnail;
        hotGames.push(hotGame);
        // console.log(hotGames)
        // console.log(hotGame)
        }));



// const getHotGames = async () => {
//     try {
//         const res = await fetch(`${url}/hot`);
//         const hotgames = await res.json();
//         return hotgames
//     } catch (err) {
//         console.log(err)
//     }
// }
    

// function getHotGames() {
//         fetch('https://bgg-json.azurewebsites.net/hot')
//         .then(res => {
//             if (!res.ok) {
//                 throw Error("ERROR");
//             }
//             return res.json();
//         })
//         .then(data => {
//             console.log(data);
//             const html = data.map(game => {
//                 return `
//                 <div class="game">
//                     <h4>${game.name}</h4>
//                     <img src="${game.thumbnail}"></img>
//                     <p>${game.yearPublished}</p>
//                 </div>
//                 `;
//             }).join('');
//             document
//                 .querySelector('#hotgame')
//                 .insertAdjacentHTML("afterbegin", html);
//         })
//         .catch(error => {
//             console.log(error);
//         });
//     }


// const getHotGames = async () => {
//     try {
//         const res = await fetch(`${url}/hot`);
//         const hotgames = await res.json();
//         return hotgames;
//     } catch (err) {
//         console.log(err)
//     }
// }

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

// const hotgames = getHotGames();

// async function getHotGames() {
//     try {
//     const res = await fetch('https://bgg-json.azurewebsites.net/hot');
//     data = await res.json();
//     console.log(data);
//     return data;
//     } catch (err) {
//         console.log(err)
//         }
// }



// async function getHotGames() {
//     try {
//     const res = await fetch('https://bgg-json.azurewebsites.net/hot');
//     data = await res.json();
//     const html = data.map(game => {
//         return `
//             <img src="${game.thumbnail}"></img>
//             <h3>${game.name}</h3>
//             <p>${game.yearPublished}</p>
//         `;
//         }).join('');
//         console.log(html);
//         document
//             .querySelector('#hotgame')
//             .insertAdjacentHTML("afterbegin", html);
//     } catch (err) {
//         console.log(err)
//         }
// }


// function getHotGames() {
//     fetch('https://bgg-json.azurewebsites.net/hot')
//     .then(res => {
//         if (!res.ok) {
//             throw Error("ERROR");
//         }
//         return res.json();
//     })
//     .then(data => {
//         console.log(data);
//         const html = data.map(game => {
//             return `
//             <div class="game">
//                 <h4>${game.name}</h4>
//                 <img src="${game.thumbnail}"></img>
//                 <p>${game.yearPublished}</p>
//             </div>
//             `;
//         }).join('');
//         console.log(html);
//         document
//             .querySelector('#hotgame')
//             .insertAdjacentHTML("afterbegin", html);
//     })
//     .catch(error => {
//         console.log(error);
//     });
// }