import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount } from './handlers'

const router = Router()

/** Auth and Register */
router.post('/auth/register', 
    body('handle').
        notEmpty().
        withMessage('El handle no puede ir vacío'),
    body('name').
        notEmpty().
        withMessage('El name no puede ir vacío'),
    body('password').
        isLength({min: 8}).
        withMessage('El password es muy corto, mínumo 8 caracteres'),
    body('email').
        isEmail().
        withMessage('El mail no es válido'),
    createAccount)

export default router