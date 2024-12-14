const express = require('express');

const app = express();

// Routing
app.get('/', (request, response) => {
    response.send('Home')
})

app.listen(4000, () => {
    
})