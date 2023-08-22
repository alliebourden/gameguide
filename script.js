let url = "https://api.boardgameatlas.com/api/search?"
const client_id = "JHVAsnwvSz"
let players = document.getElementById("players").value
let playtime = document.getElementById("playtime").value

fetch('https://api.boardgameatlas.com/api/search?min_players=${players}&max_playtime=${playtime}&order_by=rank&limit=6&client_id=JHVAsnwvSz')
    .then(res =>  {
        return res.json();
        })
    .then(data => console.log(data))
    .catch(error => console.log('ERROR'))

fetch('https://api.boardgameatlas.com/api/search?min_players=${players}&order_by=rank&limit=4&client_id=JHVAsnwvSz')
    .then(res =>  {
        return res.json();
        })
    .then(data => console.log(data))
    .catch(error => console.log('ERROR'))


fetch('https://api.boardgameatlas.com/api/search?order_by=rank&limit=4&client_id=JHVAsnwvSz')
    .then(res =>  {
        return res.json();
        })
    .then(data => console.log(data))
    .catch(error => console.log('ERROR'))

fetch('https://api.boardgameatlas.com/api/search?order_by=rank&limit=4&client_id=JHVAsnwvSz')
    .then(res => {
        return res.json();
    })
    .then(data => console.log(data))
    .catch(error => console.log('ERROR'))


    fetch('https://api.boardgameatlas.com/api/search?order_by=rank&limit=4&client_id=JHVAsnwvSz')
    .then(res =>  {
        if (res.ok) {
            console.log('Success')
        } else {
            console.log('Not Successful')
        }
    })