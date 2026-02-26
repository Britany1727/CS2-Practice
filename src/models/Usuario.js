import mongoose, {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"

const usuarioSchema = new Schema({
    nombre: { 
        type:String, 
        required:true, 
        trim:true 
    },
    apellido: { 
        type:String, 
        required:true, 
        trim:true 
    },
    email: { 
        type:String, 
        required:true, 
        trim:true, 
        unique:true 
    },
    password: { 
        type:String, 
        required:true 
    }
},{
    timestamps:true
})

// Encriptar contraseña
usuarioSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

// Verificar contraseña (Login)
usuarioSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export default model('Usuario', usuarioSchema)