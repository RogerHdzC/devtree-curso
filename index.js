import express from 'express'

const app = express();

// Routing
app.get('/', (request, response) => {
    response.send('Home')
})

const port = process.env.PORT || 4000

app.listen(port, () => {})