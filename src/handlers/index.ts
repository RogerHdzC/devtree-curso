import { Request, Response } from "express"
import { validationResult } from 'express-validator'
import slug from 'slug'
import User from "../models/User"
import { hashPassword } from "../utils/auth"

export const createAccount = async (request: Request, response: Response) => {

    let errors = validationResult(request)
    if(!errors.isEmpty()){
        response.status(400).json({errors: errors.array()})
        return
    }

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