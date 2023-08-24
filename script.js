const url = 'https://bgg-json.azurewebsites.net';

const getHotGames = async () => {
    try {
        const res = await fetch(`${url}/hot`);
        const hotgames = await res.json();
        console.log(hotgames);
    } catch (err) {
        console.log(err)
    }
}

