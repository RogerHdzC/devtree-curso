import { Router } from 'express'

const router = Router()

// Routing
router.get('/', (request, response) => {
    response.send('Home')
})

router.get('/nosotros', (request, response) => {
    response.send('Nosotros')
})
router.get('/blog', (request, response) => {
    response.send('Blog')
})

export default router