import { Request, Response } from "express"
import slug from 'slug'
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt"

export const createAccount = async (request: Request, response: Response) => {

    const {email, password} = request.body
    const userExists = await User.findOne({email})
    if(userExists){
        const error = new Error('El Usuario ya esta registrado')
        response.status(409).json({error: error.message})
        return;
    }
    const handle = slug(request.body.handle, '')
    const handleExists = await User.findOne({handle})
    if(handleExists){
        const error = new Error('Nombre de usuario no disponible')
        response.status(409).json({error: error.message})
        return;
    }
    const user = new User(request.body)
    user.password = await hashPassword(password)
    user.handle = handle
    await user.save()

    response.status(201).send('Registro Creado Correctamente')
}

export const login = async (request: Request, response: Response) =>{

    const {email, password} = request.body
    const user = await User.findOne({email})
    if(!user){
        const error = new Error('El Usuario no existe')
        response.status(404).json({error: error.message})
        return;
    }
    const isPasswordCorrect = await checkPassword(password, user.password)
    if(!isPasswordCorrect){
        const error = new Error('Wrong Password')
        response.status(401).json({error: error.message})
        return;
    }

    generateJWT({id: user.id})

    response.send("Auth")

}