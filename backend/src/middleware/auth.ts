import type { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User"

declare global{
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (request: Request, response: Response, next: NextFunction) =>{
    const bearer = request.headers.authorization
    if(!bearer){
        const error = new Error('No Autorizado')
        response.status(401).json({error: error.message})
        return
    }

    const [, token] = bearer.split(' ')
    if(!token){
        const error = new Error('Not Authorized')
        response.status(401).json({error: error.message})
        return
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof result === 'object' && result.id){
            const user = await User.findById(result.id).select('-password')
            if(!user){
                const error = new Error("User does not exist")
                response.status(404).json({error: error.message})
                return
            }
            request.user = user
            next()
        }
    } catch (error) {
        response.status(500).json({error: 'No valid token'})
        return
    }
}