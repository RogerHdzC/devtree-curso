import { response, Router } from 'express'

const router = Router()

/** Auth and Register */
router.post('/auth/register', (request, response) => {
    console.log("Register")
})

export default router