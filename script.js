const url = 'https://bgg-json.azurewebsites.net';

const getHotGames = async () => {
    try {
        const res = await fetch(`${url}/hot`);
        const hotgames = await res.json();
        let limit = 10;
        let i = 0
        hotgames.forEach(hotgame => {
            if (i < limit) {
                console.log(hotgame.name);
            }
            i++;
        });
    } catch (err) {
        console.log(err)
    }
}

