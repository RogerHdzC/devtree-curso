import User from "../models/User"
export const createAccount = async (request, response) => {
    const user = new User(request.body)
    await user.save()

    response.send('Registro Creado Correctamente')
}