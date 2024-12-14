import express from 'express'

const app = express()

// Routing
app.get('/', (request, response) => {
    response.send('Home')
})

export default app