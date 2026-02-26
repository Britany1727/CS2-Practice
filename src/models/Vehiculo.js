import mongoose, {Schema, model} from 'mongoose'

const vehiculoSchema = new Schema({
    placa: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    modelo: {
        type: String,
        required: true,
        trim: true
    },
    anio: {
        type: Number,
        required: true
    },
    precio_dia: {
        type: Number,
        required: true
    },
    estado: {
        type: Boolean,
        default: true // Por defecto, al registrarlo está disponible
    }
},{
    timestamps: true
})

export default model('Vehiculo', vehiculoSchema)