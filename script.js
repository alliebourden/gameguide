fetch('https://api.boardgameatlas.com/api/search?order_by=rank&limit=4&client_id=JHVAsnwvSz')
    .then(res =>  {
        if (res.ok) {
            console.log('Success')
        } else {
            console.log('Not Successful')
        }
    })
    .then(data => console.log(data))
    .catch(error => console.log('ERROR'))


fetch('https://api.boardgameatlas.com/api/search?order_by=rank&limit=4&client_id=JHVAsnwvSz')
    .then(res =>  {
        return res.json();
        })
    .then(data => console.log(data))
    .catch(error => console.log('ERROR'))