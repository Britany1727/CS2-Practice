import mongoose, {Schema, model} from 'mongoose'

const clienteSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    apellido:{
        type:String,
        required:true,
        trim:true
    },
    cedula:{
        type:String,
        required:true,
        trim:true,
        unique:true // No pueden haber dos clientes con la misma cédula
    },
    fecha_nacimiento:{
        type:Date,
        required:true,
        trim:true
    },
    genero:{
        type:String,
        trim:true, 
        default: null
    },
    ciudad:{
        type:String,
        trim:true
    },
    direccion:{
        type:String,
        trim:true
    },
    telefono:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true 
    }
},{
    timestamps:true
})

export default model('Cliente', clienteSchema)