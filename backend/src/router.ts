import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, login, updateProfile, uploadImage } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'

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
    handleInputErrors,
    createAccount)

router.post('/auth/login',
    body('password').
        notEmpty().
        withMessage('El password es obligatorio'),
    body('email').
        isEmail().
        withMessage('El mail no es válido'),
    handleInputErrors,
    login
)

router.get('/user', authenticate ,getUser)
router.patch('/user', 
    body('handle').
        notEmpty().
        withMessage('Handle is required'),
    body('description').
        notEmpty().
        withMessage('Description is required'),
    handleInputErrors,
    authenticate,
    updateProfile
)

router.post('/user/image', authenticate, uploadImage)
export default router