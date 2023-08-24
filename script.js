const url = "https://bgg-json.azurewebsites.net";

async function getHotGames() {
    const res = await fetch(`${url}/hot`);
    console.log(res);
    const hotgames = await res.json();
    console.log(hotgames);
}