import User from "../models/User"
import { Request, Response } from "express"
export const createAccount = async (request: Request, response: Response) => {
    const user = new User(request.body)
    await user.save()

    response.send('Registro Creado Correctamente')
}