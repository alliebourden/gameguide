fetch('https://api.boardgameatlas.com/api/search?order_by=rank&ascending=false&client_id=JHVAsnwvSz')
    .then(res => res.json())
    .then(data => console.log(data))