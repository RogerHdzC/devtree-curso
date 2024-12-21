import { Request, Response } from "express"
import slug from 'slug'
import formidable from 'formidable'
import { v4 as uuid } from "uuid"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt"
import cloudinary from "../config/cloudinary"

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

    const token = generateJWT({id: user.id})

    response.send(token)

}

export const getUser = async (request: Request, response: Response) => {
    response.json(request.user)
}

export const updateProfile = async (request: Request, response: Response) => {
    try {
        const { description } = request.body
        const handle = slug(request.body.handle, '')
        const handleExists = await User.findOne({handle})
        if(handleExists && handleExists.email !== request.user.email){
            const error = new Error('Nombre de usuario no disponible')
            response.status(409).json({error: error.message})
            return;
        }
        request.user.description = description
        request.user.handle = handle
        await request.user.save()
        response.send('Perfil Actualizado Correctamente')
        
    } catch {
        const error = new Error('Hubo un error')
        response.status(500).json({error: error.message})
        return
    }
}

export const uploadImage = async (request: Request, response: Response) => {
    const form = formidable({multiples: false})

    try {
        form.parse(request, (error, fields, files)  => {
            
            cloudinary.uploader.upload(files.file[0].filepath, {public_id: uuid()}, async function(error, result){
                if(error){
                    const error = new Error('Hubo un error al subir la imagen')
                    response.status(500).json({error: error.message})
                    return
                }
                if(result){
                    request.user.image = result.secure_url
                    await request.user.save()
                    response.json({image: result.secure_url})
                }
            })
        })
    } catch{
        const error = new Error('Hubo un error al subir la imagen')
        response.status(500).json({error: error.message})
        return
    }
}