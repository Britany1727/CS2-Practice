import Usuario from '../models/Usuario.js'
import jwt from 'jsonwebtoken' 

// Método para generar el Token (JWT)
const generarJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

const registro = async (req, res) => {
    try {
        const { email, password } = req.body
        // Validar campos vacíos
        if (Object.values(req.body).includes("")) return res.status(400).json({msg: "Debes llenar todos los campos"})
        
        // Validar email duplicado
        const verificarEmail = await Usuario.findOne({email})
        if(verificarEmail) return res.status(400).json({msg: "El email ya se encuentra registrado"})

        // Guardar usuario
        const nuevoUsuario = new Usuario(req.body)
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)
        await nuevoUsuario.save()
        
        res.status(200).json({msg: "Registro exitoso"})
    } catch (error) {
        console.log(error) 
        res.status(500).json({msg: "Hubo un error en el servidor", error: error.message})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        // Validar campos vacíos
        if (Object.values(req.body).includes("")) return res.status(404).json({msg: "Debes llenar todos los campos"})
        
        // Buscar usuario por email
        const usuarioBDD = await Usuario.findOne({email})
        if(!usuarioBDD) return res.status(404).json({msg: "El usuario no se encuentra registrado"})
        
        // Verificar password
        const verificarPassword = await usuarioBDD.matchPassword(password)
        if(!verificarPassword) return res.status(404).json({msg: "El password no es el correcto"})

        // Crear Token y responder
        const token = generarJWT(usuarioBDD._id, "usuario")
        const {nombre, apellido, _id} = usuarioBDD
        
        res.status(200).json({
            token,
            nombre,
            apellido,
            _id,
            email: usuarioBDD.email
        })
    } catch (error) {
        console.log(error) 
        res.status(500).json({msg: "Hubo un error en el servidor", error: error.message})
    }
}

export {
    login,
    registro
}