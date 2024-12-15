import { Request, Response } from "express"
import User from "../models/User"

export const createAccount = async (request: Request, response: Response) => {
    const {email} = request.body
    const userExists = await User.findOne({email})
    if(userExists){
        const error = new Error('El Usuario ya esta registrado')
        response.status(409).json({error: error.message})
        return;
    }
    const user = new User(request.body)
    await user.save()

    response.status(201).send('Registro Creado Correctamente')
}