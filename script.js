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

let output = document.getElementById('output')

getHotGames().then(r => {
    let i = 0;
    let limit = 10;
    r.forEach(hotgame => {
        if (i < limit) {
            let output = document.getElementById(`output${i}`);
            output.innerHTML = hotgame.name;
            i++;
        }    
    })
    } )